import Field from '../field.vue';
import Keyboard from '../keyboard.vue';

export default {
  name: 'app',
  // Vue expects to inject 'this' for instatiation, arrow functions would break that
  data: function () { // eslint-disable-line object-shorthand
    return {
      menuVisible: true,
      completed: false,
      firstTime: true
    };
  },
  methods: {
    fieldCompleted: function () { // eslint-disable-line object-shorthand
      this.completed = true;
      this.menuVisible = true;
    },
    play: function () { // eslint-disable-line object-shorthand
      this.menuVisible = !this.menuVisible;
      if (this.completed)
        this.$children[0].reset();
      this.completed = false;
      this.firstTime = false;
    },
    openMenu: function () { // eslint-disable-line object-shorthand
      this.menuVisible = true;
    },
    restart: function () { // eslint-disable-line object-shorthand
      this.menuVisible = false;
      this.$children[0].reset();
    }
  },
  components: {
    Field,
    Keyboard
  }
};
