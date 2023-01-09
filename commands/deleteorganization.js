const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits, ButtonBuilder, ButtonStyle, Events  } = require("discord.js")
const { EmbedBuilder, ActionRowBuilder, ComponentType } = require("discord.js")
const villain_api = require("../service/api/villain_api")
const organizations_api = require("../service/api/organizations_api")
const { bountyActions, bountyCheck} = require("../utilities")
const { organizationClass } = require("../classes/organization")
const { bountyImage } = require("../utilities/bounty_canva")



module.exports = {
    data: new SlashCommandBuilder()
        .setName("deleteorganization")
        .setDescription("Delete your criminal organization"),
        async execute(interaction) {
            try {
                const id = interaction.user.id
                const organization_info = await organizations_api.read({"OWNER": id})

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
                
                // Checks
                if(organization_info){

                    const message = await interaction.reply({
                        content: `Are you sure you want to delete your organization, ${organization_info.NAME}?`,
                        components: [row]
                    })
                    const filter = i => i.user.id === organization_info.ID;

                    const collector = message.createMessageComponentCollector({filter, time: 15000})

                    collector.on('collect', async i => {
                        if(i.customId === 'yes'){
                            const response = await organizations_api.remove({"ID": organization_info.ID})
                            await i.update({
                                content: `The **${organization_info.NAME}** criminal organization has been deleted.`,
                                ephemeral: true,
                                components: []
                            })
        
                        }
                        if(i.customId === 'no'){
                            await i.update({
                                content: `Your organization was not deleted.`,
                                ephemeral: true,
                                components: []
                            })
                        }
                    })
                }

            } catch(err) {
                console.log(err)
                if(err) await interaction.reply("There was an issue with creating this organization. Please seek developer support.")
                return
            }
        }
}