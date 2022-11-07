let board = (() => {
  let cells = [0,1,2,3,4,5,6,7,8]

  const resetBoard = () => {
    cells = [0,1,2,3,4,5,6,7,8]
    const cellsUi = document.querySelectorAll('.cell')
    cellsUi.forEach((cell) => {
      cell.innerHTML = ''
    })
  }

  const addToBoard = function(index, playerSymbol) {
    cells[index] = playerSymbol
  }

  const cellIsFree = (index) => {
    return cells[index] !== 'x' && cells[index] !== 'o'
  }

  const checkWinner = function() {
    const winingStates = [[0,1,2], [3,4,5], [6,7,8],
                        [0,3,6], [1,4,7], [2,5,8],
                        [0,4,8],[2,4,6]]

    for(let stateArray of winingStates) {
      let countX = 0
      let countO = 0
      for(let index of stateArray) {
        if(cells[index] === 'x')
          countX++
        
        if(cells[index] === 'o')
          countO++
      }

      if(countX === 3)
        return 'x'

      if(countO === 3)
        return 'o'
    }

    return false
  }

  return {
    cellIsFree,
    addToBoard,
    checkWinner,
    resetBoard
  }
})()

const playRound = (function() {
  let turn = 'x'

  const resualt = document.querySelector('#resualt')

  const playAgainButton = document.querySelector('#playAgain')
  playAgainButton.addEventListener('click', function() {
    turn = 'x'
    board.resetBoard()
    resualt.innerHTML = ''
  })
     
  toggleTurn = () => {
    if(turn === 'x')
      turn = 'o'
    else
      turn = 'x'
  }

  function play() {
    const cells = document.querySelectorAll('.cell')
    cells.forEach((cell, index) => {
      cell.addEventListener('click', function() {
        if(board.cellIsFree(index) && !board.checkWinner()) {
          this.innerText = turn
          board.addToBoard(index, turn)
          showResualt(board.checkWinner())
          toggleTurn()
        }
      })
    })
  }

  function showResualt(winner) {
    if(winner) {
      resualt.innerHTML = `${winner} is winner`
      playAgainButton.classList.remove('hide')
    }
  }

  return { play }
})()

playRound.play()