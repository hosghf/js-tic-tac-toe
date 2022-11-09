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
      if(stateArray.every((element) => { return cells[element] === 'x' }))
        return 'x'

      if(stateArray.every((element) => { return cells[element] === 'o' }))
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
  let player = 'x'
  let humanComputer = false

  const resualt = document.querySelector('#resualt')
  const playerName = document.querySelector('#player-turn')

  const playAgainButton = document.querySelector('#playAgain')
  playAgainButton.addEventListener('click', function() {
    player = 'x'
    board.resetBoard()
    resualt.innerHTML = ''
    playerName.innerHTML = `${player.toLocaleUpperCase()} it's your turn`
  })
     
  const togglePlayer = () => {
    if(player === 'x')
      player = 'o'
    else
      player = 'x'

    playerName.innerHTML = `${player.toLocaleUpperCase()} it's your turn`
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
    const backToStart = document.querySelector('#back-to-start')

    xButtonHuman.addEventListener('click', function(){
      this.classList.add('selected')
      oButtonHuman.classList.remove('selected')
      player = 'x'
    })

    oButtonHuman.addEventListener('click', function() {
      this.classList.add('selected')
      xButtonHuman.classList.remove('selected')
      player = 'o'
    })

    xButtonComputer.addEventListener('click', function() {
      this.classList.add('selected')
      oButtonComputer.classList.remove('selected')
      player = 'x'
    })

    oButtonComputer.addEventListener('click', function(){
      this.classList.add('selected')
      xButtonComputer.classList.remove('selected')
      player = 'o'
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
      playerName.innerHTML = `${player.toLocaleUpperCase()} it's your turn`
      play()
    })
  }

  function checkWinner() {
    if(board.checkWinner()) {
      resualt.innerHTML = `${player} is winner`
      playAgainButton.classList.remove('hide')
      playerName.innerHTML = ''
      return true
    }

    if(board.playedCellsCount() === 9) {
      resualt.innerHTML = 'tie'
      playAgainButton.classList.remove('hide')
      playerName.innerHTML = ''
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
            this.innerText = player
            board.addToBoard(index, player)

            if(checkWinner()) return
            togglePlayer()
          }
        })
      })
    } else {
      cells.forEach((cell, index) => {
        cell.addEventListener('click', function() {
          if(board.cellIsFree(index) && !board.checkWinner()) {
            this.innerText = player
            board.addToBoard(index, player)
          } else return

          if(checkWinner()) return
          
          togglePlayer()
    
          let computerChose = board.freeCells()[Math.floor(Math.random() * board.freeCells().length)]
          if(board.cellIsFree(computerChose)) {
            cells[computerChose].innerText = player
            board.addToBoard(computerChose, player)
          }

          if(checkWinner()) return
          togglePlayer()
        })
      })
    }
  }

  return { initilizeRound }
})()

playRound.initilizeRound()