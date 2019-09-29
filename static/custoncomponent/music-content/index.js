/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
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
      const id = `id=${targetId}`
      switch (targetType) {
        case '1':
          wx.navigateTo({ url: '/pages/play/view/main?' + id })
          break
        case '1004':
          wx.navigateTo({ url: '/pages/mv/play/main?' + id })
          break
        case '1014':
          wx.navigateTo({ url: '/pages/mv/play/main?' + id })
          break
        default: break
      }
      // if (targetType === '1') {
      //   wx.navigateTo({
      //     url: '/pages/play/view/main?' + `id=${targetId}`,
      //     fail (err) {
      //       console.log(err)
      //     }
      //   })
      // } else if (targetType === '1004' || targetType === '1014') {
      //   wx.navigateTo({
      //     url: '/pages/mv/play/main?' + `id=${targetId}`,
      //     fail (err) {
      //       console.log(err)
      //     }
      //   })
      // }
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
          type: 2
        })
        if (code === 200 && banners.length > 0) {
          // 默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
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
