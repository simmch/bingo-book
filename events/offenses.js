const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const { read, create, update } = require("../service/api");
const { villainClass } = require("../classes/villain");
const { request } = require("undici");
// const { ranks, bountyActions, bountyLosses, bountyCheck} = require("../utilities")

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (!interaction.isSelectMenu()) return;
    
    }
}