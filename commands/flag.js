const { EmbedBuilder, SelectMenuBuilder, ActionRowBuilder, ComponentType, ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
const { create, read, update } = require("../service/api")
const { getChannelByName, getChannelById } = require("../utilities")
const { villainClass } = require("../classes/villain");



module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("flag")
        .setType(ApplicationCommandType.Message),
        async execute(interaction) {
            try {
                await interaction.deferReply();
                const channel = getChannelById(interaction.guild, interaction.targetMessage.channelId)
                const message = await channel.messages.fetch(interaction.targetMessage.id)

                const id = interaction.targetMessage.author.id
                let query = {"ID": id}
                const response = await read(query)
                var update_query = {"$set": {"FLAGS": 1}}

                if (response){
                    if (response.FLAGS) {
                        var update_query = {"$inc": {"FLAGS": 1}}
                    } else {
                        var update_query = {"$set": {"FLAGS": 1}}
                    }
                    await update(query, update_query)
                } else {
                    const villain = new villainClass(id, interaction.user.username, "C", 0, [], [], 1)
                    await create(villain)
                }

                await message.react("🚩")
                await interaction.deleteReply()

            } catch(err) {
                console.log(err)
                if(err) await interaction.editReply("There was an issue with reporting this offense. Please seek developer support.")
                return
            }
        }
}