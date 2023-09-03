const quizPrompt = (difficulty, amount, category) => {
    return `
    Give me a ${difficulty} quiz question about the manga/anime ${category}. Make sure the question is based on fact that happened in the source material. Please, give 4 possible answers with 1 being the answer for each quiz question. Always write the response in json format like this example: {
        question: 'Who was the first Hokage of Konohagakure?',
        answers: {
          a: 'Hashirama Senju',
          b: 'Minato Namikaze',
          c: 'Tobirama Senju',
          d: 'Hiruzen Sarutobi'
        },
        correct_answer: 'a'
      }
    `
}

module.exports = {
    quizPrompt
}