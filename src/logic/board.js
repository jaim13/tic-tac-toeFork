import { winnerCombos } from '../constants.js'
export const checkWinner = (boardToCheck) => {

    //Revisamos todas las combinaciones ganadoras para saber si X o O ganaron
    for (const combo of winnerCombos) {
        const [a, b, c] = combo
        if (
            boardToCheck[a] &&
            boardToCheck[a] === boardToCheck[b] &&
            boardToCheck[a] === boardToCheck[c]
        ) {
            return boardToCheck[a]
        }
    }
    return null
}

export const checkEndGame = (boardToCheck) => {
    return boardToCheck.every((square) => square !== null)
} 