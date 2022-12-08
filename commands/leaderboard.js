const { SlashCommandBuilder } = require("@discordjs/builders");
const Pagination = require('customizable-discordjs-pagination');
const { PermissionFlagsBits, EmbedBuilder, ButtonStyle, AttachmentBuilder, UserManager } = require("discord.js");
const { readAll } = require("../service/api");
const { villainClass } = require("../classes/villain");
const { bountyImage } = require("../utilities/bounty_canva");




module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("View a villains detailed offenses.")
        .addStringOption(option => 
            option
                .setName("type")
                .setDescription("which leaderboard would you like to see")
                .setRequired(true)
                .addChoices(
                    {name: '🚓 Offenses Leaderboard', value: 'offenses'},
                    {name: '💰 Bounty Leaderboard', value: 'bounties'}
                )
        ),
        async execute(interaction) {
            try {
                const leaderboardtype = interaction.options.getString("type")
                const villain_list = await readAll()
                if (villain_list) {
                    if (leaderboardtype === "bounties") {
                        const topN = (arr, n) => {
                            if(n > arr.length){
                               return false;
                            }
                            return arr
                            .slice()
                            .sort((a, b) => {
                               return b.BOUNTY - a.BOUNTY
                            })
                            .slice(0, n);
                         };

                        const topBounties = topN(villain_list, 10);
                        let topList = []
                        let count = 0
                        for(let bounty of topBounties) {
                            let username = await interaction.client.users.fetch(bounty.ID).catch(() => null);
                            ++count
                            count === 1 ? m = "👑" : m = ""
                            topList.push(`${count.toString()} - 💵 $${bounty.BOUNTY.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}  **${username.username}** ${m}\n`)
                        }
                        let message = topList.join("\n")
                        const embedVar = new EmbedBuilder()
                            .setTitle(`💰 Bounty Leaderboard`)
                            .setDescription(`${message}`)
                            // .setAuthor({
                            //     name: `📚 ${title}\nChapter ${chapterNumber.toString()}`,
                            // })
                            // .setFooter({
                            //     text: `Page ${page} of ${pages.length}`
                            // })
                        
                            await interaction.reply({
                                embeds: [embedVar]
                            })
                            

                    } else {
                        await interaction.reply({
                            content: "This feature is currently under development. Please check back later.\n- *Doodle Bobdin*"
                        })
                    }

                } else {
                    await interaction.reply({
                        content: `There are no Bingo Book records.`,
                    })
                }


            } catch(err) {
                console.error(err)
                if(err) await interaction.editReply("There was an issue with showing the leaderboard. Please seek developer support.")
                return
            }
        }
}