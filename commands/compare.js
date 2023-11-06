const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const openai = require("openai");
const prompts = require("../utilities/prompts");

const ai = new openai.OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = {
    data: new SlashCommandBuilder()
        .setName("versuz")
        .setDescription("Pit two anime together in a head to head battle!")
        .addStringOption(option => 
            option
                .setName("anime1")
                .setDescription("First anime to battle")
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option => 
            option
                .setName("anime2")
                .setDescription("Second anime to battle")
                .setRequired(true)
                .setAutocomplete(true)),
    
    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        let focusedValue;

        if (focusedOption.name === 'anime1' || focusedOption.name === 'anime2') {
            focusedValue = focusedOption.value.toLowerCase();
        }

        const filtered = prompts.animeMangaList.filter(choice => choice.toLowerCase().startsWith(focusedValue)).slice(0, 25);
        
        await interaction.respond(
            filtered.map(choice => ({
                name: choice,
                value: choice
            }))
        );
    },

    async execute(interaction) {
        await interaction.deferReply();
        const anime1 = interaction.options.getString("anime1");
        const anime2 = interaction.options.getString("anime2");


        async function getVersesResults(a1, a2) {
            try {
                let prompt;
        
                prompt = prompts.versusPrompt(a1, a2);
                const completion = await ai.chat.completions.create({
                    messages: [{ role: 'user', content: prompt }],
                    model: 'gpt-4-1106-preview',
                });
                return completion.choices[0].message.content;
            } catch (error) {
                console.error(error);
                throw new Error("There was an issue with getting the question. Please seek developer support.");
            }
        }


        const versuz_results = await getVersesResults(anime1, anime2)


        const embedVar = new EmbedBuilder()
            .setTitle(`${anime1} 🆚 ${anime2}`)
            .setDescription(`${versuz_results}`)
            .setTimestamp()
        await interaction.followUp({ embeds: [embedVar] });
    }
};
