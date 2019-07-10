/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

Component({
  properties: {
    API: Object,
    parentFunc: Object
  },
  data: {
    slideOffset: 0,
    half: 0,
    quarter: 0,
    hasBannerData: true,
    bannerList: []
  },
  ready () {
    this.getSystemInfo()
    this.getBanner()
  },
  methods: {
    goToPlayView (e) {
      const { targetId, targetType } = e.currentTarget.dataset.info
      if (targetType === '1') {
        wx.navigateTo({
          url: '/pages/play/view/main?' + `id=${targetId}`,
          fail (err) {
            console.log(err)
          }
        })
      }
    },
    jumpPage (e) {
      const router = e.currentTarget.dataset.router
      if (router && router !== '') {
        wx.navigateTo({
          url: router
        })
      }
    },
    bindchange (e) {
      const { quarter, half } = this.properties
      const current = e.detail.current
      if (current === 0) {
        this.setData({
          slideOffset: quarter - 14
        })
      }
      if (current === 1) {
        this.setData({
          slideOffset: (quarter - 14) + half
        })
      }
      if (current === null) {
        this.setData({
          slideOffset: quarter - 14
        })
      }
      // this.setData({ currentIndex: 0 })
    },
    async getSystemInfo () {
      try {
        const data = await this.properties.API.getWXApiInfo('getSystemInfo')
        const half = data.windowWidth / 2
        const quarter = data.windowWidth / 2 / 2
        const slideOffset = quarter - 14
        this.setData({
          slideOffset: slideOffset,
          half: half,
          quarter: quarter
        })
      } catch (err) {
        console.log(err)
      }
    },
    async getBanner () {
      try {
        const { code, banners } = await this.properties.API.getBanner({
          type: 0
        })
        if (code === 200 && banners.length > 0) {
          this.setData({
            bannerList: banners,
            hasBannerData: banners.length > 0
          })
        } else {
          this.setData({
            hasBannerData: false
          })
        }
      } catch (err) {
        console.log(err)
        this.setData({
          hasBannerData: false
        })
      }
    }
  }
})
