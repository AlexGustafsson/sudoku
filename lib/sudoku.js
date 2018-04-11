class Sudoku {
  constructor() {
    this.grid = new Array(9).fill(null).map(() => {
      return new Array(9).fill(null).map(() => {
        return {number: null, correct: false, legal: true};
      });
    });

    this.correctGrid = new Array(9).fill(null).map(() => {
      return new Array(9).fill(null);
    });
  }

  getCell(x, y) {
    const sx = Math.floor(x / 3);
    const sy = Math.floor(y / 3);
    const subgrid = sx + (sy * 3);
    const cx = x % 3;
    const cy = y % 3;

    return this.grid[subgrid][cx + (3 * cy)];
  }

  getRandomHint() {
    const start = Math.floor(Math.random() * 81);
    let coordinates = null;
    for (let i = 0; i < 81; i++) {
      const index = (start + i) % 81;
      const y = Math.floor(index / 9);
      const x = index - (9 * y);
      coordinates = {x, y};
      const cell = this.getCell(x, y);
      if (!cell.number || !cell.correct)
        break;
    }

    return {...coordinates, number: this.getCorrectNumber(coordinates.x, coordinates.y)};
  }

  getCorrectNumber(x, y) {
    const sx = Math.floor(x / 3);
    const sy = Math.floor(y / 3);
    const subgrid = sx + (sy * 3);
    const cx = x % 3;
    const cy = y % 3;

    return this.correctGrid[subgrid][cx + (3 * cy)];
  }

  getNumber(x, y) {
    const cell = this.getCell(x, y);
    return cell.number;
  }

  setNumber(x, y, number) {
    const cell = this.getCell(x, y);
    const legal = this.isLegalMove(x, y, number);
    const correct = number === this.getCorrectNumber(x, y);

    cell.number = number;
    cell.legal = legal;
    cell.correct = correct;

    return {legal, correct};
  }

  getNeighbors(x, y) {
    const neighbors = [];
    const taken = [];

    // Same row, all columns
    for (let nx = 0; nx < 9; nx++) {
      const key = `${nx}${y}`;
      if (nx !== x && !taken.includes(key)) {
        neighbors.push({x: nx, y});
        taken.push(key);
      }
    }

    // Same column, all rows
    for (let ny = 0; ny < 9; ny++) {
      const key = `${x}${ny}`;
      if (ny !== y && !taken.includes(key)) {
        neighbors.push({x, y: ny});
        taken.push(key);
      }
    }

    // Same subgrid
    const sx = Math.floor(x / 3);
    const sy = Math.floor(y / 3);
    for (let nx = 0; nx < 3; nx++) {
      for (let ny = 0; ny < 3; ny++) {
        const key = `${nx}${ny}`;
        if (nx !== x && ny !== y && !taken.includes(key)) {
          neighbors.push({x: nx + (sx * 3), y: ny + (sy * 3)});
          taken.push(key);
        }
      }
    }

    return neighbors;
  }

  getPossibilities(x, y) {
    const neighbors = this.getNeighbors(x, y).map(cell => this.getNumber(cell.x, cell.y));
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => !neighbors.includes(x));
  }

  generate(difficulty = 0.5) {
    this.grid = new Array(9).fill(null).map(() => {
      return new Array(9).fill(null).map(() => {
        return {number: null, correct: false, legal: true, generationTries: []};
      });
    });

    this.correctGrid = new Array(9).fill(null).map(() => {
      return new Array(9).fill(null);
    });

    for (let index = 0; index < 81; index++) {
      const y = Math.floor(index / 9);
      const x = index - (9 * y);
      const cell = this.getCell(x, y);
      const possibilities = this.getPossibilities(x, y).filter(number => !cell.generationTries.includes(number));
      if (possibilities.length > 0) {
        const number = possibilities[Math.floor(Math.random() * possibilities.length)];
        cell.number = number;
        cell.generationTries.push(number);
      } else {
        cell.number = 0;
        for (let futureIndex = index; futureIndex < 81; futureIndex++) {
          const futureY = Math.floor(futureIndex / 9);
          const futureX = futureIndex - (9 * futureY);
          const futureCell = this.getCell(futureX, futureY);
          futureCell.generationTries = [];
        }

        index -= 2;
      }
    }

    this.correctGrid = this.grid.map(subgrid => subgrid.map(cell => cell.number));
    this.grid = new Array(9).fill(null).map(() => {
      return new Array(9).fill(null).map(() => {
        return {number: null, correct: false, legal: true};
      });
    });

    for (let index = 0; index < 81; index++) {
      const y = Math.floor(index / 9);
      const x = index - (9 * y);
      if (Math.random() > difficulty)
        this.setNumber(x, y, this.getCorrectNumber(x, y));
    }
  }

  isLegalMove(x, y, number) {
    const possibilities = this.getPossibilities(x, y);
    return possibilities.includes(number);
  }

  isComplete() {
    for (let index = 0; index < 81; index++) {
      const y = Math.floor(index / 9);
      const x = index - (9 * y);

      if (this.getNumber(x, y) !== this.getCorrectNumber(x, y))
        return false;
    }

    return true;
  }

  log() {
    let str = '';
    for (let index = 0; index < 81; index++) {
      const y = Math.floor(index / 9);
      const x = index - (9 * y);

      str += this.getCorrectNumber(x, y) + ' ';
      if ((x + 1) % 3 === 0)
        str += '  ';
      if ((x + 1) % 9 === 0)
        str += '\n';
      if ((y + 1) % 3 === 0 && (x + 1) % 9 === 0)
        str += '\n';
    }
    console.log(str);
  }
}

module.exports = Sudoku;
