const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require("discord.js")
const { EmbedBuilder, SelectMenuBuilder, ActionRowBuilder, ComponentType } = require("discord.js");
const { read, create, update } = require("../service/api")
const { bountyActions, bountyCheck} = require("../utilities")
const { villainClass } = require("../classes/villain");
const { bountyImage } = require("../utilities/bounty_canva")



module.exports = {
    data: new SlashCommandBuilder()
        .setName("reportoffense")
        .setDescription("Report Criminal Offense to increase Bounty")
        .addUserOption(option => 
                option
                    .setName("criminal")
                    .setDescription("Criminal to report")
                    .setRequired(true)
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
        async execute(interaction) {
            try {
                const criminal = interaction.options.getUser("criminal")
                const id = criminal.id
                const villain_info = await read({"ID": id})
                const bounty_message = bountyCheck(criminal, villain_info)
                const embedVar = new EmbedBuilder()
                    .setTitle("📔 Select Criminal Offense")
                    .setDescription(`Moderator or Staff, select the offense commited by the criminal from the list below.\n${bounty_message}`)
                    .addFields({name: "General Villain Behavior", value: "Increases bounty by 🪙 **1,000**."})
                    .addFields({name: "Flagrant Question", value: "Increases bounty by 🪙 **3,000**."})
                    .addFields({name: "Flagrant Statment", value: "Increases bounty by 🪙 **8,000**."})
                    .addFields({name: "Generic Debate Win", value: "Increases bounty by 🪙 **100,000**."})
                    .addFields({name: "Villain Arc Started", value: "Increases bounty by 🪙 **500,000**."})
                    .addFields({name: "Direspected Others", value: "Decreases bounty by 🪙 **10,000**."})
                    .addFields({name: "Lost Debate", value: "Decreases bounty by 🪙 **50,000**."})
                const row = new ActionRowBuilder()
                    .addComponents(
                        new SelectMenuBuilder()
                            .setCustomId("offensereported")
                            .setPlaceholder("list of offenses")
                            .addOptions(bountyActions)
                    )
                
                const message = await interaction.reply({
                    embeds: [embedVar],
                    components: [row],
                    fetchReply: true,
                    ephemeral: true
                });

                const collector = message.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 15000 });

                collector.on('collect', async i => {
                    if (i.user.id === interaction.user.id) {
                        // i.reply(`${i.user.id} blah.`);
                        try {
                            // await interaction.deferUpdate();
                            let updatebounty = Number(i.values)

                            if (villain_info) {
                                let villain = new villainClass(villain_info.ID, villain_info.CUSTOM_TITLE, villain_info.RANK, villain_info.BOUNTY, villain_info.DEBATES, villain_info.CRIMINAL_OFFENSES);
                                villain.increaseBounty(updatebounty)
                                villain.increaseCriminalOffense(updatebounty.toString())
                                villain.setRank()
                                await update({"$set": villain})
                                let image = await bountyImage(criminal, villain)
                                await i.reply({
                                    content: `Increased Bounty by **${updatebounty}**`,
                                    ephemeral: true
                                })
                            } else {
                                let villain = new villainClass(id, "N/A", "D", 0, [], []);
                                villain.increaseBounty(updatebounty)
                                villain.increaseCriminalOffense(updatebounty.toString())
                                villain.setRank()
                                await create(villain)
                                let image = await bountyImage(criminal, villain)
                                await i.reply({
                                    content: `Increased  Bounty by **${updatebounty}**`,
                                    ephemeral: true
                                })
                            }

                        } catch(err) {
                            console.log(err)
                            if(err) await interaction.editReply(`There was an error reporting offense. Seek developer support.`)
                            return
                        }

                    } else {
                        i.reply({ content: `Not for you!`, ephemeral: true });
                    }
                });

                collector.on('end', collected => {
                    console.log(`Collected ${collected.size} interactions.`);
                });

                // await interaction.awaitMessageComponent({ filter, componentType: "SELECT_MENU", time: 60000 })
                //     .then(interaction => interaction.editReply(`You selected ${interaction.values.join(', ')}!`))
                //     .catch(err => console.log(`No interactions were collected.`));

            } catch(err) {
                console.log(err)
                if(err) await interaction.editReply("There was an issue with reporting this offense. Please seek developer support.")
                return
            }
        }
}