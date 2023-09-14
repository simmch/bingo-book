require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { EmbedBuilder } = require("discord.js");
const { Routes } = require("discord-api-types/v9");
const openai = require("openai");
const prompts = require("../utilities/prompts")

const ai = new openai.OpenAI({apiKey: process.env.OPENAI_API_KEY})


module.exports = {
    name: "ready",
    once: true,
    execute (client, commands) {
        console.log("Bot is online")
        var token = ""
        process.env.ENV === "production" ? token = process.env.PRODUCTION_TOKEN : token = process.env.TEST_TOKEN

        const CLIENT_ID = client.user.id;
    
        const rest = new REST({
            version: "9"
        }).setToken(token);
    
        (async () => {
            try {
                if (process.env.ENV === "production" || process.env.ENV === "prod" || process.env.ENV === "test") {
                    await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: commands
                    });
                    console.log("Successfully registered commands globally.");
                } else {
                    await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: commands
                    });
                    console.log("Successfully registered commands locally.");
                }
                async function getHotTake() {
                    try {
                        let prompt;
                
                        prompt = prompts.hotTakePrompt();
                        const completion = await ai.chat.completions.create({
                            messages: [{ role: 'user', content: prompt }],
                            model: 'gpt-3.5-turbo-16k',
                        });
                        console.log(completion.choices[0].message.content)
                        return completion.choices[0].message.content;
                    } catch (error) {
                        console.error(error);
                        throw new Error("There was an issue with getting the question. Please seek developer support.");
                    }
                }


                async function reviewPromptTake() {
                    try {
                        let prompt;
                
                        prompt = prompts.reviewPrompt();
                        const completion = await ai.chat.completions.create({
                            messages: [{ role: 'user', content: prompt }],
                            model: 'gpt-3.5-turbo-16k',
                        });
                        console.log(completion.choices[0].message.content)
                        return completion.choices[0].message.content;
                    } catch (error) {
                        console.error(error);
                        throw new Error("There was an issue with getting the question. Please seek developer support.");
                    }
                }


                // Set an interval to run every hour (3600000 milliseconds)
                setInterval(async () => {
                    // Loop through all guilds (servers) the bot is a member of
                    const channel = client.channels.cache.get(process.env.PROD_CHANNEL_ID_FOR_HOTTAKES)
                    const hot_take = await getHotTake()

                    console.log(hot_take)
                
                    const embedVar = new EmbedBuilder()
                        .setTitle(`🔥 Ai Anime Hot Take`)
                        .setDescription(hot_take)
                        .setTimestamp()
                    channel.send({ embeds: [embedVar] });
                }, 3600000 ); // 3600000 -  45 minutes in milliseconds

                // Set an interval to run every hour (3600000 milliseconds)
                // setInterval(async () => {
                //     // Loop through all guilds (servers) the bot is a member of
                //     const channel = client.channels.cache.get(process.env.PROD_CHANNEL_ID_FOR_HOTTAKES)
                //     const review_take = await reviewPromptTake()

                //     console.log(review_take)
                
                //     const embedVar = new EmbedBuilder()
                //         .setTitle(`✨ Ai Anime Review`)
                //         .setDescription(review_take)
                //         .setTimestamp()
                //     channel.send({ embeds: [embedVar] });
                // }, 3600000 ); // 2700000 -  45 minutes in milliseconds

            } catch (err) {
                if (err) console.error(err);
            }
        })();
    
    }
}