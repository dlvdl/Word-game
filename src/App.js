import getData from './utility/fetchQuiz'
import './styles/main.css'

const optionWords = document.querySelector('#option')
const quizWords = document.querySelector('#quiz')
const levelCount = document.querySelector('#level_count')
const stageCount = document.querySelector('#stage_count')
const resetButton = document.querySelector('#reset_button')
const startButton = document.querySelector('#start_button')
const progressContainer = document.querySelector('#progress_container')
const liveContainer = document.querySelector('#live_container')

const arrayOfOptionWords = Array.from(optionWords.children)
const arrayOfQuizWords = Array.from(quizWords.children)

let stage = 1
let level = 1
let quizlist = {}
let quontityOfLife = 3

startButton.addEventListener('click', startGame)
resetButton.addEventListener('click', resetGame)
optionWords.addEventListener('click', handleClick)

function resetGame() {
  toggleClass(
    [
      startButton,
      resetButton,
      optionWords,
      quizWords,
      progressContainer,
      liveContainer,
    ],
    'disabled'
  )

  stage = 1
  level = 1
  quizlist = {}
  quontityOfLife = 3

  restoreLife()
}

async function startGame() {
  toggleClass(
    [
      startButton,
      resetButton,
      optionWords,
      quizWords,
      progressContainer,
      liveContainer,
    ],
    'disabled'
  )

  await getData(stage)
    .then((res) => res.json())
    .then((res) => getQuiz(res))

  renderQuiz()
}

async function updateGame(stage) {
  await getData(stage)
    .then((res) => res.json())
    .then((res) => getQuiz(res))
}

const getQuiz = async (data) => {
  quizlist = await data.quizlist
}

async function handleClick(e) {
  const currentQuiz = quizlist[level - 1]
  const correctAnswerId = currentQuiz.correct
  const buttonId = +e.target.dataset.id

  if (!buttonId) {
    return
  }

  if (buttonId !== correctAnswerId) {
    setTimeout(() => {
      toggleClass([e.target], 'wrong_answer')
    }, 250)

    toggleClass([e.target], 'wrong_answer')

    removeLife()
    if (quontityOfLife < 1) {
      resetGame()
    }
    renderQuiz()
  }

  level += 1

  if (level > 10) {
    level = 1
    stage += 1
    await updateGame(stage)
  }

  renderQuiz()
}

function renderQuiz() {
  const currentQuiz = quizlist[level - 1]

  levelCount.innerText = level
  stageCount.innerText = stage

  arrayOfOptionWords.forEach((word, i) => {
    word.innerText = currentQuiz.option[i]
    word.dataset.id = i + 1
  })

  arrayOfQuizWords.forEach((word, i) => (word.innerText = currentQuiz.quiz[i]))
}

function toggleClass(elements, className) {
  elements.forEach((element) => {
    if (element.classList.contains(className)) {
      element.classList.remove(className)
    } else {
      element.classList.add(className)
    }
  })
}

function removeLife() {
  const wholeHeart = liveContainer.firstElementChild
  const brokenHeart = document.createElement('i')
  brokenHeart.className = 'fa-solid fa-heart-crack red_heart'

  liveContainer.removeChild(wholeHeart)
  liveContainer.appendChild(brokenHeart)

  quontityOfLife -= 1
}

function restoreLife() {
  for (let i = 0; i < quontityOfLife; i++) {
    const wholeHeart = document.createElement('i')
    const brokenHeart = liveContainer.firstElementChild

    wholeHeart.className = 'fa-solid fa-heart red_heart'
    liveContainer.removeChild(brokenHeart)
    liveContainer.appendChild(wholeHeart)
  }
}
