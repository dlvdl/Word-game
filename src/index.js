import getData from './utility/getQuizWords'
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

  if (buttonId !== correctAnswerId) {
    level = level > 1 ? (level -= 1) : 1
    removeLife()
    renderQuiz()
    return
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
  const brokenHeard = document.createElement('i')
  brokenHeard.className = 'fa-solid fa-heart-crack red_heart'
  liveContainer.appendChild(brokenHeard)
}