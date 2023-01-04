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
        .setName("help")
        .setDescription("Learn about the bingo book commands"),
        async execute(interaction) {
            try {
                
                const embedVar = new EmbedBuilder()
                    .setTitle(`🕵️‍♂️ Bingo Book Help!`)
                    .setDescription(`Learn the Bingo Book commands.`)
                    .addFields(
                        {name: "/report", value: `Mods and Staff only. Use to report criminal behavior`},
                        {name: "/reduction", value: `Use to request a Bounty reduction. Must be accepted by 2 or more mods or staff`},
                        {name: "/debatewin", value: `Mods and Staff only. Report debate wins`},
                        {name: "/criminallookup", value: `Lookup criminal bounty poster`},
                        {name: "/criminaldetails", value: `Lookup criminal's criminal history`},
                        {name: "/debatedetails", value: `Lookup criminal's debate history`},
                        {name: "/leaderboard", value: `Lookup Bingo Book leaderboard`},
                        {name: "/createcriminalorganization", value: `Create criminal organization`},
                        {name: "/addorganizationmember", value: `Invite criminal into your organization (Officers Only)`},
                        {name: "/deleteorganization", value: `Delete criminal organization (Owner Only)`},
                        {name: "/leaveorganizationmember", value: `Leave criminal organization`},
                        {name: "/lookuporganization", value: `Lookup criminal organization`},
                        {name: "/promotemember", value: `Promote or demote criminal in your organization (Owner Only)`},
                        {name: "/removeorganizationmember", value: `Remove criminal from your organization (Owner Only)`},
                        {name: "/updateorganization", value: `Update organization message or organization gif / image`},
                    )
                
                    await interaction.reply({
                        embeds: [embedVar]
                    })


            } catch(err) {
                console.log(err)
                if(err) await interaction.reply("There was an issue with the help command. Please seek developer support.")
                return
            }
        }
}