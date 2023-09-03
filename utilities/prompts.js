const basicPrompt = (category) => {
    return `
    [You are a manga writer] Give me a basic trivia question about the manga ${category}. Give questions that happened in the manga. Please, give 4 possible answers with 1 being the answer for each trivia question. Always write the response in json format like this example: {
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
    [You are a manga writer] Give me a difficult trivia question about the manga ${category} based on fights in the show, plot twists in the show, character decisions in the show, and world building in the show. Give questions that happened in the manga. Please, give 4 possible answers with 1 being the answer for each trivia question. Always write the response in json format like this example: {
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
    [You are a manga writer] Give me a difficult trivia question about the manga ${category} based on fights in the show, plot twists in the show, character decisions in the show, and world building in the show with an emphasis on story arcs, episode numbers, chapter numbers, character names, character traits, and trick questions. Give questions that happened in the manga. Please, give 4 possible answers with 1 being the answer for each trivia question. Always write the response in json format like this example: {
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