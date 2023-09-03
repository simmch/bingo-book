const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: true,
    },
    QUESTION: {
        type: String,
    },
    ANSWERS: {
        type: Object,
    },
    CORRECT_ANSWER: {
        type: String,
    },
    CATEGORY: {
        type: String,
    },
});

const collection = "QUIZ_QUESTIONS";

module.exports = Quiz = mongoose.model("quiz_questions", QuizSchema, collection);