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
        .setName("updateorganization")
        .setDescription("Update organization message or gif")
        .addStringOption((option) => 
            option
                .setName("message")
                .setDescription("Update your message")
                .setRequired(false)
        )
        .addStringOption((option) => 
            option
                .setName("giforimage")
                .setDescription("Update your message")
                .setRequired(false)
        ),
        async execute(interaction) {
            try {
                const id = interaction.user.id
                const organization_info = await organizations_api.read({"OFFICERS": id})
                const message = interaction.options.getString("message")
                const gif = interaction.options.getString("giforimage")

                if(!message && !gif){
                    await interaction.reply({
                        content: "You must first select whether to update the organization message or gif. Please retry the command.",
                        ephemeral: true
                    })
                    return
                }

                if(!organization_info){
                    await interaction.reply({
                        content: "You do not manage a criminal organization!",
                        ephemeral: true
                    })
                    return
                }
                
                if(message) {
                    const response = await organizations_api.update({"ID": organization_info.ID}, {'$set': {'MESSAGE': message}})
                }

                if(gif) {
                    const response = await organizations_api.update({"ID": organization_info.ID}, {'$set': {'GIF': gif}})
                }

                await interaction.reply({
                    content: `Your organization has been updated.`,
                    ephemeral: true,
                    components: []
                })

            } catch(err) {
                console.log(err)
                if(err) await interaction.reply("There was an issue with creating this organization. Please seek developer support.")
                return
            }
        }
}