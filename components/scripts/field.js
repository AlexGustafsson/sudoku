/* global document */

import Cell from '../cell.vue';
import Keyboard from '../keyboard.vue';

const DIFFICULTY = process.env.NODE_ENV === 'development' ? 0.015 : 0.5;

const Sudoku = require('../../lib/sudoku');

let sudoku = new Sudoku();
sudoku.generate(DIFFICULTY);

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

      const {
        number,
        correct
      } = sudoku.getCell(x, y);

      const cell = {
        number,
        x: cx,
        y: cy,
        selected: false,
        secondarySelected: false,
        highlit: false,
        marks: {},
        highlitMarks: {},
        hasHighlitMark: false,
        crossed: false,
        locked: correct,
        id: `${sx}${sy}${cx}${cy}`,
        correct,
        legal: true
      };

      for (let i = 1; i <= 9; i++)
        cell.highlitMarks[i] = false;

      for (let i = 1; i <= 9; i++)
        cell.marks[i] = false;

      cell.highlitMark = false;

      subgrids[subgrid][cx + (3 * cy)] = cell;
    }

    return {
      subgrids,
      selectedCell: null,
      highlitCells: [],
      lineColumn: 1,
      lineRow: 1,
      completed: false
    };
  },
  methods: {
    reset: function (difficulty = DIFFICULTY) { // eslint-disable-line object-shorthand
      sudoku.generate(difficulty);
      for (const subgrid of this.subgrids) {
        for (const cell of subgrid) {
          const x = (Number(cell.id[0]) * 3) + Number(cell.id[2]);
          const y = (Number(cell.id[1]) * 3) + Number(cell.id[3]);
          const sx = Math.floor(x / 3);
          const sy = Math.floor(y / 3);
          const cx = x % 3;
          const cy = y % 3;
          const {
            number,
            correct
          } = sudoku.getCell(cx + (sx * 3), cy + (sy * 3));

          for (let i = 1; i <= 9; i++)
            cell.highlitMarks[i] = false;

          for (let i = 1; i <= 9; i++)
            cell.marks[i] = false;

          cell.number = number;
          cell.correct = correct;
          cell.locked = correct;
          cell.legal = true;
          cell.selected = false;
          cell.secondarySelected = false;
          cell.crossed = false;
          cell.hasHighlitMark = false;
        }
      }

      this.completed = false;
      this.selectedCell = null;
    },
    cellSelected: function (cell) { // eslint-disable-line object-shorthand
      // Lock if completed
      if (this.completed)
        return;
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
      if (cell.number === null || cell.number !== selectedNumber) {
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
    clearSelection: function () { // eslint-disable-line object-shorthand
      this.selectedCell.selected = false;
      this.clearHighlitCells(this.selectedCell.number);
      this.selectedCell = null;
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
      for (let i = 0; i < 9; i++) {
        const cell = this.cellFromCoordinates(i, y);
        cell.crossed = true;
        this.highlitCells.push(cell);
      }

      // Vertical
      for (let i = 0; i < 9; i++) {
        const cell = this.cellFromCoordinates(x, i);
        cell.crossed = true;
        this.highlitCells.push(cell);
      }
    },
    setNumber: function (number) { // eslint-disable-line object-shorthand
      if (!this.selectedCell)
        return;

      const id = this.selectedCell.id;
      const x = (Number(id[0]) * 3) + Number(id[2]);
      const y = (Number(id[1]) * 3) + Number(id[3]);

      this.selectedCell.number = number;
      const result = sudoku.setNumber(x, y, number);
      this.selectedCell.correct = result.correct;
      this.selectedCell.legal = result.legal;

      this.updateSelectionHighlight();

      if (sudoku.isComplete()) {
        this.completed = true;
        this.clearSelection();
        this.$emit('completed', this);
      }
    },
    toggleHint: function (number) { // eslint-disable-line object-shorthand
      this.selectedCell.marks[number] = !this.selectedCell.marks[number];
    },
    clearNumber: function () { // eslint-disable-line object-shorthand
      this.selectedCell.number = null;
      this.selectedCell.correct = false;
      this.selectedCell.legal = true;

      this.updateSelectionHighlight();
    },
    moveSelection: function (arrowKey) { // eslint-disable-line object-shorthand
      // Lock if completed
      if (this.completed)
        return;

      const id = this.selectedCell.id;
      let x = (Number(id[0]) * 3) + Number(id[2]);
      let y = (Number(id[1]) * 3) + Number(id[3]);

      if (arrowKey === 'ArrowLeft')
        x = x - 1 < 0 ? (x - 1 + 9) % 9 : (x - 1) % 9;
      else if (arrowKey === 'ArrowRight')
        x = (x + 1) % 9;
      else if (arrowKey === 'ArrowUp')
        y = y - 1 < 0 ? (y - 1 + 9) % 9 : (y - 1) % 9;
      else if (arrowKey === 'ArrowDown')
        y = (y + 1) % 9;

      if (x !== this.selectedCell.x || y !== this.selectedCell.y) {
        this.selectedCell.selected = false;
        this.selectedCell.secondarySelected = false;
        this.selectedCell = this.cellFromCoordinates(x, y);
        this.selectedCell.selected = true;

        this.updateSelectionHighlight();
      }
    },
    updateSelectionHighlight: function () { // eslint-disable-line object-shorthand
      this.clearHighlitCells(this.selectedCell.number);

      this.highlightLine(this.selectedCell);
      this.highlightSimilarCells(this.selectedCell);
      this.highlightCrossedCells(this.selectedCell);
    },
    keyPressed: function (event) { // eslint-disable-line object-shorthand
      // Lock if completed
      if (this.completed)
        return;

      if (!this.selectedCell)
        return;

      const key = event.key;
      const numbers = '123456789';

      if (!this.selectedCell.locked && numbers.includes(key)) {
        const number = Number(key);
        if (this.selectedCell.secondarySelected)
          this.toggleHint(number);
        else if (number === this.selectedCell.number)
          this.clearNumber();
        else
          this.setNumber(number);
      } else if (!this.selectedCell.locked && key === ' ') {
        this.selectedCell.secondarySelected = !this.selectedCell.secondarySelected;
      } else if (!this.selectedCell.locked && !this.selectedCell.secondarySelected && (key === 'Backspace' || key === 'Delete')) {
        this.clearNumber();
      } else if (key.substring(0, 5) === 'Arrow') {
        this.moveSelection(key);
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
