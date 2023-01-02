const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require("discord.js")
const { EmbedBuilder, SelectMenuBuilder, ActionRowBuilder, ComponentType } = require("discord.js")
const villain_api = require("../service/api/villain_api")
const organizations_api = require("../service/api/organizations_api")
const { bountyActions, bountyCheck} = require("../utilities")
const { organizationClass } = require("../classes/organization")
const { bountyImage } = require("../utilities/bounty_canva")



module.exports = {
    data: new SlashCommandBuilder()
        .setName("createcriminalorganization")
        .setDescription("Create a criminal organization")
        .addStringOption(option =>
                option
                    .setName("name")
                    .setDescription("Name of the criminal organization")
                    .setRequired(true)
            )
        .addStringOption(option => 
                option
                    .setName("gif")
                    .setDescription("Gif link that represents your organization")
                    .setRequired(false)
            ),
        async execute(interaction) {
            try {
                const name = interaction.options.getString("name")
                const gif = interaction.options.getString("gif") || ""
                const id = interaction.user.id


                const villain_info = await villain_api.read({"ID": id})
                const organization_info = await organizations_api.read({"MEMBERS": id})
                // Checks
                if(!villain_info){
                    await interaction.reply({
                        content: "You are not a criminal!",
                        ephemeral: true
                    })
                    return
                }

                if(organization_info){
                    await interaction.reply({
                        content: "You're already in a criminal organization!",
                        ephemeral: true
                    })
                    return
                }


                let organization = new organizationClass(id, name, [id], [], id, villain_info.BOUNTY, "N/A", gif)
                /// come back to this right here to continue
                const response = await organizations_api.create(organization)
                await interaction.reply({
                    content: `The **${name}** criminal organization has been established.`,
                    ephemeral: true
                })
            } catch(err) {
                console.log(err)
                if(err) await interaction.reply("There was an issue with creating this organization. Please seek developer support.")
                return
            }
        }
}