const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema({
    ID: {
        type: String,
    },
    NAME: {
        type: String,
    },
    MEMBERS: {
        type: Array,
    },
    OFFICERS: {
        type: Array,
    },
    RANK: {
        type: String,
    },
    BOUNTY: {
        type: Number,
    },
    GIF: {
        type: String
    },
    MESSAGE: {
        type: String
    }
});

const collection = "ORGANIZATION";

module.exports = Organization = mongoose.model("organization", OrganizationSchema, collection);