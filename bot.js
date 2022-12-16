require("dotenv").config();
const fs = require("fs");
const express = require("express");
const connectDB = require("./service/db");
const {Client, GatewayIntentBits, Partials, Collection} = require("discord.js");
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
], partials: [Partials.Channel] });

const app = express();
connectDB();

// app.get('/', (req, res) => {
//     res.send("Hello World")
// })

const commandFiles = fs
    .readdirSync("./commands")
    .filter(file => file.endsWith(".js"));

const commands = [];

client.commands = new Collection()

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}


const eventFiles = fs
    .readdirSync("./events")
    .filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, commands));
    } else {
        client.on(event.name, (...args) => event.execute(...args, commands));
    }
}



if(process.env.ENV === "production"){
    client.login(process.env.PRODUCTION_TOKEN)
} else {
    client.login(process.env.TEST_TOKEN)
}