const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require("discord.js")
const { EmbedBuilder, SelectMenuBuilder, ActionRowBuilder, ComponentType, ButtonBuilder, ButtonStyle } = require("discord.js")
const villain_api = require("../service/api/villain_api")
const organizations_api = require("../service/api/organizations_api")
const { bountyActions, bountyCheck} = require("../utilities")
const { organizationClass } = require("../classes/organization")
const { bountyImage } = require("../utilities/bounty_canva")



module.exports = {
    data: new SlashCommandBuilder()
        .setName("promotemember")
        .setDescription("Promote or demote an organization member")
        .addUserOption(option =>
            option
                .setName("criminal")
                .setDescription("Organization member")
                .setRequired(true)
        )
        .addStringOption((option) => 
            option
                .setName("option")
                .setDescription("Promote or demote")
                .setRequired(false)
                .addChoices(
                    {name: "promote", value: "promote"},
                    {name: "demote", value: "demote"}
                )
        ),
        async execute(interaction) {
            try {
                const id = interaction.user.id
                const organization_info = await organizations_api.read({"ID": id})
                const criminal = interaction.options.getUser("criminal")
                const option = interaction.options.getString("option")

                if(!organization_info){
                    await interaction.reply({
                        content: "You do not own a criminal organization!",
                        ephemeral: true
                    })
                    return
                }

                if(!organization_info.MEMBERS.includes(criminal.id)){
                    await interaction.reply({
                        content: `${criminal} is not a member of your organization.`,
                        ephemeral: true
                    })
                }
                
                let organization = new organizationClass(organization_info.ID, organization_info.NAME, organization_info.MEMBERS, organization_info.OFFICERS, organization_info.OWNER, organization_info.BOUNTY, organization_info.RANK, organization_info.GIF, organization_info.MESSAGE )
                if(option === "demote") organization.demote(criminal.id);
                if(option === "promote") organization.promote(criminal.id);
                const response = await organizations_api.update({"ID": organization_info.ID}, {'$set': organization})
                await interaction.reply({
                    content: `The updates have been made successfully.`,
                    ephemeral: true
                })
                return

            } catch(err) {
                console.log(err)
                if(err) await interaction.reply("There was an issue with creating this organization. Please seek developer support.")
                return
            }
        }
}