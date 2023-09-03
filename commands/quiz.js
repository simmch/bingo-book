const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require("discord.js")
const { EmbedBuilder } = require("discord.js");
const { read, create, update } = require("../service/api")
const openai = require("openai");
const prompts = require("../utilities/prompts")
const { villainClass } = require("../classes/villain");
const { bountyImage } = require("../utilities/bounty_canva")
const organizations_api = require("../service/api/organizations_api")
const axios = require("axios")

const ai = new openai.OpenAI({apiKey: process.env.OPENAI_API_KEY})

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quiz")
        .setDescription("Take an anime quiz")
        .addStringOption(option => 
                option
                    .setName("difficulty")
                    .setDescription("Select a difficulty")
                    .addChoices(
                        {name: "Basic", value: "basic"},
                        {name: "Difficult", value: "difficult"},
                        {name: "Super Difficult", value: "super difficult"},
                    )
            )
        .addStringOption(option => 
                option 
                .setName("anime") 
                .setDescription("Select an anime") 
                .addChoices( 
                    {name: "Naruto", value: "naruto"},
                    {name: "One Piece", value: "one piece"},
                    {name: "Bleach", value: "bleach"},
                    {name: "Dragon Ball", value: "dragon ball"},
                    {name: "Hunter x Hunter", value: "hunter x hunter"},
                    {name: "My Hero Academia", value: "my hero academia"},
                    {name: "Demon Slayer", value: "demon slayer"},
                    {name: "Attack on Titan", value: "attack on titan"},
                    {name: "Fullmetal Alchemist", value: "fullmetal alchemist"},
                    {name: "Tokyo Ghoul", value: "tokyo ghoul"},
                    {name: "Death Note", value: "death note"},
                    {name: "Sword Art Online", value: "sword art online"},
                    {name: "Code Geass", value: "code geass"},
                    {name: "Fairy Tail", value: "fairy tail"},
                    {name: "Seven Deadly Sins", value: "seven deadly sins"},
                )
            ),
        async execute(interaction) {
            await interaction.deferReply();
            try {
                const difficulty = interaction.options.getString("difficulty")
                const anime = interaction.options.getString("anime")
              
                if(!difficulty || !anime){ 
                    await interaction.reply({content: "Please provide a difficulty and anime.", ephemeral: true})
                    return
                }
                const id = interaction.user.id
                // const organization_info = await organizations_api.read({"MEMBERS": id})
                // const villain_info = await read({"ID": id})

                async function getQuestion(difficulty, amount, category) {
                    try {
                        const prompt = prompts.quizPrompt(difficulty, amount, category)
                        const completion = await ai.chat.completions.create({
                            messages: [{role: 'user', content: prompt}],
                            model: 'gpt-3.5-turbo-16k',
                        })

                        return completion.choices[0].message.content
                    } catch(err) {
                        console.log(err)
                        if(err) await interaction.editReply("There was an issue with getting the question. Please seek developer support.")
                        return false
                    }
                }
                
                const quizData = await getQuestion(difficulty, 1, anime)
                if(!quizData) return
                const quiz = JSON.parse(quizData)
                console.log(quiz)

                var embedVar = new EmbedBuilder()
                    .setTitle(`🕵️‍♂️ ${anime} quiz`)
                    .setDescription(`${quiz.question}\na) ${quiz.answers.a}\nb) ${quiz.answers.b}\nc) ${quiz.answers.c}\nd) ${quiz.answers.d}`)

                    .setTimestamp()
                
                const msg = await interaction.editReply({
                    embeds: [embedVar]
                })

                // Filter to collect only the user's response
                const filter = (response) => {
                    return ['a', 'b', 'c', 'd'].includes(response.content.toLowerCase()) && response.author.id === interaction.user.id;
                };

                const collector = interaction.channel.createMessageCollector({filter, max:1, time: 15000}); // You can adjust the time limit (in milliseconds)

                collector.on('collect', async (message) => {
                    const selectedAnswer = message.content.toLowerCase();

                    if (selectedAnswer === quiz.correct_answer) {
                        message.channel.send('Correct answer!');
                    } else {
                        message.channel.send('Incorrect answer!');
                    }
                    await msg.delete();
                    collector.stop(); // Stop collecting responses
                });

                collector.on('end', (collected, reason) => {
                    if (reason === 'time') {
                        message.channel.send('Time is up! Quiz expired.');
                    }
                });

            //     if(custom_offense && custom_bounty){
            //         if (villain_info) {
            //             let villain = new villainClass(villain_info.ID, villain_info.CUSTOM_TITLE, villain_info.RANK, villain_info.BOUNTY, villain_info.DEBATES, villain_info.CRIMINAL_OFFENSES, villain_info.FLAG);
            //             villain.increaseBounty(custom_bounty)
            //             villain.customIncreaseCriminalOffense(custom_offense, custom_bounty.toString())
            //             villain.setRank()
            //             await update({"ID": villain.ID.toString()}, {"$set": villain})
            //             let image = await bountyImage(criminal, villain)
            //             await channel.send({
            //                 embeds: [embedVar],
            //             })
            //         } else {
            //             let villain = new villainClass(id, "N/A", "D", 0, [], [], 1);
            //             villain.increaseBounty(custom_bounty)
            //             villain.customIncreaseCriminalOffense(custom_offense, custom_bounty.toString())
            //             villain.setRank()
            //             await create(villain)
            //             let image = await bountyImage(criminal, villain)
            //             await channel.send({
            //                 embeds: [embedVar],
            //             })
            //         }    
            //     }

            //     await interaction.reply({
            //         content: `**${criminal}** has been reported.`,                    
            //     })
                 
            } catch(err) {
                console.log(err)
                if(err) await interaction.editReply("There was an issue with reporting this offense. Please seek developer support.")
                return
            }
        }
}