const basicPrompt = () => {
    return `
    Give me a ${getRandomAnime()} anime trivia question, please! Do not ask me who the main character is. Always mention the name of the anime in the beginning so we know. Always write the response in json format like this example: {
        "question": '',
        "answers": {
          "a": '',
          "b": '',
          "c": '',
          "d": ''
        },
        "correct_answer": ''
      }
      Replace all double quotes with single quotes in the response
    `
}

const funFactPrompt = () => {
  const anime = getRandomAnime();
  console.log(anime)
  const prompt = `[You are a mangaka] Tell me an interesting fun fact about the anime ${anime}`
  console.log(anime)
  return {
    prompt,
    anime
  }
}


const incorrectAnswerPrompt = (correct_answer) => {
    return `
    [You are an urban youth.] I got the answer to trivia wrong and the correct answer was ${correct_answer}. Let me know I got the answer wrong. Keep the response no more than 1 paragraph. Feel free to add emojis. Keep it real with me.
    `
}

const timeoutPrompt = () => {
    return `
    [You are an urban youth.] I didn't answer the trivia question in time. Let me know I didn't answer the question in time. Keep the response no more than 1 paragraph. Feel free to add emojis. You are speaking to me.
    `
}


const correctAnswerPrompt = () => {
  return `
  [You are an urban youth.] I got the answer to trivia correct. Let me know I got the answer correct. Keep the response no more than 3 sentences. Feel free to add emojis.
  `
}

const versusPrompt = (anime1, anime2) => {
  return `
  Following the format below, where in each category only one anime, or manga, can win, next to each category put the name of the anime that is better - ${anime1} 🆚 ${anime2}, then give a very brief summary at the end.

  Plot/Story - 
  Animation/Design/Art Style -
  Characters - 
  Audio/Soundtrack - 
  Voice Acting - 
  World-Building - 
  Themes and Symbols - 
  Emotional Impact - 
  Re-watch Value - 
  Cultural Impact/Popularity -
`
}

const reviewPrompt = () => {
  return `
  Please share your detailed and well-organized review of the anime adaptation of '${getRandomAnime()}', keep the review no longer than 8 sentences. If you have more familiarity with the manga or manhwa version, kindly review that specific version instead. Additionally, rate the anime adaptation using star emojis on a scale of 1 to 10. Please adhere strictly to the following format while providing your response:

  **"Naruto"** is an anime series that captures the journey of Naruto Uzumaki, a young ninja with dreams of becoming the strongest ninja and leader of his village, the Hokage. The story beautifully intertwines themes of friendship, perseverance, and self-discovery. As Naruto faces various adversaries, he learns the importance of bonds, understanding, and never giving up. The series is praised for its rich character development, intense battles, and emotional depth.

  The anime adaptation does justice to the original manga, bringing to life the vibrant world of ninjas, jutsus, and the tailed beasts. The soundtrack is memorable, and the animation, especially during pivotal battles, is commendable.
  
  However, one critique is the inclusion of filler episodes, which some fans found to detract from the main storyline. These episodes, while offering additional content, might not resonate with everyone.
  
  Rating: ⭐⭐⭐⭐⭐⭐⭐⭐⭐ (9/10)
  
  (Note: This review is based on the anime adaptation of "Naruto." The rating is subjective, and different viewers might have diverse opinions about the series.)
  `
}


