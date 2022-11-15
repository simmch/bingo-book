const { SlashCommandBuilder } = require("@discordjs/builders");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("pong")
        .setDescription("This is a test command"),
    async execute(interaction) {
        try {
            console.log("This is a test")
            await interaction.reply({
                content: `This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`
            });
        } catch(err) {
            if(err) console.log(err)
            await interaction.reply(`There was an issue. ${err}`)
            return
        }
    }
}