const rankLists = [
    {
    "RANK": "D",
    "BOUNTY": 1000
    },
    {
    "RANK": "D+",
    "BOUNTY": 2000
    },
    {
    "RANK": "D++",
    "BOUNTY": 3000
    },
    {
    "RANK": "D+++",
    "BOUNTY": 4000
    },


    {
    "RANK": "C",
    "BOUNTY": 5000
    },
    {
    "RANK": "C+",
    "BOUNTY": 10000
    },
    {
    "RANK": "C++",
    "BOUNTY": 20000
    },
    {
    "RANK": "C+++",
    "BOUNTY": 50000
    },

    {
    "RANK": "B",
    "BOUNTY": 70000
    },
    {
    "RANK": "B+",
    "BOUNTY": 95000
    },
    {
    "RANK": "B++",
    "BOUNTY": 120000
    },
    {
    "RANK": "B+++",
    "BOUNTY": 180000
    },


    {
    "RANK": "A",
    "BOUNTY": 300000
    },
    {
    "RANK": "A+",
    "BOUNTY": 400000
    },
    {
    "RANK": "A++",
    "BOUNTY": 600000
    },
    {
    "RANK": "A+++",
    "BOUNTY": 800000
    },

    {
    "RANK": "S",
    "BOUNTY": 1000000
    },
    {
    "RANK": "S+",
    "BOUNTY": 2500000
    },
    {
    "RANK": "S++",
    "BOUNTY": 5000000
    },
    {
    "RANK": "S+++",
    "BOUNTY": 10000000
    },
    
]

const bountyActions = {
    "General Villainy": 1000,
    "Flagrant Statement": 5000,
    "Flagrant Question": 8000,
    "Generic Debate Win": 100000,
    "Villain Arc Started": 500000
}

const loseBounty = {
    "Disrespect": 5000,
    "Muted": 10000,
    "Debate Loss": 50000
}

/**
 * Make command for debate wins specifically
 * Command will be named debate
 * Command will have user options for winner and loser
 * Command will increase bounty by amount based on losers bounty as follow...
 * 1. If Loser bounty is higher, Winner bounty will increase by 60% of opponent bounty
 * 2. If Loser bounty is lower or equal, Winner bounty will increase by 100k
 * 3. Loser bounty will decrease by 40%
 */

module.exports = {
    ranks: rankLists,
    bountyActions: bountyActions,
    bountyLosses: loseBounty
}