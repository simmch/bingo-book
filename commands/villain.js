const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord.js");
const { read } = require("../service/api");
const { villainClass } = require("../classes/villain");
const { bountyImage } = require("../utilities/bounty_canva");



module.exports = {
    data: new SlashCommandBuilder()
        .setName("criminallookup")
        .setDescription("View a villain page in the bingo book.")
        .addUserOption(option => 
                option
                    .setName("criminal")
                    .setDescription("type in criminal name")
                    .setRequired(true)
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
        async execute(interaction) {
            try {
                const criminal = interaction.options.getUser("criminal")
                const id = criminal.id
                const villain_info = await read({"ID": id})
                if (villain_info) {
                    let villain = new villainClass(villain_info.ID, villain_info.CUSTOM_TITLE, villain_info.RANK, villain_info.BOUNTY, villain_info.DEBATES, villain_info.CRIMINAL_OFFENSES);
                    let image = await bountyImage(criminal, villain)
                    await interaction.reply({
                        files: [image],
                    })
                } else {
                    await interaction.reply({
                        content: `**${criminal.username}** does not have a Bingo Book entry. Let's hope they don't end up with one.`,
                    })
                }


            } catch(err) {
                console.log(err)
                if(err) await interaction.editReply("There was an issue with showing this page in the bingo book. Please seek developer support.")
                return
            }
        }
}