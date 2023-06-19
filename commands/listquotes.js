const { SlashCommandBuilder } = require("@discordjs/builders");
const Pagination = require('customizable-discordjs-pagination');
const { PermissionFlagsBits, EmbedBuilder, ButtonStyle, AttachmentBuilder, UserManager } = require("discord.js");
const { read, update, readAll, readAllByOwner } = require("../service/api/quotable_api")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("listquotes")
        .setDescription("List all of the quotes in the database.")
        .addUserOption(option => 
            option
                .setName("quoter")
                .setDescription("Optionally list by quoter")
                .setRequired(false)

        ),
        async execute(interaction) {
            try {
                const quoter = interaction.options.getUser("quoter")
                let quote_list;
                if (!quoter) {
                    quote_list = await readAll();
                } else {
                    quote_list = await readAllByOwner(quoter.id);
                }

                if (quote_list.length >= 1) {
                    let quoteList = []
                    let count = 0
                    for(let quote of quote_list) {
                        let username = await interaction.client.users.fetch(quote.OWNER).catch(() => null);
                        ++count
                        quoteList.push(`**QID${quote.ID}** - ${username} 💬 ${quote.QUOTE}\n`)
                    }
                    let message = quoteList.join("\n")
                    const embedVar = new EmbedBuilder()
                        .setTitle(`💬 Dojo Quotables`)
                        .setDescription(`${message}`)
                        .setTimestamp()
                    
                        await interaction.reply({
                            embeds: [embedVar]
                        })
          
                } else {
                    await interaction.reply({
                        content: `There are no quotes in the database.`,
                        ephemeral: true
                    })
                }

            } catch(err) {
                console.error(err)
                if(err) await interaction.reply({
                    content: "There was an error trying to execute that command.",
                    ephemeral: true
                })
                return
            }
        }
}