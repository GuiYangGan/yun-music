<template>
  <block>
    <div class="viedo-wrapper">
      <video
        id="mv-play"
        style="width: 100%;height: 100%;"
        :title="mvDetail.name"
        :src="mvDetail.brs && mvDetail.brs[1080]"
        :autoplay="networkType === 'wifi'"
        enable-play-gesture />
    </div>
    <scroll-view class="wrapper" scroll-y enable-back-to-top @scrolltolower="onScrollToLower" >
      <div class="title" @click="showMoreInfo">
        <div class="title-text">{{mvDetail.name}}</div>
        <div class="title-icon"><i class="iconfont" :class="showMore ? 'icon-caret-up' : 'icon-caret-down'" /></div>
      </div>
      <div class="play-count">{{mvDetail.playCount}}次观看</div>
    </scroll-view>
  </block>
</template>

<script>
import numeral from 'numeral'
import API from '../../../utils/api'
import './index.less'

export default {
  data () {
    return {
      API,
      mvInfo: {},
      showMore: false,
      parentFunc: {},
      mvDetail: {},
      networkType: ''
    }
  },
  onLoad (options) {
    this.getNetworkType()
    this.getMVDetail({
      mvid: options.id
    })
  },
  methods: {
    onScrollToLower () {
      console.log(123)
    },
    showMoreInfo () {
      this.showMore = !this.showMore
    },
    getNetworkType () {
      const _this = this
      wx.getNetworkType({
        success: function (res) {
          if (res.errMsg === 'getNetworkType:ok') {
            _this.networkType = res.networkType
          }
        }
      })
    },
    async getMVDetail (params) {
      try {
        const {code, data} = await API.getMVDetail(params)
        if (code === 200 && Object.keys(data).length) {
          console.log(data)
          data.playCount = numeral(data.playCount).format('0,0')
          this.mvDetail = data
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
