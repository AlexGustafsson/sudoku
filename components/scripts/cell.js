export default {
  name: 'cell',
  // Vue expects to inject 'this' for instatiation, arrow functions would break that
  data: function () { // eslint-disable-line object-shorthand
    const enabled = {};
    for (let i = 1; i <= 9; i++)
      enabled[i] = true;

    const number = Math.random() > 0.3 ? 1 : null;

    return {
      enabled,
      number
    };
  },
  methods: {

  },
  components: {

  }
};
