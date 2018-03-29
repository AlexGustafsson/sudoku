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
      highlitCells: []
    };
  },
  methods: {
    cellSelected: function (cell) { // eslint-disable-line object-shorthand
      // Deselect the current cell, select the new cell
      let selectedNumber = null;
      if (this.selectedCell) {
        this.selectedCell.selected = false;
        selectedNumber = this.selectedCell.number;
      }
      this.selectedCell = this.cellFromId(cell.id);
      this.selectedCell.selected = true;

      // Remove highlit numbers, highlight new similar cells
      if (cell.number !== selectedNumber) {
        for (const highlitCell of this.highlitCells) {
          highlitCell.highlit = false;
          if (selectedNumber)
            highlitCell.highlitMarks[selectedNumber] = false;
        }

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
  components: {
    Cell
  }
};
