const mongoose = require("mongoose");

const VillainSchema = new mongoose.Schema({
    ID: {
        type: String,
    },
    CUSTOM_TITLE: {
        type: String,
    },
    RANK: {
        type: String,
    },
    BOUNTY: {
        type: Number,
    },
    DEBATES: {
        type: Array
    },
    CRIMINAL_OFFENSES: {
        type: Array
    }
});

const collection = "VILLAINS";

module.exports = Villain = mongoose.model("villains", VillainSchema, collection);