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

    //Null es que no hay ganador, false es que hay un empate
    const [winner, setWinner] = useState(null)

    const updateBoard = (index) => {

        //Si tiene algo no actualiza posicion
        if (board[index] || winner) return

        //Actualizar el tablero
        const newBoard = [...board]
        newBoard[index] = turn
        setBoard(newBoard)

        //Cambiar el turno
        const newTurn = turn === Turns.X ? Turns.O : Turns.X
        setTurn(newTurn)

        //Guardar partida en local storage
        window.localStorage.setItem('board', JSON.stringify(newBoard))
        window.localStorage.setItem('turn', newTurn)

        //Revisar si hay un ganador
        const newWinner = checkWinner(newBoard)
        if (newWinner) {
            confetti()
            setWinner(newWinner)
        } else if (checkEndGame(newBoard)) {
            setWinner(false) //Empate
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
                    {Turns.X}
                </Square>
                <Square isSelected={turn === Turns.O}>
                    {Turns.O}
                </Square>
            </section>
            <button onClick={resetGame}>Reset</button>
            <WinnerModal resetGame={resetGame} winner={winner} />
        </main>
    )
}

export default App
