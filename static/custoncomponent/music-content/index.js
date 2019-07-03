/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

Component({
  properties: {
    API: Object,
    parentFunc: Object
  },
  data: {
    slideOffset: 0
  },
  ready () {
    this.getSystemInfo()
  },
  methods: {
    async getSystemInfo () {
      try {
        const data = await this.properties.API.getWXApiInfo('getSystemInfo')
        // const half = data.windowWidth / 2
        const quarter = data.windowWidth / 2 / 2
        const slideOffset = quarter - 15.5
        console.log(slideOffset)
        this.setData({
          slideOffset: slideOffset
        })
      } catch (err) {
        console.log(err)
      }
    }
  }
})