const animeMangaList = [
  "Naruto",
  "Bleach",
  "One Piece",
  "Dragon Ball",
  "Attack on Titan",
  "Fullmetal Alchemist",
  "Death Note",
  "Tokyo Ghoul",
  "My Hero Academia",
  "Cowboy Bebop",
  "Demon Slayer: Kimetsu no Yaiba",
  "Sword Art Online",
  "Hunter x Hunter",
  "Fairy Tail",
  "One Punch Man",
  "JoJo's Bizarre Adventure",
  "Berserk",
  "Gintama",
  "Yu Yu Hakusho",
  "Black Clover",
  "Neon Genesis Evangelion",
  "Code Geass",
  "Durarara!!",
  "Steins;Gate",
  "Clannad",
  "Bakuman",
  "Slam Dunk",
  "Kuroko no Basket",
  "Vinland Saga",
  "InuYasha",
  "Rurouni Kenshin",
  "Psycho-Pass",
  "Parasyte",
  "Your Lie in April",
  "Erased",
  "Haikyuu!!",
  "Food Wars! Shokugeki no Soma",
  "No Game No Life",
  "Re:Zero",
  "Made in Abyss",
  "Mob Psycho 100",
  "Dr. Stone",
  "Jujutsu Kaisen",
  "The Promised Neverland",
  "Toradora!",
  "Anohana",
  "Fruits Basket",
  "Nana",
  "Monster",
  "Vagabond",
  "Black Butler",
  "Gundam",
  "Sailor Moon",
  "Detective Conan",
  "Doraemon",
  "Akame ga Kill!",
  "Magi: The Labyrinth of Magic",
  "Elfen Lied",
  "Hellsing",
  "Blue Exorcist",
  "Kill la Kill",
  "Highschool of the Dead",
  "Spice and Wolf",
  "Chihayafuru",
  "Golden Kamuy",
  "Bunny Girl Senpai",
  "Your Name",
  "A Silent Voice",
  "Grave of the Fireflies",
  "5 Centimeters Per Second",
  "Mushishi",
  "Natsume's Book of Friends",
  "Angel Beats!",
  "Overlord",
  "Konosuba",
  "Log Horizon",
  "Soul Eater",
  "D.Gray-man",
  "Black Lagoon",
  "Trigun",
  "Outlaw Star",
  "Samurai Champloo",
  "FLCL",
  "Serial Experiments Lain",
  "GTO: Great Teacher Onizuka",
  "K-On!",
  "Love, Chunibyo & Other Delusions",
  "Nichijou",
  "Daily Lives of High School Boys",
  "Shirobako",
  "March Comes in Like a Lion",
  "Oregairu",
  "Hyouka",
  "Plastic Memories",
  "Beastars",
  "Mirai Nikki",
  "Terror in Resonance",
  "Guilty Crown",
  "Baccano!",
  "Claymore",
  "Deadman Wonderland",
  "Escaflowne",
  "Fist of the North Star",
  "Gankutsuou: The Count of Monte Cristo",
  "Higurashi When They Cry",
  "Initial D",
  "Jormungand",
  "Kaiji",
  "Lucky Star",
  "Mawaru Penguindrum",
  "Nagi no Asukara",
  "Owari no Seraph",
  "Panty & Stocking with Garterbelt",
  "Queen's Blade",
  "Ranma ½",
  "School Rumble",
  "Tiger & Bunny",
  "Uchuu Kyoudai (Space Brothers)",
  "Vampire Hunter D",
  "Welcome to the N.H.K.",
  "X",
  "Yakitate!! Japan",
  "Zankyou no Terror",
  "Ajin: Demi-Human",
  "Btooom!",
  "Charlotte",
  "Dennou Coil",
  "Eureka Seven",
  "Fantastic Children",
  "Ghost Hunt",
  "Hyouge Mono",
  "Ixion Saga DT",
  "Juuni Taisen",
  "Kekkai Sensen (Blood Blockade Battlefront)",
  "Last Exile",
  "Mnemosyne",
  "Nodame Cantabile",
  "Orange",
  "Paprika",
  "Quanzhi Gaoshou (The King's Avatar)",
  "R.O.D: Read or Die",
  "Skip Beat!",
  "Terra e...",
  "Uchouten Kazoku (The Eccentric Family)",
  "Vivy: Fluorite Eye's Song",
  "Witch Hunter Robin",
  "xxxHolic",
  "Yuri on Ice!!!",
  "Zetsuen no Tempest",
  "91 Days",
  "ACCA: 13-Territory Inspection Dept.",
  "Black Cat",
  "C: The Money of Soul and Possibility Control",
  "Darker than Black",
  "Ef: A Tale of Memories.",
  "Free!",
  "Gosick",
  "Hakata Tonkotsu Ramens",
  "Is It Wrong to Try to Pick Up Girls in a Dungeon?",
  "Jin-Roh: The Wolf Brigade",
  "Kino's Journey",
  "Little Witch Academia",
  "Magical Girl Lyrical Nanoha",
  "No.6",
  "Ouran High School Host Club",
  "Paranoia Agent",
  "RahXephon",
  "Sakurasou no Pet na Kanojo",
  "The Twelve Kingdoms",
  "Un-Go",
  "Valkyria Chronicles",
  "Watamote",
  "Rin: Daughters of Mnemosyne",
  "Xam'd: Lost Memories",
  "Yamada-kun and the Seven Witches",
  "Zone of the Enders: Dolores, I",
  "A Lull in the Sea",
  "Beck: Mongolian Chop Squad",
  "Cromartie High School",
  "D-Frag!",
  "Eden of the East",
  "Fractale",
  "Grimgar: Ashes and Illusions",
  "Himouto! Umaru-chan",
  "Inari, Konkon, Koi Iroha.",
  "Joker Game",
  "Kyoukai no Rinne",
  "Love, Election and Chocolate",
  "Mekakucity Actors",
  "Nyan Koi!",
  "Occultic;Nine",
  "Princess Jellyfish",
  "Rokka: Braves of the Six Flowers",
  "Shigofumi",
  "Tari Tari",
  "Umi Monogatari",
  "Vandread",
  "Witch Craft Works",
  "Yozakura Quartet",
  "Zan Sayonara Zetsubou Sensei",
  "Tower of God",
  "God of High School",
  "Noblesse",
  "Bastard",
  "Sweet Home",
  "Unordinary",
  "I Love Yoo",
  "Let's Play",
  "Lore Olympus",
  "Lumine",
  "The Gamer",
  "Dice",
  "Lookism",
  "Hardcore Leveling Warrior",
  "Girls of the Wild's",
  "Akatsuki no Yona (Yona of the Dawn)",
  "Kingdom",
  "Horimiya",
  "Kaguya-sama: Love is War",
  "Chainsaw Man",
  "Solo Leveling",
  "The Breaker",
  "The Breaker: New Waves",
  "Sun-Ken Rock",
  "Red Storm",
  "Magician",
  "Lessa",
  "Kubera",
  "Wind Breaker",
  "Orange Marmalade",
  "Siren's Lament",
  "Age Matters",
  "My ID is Gangnam Beauty",
  "The Scholar's Reincarnation",
  "Gosu",
  "My Dear Cold-Blooded King",
  "I Am the Sorcerer King",
  "The Beginning After the End",
  "A Returner's Magic Should Be Special",
  "Omniscient Reader's Viewpoint",
  "The Duchess' 50 Tea Recipes",
  "Who Made Me a Princess",
  "The Remarried Empress",
  "I Became the Hero's Mother",
  "The Villainess Reverses the Hourglass",
  "Doctor Elise: The Royal Lady with the Lamp",
  "The Reason Why Raeliana Ended up at the Duke's Mansion",
  "Survive as the Hero's Wife",
  "The Lady and the Beast",
  "The Villainess Lives Twice",
  "Death Is The Only Ending For The Villainess",
  "I Tamed a Tyrant and Ran Away",
  "The Tyrant's Guardian is an Evil Witch",
  "The Monster Duchess and Contract Princess",
  "I'm Stanning the Prince",
  "The Archmage's Daughter",
  "The Precious Sister of the Villainous Grand Duke",
  "The Evil Lady Will Change",
  "The 8th Son? Are You Kidding Me?",
  "Seirei Gensouki: Spirit Chronicles",
  "High School Prodigies Have It Easy Even In Another World",
  "The Reincarnation of the Strongest Exorcist in Another World",
  "Handyman Saitou in Another World",
  "Show By Rock",
  "Campfire Cooking With My Absurd Skill",
  "Tenchi Muyo: War On Geminar",
  "Dog Days",
  "Drifters",
  "The Reason Why Raeliana Ended Up At The Duke's Mansion",
  "Kuma Kuma Kuma Bear",
  "Total Fantasy Knockout",
  "Combatants Will Be Dispatched!",
  "Mushoku Tensei",
  "Jobless Reincarnation",
];

function getRandomAnime() {
  const randomIndex = Math.floor(Math.random() * animeMangaList.length);
  return animeMangaList[randomIndex];
}

module.exports = {
    basicPrompt,
    funFactPrompt,
    incorrectAnswerPrompt,
    timeoutPrompt,
    correctAnswerPrompt,
    animeMangaList,
    versusPrompt,
    reviewPrompt
}