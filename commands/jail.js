const { SlashCommandBuilder } = require("@discordjs/builders")
const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus } = require('@discordjs/voice');
const { PermissionsBitField  } = require("discord.js")
const { EmbedBuilder, SelectMenuBuilder, ActionRowBuilder, ComponentType } = require("discord.js");
const { read, create, update } = require("../service/api")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("jail")
        .setDescription("Mute or unmute a member in voice chat")
        .addUserOption(option =>
                option
                    .setName("criminal")
                    .setDescription("Select the member to mute/unmute")
                    .setRequired(true)
            )
            .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers),
    async execute(interaction) {
        try {
            const criminal = interaction.options.getMember("criminal");
            const guild = interaction.guild;
            const originalName = criminal.nickname;
            const user = await guild.members.fetch(criminal)

            // await user.timeout(3 * 60 * 1000)
            const randomNumber = Math.floor(Math.random() * 10000);  // Generate a random number between 0 and 9999
            await user.setNickname(`⛓️ PRISONER-NUMBER-${randomNumber} ⛓️`);
            await interaction.reply({
                content: `${criminal.user} has been sent to jail for 5 minutes for their insane behavior.`
            });

            setTimeout(async () => {
                await user.setNickname(originalName);
                await interaction.followUp(`${criminal.user} has been released from jail.`);
            }, 5 * 60 * 1000);
                
        } catch(err) {
            console.log(err);
            await interaction.reply({
                content: "There was an error trying to execute that command.",
                ephemeral: true
            });
        }
    }
};