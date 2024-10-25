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
const POLL_END_MESSAGE = 'Die Umfrage ist beendet. Hier sind die Teilnehmer:';
const FFL_CATEGORY_NAME = 'BOT-TEST';
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
const generateFFLRules = (weightClass) => `FFL Kampfregeln:
1. 5 Runden Fights.
2. Nachweis im Chat hier ist Pflicht! Ansonsten wird das Ergebnis nicht gewertet.
3. Falls euer Gegner länger als 2 Tage nicht antwortet (ffl-xxx-chat) bzw. es unklar ist, wann ihr kämpft => DQ Sieg.
4. Keine Mirror Matches.
5. Gewichtsklasse: ${weightClass}`;

// Set up channel permissions
const getChannelPermissions = (interaction, playerA, playerB) => [
  {
    id: interaction.guild.id,
    deny: [PermissionsBitField.Flags.ViewChannel],
  },
  {
    id: interaction.guild.members.cache.find((member) => member.user.username === playerA)?.id,
    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
  },
  {
    id: interaction.guild.members.cache.find((member) => member.user.username === playerB)?.id,
    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
  },
  {
    id: interaction.guild.members.cache.find((member) =>
      member.permissions.has(PermissionsBitField.Flags.Administrator)
    )?.id,
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
        // allow: [PermissionsBitField.Flags.ViewChannel],
        deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
      },
    ],
  });

  surveyChannel.send({
    poll: {
      question: { text: surveyQuestion },
      answers: [{ text: 'Ich', emoji: '🥊' }],
      allowMultiselect: false,
      // expiresTimestamp: new Date(Date.now() + POLL_DURATION_MS).getTime,
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

    const newChannel = await interaction.guild.channels.create({
      name: channelName,
      type: 0,
      parent: fflCategory.id,
      topic: `Match zwischen ${playerA} und ${playerB}`,
      permissionOverwrites: getChannelPermissions(interaction, playerA, playerB),
    });

    await newChannel.send(
      `Willkommen <@${playerA}> und <@${playerB}>! Dies ist euer privater Match-Kanal. Viel Glück!
${generateFFLRules(weightclass)}
<@${playerA}>, wen möchtest du bannen?
<@${playerB}>, wen möchtest du bannen?`
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
  }
});

client.login(process.env.DISCORD_TOKEN);
