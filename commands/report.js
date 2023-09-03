const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require("discord.js")
const { EmbedBuilder, SelectMenuBuilder, ActionRowBuilder, ComponentType } = require("discord.js");
const { read, create, update } = require("../service/api")
const { bountyActions, bountyCheck, getChannelByName} = require("../utilities")
const { villainClass } = require("../classes/villain");
const { organizationClass } = require("../classes/organization")
const { bountyImage } = require("../utilities/bounty_canva")
const organizations_api = require("../service/api/organizations_api")



module.exports = {
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Report Criminal Offense to increase Bounty")
        .addUserOption(option => 
                option
                    .setName("criminal")
                    .setDescription("Criminal to report")
                    .setRequired(true)
            )
        .addStringOption(option => 
                option
                    .setName("customoffense")
                    .setDescription("Type a custom offense instead of selecting from dropdown")
                    .setRequired(false)
            )
        .addStringOption(option => 
                option
                    .setName("custombounty")
                    .setDescription("Type the bounty increase or use - in front for decrease like -1000.")
                    .setRequired(false)
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
        async execute(interaction) {
            try {
                const criminal = interaction.options.getUser("criminal")
                const custom_offense = interaction.options.getString("customoffense")
                let custom_bounty = interaction.options.getString("custombounty");

                // Remove commas and keep only numbers
                let numbersOnly = custom_bounty.replace(/,/g, '');
                
                // Reassign the modified value back to custom_bounty
                custom_bounty = numbersOnly;                
                if(!custom_offense || !custom_bounty){ 
                    await interaction.reply({content: "Please provide a custom offense and bounty number.", ephemeral: true})
                    return
                }
                const id = criminal.id
                const organization_info = await organizations_api.read({"MEMBERS": id})
                if(id === interaction.user.id){
                    await interaction.reply({
                        content: "No self reporting!",
                        ephemeral: true
                    })
                    return
                }
                const villain_info = await read({"ID": id})
                const bounty_message = bountyCheck(criminal, villain_info)
                const channel = getChannelByName(interaction.guild)
                
                var embedVar = new EmbedBuilder()
                    .setTitle("🚨 New Criminal Offense Reported")
                    .setDescription(`**${interaction.user.username}** has reported a new criminal offense against **${criminal.username}**`)
                    .addFields(
                        {name: "🪪 Criminal", value: `${criminal.username}`, inline: true},
                        {name: "📝 Offense", value: `${custom_offense}`, inline: true},
                        {name: "💰 Bounty", value: `**$${custom_bounty.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}**`, inline: true},
                    )
                    .setImage(criminal.displayAvatarURL({dynamic: true, size: 1024}))
                    .setTimestamp()

                if(custom_offense && custom_bounty){
                    if (villain_info) {
                        let villain = new villainClass(villain_info.ID, villain_info.CUSTOM_TITLE, villain_info.RANK, villain_info.BOUNTY, villain_info.DEBATES, villain_info.CRIMINAL_OFFENSES, villain_info.FLAG);
                        villain.increaseBounty(custom_bounty)
                        villain.customIncreaseCriminalOffense(custom_offense, custom_bounty.toString())
                        villain.setRank()
                        await update({"ID": villain.ID.toString()}, {"$set": villain})
                        let image = await bountyImage(criminal, villain)
                        await channel.send({
                            embeds: [embedVar],
                        })
                    } else {
                        let villain = new villainClass(id, "N/A", "D", 0, [], [], 1);
                        villain.increaseBounty(custom_bounty)
                        villain.customIncreaseCriminalOffense(custom_offense, custom_bounty.toString())
                        villain.setRank()
                        await create(villain)
                        let image = await bountyImage(criminal, villain)
                        await channel.send({
                            embeds: [embedVar],
                        })
                    }    
                }

                await interaction.reply({
                    content: `**${criminal}** has been reported.`,                    
                })
                 
            } catch(err) {
                console.log(err)
                if(err) await interaction.editReply("There was an issue with reporting this offense. Please seek developer support.")
                return
            }
        }
}