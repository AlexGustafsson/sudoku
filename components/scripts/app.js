/* global alert */

import Field from '../field.vue';

export default {
  name: 'app',
  // Vue expects to inject 'this' for instatiation, arrow functions would break that
  data: function () { // eslint-disable-line object-shorthand
    return {
      menuVisible: true,
      completed: false
    };
  },
  methods: {
    fieldCompleted: function (field) { // eslint-disable-line object-shorthand
      this.completed = true;
      this.menuVisible = true;
    },
    play: function () { // eslint-disable-line object-shorthand
      this.menuVisible = !this.menuVisible;
      if (this.completed)
        this.$children[0].reset();
      this.completed = false;
    }
  },
  components: {
    Field
  }
};
