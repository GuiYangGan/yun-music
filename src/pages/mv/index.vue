<template>
  <scroll-view scroll-y enable-back-to-top class="wrapper">
    <div class="title">
      <div class="title-left">MV精选</div>
      <div class="title-right">
        <p>更多</p>
      </div>
    </div>
    <div class="mv-wrapper">
      <div v-for="(item, index) in recommendMV" :key="index">
        <img :src="item.picUrl" class="mv-img" />
        <div>
          <div class="mv-name">{{item.name}}</div>
          <div class="mv-artistName">{{item.artistName}}</div>
        </div>
      </div>
    </div>
    <div v-show="recommendMV.length === 0" class="nodata-wrapper">
      <i class="iconfont icon-zanwushuju" />
      <div>暂无数据</div>
    </div>
  </scroll-view>
</template>

<script>
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
    async getRecommendMV () {
      try {
        const { code, result } = await API.getRecommendMV()
        if (code === 200) {
          console.log(result)
          this.recommendMV = result
        }
        // else {
        //   API.showErrNotice(msg ? {err: msg} : {err})
        // }
      } catch (err) {}
    }
  }
}
</script>
