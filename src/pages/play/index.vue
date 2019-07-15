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
      url: 'https://music.163.com/song/media/outer/url?id=',
      parentFunc: {},
      songInfo: {},
      isPlay: '',
      songId: [],
      song: []
    }
  },
  onLoad () {
  },
  onShow () {
    const { bgAudioManage, currentSongId } = global.getApp().globalData
    const historySong = wx.getStorageSync('history_song') || []
    this.song = historySong
    this.songId = currentSongId
    if (this.song.length > 0) {
      // 进入播放页面后，填充songInfo数据
      let songInfo = {}
      if (this.songId && this.songId !== '') {
        songInfo = this.song.find(item => Number(item.id) === Number(this.songId))
      } else {
        songInfo = this.song[0]
      }
      this.songInfo = songInfo
      // 获取音乐播放的状态，如： 暂停、进度等
      if (bgAudioManage && Object.keys(bgAudioManage).length > 0) {
        const isPaused = bgAudioManage.paused // false表示音乐暂停
        this.isPlay = !isPaused
      }
    } else {
      wx.showModal({
        content: '请先前往乐库添加歌曲',
        showCancel: false,
        confirmText: '立即前往',
        complete () {
          wx.switchTab({
            url: '/pages/home/main'
          })
        }
      })
    }
  },
  methods: {
    handleToggleBGAudio () {
      const bgAudioManage = global.getApp().globalData.bgAudioManage
      if (this.isPlay) {
        bgAudioManage.pause()
      } else {
        bgAudioManage.play()
      }
      this.isPlay = !this.isPlay
    }
  }
}
</script>
