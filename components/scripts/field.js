/* global document */

import Cell from '../cell.vue';
import Keyboard from '../keyboard.vue';

const Sudoku = require('../../lib/sudoku');

const sudoku = new Sudoku();
sudoku.generate();

export default {
  name: 'field',
  // Vue expects to inject 'this' for instatiation, arrow functions would break that
  data: function () { // eslint-disable-line object-shorthand
    const subgrids = new Array(9).fill(null).map(() => {
      return new Array(9).fill(null);
    });

    for (let index = 0; index < 81; index++) {
      const y = Math.floor(index / 9);
      const x = index - (9 * y);

      const sx = Math.floor(x / 3);
      const sy = Math.floor(y / 3);
      const subgrid = sx + (sy * 3);
      const cx = x % 3;
      const cy = y % 3;

      const cell = {
        number: null,
        x: cx,
        y: cy,
        selected: false,
        secondarySelected: false,
        highlit: false,
        marks: {},
        highlitMarks: {},
        hasHighlitMark: false,
        crossed: false,
        locked: false,
        id: `${sx}${sy}${cx}${cy}`,
        correct: false,
        legal: true
      };

      for (let i = 1; i <= 9; i++)
        cell.highlitMarks[i] = false;
      for (let i = 1; i <= 9; i++)
        cell.marks[i] = false;
      if (Math.random() > 0.1) {
        cell.number = sudoku.getCorrectNumber(x, y);
        cell.locked = true;
        cell.correct = true;
        cell.legal = true;
      }

      cell.highlitMark = false;

      subgrids[subgrid][cx + (3 * cy)] = cell;
    }

    return {
      subgrids,
      selectedCell: null,
      highlitCells: [],
      lineColumn: 1,
      lineRow: 1
    };
  },
  methods: {
    cellSelected: function (cell) { // eslint-disable-line object-shorthand
      // Toggle secondary selection if pressing the selected cell
      if (this.selectedCell && cell.id === this.selectedCell.id) {
        if (!this.selectedCell.locked)
          this.selectedCell.secondarySelected = !this.selectedCell.secondarySelected;

        return;
      }

      // Deselect the current cell, select the new cell
      let selectedNumber = null;
      if (this.selectedCell) {
        this.selectedCell.selected = false;
        this.selectedCell.secondarySelected = false;
        selectedNumber = this.selectedCell.number;
      }
      this.selectedCell = this.cellFromId(cell.id);
      this.selectedCell.selected = true;
      this.highlightLine(cell);

      // Remove highlit numbers, highlight new similar cells
      if (cell.number !== selectedNumber) {
        this.clearHighlitCells(selectedNumber);

        this.highlightSimilarCells(cell);
        this.highlightCrossedCells(cell);
      }
    },
    clearHighlitCells: function (selectedNumber) { // eslint-disable-line object-shorthand
      for (const highlitCell of this.highlitCells) {
        highlitCell.highlit = false;
        highlitCell.hasHighlitMark = false;
        highlitCell.crossed = false;
        if (selectedNumber)
          highlitCell.highlitMarks[selectedNumber] = false;
      }
    },
    highlightSimilarCells: function (cell) { // eslint-disable-line object-shorthand
      if (cell.number === null)
        return;

      for (const similarCell of this.cellsFromNumber(cell.number)) {
        if (similarCell.id !== cell.id) {
          similarCell.highlit = true;
          this.highlitCells.push(similarCell);
        }
      }

      for (const similarCell of this.cellsFromMarks(cell.number)) {
        if (similarCell.id !== cell.id) {
          similarCell.highlitMarks[cell.number] = true;
          similarCell.hasHighlitMark = true;
          this.highlitCells.push(similarCell);
        }
      }
    },
    highlightCrossedCells: function (cell) { // eslint-disable-line object-shorthand
      const id = cell.id;
      const x = (Number(id[0]) * 3) + Number(id[2]);
      const y = (Number(id[1]) * 3) + Number(id[3]);

      // Horizontal
      for (let i = 0; i < 9; i++)
        this.cellFromCoordinates(i, y).crossed = true;
      // Vertical
      for (let i = 0; i < 9; i++)
        this.cellFromCoordinates(x, i).crossed = true;
    },
    keyPressed: function (event) { // eslint-disable-line object-shorthand
      if (!this.selectedCell)
        return;

      const key = event.key;
      const numbers = '123456789';

      if (!this.selectedCell.locked && numbers.includes(key)) {
        const number = Number(key);
        if (this.selectedCell.secondarySelected) {
          this.selectedCell.marks[number] = !this.selectedCell.marks[number];
        } else {
          if (number === this.selectedCell.number) {
            this.clearHighlitCells(this.selectedCell.number);
            this.selectedCell.number = null;
            this.selectedCell.legal = true;
            this.selectedCell.correct = false;
          } else {
            const id = this.selectedCell.id;
            let x = (Number(id[0]) * 3) + Number(id[2]);
            let y = (Number(id[1]) * 3) + Number(id[3]);
            this.clearHighlitCells(this.selectedCell.number);
            this.selectedCell.number = number;
            const result = sudoku.setNumber(x, y, number);
            this.selectedCell.correct = result.correct;
            this.selectedCell.legal = result.legal;
            this.highlightSimilarCells(this.selectedCell);
            this.highlightCrossedCells(this.selectedCell);
          }
        }
      } else if (!this.selectedCell.locked && key === ' ') {
        this.selectedCell.secondarySelected = !this.selectedCell.secondarySelected;
      } else if (!this.selectedCell.locked && !this.selectedCell.secondarySelected && (key === 'Backspace' || key === 'Delete')) {
        this.clearHighlitCells(this.selectedCell.number);
        this.selectedCell.number = null;
        this.highlightSimilarCells(this.selectedCell);
        this.highlightCrossedCells(this.selectedCell);
      } else if (key.substring(0, 5) === 'Arrow') {
        const id = this.selectedCell.id;
        let x = (Number(id[0]) * 3) + Number(id[2]);
        let y = (Number(id[1]) * 3) + Number(id[3]);

        if (key === 'ArrowLeft')
          x = x - 1 < 0 ? (x - 1 + 9) % 9 : (x - 1) % 9;
        else if (key === 'ArrowRight')
          x = (x + 1) % 9;
        else if (key === 'ArrowUp')
          y = y - 1 < 0 ? (y - 1 + 9) % 9 : (y - 1) % 9;
        else if (key === 'ArrowDown')
          y = (y + 1) % 9;

        if (x !== this.selectedCell.x || y !== this.selectedCell.y) {
          this.clearHighlitCells(this.selectedCell.number);
          this.selectedCell.selected = false;
          this.selectedCell.secondarySelected = false;
          this.selectedCell = this.cellFromCoordinates(x, y);
          this.selectedCell.selected = true;
          this.highlightLine(this.selectedCell);
          this.highlightSimilarCells(this.selectedCell);
          this.highlightCrossedCells(this.selectedCell);
        }
      }
    },
    clear: function () { // eslint-disable-line object-shorthand
      for (const subgrid of this.subgrids) {
        for (const cell of subgrid) {
          cell.number = null;
          cell.selected = false;
          cell.marked.fill(false);
        }
      }
    },
    cellFromId: function (id) { // eslint-disable-line object-shorthand
      const subgridIndex = Number(id[0]) + (3 * Number(id[1]));
      const cellIndex = Number(id[2]) + (3 * Number(id[3]));
      return this.subgrids[subgridIndex][cellIndex];
    },
    cellFromCoordinates: function (x, y) { // eslint-disable-line object-shorthand
      const sx = Math.floor(x / 3);
      const sy = Math.floor(y / 3);
      const subgrid = sx + (sy * 3);
      const cx = x % 3;
      const cy = y % 3;

      return this.subgrids[subgrid][cx + (cy * 3)];
    },
    cellsFromNumber: function (number) { // eslint-disable-line object-shorthand
      const cells = [];
      for (const subgrid of this.subgrids) {
        for (const cell of subgrid) {
          if (cell.number === number)
            cells.push(cell);
        }
      }
      return cells;
    },
    highlightLine: function (cell) { // eslint-disable-line object-shorthand
      this.lineColumn = `grid-row: ${Number(cell.id[3]) + (3 * Number(cell.id[1])) + 1}`;
      this.lineRow = `grid-column: ${Number(cell.id[2]) + (3 * Number(cell.id[0])) + 1}`;
    },
    cellsFromMarks: function (number) { // eslint-disable-line object-shorthand
      const cells = [];
      for (const subgrid of this.subgrids) {
        for (const cell of subgrid) {
          if (cell.marks[number])
            cells.push(cell);
        }
      }
      return cells;
    }
  },
  mounted: function () { // eslint-disable-line object-shorthand
    document.addEventListener('keydown', this.keyPressed, false);
  },
  destroyed: function () { // eslint-disable-line object-shorthand
    document.removeEventListener('keydown', this.keyPressed);
  },
  components: {
    Cell,
    Keyboard
  }
};
