const { read, readAll, create, update  } = require("../service/api/organizations_api")
const moment = require("moment")


const today = moment().format('L')

class Organization{
    constructor(ID, NAME, MEMBERS, OFFICERS, OWNER, BOUNTY, RANK, GIF) {
        this.ID = ID
        this.NAME = NAME
        this.MEMBERS = MEMBERS
        this.OFFICERS = OFFICERS
        this.OWNER = OWNER
        this.BOUNTY = BOUNTY
        this.RANK = RANK
        this.GIF = GIF
    }

   
}

module.exports = {
    organizationClass: Organization
}