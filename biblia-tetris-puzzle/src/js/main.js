// Lógica principal de interacción
let currentPuzzle = null;
let placedPiecesCount = 0;

document.addEventListener('DOMContentLoaded', () => {
  initGame();

  document.getElementById('btn-new-game').addEventListener('click', () => {
    SoundEffects.playClick();
    initGame();
  });

  document.getElementById('btn-pdf').addEventListener('click', () => {
    SoundEffects.playClick();
    if (currentPuzzle) {
      PDFExporter.generatePDF(currentPuzzle.pieces);
    }
  });
});

function initGame() {
  currentPuzzle = TetrisGenerator.generatePuzzle();
  placedPiecesCount = 0;
  renderBoard();
  renderBank();
  document.getElementById('victory-modal').classList.add('hidden');
}

function renderBoard() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  for (let r = 0; r < 13; r++) {
    for (let c = 0; c < 12; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('dragover', (e) => e.preventDefault());
      cell.addEventListener('drop', (e) => handleDrop(e, r, c));
      boardEl.appendChild(cell);
    }
  }
}

function renderBank() {
  const bankEl = document.getElementById('piece-bank');
  bankEl.innerHTML = '';
  
  // Desordenar fichas para el banco
  let shuffledPieces = [...currentPuzzle.pieces].sort(() => Math.random() - 0.5);

  shuffledPieces.forEach(p => {
    const pCard = document.createElement('div');
    pCard.classList.add('piece-card');
    pCard.style.backgroundColor = p.color;
    pCard.draggable = true;
    pCard.id = `card_${p.id}`;
    
    pCard.innerHTML = `<strong>#${p.bookId}</strong><br>${p.name}`;
    
    pCard.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify(p));
      SoundEffects.playClick();
    });

    bankEl.appendChild(pCard);
  });
}

function handleDrop(e, row, col) {
  e.preventDefault();
  const pieceData = JSON.parse(e.dataTransfer.getData('text/plain'));
  
  // Validar origen exacto o encaje
  if (pieceData.solutionOrigin[0] === row && pieceData.solutionOrigin[1] === col) {
    SoundEffects.playClick();
    const cardEl = document.getElementById(`card_${pieceData.id}`);
    if (cardEl) cardEl.remove();

    pieceData.blocks.forEach(([dr, dc]) => {
      const targetCell = document.querySelector(`.cell[data-row="${row + dr}"][data-col="${col + dc}"]`);
      if (targetCell) {
        targetCell.style.backgroundColor = pieceData.color;
        targetCell.classList.add('filled');
        targetCell.innerText = pieceData.name;
      }
    });

    placedPiecesCount++;
    if (placedPiecesCount === 39) {
      setTimeout(() => {
        SoundEffects.playWin();
        document.getElementById('victory-modal').classList.remove('hidden');
      }, 300);
    }
  } else {
    SoundEffects.playError();
  }
}
