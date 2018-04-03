/* global document KeyboardEvent */

export default {
  name: 'keyboard',
  // Vue expects to inject 'this' for instatiation, arrow functions would break that
  data: function () { // eslint-disable-line object-shorthand
    return {};
  },
  methods: {
    clicked: function (number) { // eslint-disable-line object-shorthand
      document.dispatchEvent(new KeyboardEvent('keydown', {key: number}));
    }
  },
  components: {
  }
};
