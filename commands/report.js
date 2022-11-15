const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits, AttachmentBuilder } = require("discord.js")
const { EmbedBuilder, SelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { read, create, update } = require("../service/api")
const { ranks, bountyActions, bountyLosses, bountyCheck} = require("../utilities")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("reportoffense")
        .setDescription("Report Criminal Offense to increase Bounty")
        .addUserOption(option => 
                option
                    .setName("criminal")
                    .setDescription("Criminal to report")
                    .setRequired(true)
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
        async execute(interaction) {
            try {
                const criminal = interaction.options.getUser("criminal")
                const id = criminal.id
                const villain_info = await read({"ID": id})
                const bounty_message = bountyCheck(criminal, villain_info)
                const embedVar = new EmbedBuilder()
                    .setTitle("📔 Select Criminal Offense")
                    .setDescription(`Moderator or Staff, select the offense commited by the criminal from the list below.\n${bounty_message}`)
                    .addFields({name: "General Villain Behavior", value: "Increases bounty by 🪙 **1,000**."})
                    .addFields({name: "Flagrant Question", value: "Increases bounty by 🪙 **3,000**."})
                    .addFields({name: "Flagrant Statment", value: "Increases bounty by 🪙 **8,000**."})
                    .addFields({name: "Generic Debate Win", value: "Increases bounty by 🪙 **100,000**."})
                    .addFields({name: "Villain Arc Started", value: "Increases bounty by 🪙 **500,000**."})
                const row = new ActionRowBuilder()
                    .addComponents(
                        new SelectMenuBuilder()
                            .setCustomId("offensereported")
                            .setPlaceholder("list of offenses")
                            .addOptions(bountyActions)
                    )
                
                await interaction.reply({
                    embeds: [embedVar],
                    components: [row]
                });

            } catch(err) {
                console.log(err)
                if(err) await interaction.reply("There was an issue with reporting this offense. Please seek developer support.")
                return
            }
        }
}