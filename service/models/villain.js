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
        type: Number
    }
});

const collection = "VILLAINS";

module.exports = Villain = mongoose.model("villains", VillainSchema, collection);