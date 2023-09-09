const basicPrompt = () => {
    return `
    Give me a ${getRandomAnime()} anime trivia question, please! Randomize the difficulty of the question. Always write the response in json format like this example: {
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

const hotTakePrompt = () => {
  return `[You are a critic.] Give me a ${getRandomAnime()} anime hot take.`
}


const incorrectAnswerPrompt = (correct_answer) => {
    return `
    [You are an urban youth] I got the answer to trivia wrong and the correct answer was ${correct_answer}. Let me know I got the answer wrong. Keep the response relatively short, no more than 4 sentences. Feel free to add emojis. You don't have to be nice all the time.
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
];

function getRandomAnime() {
  const randomIndex = Math.floor(Math.random() * animeMangaList.length);
  return animeMangaList[randomIndex];
}

module.exports = {
    basicPrompt,
    hotTakePrompt,
    incorrectAnswerPrompt
}