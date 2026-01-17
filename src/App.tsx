import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const generateQuestion = () => {
    const n1 = Math.floor(Math.random() * 20) + 1
    const n2 = Math.floor(Math.random() * 20) + 1
    setNum1(n1)
    setNum2(n2)
    setAnswer('')
    setMessage('')
    setIsCorrect(null)
  }

  useEffect(() => {
    generateQuestion()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const userAnswer = parseInt(answer)
    const correctAnswer = num1 + num2
    setTotal(total + 1)

    if (userAnswer === correctAnswer) {
      setScore(score + 1)
      setMessage('正解！🎉')
      setIsCorrect(true)
    } else {
      setMessage(`不正解。正解は ${correctAnswer} でした。`)
      setIsCorrect(false)
    }

    setTimeout(() => {
      generateQuestion()
    }, 2000)
  }

  const handleReset = () => {
    setScore(0)
    setTotal(0)
    setMessage('')
    setIsCorrect(null)
    generateQuestion()
  }

  return (
    <div className="app">
      <div className="container">
        <h1>足し算ゲーム</h1>
        
        <div className="score-board">
          <div className="score-item">
            <span className="score-label">正解数:</span>
            <span className="score-value">{score}</span>
          </div>
          <div className="score-item">
            <span className="score-label">問題数:</span>
            <span className="score-value">{total}</span>
          </div>
          {total > 0 && (
            <div className="score-item">
              <span className="score-label">正答率:</span>
              <span className="score-value">
                {Math.round((score / total) * 100)}%
              </span>
            </div>
          )}
        </div>

        <div className="question-card">
          <div className="question">
            <span className="number">{num1}</span>
            <span className="operator">+</span>
            <span className="number">{num2}</span>
            <span className="operator">=</span>
          </div>

          <form onSubmit={handleSubmit} className="answer-form">
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="答えを入力"
              className="answer-input"
              autoFocus
            />
            <button type="submit" className="submit-button">
              回答
            </button>
          </form>

          {message && (
            <div className={`message ${isCorrect ? 'correct' : 'incorrect'}`}>
              {message}
            </div>
          )}
        </div>

        <button onClick={handleReset} className="reset-button">
          リセット
        </button>
      </div>
    </div>
  )
}

export default App
