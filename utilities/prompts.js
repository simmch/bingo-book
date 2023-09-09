const basicPrompt = () => {
    return `
    There are thousands of anime in the world. Give me a random anime trivia question, please! Randomize the difficulty of the question. Always write the response in json format like this example: {
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
  return `[You are a critic.] Give me an anime hot take. Only respond with the hot take, not the question.`
}

module.exports = {
    basicPrompt,
    hotTakePrompt
}