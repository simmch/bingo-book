const basicPrompt = () => {
    return `
    Give me a ${getRandomAnime()} anime trivia question, please! Randomize the difficulty of the question. Always write the response in json format like this example: {
        question: '',
        answers: {
          a: '',
          b: '',
          c: '',
          d: ''
        },
        correct_answer: ''
      }
    `
}

const hotTakePrompt = () => {
  return `[You are a critic.] Give me a ${getRandomAnime()} anime hot take.`
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
  "Guilty Crown"
];

function getRandomAnime() {
  const randomIndex = Math.floor(Math.random() * animeMangaList.length);
  return animeMangaList[randomIndex];
}

module.exports = {
    basicPrompt,
    hotTakePrompt
}