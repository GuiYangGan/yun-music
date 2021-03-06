/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

Component({
  properties: {
    API: Object,
    parentFunc: Object,
    searching: Boolean
  },
  data: {
    orderList: {
      albums: '专辑',
      artists: '歌手',
      songs: '音乐',
      playlists: '歌单',
      mvs: 'MV'
    },
    inputShowed: true,
    searchKey: '',
    history_key: '',
    hotsongs: [],
    history: [],
    suggest: {},
    hasSugData: 0,
    serachData: [],
    searchOver: false,
    serachCount: 0,
    searchPage: 0
  },
  ready () {
    this.getHotsongs()
    this.getStorage({
      key: 'SEARCH_HISTROY'
    })
  },
  methods: {
    onScrollToLower: function () {
      const searchPage = this.properties.searchPage + 1
      if (searchPage * 30 < this.properties.serachCount) {
        this.searchResult({
          keywords: this.properties.searchKey,
          offset: searchPage,
          loading: false
        })
      }
    },
    showInput: function () {
      this.setData({
        inputShowed: true
      })
      this.properties.parentFunc.setSearch(true)
      this.getHotsongs()
      this.getStorage({
        key: 'SEARCH_HISTROY'
      })
    },
    hideInput: function () {
      this.setData({
        searchKey: '',
        inputShowed: false,
        searchOver: false,
        history_key: '',
        searchResult: [],
        suggest: [],
        hasSugData: 0,
        serachCount: 0,
        searchPage: 0
      })
      this.properties.parentFunc.setSearch(false)
    },
    clearInput: function () {
      this.setData({
        searchKey: '',
        suggest: [],
        hasSugData: 0,
        searchOver: false
      })
    },
    inputTyping: function (e) {
      this.setData({
        searchKey: e.detail.value
      })
      if (e.detail.value !== '') {
        this.searchSuggest({
          keywords: e.detail.value,
          type: 'mobile'
        })
      } else {
        this.setData({
          suggest: [],
          hasSugData: 0
        })
      }
    },
    handleSearch: function (e) {
      const value = e.detail && e.detail.value ? e.detail.value : e.currentTarget.dataset.value
      if (value !== '') {
        let hList = this.properties.history
        hList.push(value)
        hList = hList = this.properties.parentFunc.removeRepeat(hList)
        this.setData({history: hList, searchKey: value})
        wx.setStorage({
          key: 'SEARCH_HISTROY',
          data: hList
        })
        this.searchResult({keywords: value, offset: 0, loadning: true})
      }
    },
    async getHotsongs (params = {}) {
      try {
        const { code, result } = await this.properties.API.gethotsongs(params)
        if (code === 200 && result.hots) {
          this.setData({
            hotsongs: result.hots
          })
        }
      } catch (err) {}
    },
    async searchSuggest (params = {}) {
      try {
        const { code, result } = await this.properties.API.searchSuggest(params)
        if (code === 200 && Object.keys(result).length) {
          this.setData({
            hasSugData: Object.keys(result).length,
            suggest: result
          })
        }
      } catch (err) {}
    },
    async getStorage (params = {}) {
      try {
        const {data, errMsg} = await this.properties.API.getWXApiInfo('getStorage', params)
        this.setData({history: data})
      } catch (err) {}
    },
    async clearStorage (params = {}) {
      try {
        const {errMsg} = await this.properties.API.getWXApiInfo('clearStorage', params)
        if (errMsg === 'clearStorage:ok') {
          wx.showToast({
            title: '清除成功',
            icon: 'success',
            duration: 1000,
            success: () => {
              this.setData({history: []})
            }
          })
        }
      } catch (err) {}
    },
    async searchResult (params = {}) {
      if (params.loadning) {
        wx.showLoading()
      }
      try {
        const { code, result, err, msg } = await this.properties.API.searchResult({
          keywords: params.keywords,
          limit: 30,
          offset: params.offset
        })
        if (code === 200 && result.songs) {
          let serachData = []
          if (this.properties.history_key === params.keywords) {
            serachData = this.properties.serachData.concat(result.songs)
          } else {
            serachData = result.songs
          }
          console.log(serachData)
          this.setData({
            serachData,
            serachCount: result.songCount,
            searchOver: true,
            searchPage: params.offset,
            history_key: params.keywords
          })
        } else {
          this.properties.API.showErrNotice(false)
        }
        wx.hideLoading()
      } catch (err) {
        wx.hideLoading()
      }
    },
    goToPlayView (e) {
      console.log(e.currentTarget.dataset)
      const songId = e.currentTarget.dataset.songid
      wx.navigateTo({
        url: '/pages/play/view/main?' + `id=${songId}`,
        fail (err) {
          console.log(err)
        }
      })
    }
  }
})
