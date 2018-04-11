import Field from '../field.vue';
import Keyboard from '../keyboard.vue';

const difficultyLevels = [
  {level: 'trivial', difficulty: 0.1},
  {level: 'easy', difficulty: 0.35},
  {level: 'medium', difficulty: 0.45},
  {level: 'challening', difficulty: 0.55},
  {level: 'hard', difficulty: 0.65},
  {level: 'master', difficulty: 0.75},
  {level: 'impossible', difficulty: 0.9}
];

export default {
  name: 'app',
  // Vue expects to inject 'this' for instatiation, arrow functions would break that
  data: function () { // eslint-disable-line object-shorthand
    const {level, difficulty} = difficultyLevels[1];

    return {
      menuVisible: true,
      completed: false,
      endState: false,
      firstTime: true,
      difficulty,
      level,
      generatedDifficulty: difficulty
    };
  },
  methods: {
    fieldCompleted: function () { // eslint-disable-line object-shorthand
      this.completed = true;
      this.endState = true;
      this.menuVisible = true;
    },
    play: function () { // eslint-disable-line object-shorthand
      this.menuVisible = !this.menuVisible;
      if (this.completed)
        this.$children[0].reset(this.difficulty);
      this.completed = false;
      this.firstTime = false;
      this.endState = false;
    },
    openMenu: function () { // eslint-disable-line object-shorthand
      this.menuVisible = true;
    },
    restart: function () { // eslint-disable-line object-shorthand
      this.menuVisible = false;
      this.$children[0].reset(this.difficulty);
      this.completed = false;
      this.generatedDifficulty = this.difficulty;
      this.endState = false;
    },
    cycleDifficulty: function () { // eslint-disable-line object-shorthand
      const level = (difficultyLevels.findIndex(x => x.level === this.level) + 1) % difficultyLevels.length;
      this.difficulty = difficultyLevels[level].difficulty;
      this.level = difficultyLevels[level].level;
      if ((this.firstTime || this.endState) && this.difficulty !== this.generatedDifficulty) {
        this.generatedDifficulty = this.difficulty;
        this.$children[0].reset(this.difficulty);
        this.completed = false;
      }
    }
  },
  components: {
    Field,
    Keyboard
  }
};
