const { read, readAll, create, update  } = require("../service/api/organizations_api")
const moment = require("moment")


const today = moment().format('L')

class Organization {
    constructor(ID, NAME, MEMBERS, OFFICERS, OWNER, BOUNTY, RANK, GIF, MESSAGE) {
        this.ID = ID
        this.NAME = NAME
        this.MEMBERS = MEMBERS
        this.OFFICERS = OFFICERS
        this.OWNER = OWNER
        this.BOUNTY = BOUNTY
        this.RANK = RANK
        this.GIF = GIF
        this.MESSAGE = MESSAGE
    }

    demote(id) {
        if(id === this.ID) return
        if(this.OFFICERS.includes(id)){
            const o = this.OFFICERS.indexOf(id)
            delete this.OFFICERS.splice(o, 1)
        } else {
            return
        }
    }

    promote(id) {
        if(id === this.ID) return
        if(!this.OFFICERS.includes(id)){
            this.OFFICERS.push(id)
        } else {
            return
        }        
    }

    addToTeam(criminal){
        this.MEMBERS.push(criminal.ID)
        this.BOUNTY = this.BOUNTY + criminal.BOUNTY
        return 
    }

    removeFromTeam(criminal){
        const m = this.MEMBERS.indexOf(criminal.ID)
        const o = this.OFFICERS.indexOf(criminal.ID)

        this.BOUNTY = this.BOUNTY - criminal.BOUNTY

        delete this.MEMBERS.splice(m, 1)
        delete this.OFFICERS.splice(m, 1)
        
        return
    }

    sumTeamBounty(bounty){
        this.BOUNTY = this.BOUNTY + bounty
        return
    }

   
}

module.exports = {
    organizationClass: Organization
}