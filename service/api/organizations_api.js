const Organization = require("../models/organizations")

const read = async (params) => {
    try {
        const response = await Organization.findOne(params);
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
        const response = await Organization.find();
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
        const organization = new Organization(new_record);
        const response = await organization.save();
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
        const response = await Organization.updateOne(record, updated_field)
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

const remove = async (record) => {
    try {
        const response = await Organization.deleteOne(record)
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
    remove
}