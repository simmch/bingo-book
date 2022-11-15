require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

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
            } catch (err) {
                if (err) console.error(err);
            }
        })();
    
    }
}