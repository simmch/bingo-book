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
        .setName("removeorganizationmember")
        .setDescription("Remove from the organization")
        .addUserOption(option => 
            option
                .setName("criminal")
                .setDescription("Criminal to remove")
                .setRequired(true)
        ),
        async execute(interaction) {
            try {
                const criminal = interaction.options.getUser("criminal")
                const yourId = interaction.user.id
                const theirId = criminal.id

                const villain_info = await villain_api.read({"ID": theirId})
                const organization_info = await organizations_api.read({"OFFICERS": yourId})
                // const they_are_in_a_team = await organizations_api.read({"MEMBERS": theirId})
                // Checks
                if(!villain_info){
                    await interaction.reply({
                        content: "This individual is not in your organization.",
                        ephemeral: true
                    })
                    return
                }

                if(!organization_info){
                    await interaction.reply({
                        content: "You do not own a criminal organization!",
                        ephemeral: true
                    })
                    return
                }

                if(yourId === theirId){
                    await interaction.reply({
                        content: "You cannot remove yourself from your own criminal organization! Instead, you may disband the organization altogether by using the command **/deleteorganization**",
                        ephemeral: true
                    })
                    return
                }

                if(!organization_info.MEMBERS.includes(villain_info.ID)){
                    await interaction.reply({
                        content: 'This criminal is not in your organization.',
                        ephemeral: true
                    })
                    return
                }

                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('yes')
                        .setLabel('Yes')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('no')
                        .setLabel('No')
                        .setStyle(ButtonStyle.Danger)
                )

                let organization = new organizationClass(organization_info.ID, organization_info.NAME, organization_info.MEMBERS, organization_info.OFFICERS, organization_info.OWNER, organization_info.BOUNTY, organization_info.RANK, organization_info.GIF, organization_info.MESSAGE )
                /// come back to this right here to continue
                organization.removeFromTeam(villain_info)
                const response = await organizations_api.update({"ID": organization_info.ID}, {'$set': organization})
                await interaction.reply({
                    content: `**${criminal}** has been removed from the criminal organization.`,
                    ephemeral: true,
                    components: []
                })
                    


            } catch(err) {
                console.log(err)
                if(err) await interaction.reply("There was an issue with removing this criminal from this organization. Please seek developer support.")
                return
            }
        }
}