const Quiz = require("../models/quiz_questions")

const read = async (params) => {
    try {
        const response = await Quiz.findOne(params);
        if(response) return response
        if(!response) return false
    }
    catch (err) {
        if(err){
            console.error(err)
            return false
        }
    }
}

const readAll = async () => {
    try {
        const response = await Quiz.find();
        if(response) return response
        if(!response) return false
    }
    catch (err) {
        if(err){
            console.error(err)
            return false
        }
    }
}

const readAllByOwner = async (id) => {
    try {
        const response = await Quiz.find({"ID": id});
        if(response) return response
        if(!response) return false
    }
    catch (err) {
        if(err){
            console.error(err)
            return false
        }
    }
}

const create = async (new_record) => {
    try {
        const quiz = new Quiz(new_record);
        const response = await quiz.save();
        if(response) return true
        if(!response) return false
    }
    catch (err) {
        if(err){
            console.error(err)
            return false
        }
    }

}

const update = async (record, updated_field) => {
    try {
        const response = await Quiz.updateOne(record, updated_field)
        if(response) return true
        if(!response) return false
    }
    catch (err) {
        if(err){
            console.error(err)
            return false
        }
    }

}

module.exports = {
    read,
    readAll,
    create,
    update,
    readAllByOwner
}