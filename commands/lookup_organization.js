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
        .setName("lookuporganization")
        .setDescription("View criminal organization info")
        .addUserOption(option => 
            option
                .setName("criminal")
                .setDescription("Lookup organization by criminal member")
                .setRequired(false)
        )
        .addStringOption(option => 
            option
                .setName("organization")
                .setDescription("Lookup organization by name")
                .setRequired(false)
        ),
        async execute(interaction) {
            try {
                const criminal = interaction.options.getUser("criminal")
                const organization_name = interaction.options.getString("organization")
                const yourId = interaction.user.id
                var organization_info;

                if(criminal){
                    organization_info = await organizations_api.read({"MEMBERS": criminal.id})
                    if(!organization_info){
                        await interaction.reply({
                            content: "This criminal is not in an organization."
                        })
                        return
                    } 
                }
                if(organization_name){
                    organization_info = await organizations_api.read({"NAME": organization_name})
                    if(!organization_info){
                        await interaction.reply({
                            content: "This organization does not exist."
                        })
                        return

                    } 
                }

                if(!criminal && !organization_name) {
                    organization_info = await organizations_api.read({"MEMBERS": yourId})
                    if(!organization_info){
                        await interaction.reply({
                            content: "You are not in an organization."
                        })
                        return
                    } 
                }

                let members = []
                let officers = []
                for(let member of organization_info.MEMBERS) {
                    let username = await interaction.client.users.fetch(member).catch(() => null);
                    members.push(`${username}`)
                }
                for(let officer of organization_info.OFFICERS) {
                    let username = await interaction.client.users.fetch(officer).catch(() => null);
                    officers.push(`${username}`)
                }
                let memberList = members.join("\n")
                let officerList = officers.join("\n")
                const embedVar = new EmbedBuilder()
                    .setTitle(`🕵️‍♂️ ${organization_info.NAME}`)
                    .setDescription(`💬 **Message of the day**\n${organization_info.MESSAGE}`)
                    .addFields(
                        {name: "🕵️‍♂️ Members", value: `${memberList}`},
                        {name: "🕴️ Officers", value: `${officerList}`},
                        {name: "💰 Bounty", value: `💵 $${organization_info.BOUNTY.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                    )
                organization_info.GIF ? embedVar.setImage(gif) : ""

                
                    await interaction.reply({
                        embeds: [embedVar]
                    })


            } catch(err) {
                console.log(err)
                if(err) await interaction.reply("There was an issue with creating this organization. Please seek developer support.")
                return
            }
        }
}