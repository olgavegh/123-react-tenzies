import { useState, useRef, useEffect } from "react"
import Die from "./Die"
import Confetti from "react-confetti"

// utility
function getInitialTheme() {
  // User saved a preference
  const saved = localStorage.getItem('theme')
  if (saved) return saved

  // If no preferences saved, ask the OS
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (dark) return 'dark'

  // safe fallback
  return 'light'
}

export default function App() {
  const [dice, setDice] = useState(generateAllNewDice)  // lazy, call it once
  const [rollCount, setRollCount] = useState(0)
  const [theme, setTheme] = useState(getInitialTheme) // lazy, call it once
  const buttonRef = useRef(null)

  // Feature : Theme management
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme])
  function toggleTheme() {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  // Feature : Winning state
  const gameWon = dice.every(die => die.isHeld) &&
    dice.every(die => die.value === dice[0].value)
  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus()
    }
  }, [gameWon])

  function generateAllNewDice() {
    return new Array(10)
      .fill(0)
      .map(() => ({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: crypto.randomUUID()
      }))
  }

  function rollDice() {
    if (!gameWon) {
      setRollCount(prev => prev + 1)
      setDice(oldDice => oldDice.map(die =>
        die.isHeld ?
          die :
          { ...die, value: Math.ceil(Math.random() * 6) }
      ))
    } else {
      setRollCount(0)
      setDice(generateAllNewDice())
    }
  }

  function hold(id) {
    setDice(oldDice => oldDice.map(die =>
      die.id === id ?
        { ...die, isHeld: !die.isHeld } :
        die
    ))
  }

  const diceElements = dice.map(dieObj => (
    <Die
      key={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      hold={() => hold(dieObj.id)}
    />
  ))

  return (
    <main>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
        {theme === 'dark' ? '☀' : '☾'}
      </button>
      <div id="board" >
        {gameWon && <Confetti />}
        <div>
          <h1 className="title">Tenzies</h1>
          <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        </div>
        <div className="dice-container">
          {diceElements}
        </div>
        <div className="game-footer">
          <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
            {gameWon ? "New Game" : "Roll"}
          </button>
          <p className="roll-count">Rolls: {rollCount}</p>
        </div>
      </div>
    </main>
  )
}