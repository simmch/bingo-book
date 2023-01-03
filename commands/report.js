const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require("discord.js")
const { EmbedBuilder, SelectMenuBuilder, ActionRowBuilder, ComponentType } = require("discord.js");
const { read, create, update } = require("../service/api")
const { bountyActions, bountyCheck} = require("../utilities")
const { villainClass } = require("../classes/villain");
const { organizationClass } = require("../classes/organization")
const { bountyImage } = require("../utilities/bounty_canva")
const organizations_api = require("../service/api/organizations_api")



module.exports = {
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Report Criminal Offense to increase Bounty")
        .addUserOption(option => 
                option
                    .setName("criminal")
                    .setDescription("Criminal to report")
                    .setRequired(true)
            )
        .addStringOption(option => 
                option
                    .setName("customoffense")
                    .setDescription("Type a custom offense instead of selecting from dropdown")
                    .setRequired(false)
            )
        .addStringOption(option => 
                option
                    .setName("custombounty")
                    .setDescription("Type the bounty increase or use - in front for decrease like -1000.")
                    .setRequired(false)
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
        async execute(interaction) {
            try {
                const criminal = interaction.options.getUser("criminal")
                const custom_offense = interaction.options.getString("customoffense")
                const custom_bounty = interaction.options.getString("custombounty")
                const id = criminal.id
                const organization_info = await organizations_api.read({"MEMBERS": id})
                if(id === interaction.user.id){
                    await interaction.reply({
                        content: "No self reporting!",
                        ephemeral: true
                    })
                    return
                }
                const villain_info = await read({"ID": id})
                const bounty_message = bountyCheck(criminal, villain_info)

                if(custom_offense && custom_bounty){
                    if (villain_info) {
                        let villain = new villainClass(villain_info.ID, villain_info.CUSTOM_TITLE, villain_info.RANK, villain_info.BOUNTY, villain_info.DEBATES, villain_info.CRIMINAL_OFFENSES);
                        villain.increaseBounty(custom_bounty)
                        villain.customIncreaseCriminalOffense(custom_offense, custom_bounty.toString())
                        villain.setRank()
                        await update({"ID": villain.ID.toString()}, {"$set": villain})
                        let image = await bountyImage(criminal, villain)
                        await interaction.reply({
                            content: `Increased Bounty by **${custom_bounty.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}**`,
                            ephemeral: true
                        })
                    } else {
                        let villain = new villainClass(id, "N/A", "D", 0, [], []);
                        villain.increaseBounty(custom_bounty)
                        villain.customIncreaseCriminalOffense(custom_offense, custom_bounty.toString())
                        villain.setRank()
                        await create(villain)
                        let image = await bountyImage(criminal, villain)
                        await interaction.reply({
                            content: `Increased  Bounty by **${custom_bounty.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}**`,
                            ephemeral: true
                        })
                    }    
                } else {
                    const embedVar = new EmbedBuilder()
                    .setTitle("📔 Select Criminal Offense")
                    .setDescription(`Moderator or Staff, select the offense commited by the criminal from the list below.\n${bounty_message}`)
                    .addFields({name: "General Villain Behavior", value: "Increases bounty by 💵 **2,000**."})
                    .addFields({name: "Flagrant Question", value: "Increases bounty by 💵 **3,000**."})
                    .addFields({name: "Flagrant Statment", value: "Increases bounty by 💵 **8,000**."})
                    .addFields({name: "Generic Debate Win", value: "Increases bounty by 💵 **150,000**."})
                    .addFields({name: "Villain Arc Started", value: "Increases bounty by 💵 **500,000**."})
                    .addFields({name: "Direspected Others", value: "Decreases bounty by 💵 **10,000**."})
                    .addFields({name: "Generic Lost Debate", value: "Decreases bounty by 💵 **70,000**."})
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
                                    villain.increaseCriminalOffense(updatebounty.toString(), updatebounty.toString())
                                    villain.setRank()
                                    await update({"ID": villain.ID.toString()},{"$set": villain})
                                    
                                    if(organization_info){
                                        let organization = new organizationClass(organization_info.ID, organization_info.NAME, organization_info.MEMBERS, organization_info.OFFICERS, organization_info.OWNER, organization_info.BOUNTY, organization_info.RANK, organization_info.GIF )
                                        organization.sumTeamBounty(updatebounty)
                                        const response = await organizations_api.update({"ID": organization_info.ID}, {'$set': organization})                        
                                    }

                                    await i.reply({
                                        content: `Increased Bounty by **${updatebounty}**`,
                                        ephemeral: true
                                    })
                                } else {
                                    let villain = new villainClass(id, "N/A", "D", 0, [], []);
                                    villain.increaseBounty(updatebounty)
                                    villain.increaseCriminalOffense(updatebounty.toString(),  updatebounty.toString())
                                    villain.setRank()
                                    await create(villain)
                                    // let image = await bountyImage(criminal, villain)
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


                }
                 
            } catch(err) {
                console.log(err)
                if(err) await interaction.editReply("There was an issue with reporting this offense. Please seek developer support.")
                return
            }
        }
}