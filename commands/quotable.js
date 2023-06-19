const { SlashCommandBuilder } = require("@discordjs/builders")
const { read, create, update } = require("../service/api/quotable_api")



module.exports = {
    data: new SlashCommandBuilder()
        .setName("addquote")
        .setDescription("Report dojo quotables.")
        .addUserOption(option => 
                option
                    .setName("quoter")
                    .setDescription("dojo member who said the quote")
                    .setRequired(true)
            )
        .addStringOption(option => 
                option
                    .setName("quote")
                    .setDescription("quote said by the dojo member")
                    .setRequired(true)
            ),
        async execute(interaction) {
            try {
                const quoter = interaction.options.getUser("quoter")
                const quote = interaction.options.getString("quote")
                const id = Math.floor(Math.random() * 10000)
                const create_query = {"ID": id, "QUOTE": quote, "OWNER": quoter.id}
                const response = await create(create_query)

                if (response) {
                    await interaction.reply({
                        content: "Quote successfully added to the database.",
                        ephemeral: true
                    })
                } else {
                    await interaction.reply({
                        content: "There was an error adding the quote to the database.",
                        ephemeral: true
                    })
                }
            } catch(err) {
                console.log(err)
                if(err) await interaction.editReply({
                    content: "There was an error trying to execute that command.",
                    ephemeral: true
                })
                return
            }
        }
}