let board = (() => {
  let cells = [0,1,2,3,4,5,6,7,8]

  const resetBoard = () => {
    cells = [0,1,2,3,4,5,6,7,8]
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

displayController = (() => {
  let player = 'x'
  let humanComputer = false
  const resualt = document.querySelector('#resualt')
  const playerTurn = document.querySelector('#player-turn')
  const cells = document.querySelectorAll('.cell')

  getHumanComputer = () => { return humanComputer }
  getPlayer = () => { return player }

  function resetGame() {
    const cells = document.querySelectorAll('.cell')
    cells.forEach((cell) => {
      cell.innerText = ''
    })

    board.resetBoard()
    resualt.innerHTML = ''
    playerTurn.innerHTML = `${player.toLocaleUpperCase()} it's your turn`
  }

  const playAgainButton = document.querySelector('#playAgain')
  playAgainButton.addEventListener('click', resetGame)

  function showResult(message) {
    resualt.innerHTML = message
    displayController.playAgainButton.classList.remove('hide')
    displayController.playerTurn.innerHTML = ''
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

    function togglePlayerNameButton(oponentButton, p) {
      this.classList.add('selected')
      oponentButton.classList.remove('selected')
      player = p
    }

    function computerHumanToggle(unSelected, computerStatus, buttons) {
      humanComputer = computerStatus
      this.classList.add('selected')
      unSelected.classList.remove('selected')
      buttons[0].classList.remove('selected')
      buttons[1].classList.remove('selected')
    }

    // the first parameter is the scope of 'x' for the bind function, the second is 
    // the oponent button
    xButtonHuman.addEventListener('click', togglePlayerNameButton.bind(xButtonHuman, oButtonHuman, 'x'))
    oButtonHuman.addEventListener('click', togglePlayerNameButton.bind(oButtonHuman, xButtonHuman, 'o'))
    xButtonComputer.addEventListener('click', togglePlayerNameButton.bind(xButtonComputer, oButtonComputer, 'x'))
    oButtonComputer.addEventListener('click', togglePlayerNameButton.bind(oButtonComputer, xButtonComputer, 'o') )

    computerHumanSection.addEventListener('click',computerHumanToggle.bind(computerHumanSection, humanHumanSection, true, [xButtonHuman, oButtonHuman]))
    humanHumanSection.addEventListener('click', computerHumanToggle.bind(humanHumanSection, computerHumanSection, false, [xButtonComputer, oButtonComputer]))

    startButton.addEventListener('click', function() {
      startContainer.classList.add('hide')
      boardContainer.classList.remove('hide')
      playerTurn.innerHTML = `${player.toLocaleUpperCase()} it's your turn`
      playRound.play()
    })
  }

  return { initilizeRound, showResult, playAgainButton, playerTurn, getPlayer, getHumanComputer, cells }
})()

const playRound = (function() {
  let player = 'x'
  let humanComputer = false
     
  const togglePlayer = () => {
    if(player === 'x')
      player = 'o'
    else
      player = 'x'

    displayController.playerTurn.innerHTML = `${player.toLocaleUpperCase()} it's your turn`
  }

  function play() {
    humanComputer = displayController.getHumanComputer()
    player = displayController.getPlayer()

    if(!humanComputer) {
      displayController.cells.forEach((cell, index) => {
        cell.addEventListener('click', function() {
          if(board.cellIsFree(index) && !board.checkWinner()) {
            this.innerText = player
            board.addToBoard(index, player)

            if(board.checkWinner()){
              displayController.showResult(`${player} is winner`)
              return
            }

            if(board.playedCellsCount() === 9) {
              displayController.showResult('tie')
              return
            }
            
            togglePlayer()
          }
        })
      })
    } else {
      let computerChose

      displayController.cells.forEach((cell, index) => {
        cell.addEventListener('click', function() {
          if(board.cellIsFree(index) && !board.checkWinner()) {
            this.innerText = player
            board.addToBoard(index, player)
          } else return

          if(board.checkWinner()){
            displayController.showResult(`${player} is winner`)
            return
          }

          if(board.playedCellsCount() === 9) {
            displayController.showResult('tie')
            return
          }

          togglePlayer()
    
          computerChose = board.freeCells()[Math.floor(Math.random() * board.freeCells().length)]
          if(board.cellIsFree(computerChose)) {
            displayController.cells[computerChose].innerText = player
            board.addToBoard(computerChose, player)
          }

          if(board.checkWinner()){
            displayController.showResult(`${player} is winner`)
            return
          }
          
          togglePlayer()
        })
      })
    }
  }

  return { play }
})()

displayController.initilizeRound()