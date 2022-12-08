const Villain = require("../models/villain")

const read = async (params) => {
    try {
        const response = await Villain.findOne(params);
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
        const response = await Villain.find();
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
        const villain = new Villain(new_record);
        const response = await villain.save();
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
        const response = await Villain.updateOne(record, updated_field)
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
    update
}