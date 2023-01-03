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
        .setName("addorganizationmember")
        .setDescription("Invite to the organization")
        .addUserOption(option => 
            option
                .setName("criminal")
                .setDescription("Criminal to report")
                .setRequired(true)
        ),
        async execute(interaction) {
            try {
                const criminal = interaction.options.getUser("criminal")
                const yourId = interaction.user.id
                const theirId = criminal.id

                const villain_info = await villain_api.read({"ID": theirId})
                const organization_info = await organizations_api.read({"MEMBERS": yourId})
                const they_are_in_a_team = await organizations_api.read({"MEMBERS": theirId})
                // Checks
                if(!villain_info){
                    await interaction.reply({
                        content: "You can only invite criminals into your criminal organization!",
                        ephemeral: true
                    })
                    return
                }

                if(!organization_info){
                    await interaction.reply({
                        content: "You're do not own a criminal organization!",
                        ephemeral: true
                    })
                    return
                }

                if(yourId === theirId){
                    await interaction.reply({
                        content: "You're already in the criminal organization!",
                        ephemeral: true
                    })
                    return
                }

                if(organization_info.MEMBERS.includes(villain_info.ID)){
                    await interaction.reply({
                        content: 'This criminal is already in your organization.',
                        ephemeral: true
                    })
                    return
                }

                if(they_are_in_a_team){
                    await interaction.reply({
                        content: `This criminal is already a part of an organization.`,
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

                const message = await interaction.reply({
                    content: `${criminal}, will you join **${organization_info.NAME}**?`,
                    components: [row]
                })
                const filter = i => i.user.id === theirId;

                const collector = message.createMessageComponentCollector({filter, time: 15000})

                collector.on('collect', async i => {
                    if(i.customId === 'yes'){
                        let organization = new organizationClass(organization_info.ID, organization_info.NAME, organization_info.MEMBERS, organization_info.OFFICERS, organization_info.OWNER, organization_info.BOUNTY, organization_info.RANK, organization_info.GIF )
                        /// come back to this right here to continue
                        organization.addToTeam(villain_info)
                        const response = await organizations_api.update({"ID": organization_info.ID}, {'$set': organization})
                        await i.update({
                            content: `**${criminal}** has been added to the criminal organization.`,
                            ephemeral: true,
                            components: []
                        })
                    }
                    if(i.customId === 'no'){
                        await i.update({
                            content: `Invitation denied.`,
                            ephemeral: true,
                            components: []
                        })
                    }
                })


            } catch(err) {
                console.log(err)
                if(err) await interaction.reply("There was an issue with creating this organization. Please seek developer support.")
                return
            }
        }
}