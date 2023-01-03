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
        .setName("leaveorganizationmember")
        .setDescription("Remove from the organization"),
        async execute(interaction) {
            try {
                const yourId = interaction.user.id
                const villain_info = await villain_api.read({"ID": yourId})
                const organization_info = await organizations_api.read({"MEMBERS": yourId})


                if(!villain_info || !organization_info){
                    await interaction.reply({
                        content: "You are not in a criminal organization.",
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

                let organization = new organizationClass(organization_info.ID, organization_info.NAME, organization_info.MEMBERS, organization_info.OFFICERS, organization_info.OWNER, organization_info.BOUNTY, organization_info.RANK, organization_info.GIF )
                /// come back to this right here to continue
                organization.removeFromTeam(villain_info)
                const response = await organizations_api.update({"ID": organization_info.ID}, {'$set': organization})
                await interaction.reply({
                    content: `You have been removed from the criminal organization.`,
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