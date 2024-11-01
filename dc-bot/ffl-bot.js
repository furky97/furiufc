require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField, PollLayoutType } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const csv = require('csv-parser');
const { Readable } = require('stream');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessagePolls,
  ],
});

// Constants
const FFL_MODERATOR_ROLE_ID = '1293901924894248970';
const FFL_CATEGORY_NAME = '---------FFL---------';
const NEWS_CHANNEL_ID = '1258350376562855967';
const NOT_FOUND_CATEGORY_MESSAGE = `Kategorie "${FFL_CATEGORY_NAME}" wurde nicht gefunden.`;

// Slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('ffl-start')
    .setDescription('Start a survey for an FFL event')
    .addStringOption((option) =>
      option.setName('number').setDescription('FFL number').setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('ffl-create-matches')
    .setDescription('Create FFL matches from a CSV file')
    .addStringOption((option) =>
      option.setName('number').setDescription('FFL number').setRequired(true)
    )
    .addAttachmentOption((option) =>
      option.setName('matches').setDescription('CSV file with matches').setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('ffl-collect-names')
    .setDescription('Collect FFL participants')
    .addStringOption((option) =>
      option.setName('pollid').setDescription('poll id').setRequired(true)
    ),
].map((command) => command.toJSON());

// Register slash commands when the bot is ready
client.once('ready', async () => {
  const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
  try {
    console.log('Refreshing slash commands...');
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: commands,
    });
    console.log('FFL Bot ist online und die Befehle sind registriert!');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
});

// Helper functions
const getCategoryByName = (guild, categoryName) =>
  guild.channels.cache.find((channel) => channel.type === 4 && channel.name === categoryName);
const getFFLCategory = (guild) => getCategoryByName(guild, FFL_CATEGORY_NAME);
const getNewsChannel = (client) => client.channels.cache.get(NEWS_CHANNEL_ID);
const generateFFLRules = (
  weightClass
) => `======================\n❌ FFL Kampfregeln ❌\n======================\n
- 5 Runden Fights.
- Nachweis im Chat (Screenshot, Handyfoto) PFLICHT! Ansonsten wird das Ergebnis nicht gewertet.
- Falls euer Gegner länger als 2 Tage nicht antwortet bzw. es unklar ist, wann ihr kämpft => DQ Sieg.
- **KEINE** Mirror Matches.
- **KEINE** 5 ⭐️ Kämpfer.
- Ein Fighterban gilt für euch beide (z.b. Ban Jon Jones => keiner darf Jon Jones picken)\n
======================\nGewichtsklasse: **${weightClass}**\n======================\n\n`;

// Set up channel permissions
const getChannelPermissions = (interaction, playerAId, playerBId) => [
  {
    id: interaction.guild.id,
    allow: [PermissionsBitField.Flags.ViewChannel],
    deny: [PermissionsBitField.Flags.SendMessages],
  },
  {
    id: playerAId,
    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
  },
  {
    id: playerBId,
    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
  },
  {
    id: FFL_MODERATOR_ROLE_ID,
    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
  },
];

// Parse CSV data
const parseCSV = async (csvAttachment) => {
  const matchesData = [];
  const csvData = await (await fetch(csvAttachment.url)).text();

  return new Promise((resolve) => {
    Readable.from(csvData)
      .pipe(csv())
      .on('data', (row) => {
        if (row.playerA && row.playerB && row.weightclass) {
          matchesData.push({
            playerA: row.playerA,
            playerB: row.playerB,
            weightclass: row.weightclass,
          });
        }
      })
      .on('end', () => resolve(matchesData));
  });
};

// Start survey
const startSurvey = async (interaction, fflNumber) => {
  const surveyQuestion = `Wer macht bei FFL ${fflNumber} mit?`;
  const fflCategory = getFFLCategory(interaction.guild);

  if (!fflCategory) {
    return interaction.reply(NOT_FOUND_CATEGORY_MESSAGE);
  }

  const surveyChannel = await interaction.guild.channels.create({
    name: `ffl-${fflNumber}-anmeldung`,
    type: 0,
    parent: fflCategory.id,
    permissionOverwrites: [
      {
        id: interaction.guild.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
        deny: [PermissionsBitField.Flags.SendMessages],
      },
    ],
  });

  surveyChannel.send({
    poll: {
      question: { text: surveyQuestion },
      answers: [{ text: 'Ich', emoji: '🥊' }],
      allowMultiselect: false,
      duration: 48,
      layoutType: PollLayoutType.Default,
    },
  });

  // Announce new FFL in news channel
  getNewsChannel(client).send(
    `@everyone Anmeldungen für FFL-${fflNumber} laufen im <#${surveyChannel.id}> Kanal. BITTE ABSTIMMEN!`
  );
};

// Create matches
const createMatches = async (interaction, matchesData, fflNumber) => {
  if (matchesData.length < 1) return interaction.followUp('Nicht genug Teilnehmer für Paarungen.');
  const fflCategory = getFFLCategory(interaction.guild);
  if (!fflCategory) return interaction.followUp(NOT_FOUND_CATEGORY_MESSAGE);

  for (let i = 0; i < matchesData.length; i++) {
    const { playerA, playerB, weightclass } = matchesData[i];
    const channelName = `ffl-${fflNumber}-match-${i + 1}`;
    const members = await interaction.guild.members.fetch();
    let playerAId = null;
    let playerBId = null;
    members.forEach((member) => {
      if (member.displayName === playerA) {
        playerAId = member.id;
      } else if (member.displayName === playerB) {
        playerBId = member.id;
      }
    });

    const newChannel = await interaction.guild.channels.create({
      name: channelName,
      type: 0,
      parent: fflCategory.id,
      topic: `FFL-${fflNumber} - Match zwischen ${playerA} und ${playerB}`,
      permissionOverwrites: getChannelPermissions(interaction, playerAId, playerBId),
    });

    await newChannel.send(
      `Willkommen <@${playerAId}> und <@${playerBId}>! Dies ist euer privater Match-Kanal. Viel Glück!
${generateFFLRules(weightclass)}
**BITTE** Reihenfolge unten beachten!\n
- <@${playerAId}>, wer ist dein *BAN* pick?
- <@${playerBId}>, wer ist dein *BAN* pick?
- <@${playerAId}>, welchen *Kämpfer* wähltst du?
- <@${playerBId}>, welchen *Kämpfer* wähltst du?`
    );
  }
};

// Command interaction handler
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  if (commandName === 'ffl-start') {
    const fflNumber = interaction.options.getString('number');
    console.log(`Start Umfrage für FFL-${fflNumber}.`);
    await startSurvey(interaction, fflNumber);
    console.log(`Umfrage für FFL-${fflNumber} läuft.`);
  } else if (commandName === 'ffl-create-matches') {
    const fflNumber = interaction.options.getString('number');
    const csvAttachment = interaction.options.getAttachment('matches');
    if (!csvAttachment)
      return interaction.followUp('Bitte eine CSV-Datei mit Teilnehmern anhängen.');
    const matchesData = await parseCSV(csvAttachment);
    await createMatches(interaction, matchesData, fflNumber);
  } else if (commandName === 'ffl-collect-names') {
    const pollid = interaction.options.getString('pollid');
    const message = await interaction.channel.messages.fetch(pollid);
    const voters = await message.poll.answers.at(0).fetchVoters();
    interaction.channel.send('Die Teilnehmer sind...');
    voters.forEach((voter) => {
      interaction.channel.send(`<@${voter.id}>`);
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
