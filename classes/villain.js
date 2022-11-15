const { ranks } = require("../utilities")

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
        return
    }

    increaseCriminalOffense(){
        this.CRIMINAL_OFFENSES = this.CRIMINAL_OFFENSES + 1
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