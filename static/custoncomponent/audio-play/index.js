/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

Component({
  properties: {
    API: Object,
    parentFunc: Object,
    mvId: Number
  },
  data: {
    mvDetail: {}
  },
  ready () {},
  methods: {
    async getMVDetail (params) {
      try {
        const {code, data} = await this.properties.API.getMVDetail(params)
        console.log(data)
        if (code === 200 && Object.keys(mvDetail).length) {
          this.setData({
            mvDetail: data
          })
        }
      } catch (err) {

      }
    }
  }
})
