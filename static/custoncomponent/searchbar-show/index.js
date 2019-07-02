/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

Component({
  properties: {
    parentFunc: Object,
    searching: Boolean
  },
  methods: {
    showInput: function () {
      this.properties.parentFunc.setSearch(true)
    }
  }
})
