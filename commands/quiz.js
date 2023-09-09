const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js");
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
                        const jsonResponse = validateJSONFormat(rawResponse);
                        console.log(jsonResponse)
                        return jsonResponse;
                    } catch (error) {
                        console.error(error);
                        throw new Error("There was an issue with getting the question. Please seek developer support.");
                    }
                }

                function validateJSONFormat(response) {
                    // Convert the response to a string
                    let strResponse = String(response);
                
                    // Replace single quotes with double quotes
                    strResponse = strResponse.replace(/'/g, '"');
                
                    // Escape any unescaped double quotes inside string values
                    strResponse = strResponse.replace(/"(.*?)"/g, function(match, p1) {
                        return '"' + p1.replace(/(?<!\\)"/g, '\\"') + '"';
                    });
                
                    // Use a regular expression to ensure all keys are enclosed in double quotes
                    strResponse = strResponse.replace(/(?<!["\w])\s*([\w]+)\s*:/g, '"$1":');
                
                    return strResponse;
                }

                function generateRandom7DigitNumber() {
                    const min = 1000000; // Minimum 7-digit number (inclusive)
                    const max = 9999999; // Maximum 7-digit number (inclusive)
                    const random7DigitNumber = Math.floor(Math.random() * (max - min + 1)) + min;
                    return random7DigitNumber;
                }
                
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
                    .setDescription(`**${quiz.question}**\n\n**A** ${quiz.answers.a}\n**B** ${quiz.answers.b}\n**C** ${quiz.answers.c}\n**D** ${quiz.answers.d}`)
                    .setTimestamp()
                    .setFooter({text: "Type a, b, c, or d to answer!"})
                
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
                        message.channel.send(`Incorrect answer! The correct answer was **${quiz.correct_answer}**.`);
                    }
                    // await msg.delete();
                    collector.stop(); // Stop collecting responses
                });

                collector.on('end', async (collected, reason) => {
                    if (reason === 'time') {
                        await interaction.editReply('You did not answer in time.');
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