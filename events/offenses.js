const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const { read, create, update } = require("../service/api");
const { villainClass } = require("../classes/villain");
const { request } = require("undici");
// const { ranks, bountyActions, bountyLosses, bountyCheck} = require("../utilities")

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (!interaction.isSelectMenu()) return;

        if (interaction.customId === 'offensereportsd') {
            // try {
            //     await interaction.deferUpdate();
            //     console.log(interaction)
            //     let id = interaction.user.id
            //     let results = interaction.values
            //     let updatebounty = Number(interaction.values)
            //     const villain_info = await read({"ID": id})

            //     if (villain_info) {
            //         let villain = new villainClass(villain_info.ID, villain_info.CUSTOM_TITLE, villain_info.RANK, villain_info.BOUNTY, villain_info.DEBATES, villain_info.CRIMINAL_OFFENSES);
            //         villain.increaseBounty(results)
            //         villain.increaseCriminalOffense()
            //         villain.setRank()
            //         await update({"$set": villain})
            //         await interaction.editReply({
            //             content: `Increased ${interaction.user.name}'s Bounty by ${results}`,
            //             embeds: [],
            //             components: []
            //         })
            //     } else {
            //         let villain = new villainClass(id, "N/A", "D", 0, [], 0);
            //         villain.increaseBounty(results)
            //         villain.increaseCriminalOffense()
            //         villain.setRank()
            //         await create(villain)
            //         await interaction.editReply({
            //             content: `Increased ${interaction.user.name}'s Bounty by ${results}`,
            //             embeds: [],
            //             components: []
            //         })
            //     }

            // } catch(err) {
            //     console.log(err)
            //     if(err) await interaction.editReply(`There was an error reporting offense. Seek developer support.`)
            //     return
            // }
            

        }
    
    }
}