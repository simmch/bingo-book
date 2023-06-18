const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require("discord.js")
const { EmbedBuilder, SelectMenuBuilder, ActionRowBuilder, ComponentType } = require("discord.js");
const { read, create, update } = require("../service/api")
const { bountyActions, bountyCheck} = require("../utilities")
const { villainClass } = require("../classes/villain");
const { bountyImage } = require("../utilities/bounty_canva")



module.exports = {
    data: new SlashCommandBuilder()
        .setName("debatewin")
        .setDescription("Report Criminal Offense to increase Bounty")
        .addUserOption(option => 
                option
                    .setName("criminal")
                    .setDescription("Criminal to report")
                    .setRequired(true)
            )
        .addUserOption(option => 
                option
                    .setName("opponent")
                    .setDescription("Who lost the debate")
                    .setRequired(true)
            )
        .addStringOption(option => 
                option
                    .setName("topic")
                    .setDescription("What was the topic of the debate")
                    .setRequired(true)
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
        async execute(interaction) {
            try {
                const criminal = interaction.options.getUser("criminal")
                const opponent = interaction.options.getUser("opponent")
                const debateTopic = interaction.options.getString("topic")
                const custom_bounty = "250000"
                const id = criminal.id
                if(id === interaction.user.id || id === opponent.id || criminal.id === opponent.id){
                    await interaction.reply({
                        content: "No self reporting!",
                        ephemeral: true
                    })
                    return
                }
                const villain_info = await read({"ID": id})
                const bounty_message = bountyCheck(criminal, villain_info)


                if (villain_info) {
                    let villain = new villainClass(villain_info.ID, villain_info.CUSTOM_TITLE, villain_info.RANK, villain_info.BOUNTY, villain_info.DEBATES, villain_info.CRIMINAL_OFFENSES);
                    villain.increaseBounty(custom_bounty)
                    villain.increaseDebateWin(opponent.id, debateTopic)
                    villain.setRank()
                    await update({"ID": villain.ID.toString()}, {"$set": villain})
                    let image = await bountyImage(criminal, villain)
                } else {
                    let villain = new villainClass(id, "N/A", "D", 0, [], [], 1);
                    villain.increaseBounty(custom_bounty)
                    villain.increaseDebateWin(opponent.id, debateTopic)
                    villain.setRank()
                    await create(villain)
                    let image = await bountyImage(criminal, villain)
                }

                await interaction.reply({
                    content: `Debate win has been added for **ID ${id}**!\nIncreased Bounty by **${custom_bounty.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}**`,
                    ephemeral: true
                })
                 
            } catch(err) {
                console.log(err)
                if(err) await interaction.editReply("There was an issue with reporting this debate win. Please seek developer support.")
                return
            }
        }
}