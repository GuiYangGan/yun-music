<template>
  <block>
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
  </block>
</template>

<script>
import API from '../../../utils/api'
import { removeRepeatObject } from '../../../utils/index'
import './index.less'

export default {
  props: ['height'],
  data () {
    return {
      API,
      url: 'https://music.163.com/song/media/outer/url?id=',
      parentFunc: {},
      songInfo: {},
      isPlay: '',
      songId: [],
      song: [],
      history_song: []
    }
  },
  onLoad (options) {
    const audioId = options.id
    const historySong = wx.getStorageSync('history_song')
    const { currentSongId, bgAudioManage } = global.getApp().globalData
    this.history_song = historySong || []
    if (bgAudioManage && Object.keys(bgAudioManage).length > 0) {
      // const isPaused = bgAudioManage.paused // false表示音乐暂停
      if (audioId !== currentSongId) {
        this.play(audioId)
      }
    } else {
      this.play(audioId)
    }
  },
  onShow () {
    // 页面显示，每次打开页面都会调用一次
  },
  onReady () {
    // 页面初次渲染完成，一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互
  },
  onHide () {
    // 当navigateTo或底部tab切换时调用
  },
  onUnload () {
    // 当redirectTo或navigateBack的时候调用
  },
  methods: {
    async getSongDetail (params) {
      try {
        const data = await API.getSongDetail({
          ids: params.ids
        })
        if (data.code === 200) {
          this.songInfo = data.songs[0]
          global.getApp().globalData.songInfo = data.songs[0]
          this.createBgAudio(params.url, params.ids)
        }
      } catch (err) {
        console.log(err)
      }
    },
    play (audioId) {
      if (audioId) {
        const url = this.url + `${audioId}.mp3`
        global.getApp().globalData.currentSongId = audioId
        wx.setInnerAudioOption({
          mixWithOther: false,
          obeyMuteSwitch: false
        })
        this.getSongDetail({
          ids: audioId,
          url
        })
      }
    },
    createBgAudio (url, audioId) {
      const { songInfo = {} } = global.getApp().globalData
      const bgAudioManage = wx.getBackgroundAudioManager()
      global.getApp().globalData.bgAudioManage = bgAudioManage
      bgAudioManage.title = songInfo.name
      bgAudioManage.singer = `${songInfo.ar.map(item => item.name).join('/')}`
      bgAudioManage.epname = `${songInfo.alia.map(item => item.name).join('/')}`
      bgAudioManage.coverImgUrl = songInfo.al.picUrl
      bgAudioManage.src = url
      let historySong = this.history_song
      historySong.push(songInfo)
      historySong = removeRepeatObject(historySong, 'id')
      bgAudioManage.onPlay(res => {
        this.isPlay = true
        this.history_song = historySong
      })
      bgAudioManage.onEnded(() => {
        console.log(this)
        this.isPlay = false
        // this.go_lastSong()
      })
      bgAudioManage.onError((e) => {
        API.showErrNotice()
      })
      wx.setStorageSync('history_song', historySong)
    },
    handleToggleBGAudio () {
      const { bgAudioManage } = global.getApp().globalData
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
