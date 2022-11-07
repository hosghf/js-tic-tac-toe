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

  const playedCellsCount = function() {
    return cells.filter((cell) => cell === 'x' || cell == 'o' ).length
  }

  const cellIsFree = (index) => {
    return cells[index] !== 'x' && cells[index] !== 'o'
  }

  const freeCells = () => {
    return cells.filter((cell) => cell !== 'x' && cell !== 'o')
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
    resetBoard,
    playedCellsCount,
    freeCells
  }
})()

const playRound = (function() {
  let turn = 'x'
  let humanComputer = false

  const resualt = document.querySelector('#resualt')
  const turnText = document.querySelector('#turn')

  const playAgainButton = document.querySelector('#playAgain')
  playAgainButton.addEventListener('click', function() {
    turn = 'x'
    board.resetBoard()
    resualt.innerHTML = ''
    turnText.innerHTML = `${turn.toLocaleUpperCase()} it's your turn`
  })
     
  const toggleTurn = () => {
    if(turn === 'x')
      turn = 'o'
    else
      turn = 'x'

    turnText.innerHTML = `${turn.toLocaleUpperCase()} it's your turn`
  }

  function initilizeRound() {
    const xButtonHuman = document.querySelector('#xButton-human')
    const oButtonHuman = document.querySelector('#oButton-human')

    const xButtonComputer = document.querySelector('#xButton-computer')
    const oButtonComputer = document.querySelector('#oButton-computer')

    const startButton = document.querySelector('#startButton')

    const startContainer = document.querySelector('#start-place')
    const boardContainer = document.querySelector('#board-container')
    const computerHumanSection = document.querySelector('#computer-human-section')
    const humanHumanSection = document.querySelector('#human-human-section')

    xButtonHuman.addEventListener('click', function(){
      this.classList.add('selected')
      oButtonHuman.classList.remove('selected')
      turn = 'x'
    })

    oButtonHuman.addEventListener('click', function() {
      this.classList.add('selected')
      xButtonHuman.classList.remove('selected')
      turn = 'o'
    })

    xButtonComputer.addEventListener('click', function() {
      this.classList.add('selected')
      oButtonComputer.classList.remove('selected')
      turn = 'x'
    })

    oButtonComputer.addEventListener('click', function(){
      this.classList.add('selected')
      xButtonComputer.classList.remove('selected')
      turn = 'o'
    })

    computerHumanSection.addEventListener('click', function () {
      humanComputer = true
      this.classList.add('selected')
      humanHumanSection.classList.remove('selected')
      xButtonHuman.classList.remove('selected')
      oButtonHuman.classList.remove('selected')
    })

    humanHumanSection.addEventListener('click', function () {
      humanComputer = false
      this.classList.add('selected')
      computerHumanSection.classList.remove('selected')
      xButtonComputer.classList.remove('selected')
      oButtonComputer.classList.remove('selected')
    })

    startButton.addEventListener('click', function() {
      startContainer.classList.add('hide')
      boardContainer.classList.remove('hide')
      turnText.innerHTML = `${turn.toLocaleUpperCase()} it's your turn`
      play()
    })
  }

  function checkWinner() {
    if(board.checkWinner()) {
      resualt.innerHTML = `${turn} is winner`
      playAgainButton.classList.remove('hide')
      turnText.innerHTML = ''
      return true
    }

    if(board.playedCellsCount() === 9) {
      resualt.innerHTML = 'tie'
      playAgainButton.classList.remove('hide')
      turnText.innerHTML = ''
      return true
    }

    return false
  }

  function play() {
    const cells = document.querySelectorAll('.cell')

    if(!humanComputer) {
      cells.forEach((cell, index) => {
        cell.addEventListener('click', function() {
          if(board.cellIsFree(index) && !board.checkWinner()) {
            this.innerText = turn
            board.addToBoard(index, turn)

            if(checkWinner()) return
            toggleTurn()
          }
        })
      })
    } else {
      cells.forEach((cell, index) => {
        cell.addEventListener('click', function() {
          if(board.cellIsFree(index) && !board.checkWinner()) {
            this.innerText = turn
            board.addToBoard(index, turn)
          } else return

          if(checkWinner()) return
          toggleTurn()
    
          let computerChose = board.freeCells()[Math.floor(Math.random() * board.freeCells().length)]
          if(board.cellIsFree(computerChose) && !board.checkWinner()) {
            cells[computerChose].innerText = turn
            board.addToBoard(computerChose, turn)
          }

          if(checkWinner()) return
          toggleTurn()
        })
      })
    }
  }

  return { initilizeRound }
})()

playRound.initilizeRound()