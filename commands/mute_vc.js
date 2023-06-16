const { SlashCommandBuilder } = require("@discordjs/builders")
const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus } = require('@discordjs/voice');
const { PermissionsBitField  } = require("discord.js")
const { EmbedBuilder, SelectMenuBuilder, ActionRowBuilder, ComponentType } = require("discord.js");
const { read, create, update } = require("../service/api")



module.exports = {
    data: new SlashCommandBuilder()
        .setName("mutevc")
        .setDescription("mute/unmute everyone in vc")
        .addStringOption(option =>
                option
                    .setName("operation")
                    .setDescription("mute/unmute")
                    .setRequired(true)
                    .addChoices(
                        {name: "🔇Mute", value: "mute"},
                        {name: "🔈Unmute", value: "unmute"}
                    )
            )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers),
        async execute(interaction) {
            try {
                const operation = interaction.options.getString("operation");
                const invoker = interaction.member;
                const channel = invoker.voice.channel;
                const guild = interaction.guild;

                // Connect to the voice channel
                const connection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: guild.id,
                    adapterCreator: guild.voiceAdapterCreator,
                });

                // Check if the command invoker is in a voice channel
                if (!channel) {
                    return await interaction.reply({
                        content: "You need to be in a voice channel to use this command.",
                        ephemeral: true
                    });
                }

                // Check if there are more than just the invoker in the voice channel
                if (channel.members.size <= 1) {
                    return await interaction.reply({
                        content: "There are no other members in the voice channel.",
                        ephemeral: true
                    });
                }
    
                // Mute or unmute all members in the channel except the command invoker
                for (const [memberId, member] of channel.members) {
                    if (memberId !== invoker.id) {
                        await member.voice.setMute(operation === "mute");
                    }
                }
                
                if (operation === "mute") {
                    embed = new EmbedBuilder()
                    .setTitle(`🔇Mute No Jutsu!`)
                    .setColor("#ff0000")
                    .setTimestamp()
                    .setDescription(`Everyone in the voice channel has been ${operation === 'mute' ? 'muted' : 'unmuted'}!`)
                    .setFooter({text: `Muted by ${invoker.user.username}`, iconURL: invoker.user.avatarURL()})
                    .setImage("https://media.tenor.com/lUlR2KJRoKYAAAAC/itachi-sharingan.gif")

                    return await interaction.reply({
                        embeds: [embed]
                    });
                } else {

                    // If the operation was "unmute", disconnect the bot from the voice channel
                    if (operation === "unmute") {
                        const connection = getVoiceConnection(guild.id);
                        if (connection) {
                            connection.destroy();
                        }
                    }    


                    embed = new EmbedBuilder()
                    .setTitle(`🔈Mute No Jutsu!`)
                    .setColor("#00ff00")
                    .setTimestamp()
                    .setDescription(`Everyone in the voice channel has been ${operation === 'mute' ? 'muted' : 'unmuted'}! The power of the Sharingan has been lifted.`)
                    .setFooter({text: `Unmuted by ${invoker.user.username}`, iconURL: invoker.user.avatarURL()})
                    .setImage("https://media.tenor.com/jNwKSlUPg8YAAAAC/hate-naruto.gif")

                    return await interaction.reply({
                        embeds: [embed]
                    });

                }            
                 
            } catch(err) {
                console.log(err)
                if(err) await interaction.reply("There was an issue with the muting operation. Please seek developer support.")
                return
            }
        }
}