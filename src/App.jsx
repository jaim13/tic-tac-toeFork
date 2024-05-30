import { useState } from 'react'
import confetti from 'canvas-confetti'
import './App.css'
import { Square } from './components/square.jsx'
import { Turns } from './constants.js'
import { checkWinner, checkEndGame } from './logic/board.js'
import { WinnerModal } from './components/winnerModal.jsx'

function App() {
    const [board, setBoard] = useState(() => {
        const boardFromStorage = window.localStorage.getItem('board')
        return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
    })

    const [turn, setTurn] = useState(() => {
        const turnFromStorage = window.localStorage.getItem('turn')
        return turnFromStorage ?? Turns.X
    })

    const [winner, setWinner] = useState(null)

    // Estados para los nombres de los jugadores
    const [playerX, setPlayerX] = useState('')
    const [playerO, setPlayerO] = useState('')

    const updateBoard = (index) => {
        if (board[index] || winner) return
    
        const newBoard = [...board]
        newBoard[index] = turn
        setBoard(newBoard)
    
        const newTurn = turn === Turns.X ? Turns.O : Turns.X
        setTurn(newTurn)
    
        window.localStorage.setItem('board', JSON.stringify(newBoard))
        window.localStorage.setItem('turn', newTurn)
    
        const newWinner = checkWinner(newBoard)
        if (newWinner) {
            confetti()
            setWinner(turn === Turns.X ? playerX : playerO)
        } else if (checkEndGame(newBoard)) {
            setWinner(false)
        }
    }
    
    const resetGame = () => {
        setBoard(Array(9).fill(null))
        setTurn(Turns.X)
        setWinner(null)

        window.localStorage.removeItem('board')
        window.localStorage.removeItem('turn')
    }

    return (
        <main className='board'>
            <h1>Tic Tac Toe!</h1>
            <div id='names'>
                <input
                    placeholder='Nombre del jugador X'
                    value={playerX}
                    onChange={(e) => setPlayerX(e.target.value)}
                />
                <input
                    placeholder='Nombre del jugador O'
                    value={playerO}
                    onChange={(e) => setPlayerO(e.target.value)}
                />
            </div>
            <section className='game'>
                {
                    board.map((square, index) => {
                        return (
                            <Square
                                key={index}
                                index={index}
                                updateBoard={updateBoard}
                            >
                                {square}
                            </Square>
                        )
                    })
                }
            </section>
            <section className='turn'>
                <Square isSelected={turn === Turns.X}>
                    {playerX || Turns.X}
                </Square>
                <Square isSelected={turn === Turns.O}>
                    {playerO || Turns.O}
                </Square>
            </section>
            <button onClick={resetGame}>Reset</button>
            <WinnerModal resetGame={resetGame} winner={winner} />
        </main>
    )    
}

export default App
