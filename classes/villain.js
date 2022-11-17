const { ranks, bountyActions } = require("../utilities")
const moment = require("moment")

class Villain {
    constructor(ID, CUSTOM_TITLE, RANK, BOUNTY, DEBATES, CRIMINAL_OFFENSES) {
        this.ID = ID
        this.CUSTOM_TITLE = CUSTOM_TITLE
        this.RANK = RANK
        this.BOUNTY = BOUNTY
        this.DEBATES = DEBATES
        this.CRIMINAL_OFFENSES = CRIMINAL_OFFENSES
    }

    increaseBounty(v){
        this.BOUNTY = this.BOUNTY + Number(v)
        if(this.BOUNTY < 0) {
            this.BOUNTY = 0
        }
        return
    }

    increaseCriminalOffense(b, p){
        for(let action of bountyActions) {
            if(action.value === b){
                this.CRIMINAL_OFFENSES.push({"OFFENSE": action.label, "BOUNTY": p, "DATE": moment().format('L')})
            }
        }
        return
    }

    customIncreaseCriminalOffense(b, p){
        this.CRIMINAL_OFFENSES.push({"OFFENSE": b, "BOUNTY": p, "DATE": moment().format('L')})
        return
    }

    setRank() {
        for(let r of ranks){
            if(this.BOUNTY >= r.BOUNTY) {
                this.RANK = r.RANK
            }
        }
        return
    }

}

module.exports = {
    villainClass: Villain
}