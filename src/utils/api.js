/* eslint-disable handle-callback-err */
/* eslint-disable no-unused-vars */

const API_BASE_URL = 'https://musicapi.leanapp.cn'

const errCode = {
  200: '请求成功',
  400: '参数错误',
  404: '页面消失啦，请重新加载',
  500: '内部服务器错误，请稍后重试',
  503: '当前服务不可用，请稍后重试',
  504: '网络请求超时，请稍后重试'
}

const showErrNotice = (url = '/pages/home/main') => {
  wx.showModal({
    content: '服务器开了点小差~~',
    cancelColor: '#DE655C',
    confirmColor: '#DE655C',
    showCancel: false,
    confirmText: '返回',
    complete () {
      wx.switchTab({
        url: url
      })
    }
  })
}

const getWXApiInfo = (apiCode, params = {}) => {
  return new Promise((resolve, reject) => {
    wx[apiCode]({
      ...params,
      success (request) {
        resolve(request)
      },
      fail (error) {
        reject(error)
      }
    })
  })
}

const request = (url, params = {}) => {
  let _url = API_BASE_URL + url
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'get',
      url: _url,
      data: params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success (request) {
        if (request.statusCode === 200) {
          resolve(request.data)
        } else {
          resolve({
            code: request.statusCode,
            err: typeof request.statusCode === 'number' ? errCode[request.statusCode] : request.statusCode
          })
        }
      },
      fail (error) {
        reject(error)
      }
    })
  })
}

const API = {
  // 命令前缀
  API_BASE_URL,

  // 网络请求出错
  showErrNotice,

  // 统一微信API请求
  getWXApiInfo,

  // 登录
  login: (params) => {
    return request('/login/cellphone', params)
  },
  // 热搜
  gethotsongs: (params) => {
    return request('/search/hot', params)
  },
  // 搜索建议
  searchSuggest: (params) => {
    return request('/search/suggest', params)
  },
  // 搜索结果
  searchResult: (params) => {
    return request('/search', params)
  },
  // 个性推荐轮播
  getBanner: (params) => {
    return request('/banner', params)
  },
  // 热门歌单
  getsongsheet: (params) => {
    return request('/top/playlist', params)
  },
  // 最新音乐
  getNewSong: (params) => {
    return request('/personalized/newsong', params)
  },
  // 电台推荐
  getDjRadios: (params) => {
    return request('/dj/recommend', params)
  },
  // 电台分类
  getDjList: (params) => {
    return request('/dj/catelist', params)
  },
  // 所有电台分类推荐
  getRecommendType: (params) => {
    return request('/dj/recommend/type', params)
  },
  // 推荐节目
  getProgramRecommend: (params) => {
    return request('/program/recommend', params)
  },
  // 推荐MV
  getRecommendMV: (params) => {
    return request('/personalized/mv', params)
  },
  // 最新MV
  getNewMv: (params) => {
    return request('/mv/first', params)
  },
  // MV数据
  getMVDetail: (params) => {
    return request('/mv/detail', params)
  },
  // MV播放地址
  getMVUrl: (params) => {
    return request('/mv/url', params)
  },
  // 最新专辑
  getNewEst: (params) => {
    return request('/album/newest', params)
  },
  // 排行榜
  getTopList: (params) => {
    return request('/top/list', params)
  },
  // 付费精品
  getPay: (params) => {
    return request('/dj/paygift', params)
  },
  // 歌手排行
  getSonger: (params) => {
    return request('/toplist/artist', params)
  },
  // 音乐详情
  getSongDetail: (params) => {
    return request('/song/detail', params)
  },
  // 音乐播放地址
  getSongUrl: (params) => {
    return request('/song/url', params)
  },
  // 相似音乐
  getSimiSong: (params) => {
    return request('/simi/song', params)
  }
}

export default API
