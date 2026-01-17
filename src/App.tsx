import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // 効果音を再生する関数
  const playSound = (isCorrect: boolean) => {
    try {
      // AudioContextを初期化（ブラウザがまだ許可していない場合）
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      const audioContext = audioContextRef.current

      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }

      // 正解時：明るい上昇音
      if (isCorrect) {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4
        oscillator.frequency.setValueAtTime(554, audioContext.currentTime + 0.1) // C#5
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2) // E5
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      } else {
        // 不正解時：低い下降音
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(220, audioContext.currentTime) // A3
        oscillator.frequency.setValueAtTime(165, audioContext.currentTime + 0.2) // E3
        oscillator.type = 'sawtooth'

        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      }
    } catch (error) {
      // 効果音の再生に失敗してもアプリは続行
      console.log('効果音の再生に失敗しました:', error)
    }
  }

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
      playSound(true) // 正解の効果音
    } else {
      setMessage(`不正解。正解は ${correctAnswer} でした。`)
      setIsCorrect(false)
      playSound(false) // 不正解の効果音
    }

    setTimeout(() => {
      generateQuestion()
    }, 1000) // 1秒
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
