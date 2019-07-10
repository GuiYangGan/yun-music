<template>
  <block>
    <tab-Bar :selectNavIndex="1" />
    <div style="height: calc(100vh - 55px); overflow: hidden;">
      <img :src="(songInfo && songInfo.al && songInfo.al.picUrl) && songInfo.al.picUrl" class="background_img" />
      <div class="play-wrapper" >
        <div class="play-title">
          <div class="song-name">{{songInfo && songInfo.name}}</div>
          <div class="ar-name" >
            <div v-for="(item, index) in songInfo && songInfo.ar" :key="index">
              {{index !== 0 ? '/' : ''}}{{item.name}}
            </div>
          </div>
        </div>
        <div class="play-show">
          <img v-if="songInfo && songInfo.al && songInfo.al.picUrl" class="show-img" :src="songInfo.al.picUrl" />
        </div>
        <div class="play-control">
          <i class="iconfont icon-shangyishou" />
          <i class="iconfont" :class="isPlay ? 'icon-zanting' : 'icon-bofang'" @click="handleToggleBGAudio" />
          <i class="iconfont icon-xiayishou" />
        </div>
      </div>
    </div>
  </block>
</template>

<script>
import API from '../../utils/api'
import tabBar from '@/components/tabBar/index'
import playView from './view/index'
import './index.less'

export default {
  components: {
    tabBar,
    playView
  },
  data () {
    return {
      API,
      isHiddenBar: false,
      searching: false,
      parentFunc: {},
      songInfo: {},
      isPlay: ''
    }
  },
  onLoad (options) {
    this.isHiddenBar = options.isHiddenBar
  },
  mounted () {
  },
  methods: {
    handleToggleBGAudio () {
      console.log(123)
    }
  }
}
</script>
