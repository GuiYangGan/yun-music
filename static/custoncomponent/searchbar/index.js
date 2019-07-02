/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

Component({
  properties: {
    API: Object,
    parentFunc: Object,
    searching: Boolean
  },
  data: {
    inputShowed: true,
    inputVal: '',
    hotsongs: {},
    history: {}
  },
  ready () {
    this.getHotsongs()
  },
  methods: {
    showInput: function () {
      this.setData({
        inputShowed: true
      })
      // this.properties.parentFunc.setSearch(true)
      this.getHotsongs()
    },
    hideInput: function () {
      this.setData({
        inputVal: '',
        inputShowed: false
      })
      this.properties.parentFunc.setSearch(false)
    },
    clearInput: function () {
      this.setData({
        inputVal: ''
      })
    },
    inputTyping: function (e) {
      this.setData({
        inputVal: e.detail.value
      })
    },
    async getHotsongs (params = {}) {
      try {
        const { code, result } = await this.properties.API.gethotsongs(params)
        if (code === 200) {
          console.log(result.hots)
          this.setData({
            hotsongs: result.hots
          })
        }
      } catch (err) {
        wx.showModal({
          title: '出错啦！',
          content: err
        })
      }
    },
    handleSearch: function (e) {
      const value = e.detail.value
      console.log(value)
    }
  }
})
