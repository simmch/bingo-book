const { SlashCommandBuilder } = require("@discordjs/builders");
const Pagination = require('customizable-discordjs-pagination');
const { PermissionFlagsBits, EmbedBuilder, ButtonStyle, AttachmentBuilder } = require("discord.js");
const { read } = require("../service/api");
const { villainClass } = require("../classes/villain");
const { bountyImage } = require("../utilities/bounty_canva");



module.exports = {
    data: new SlashCommandBuilder()
        .setName("criminaldetails")
        .setDescription("View a villains detailed offenses.")
        .addUserOption(option => 
                option
                    .setName("criminal")
                    .setDescription("type in criminal name")
                    .setRequired(true)
            ),
        async execute(interaction) {
            try {
                const criminal = interaction.options.getUser("criminal")
                const id = criminal.id
                const villain_info = await read({"ID": id})
                if (villain_info && villain_info.CRIMINAL_OFFENSES.length >= 1) {
                    let villain = new villainClass(villain_info.ID, villain_info.CUSTOM_TITLE, villain_info.RANK, villain_info.BOUNTY, villain_info.DEBATES, villain_info.CRIMINAL_OFFENSES);
                    let image = await bountyImage(criminal, villain)
                    // for(let offense in villain.CRIMINAL_OFFENSES)

                    // break the array into 5 lists
                    // you have to type the title of the bounty you want to remove
                    function chunk (items, size) {  
                        const chunks = []
                        items = [].concat(...items)
                      
                        while (items.length) {
                          chunks.push(
                            items.splice(0, size)
                          )
                        }
                      
                        return chunks
                    }

                    let offenseChunks = chunk(villain.CRIMINAL_OFFENSES, 4)
                    let listOfEmbeds = []
                    for(let offense of offenseChunks){
                        let m = []
                        for(let v of offense){
                            m.push(`**${v.OFFENSE}**\n💵 $${v.BOUNTY.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\n${v.DATE}\n`)
                        }
                        // console.log(m)
                        let j = m.join("\n")
                        const embedVar = new EmbedBuilder()
                            .setTitle(`📔 ${criminal.username} Criminal Record`)
                            .setDescription(`${j}`)
                            .setImage('attachment://profile-image.png')
                            .setThumbnail(criminal.displayAvatarURL())
                            
    
                        listOfEmbeds.push(embedVar)

                    }

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
                } else {
                    await interaction.reply({
                        content: `**${criminal.username}** does not have any criminal offenses.`,
                    })
                }


            } catch(err) {
                console.error(err)
                if(err) await interaction.editReply("There was an issue with showing this page in the bingo book. Please seek developer support.")
                return
            }
        }
}