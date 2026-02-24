import { useState, useRef, useEffect } from "react"
import Die from "./Die"
import Confetti from "react-confetti"

export default function App() {
  const [dice, setDice] = useState(() => generateAllNewDice())
  const [rollCount, setRollCount] = useState(0)
  const buttonRef = useRef(null)

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