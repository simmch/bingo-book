const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const openai = require("openai");
const prompts = require("../utilities/prompts")
const { villainClass } = require("../classes/villain");
const quiz_questions_api = require("../service/api/quiz_questions_api")

const ai = new openai.OpenAI({apiKey: process.env.OPENAI_API_KEY})

module.exports = {
    data: new SlashCommandBuilder()
        .setName("trivia")
        .setDescription("Answer an anime trivia question!"),
        async execute(interaction) {
            await interaction.deferReply();
            try {
                const id = interaction.user.id
                // const organization_info = await organizations_api.read({"MEMBERS": id})
                // const villain_info = await read({"ID": id})
                
                async function getQuestion() {
                    try {
                        let prompt;
                
                        prompt = prompts.basicPrompt();
                        const completion = await ai.chat.completions.create({
                            messages: [{ role: 'user', content: prompt }],
                            model: 'gpt-3.5-turbo-16k',
                        });

                        // In your getQuestion function, after receiving the response:
                        const rawResponse = completion.choices[0].message.content;
                        console.log(rawResponse)
                        return rawResponse;
                    } catch (error) {
                        console.error(error);
                        throw new Error("There was an issue with getting the question. Please seek developer support.");
                    }
                }
                
                function generateRandom7DigitNumber() {
                    const min = 1000000; // Minimum 7-digit number (inclusive)
                    const max = 9999999; // Maximum 7-digit number (inclusive)
                    const random7DigitNumber = Math.floor(Math.random() * (max - min + 1)) + min;
                    return random7DigitNumber;
                }


                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`A`)
                            .setLabel("A")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId(`B`)
                            .setLabel("B")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId(`C`)
                            .setLabel("C")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId(`D`)
                            .setLabel("D")
                            .setStyle(ButtonStyle.Primary),
                    )
                
                const quizData = await getQuestion()
                if(!quizData) return
                const quiz = JSON.parse(quizData)
                const quiz_question_object = {
                    ID: generateRandom7DigitNumber(),
                    QUESTION: quiz.question,
                    ANSWERS: quiz.answers,
                    CORRECT_ANSWER: quiz.correct_answer,
                }
                const quiz_question_saved = await quiz_questions_api.create(quiz_question_object)
                
                var embedVar = new EmbedBuilder()
                    .setTitle(`🕵️‍♂️ Anime Trivia`)
                    .setDescription(`<@${id}> - **${quiz.question}**\n\n**A** ${quiz.answers.a}\n**B** ${quiz.answers.b}\n**C** ${quiz.answers.c}\n**D** ${quiz.answers.d}`)
                    .setTimestamp()
                    .setFooter({text: "Type a, b, c, or d to answer!"})
                
                const msg = await interaction.editReply({
                    embeds: [embedVar],
                    components: [row]
                })

                // Filter to collect only the user's response
                const filter = b => b.user.id === interaction.user.id

                const collector = interaction.channel.createMessageComponentCollector({filter, max:1, time: 30000}); // You can adjust the time limit (in milliseconds)

                collector.once('collect', async (message) => {
                    await message.deferUpdate();
                    console.log(message)
                    const selectedAnswer = message.customId.toLowerCase();

                    if (selectedAnswer === quiz.correct_answer) {
                        message.channel.send(`<@${id}> Correct answer!`);
                    } else {
                        try {
                            let prompt;
                    
                            prompt = prompts.incorrectAnswerPrompt(quiz.correct_answer.toUpperCase());
                            const completion = await ai.chat.completions.create({
                                messages: [{ role: 'user', content: prompt }],
                                model: 'gpt-3.5-turbo-16k',
                            });

                            message.channel.send(`<@${id}> ${completion.choices[0].message.content}`);
                        } catch (error) {
                            console.error(error);
                            throw new Error("There was an issue with getting the question. Please seek developer support.");
                        }
    
                    }
                    await msg.delete();
                    collector.stop(); // Stop collecting responses
                });

                collector.on('end', async (collected, reason) => {
                        
                        if (reason === 'time') {
                            try {
                                let prompt;
                        
                                prompt = prompts.timeoutPrompt(quiz.correct_answer.toUpperCase());
                                const completion = await ai.chat.completions.create({
                                    messages: [{ role: 'user', content: prompt }],
                                    model: 'gpt-3.5-turbo-16k',
                                });
                                // console.log(completion.choices[0].message.content)
                                await interaction.editReply({content: `<@${id}> ${completion.choices[0].message.content}`, embeds: [], components: []});
                            } catch (error) {
                                console.error(error);
                                throw new Error("There was an issue with getting the question. Please seek developer support.");
                            }
                            
                        }
                    }
                );

                 
            } catch(err) {
                console.log(err)
                if(err) await interaction.editReply("Uh Oh! The trivia question didn't load properly. Please, try again!")
                return
            }
        }
}