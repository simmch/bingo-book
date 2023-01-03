const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require("discord.js")
const { EmbedBuilder, SelectMenuBuilder, ActionRowBuilder, ComponentType } = require("discord.js");
const { read, create, update } = require("../service/api")
const { bountyActions, bountyCheck} = require("../utilities")
const { villainClass } = require("../classes/villain");
const { bountyImage } = require("../utilities/bounty_canva")



module.exports = {
    data: new SlashCommandBuilder()
        .setName("reduction")
        .setDescription("Move for a bounty reduction")
        .addStringOption(option => 
                option
                    .setName("amount")
                    .setDescription("Bounty amount you want reduced")
                    .setRequired(true)
            ),
        async execute(interaction) {
            try {
                const amount = interaction.options.getString("amount")
                const id = interaction.user.id
                const villain_info = await read({"ID": id})

                if (villain_info) {
                    const embedVar = new EmbedBuilder()
                    .setTitle(`⚠️ ${interaction.user.username} has filed a motion to lower his bounty `)
                    .setDescription(`Requested amount to be lowered: 💵 ${amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`)

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new SelectMenuBuilder()
                                .setCustomId("offensereported")
                                .setPlaceholder("list of offenses")
                                .addOptions(bountyActions)
                        )
                    
                    const message = await interaction.reply({
                        embeds: [embedVar],
                        fetchReply: true,
                        ephemeral: false
                    });

                    message.react('✅').then(() => message.react('🚫'));

                    const filter = (reaction, user) => {
                        const isAdmin = message.guild.members.cache
                        .find((member) => member.id === user.id)
                        .permissions.has(PermissionFlagsBits.MuteMembers);
                        return ['✅', '🚫'].includes(reaction.emoji.name) && isAdmin;
                    };

                    message.awaitReactions({ filter, max: 4, time: 10000 })
                        .then(async collected => {
                            const thumbsUp = collected.first();
                            const thumbsDown = collected.last();
                            
                            if (thumbsUp.emoji.name === '✅' && thumbsUp.count >= 3) {
                                let villain = new villainClass(villain_info.ID, villain_info.CUSTOM_TITLE, villain_info.RANK, villain_info.BOUNTY, villain_info.DEBATES, villain_info.CRIMINAL_OFFENSES);
                                villain.decreaseBounty(amount)
                                villain.customIncreaseCriminalOffense("Bounty reduction request accepted. ", amount)
                                villain.setRank()
                                await update({"ID": villain.ID.toString()},{"$set": villain})
                                message.reactions.removeAll();
                                await interaction.editReply({
                                    content: `${interaction.user} - Bounty reduction request accepted. Bounty has been reduced by 💵 ${amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
                                    embeds: [],
                                });
                            } else {
                                message.reactions.removeAll();
                                await interaction.editReply({
                                    content: `${interaction.user} - The motion to reduce your bounty did not pass.`,
                                    embeds: [],
                                });
                            }
                        })
                        .catch(async collected => {
                            // await interaction.deleteReply();
                            message.reactions.removeAll();
                            await interaction.editReply({
                                content: `${interaction.user} - The motion to reduce your bounty did not pass.`,
                                embeds: []
                            });
                        });

                } else {
                    await interaction.reply({
                        content: "You do not have a record in the Bingo Book.",
                        ephemeral: true
                    })
                }
                 
            } catch(err) {
                console.log(err)
                if(err) await interaction.editReply("There was an issue with reporting this offense. Please seek developer support.")
                return
            }
        }
}