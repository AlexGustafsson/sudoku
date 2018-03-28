import Field from '../field.vue';

export default {
  name: 'app',
  // Vue expects to inject 'this' for instatiation, arrow functions would break that
  data: function () { // eslint-disable-line object-shorthand
    return {};
  },
  methods: {

  },
  components: {
    Field
  }
};
