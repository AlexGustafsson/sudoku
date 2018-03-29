/* global document */

import Cell from '../cell.vue';

export default {
  name: 'field',
  // Vue expects to inject 'this' for instatiation, arrow functions would break that
  data: function () { // eslint-disable-line object-shorthand
    const subgrids = [];
    for (let sy = 0; sy < 3; sy++) {
      for (let sx = 0; sx < 3; sx++) {
        const subgrid = {
          cells: [],
          x: sx,
          y: sy
        };

        for (let cy = 0; cy < 3; cy++) {
          for (let cx = 0; cx < 3; cx++) {
            const cell = {
              number: null,
              x: cx,
              y: cy,
              selected: false,
              highlit: false,
              marks: {},
              highlitMarks: {},
              id: `${sx}${sy}${cx}${cy}`
            };

            cell.number = Math.random() > 0.3 ? Math.floor(Math.random() * Math.floor(9)) + 1 : null;
            for (let i = 1; i <= 9; i++)
              cell.highlitMarks[i] = false;
            for (let i = 1; i <= 9; i++)
              cell.marks[i] = Math.random() > 0.6;

            subgrid.cells.push(cell);
          }
        }

        subgrids.push(subgrid);
      }
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
      // Toggle selection if pressing the selected cell
      if (this.selectedCell && cell.id === this.selectedCell.id) {
        this.selectedCell.selected = false;

        for (const highlitCell of this.highlitCells) {
          highlitCell.highlit = false;
          if (cell.number)
            highlitCell.highlitMarks[cell.number] = false;
        }

        this.selectedCell = null;
        return;
      }

      // Deselect the current cell, select the new cell
      let selectedNumber = null;
      if (this.selectedCell) {
        this.selectedCell.selected = false;
        selectedNumber = this.selectedCell.number;
      }
      this.selectedCell = this.cellFromId(cell.id);
      this.selectedCell.selected = true;
      this.highlightLine(cell);

      // Remove highlit numbers, highlight new similar cells
      if (cell.number !== selectedNumber) {
        this.clearHighlitCells(selectedNumber);

        this.highlightSimilarCells(cell);
      }
    },
    clearHighlitCells: function (selectedNumber) { // eslint-disable-line object-shorthand
      for (const highlitCell of this.highlitCells) {
        highlitCell.highlit = false;
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
          this.highlitCells.push(similarCell);
        }
      }
    },
    keyPressed: function (event) { // eslint-disable-line object-shorthand
      if (!this.selectedCell)
        return;

      const key = event.key;
      const numbers = '123456789';

      if (numbers.includes(key)) {
        const number = Number(key);
        if (number !== this.selectedCell.number) {
          this.clearHighlitCells(this.selectedCell.number);
          this.selectedCell.number = number;
          this.highlightSimilarCells(this.selectedCell);
        }
      } else if (key === 'Backspace' || key === 'Delete') {
        this.clearHighlitCells(this.selectedCell.number);
        this.selectedCell.number = null;
        this.highlightSimilarCells(this.selectedCell);
      } else if (key.substring(0, 5) === 'Arrow') {
        const id = this.selectedCell.id;
        let x = (Number(id[0]) * 3) + Number(id[2]);
        let y = (Number(id[1]) * 3) + Number(id[3]);

        if (key === 'ArrowLeft')
          x = Math.max(x - 1, 0);
        else if (key === 'ArrowRight')
          x = Math.min(x + 1, 8);
        else if (key === 'ArrowUp')
          y = Math.max(y - 1, 0);
        else if (key === 'ArrowDown')
          y = Math.min(y + 1, 8);

        if (x !== this.selectedCell.x || y !== this.selectedCell.y) {
          this.clearHighlitCells(this.selectedCell.number);
          this.selectedCell.selected = false;
          this.selectedCell = this.cellFromCoordinates(x, y);
          this.selectedCell.selected = true;
          this.highlightLine(this.selectedCell);
          this.highlightSimilarCells(this.selectedCell);
        }
      }
    },
    clear: function () { // eslint-disable-line object-shorthand
      for (const subgrid of this.subgrids) {
        for (const cell of subgrid.cells) {
          cell.number = null;
          cell.selected = false;
          cell.marked.fill(false);
        }
      }
    },
    cellFromId: function (id) { // eslint-disable-line object-shorthand
      const subgridIndex = Number(id[0]) + (3 * Number(id[1]));
      const cellIndex = Number(id[2]) + (3 * Number(id[3]));
      return this.subgrids[subgridIndex].cells[cellIndex];
    },
    cellFromCoordinates: function (x, y) { // eslint-disable-line object-shorthand
      const sx = Math.floor(x / 3);
      const sy = Math.floor(y / 3);
      const subgrid = sx + (sy * 3);
      const cx = x % 3;
      const cy = y % 3;

      return this.subgrids[subgrid].cells[cx + (cy * 3)];
    },
    cellsFromNumber: function (number) { // eslint-disable-line object-shorthand
      const cells = [];
      for (const subgrid of this.subgrids) {
        for (const cell of subgrid.cells) {
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
        for (const cell of subgrid.cells) {
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
    Cell
  }
};
