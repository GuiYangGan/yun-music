<template>
  <scroll-view scroll-y enable-back-to-top class="wrapper">
    <div class="title">
      <div class="title-left">MV精选</div>
      <div class="title-right">
        <p>更多</p>
      </div>
    </div>
    <div class="mv-wrapper">
      <div v-for="(item, index) in recommendMV" :key="index" @click="goToPlay(item)">
        <div style="position: relative">
          <img :src="item.picUrl" class="mv-img" />
          <div class="img-play">
            <i class="iconfont icon-play2" />{{item.playCount}}
          </div>
        </div>
        <div class="mv-info">
          <div class="mv-name">{{item.name}}</div>
          <div class="mv-artistName">
            <text v-for="(artist, i) in item.artists" :key="i">
              {{i !== 0 ? '/' : ''}}{{artist.name}}
            </text>
          </div>
        </div>
      </div>
    </div>
  </scroll-view>
</template>

<script>
import numeral from 'numeral'
import API from '../../utils/api'
import './index.less'

export default {
  data () {
    return {
      API,
      searching: false,
      parentFunc: {},
      recommendMV: []
    }
  },
  onLoad () {
    this.getRecommendMV()
  },
  methods: {
    goToPlay: function (info) {
      const router = '/pages/mv/play/main?' + `id=${info.id}`
      wx.navigateTo({
        url: router
      })
    },
    async getRecommendMV () {
      try {
        const { code, result } = await API.getRecommendMV()
        if (code === 200 && result.length) {
          this.recommendMV = result.map(item => {
            return {
              ...item,
              playCount: numeral(item.playCount).format('0,0')
            }
          })
        }
        // else {
        //   API.showErrNotice(msg ? {err: msg} : {err})
        // }
      } catch (err) {}
    }
  }
}
</script>
