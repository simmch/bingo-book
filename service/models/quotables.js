const mongoose = require("mongoose");

const QuotableSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: true,
    },
    QUOTE: {
        type: String,
    },
    OWNER: {
        type: String,
    },
});

const collection = "QUOTABLES";

module.exports = Quotable = mongoose.model("quotables", QuotableSchema, collection);