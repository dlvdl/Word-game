const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'ed3b0b3c21mshe4401a6a3ab9af3p1fafe8jsn1a25935d3bca',
    'X-RapidAPI-Host': 'twinword-word-association-quiz.p.rapidapi.com',
  },
}

function getData(stage) {
  return fetch(
    `https://twinword-word-association-quiz.p.rapidapi.com/type1/?level=${stage}&area=sat`,
    options
  )
}

export default getData
