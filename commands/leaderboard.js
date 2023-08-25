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
                    {name: '🏦 Hall of Fame', value: 'hall'},
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
                            

                    } else if (leaderboardtype === "offenses") {
                        const topN = (arr, n) => {
                            if(n > arr.length){
                               return false;
                            }
                            return arr
                            .slice()
                            .sort((a, b) => {
                               return b.CRIMINAL_OFFENSES.length - a.CRIMINAL_OFFENSES.length
                            })
                            .slice(0, n);
                         };

                        const topOffenses = topN(villain_list, 10);
                        let topList = []
                        let count = 0
                        for(let offense of topOffenses) {
                            let username = await interaction.client.users.fetch(offense.ID).catch(() => null);
                            ++count
                            count === 1 ? m = "👑" : m = ""
                            topList.push(`${count.toString()} - **${username.username}** 🚓 **${offense.CRIMINAL_OFFENSES.length.toString()}** offenses ${m}\n`)
                        }
                        let message = topList.join("\n")
                        const embedVar = new EmbedBuilder()
                            .setTitle(`🚓 Criminal Offenses Leaderboard`)
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

                    
                    
                    
                    } else if (leaderboardtype === "hall"){
                        const villain_list = await readAll();
                        let listOfEmbeds = [];
                        for (let villain_info of villain_list) {
                            if (villain_info && villain_info.CRIMINAL_OFFENSES.length >= 1) {
                                let villain = new villainClass(villain_info.ID, villain_info.CUSTOM_TITLE, villain_info.RANK, villain_info.BOUNTY, villain_info.DEBATES, villain_info.CRIMINAL_OFFENSES);
                        
                                function chunk(items, size) {
                                    const chunks = []
                                    items = [].concat(...items)
                                    
                                    while (items.length) {
                                        chunks.push(
                                            items.splice(0, size)
                                        )
                                    }
                                    return chunks
                                }
                        
                                const highBountyOffenses = villain.CRIMINAL_OFFENSES.filter(offense => offense.BOUNTY > 500000);
                                let offenseChunks = chunk(highBountyOffenses, 5);
                                
                                for(let offense of offenseChunks){
                                    let m = [];
                                    for(let v of offense){
                                        m.push(`<@${villain.ID}> - **${v.OFFENSE}**\n💵 $${v.BOUNTY.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\n${v.DATE}\n`)
                                    }
                                    let j = m.join("\n")
                                    const embedVar = new EmbedBuilder()
                                        .setTitle(`📔 Hall of Fame Criminal Records`)
                                        .setDescription(`${j}`)
                                        
                                    listOfEmbeds.push(embedVar)
                                }
                        

                            }
                        }
                        if(listOfEmbeds.length >= 1){
                            listOfEmbeds.length <= 25 ? selectMenu = true : selectMenu = false

                            const buttons = [
                                { label: 'Previous', style: 'Danger' },
                                { label: 'Next', style: 'Success' },
                             ];
                             
                             new Pagination()
                                .setCommand(interaction)
                                .setPages(listOfEmbeds)
                                .setButtons(buttons)
                                .setPaginationCollector({ timeout: 120000 })
                                .setSelectMenu({ enable: selectMenu })
                                .setFooter({ enable: true })
                                .send();
                        }                    

                    } else {
                        await interaction.reply({
                            content: "This feature is currently under development. Please check back later.\n- *Goodle Bobdin*"
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