export default {
  name: 'cell',
  // Vue expects to inject 'this' for instatiation, arrow functions would break that
  data: function () { // eslint-disable-line object-shorthand
    return {

    };
  },
  props: {
    number: {
      type: Number,
      requried: true
    },
    marks: {
      type: Object,
      required: true
    },
    highlitMarks: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      required: true
    },
    secondarySelected: {
      type: Boolean,
      required: true
    },
    x: {
      type: Number,
      required: false
    },
    y: {
      type: Number,
      required: false
    },
    id: {
      type: String,
      required: true
    },
    highlit: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    clicked: function () { // eslint-disable-line object-shorthand
      this.$emit('selected', this);
    }
  },
  components: {

  }
};
