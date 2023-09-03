const basicPrompt = (category) => {
    return `
    Give me a basic quiz question about the manga/anime ${category}. Make sure the question is based on fact that happened in the source material. Please, give 4 possible answers with 1 being the answer for each quiz question. Always write the response in json format like this example: {
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

const difficultPrompt = (category) => {
    return `
    Give me a difficult quiz question about the manga/anime ${category} based on fights in the show, plot twists in the show, character decisions in the show, and world building in the show. Make sure the question is based on fact that happened in the source material. Please, give 4 possible answers with 1 being the answer for each quiz question. Always write the response in json format like this example: {
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

const impossiblePrompt = (category) => {
    return `
    Give me a difficult quiz question about the manga/anime ${category} based on fights in the show, plot twists in the show, character decisions in the show, and world building in the show with an emphasis on story arcs, episode numbers, chapter numbers, character names, character traits, and trick questions. Make sure the question is based on fact that happened in the source material. Please, give 4 possible answers with 1 being the answer for each quiz question. Always write the response in json format like this example: {
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

module.exports = {
    basicPrompt,
    difficultPrompt,
    impossiblePrompt
}