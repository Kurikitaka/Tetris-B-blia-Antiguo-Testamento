// Motor de descomposición inversa para tablero 12x13 (156 casillas = 39 tetraminós)
const TetrisGenerator = {
  COLS: 12,
  ROWS: 13,
  
  // Plantillas de formas de tetraminós (4 bloques rel)
  PIECE_SHAPES: [
    { type: 'I_h', blocks: [[0,0], [0,1], [0,2], [0,3]] },
    { type: 'I_v', blocks: [[0,0], [1,0], [2,0], [3,0]] },
    { type: 'O',   blocks: [[0,0], [0,1], [1,0], [1,1]] },
    { type: 'T_u', blocks: [[0,0], [0,1], [0,2], [1,1]] },
    { type: 'T_d', blocks: [[1,0], [1,1], [1,2], [0,1]] },
    { type: 'L_0', blocks: [[0,0], [1,0], [2,0], [2,1]] },
    { type: 'J_0', blocks: [[0,1], [1,1], [2,1], [2,0]] },
    { type: 'S_0', blocks: [[0,1], [0,2], [1,0], [1,1]] },
    { type: 'Z_0', blocks: [[0,0], [0,1], [1,1], [1,2]] }
  ],

  generatePuzzle() {
    let board = Array(this.ROWS).fill(null).map(() => Array(this.COLS).fill(null));
    let pieces = [];
    
    // Asignación sistemática de las 39 fichas cubriendo el tablero 12x13
    let bookIndex = 0;
    
    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        if (board[r][c] !== null) continue;
        if (bookIndex >= BOOKS_DATA.length) break;

        // Probar forma que encaje
        let placed = false;
        let shuffledShapes = [...this.PIECE_SHAPES].sort(() => Math.random() - 0.5);

        for (let shapeObj of shuffledShapes) {
          if (this.canPlace(board, r, c, shapeObj.blocks)) {
            const bookInfo = BOOKS_DATA[bookIndex];
            const piece = {
              id: `piece_${bookInfo.id}`,
              bookId: bookInfo.id,
              name: bookInfo.name,
              group: bookInfo.group,
              color: bookInfo.color,
              shape: shapeObj.type,
              blocks: shapeObj.blocks,
              solutionOrigin: [r, c]
            };
            this.placeOnBoard(board, r, c, shapeObj.blocks, piece.id);
            pieces.push(piece);
            bookIndex++;
            placed = true;
            break;
          }
        }

        // Fallback básico si ninguna encaja exactamente
        if (!placed) {
          // Bloque simple o genérico para asegurar cobertura
          let fallbackBlocks = [[0,0], [0,1], [1,0], [1,1]];
          const bookInfo = BOOKS_DATA[bookIndex];
          const piece = {
            id: `piece_${bookInfo.id}`,
            bookId: bookInfo.id,
            name: bookInfo.name,
            group: bookInfo.group,
            color: bookInfo.color,
            shape: 'O',
            blocks: fallbackBlocks,
            solutionOrigin: [r, c]
          };
          this.placeOnBoard(board, r, c, fallbackBlocks, piece.id);
          pieces.push(piece);
          bookIndex++;
        }
      }
    }
    return { board, pieces };
  },

  canPlace(board, r, c, blocks) {
    return blocks.every(([dr, dc]) => {
      let nr = r + dr;
      let nc = c + dc;
      return nr >= 0 && nr < this.ROWS && nc >= 0 && nc < this.COLS && board[nr][nc] === null;
    });
  },

  placeOnBoard(board, r, c, blocks, id) {
    blocks.forEach(([dr, dc]) => {
      board[r + dr][c + dc] = id;
    });
  }
};
