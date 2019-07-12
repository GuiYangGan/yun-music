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
      songid: [],
      song: [],
      history_songId: []
    }
  },
  onLoad (options) {
    const { bgAudioManage } = global.getApp().globalData
    console.log(bgAudioManage)
    const historySong = wx.setStorageSync('history_song')
    this.history_song = historySong
    const audioId = options.id
    this.play(audioId)
  },
  mounted () {
  },
  destroy () {
    this.songId = null
    this.songInfo = {}
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
          this.createBgAudio(params.url)
        }
      } catch (err) {
        console.log(err)
      }
    },
    play (audioId) {
      if (audioId) {
        const url = this.url + `${audioId}.mp3`
        global.getApp().globalData.songId = audioId
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
    createBgAudio (url) {
      const { songInfo } = global.getApp().globalData
      const bgAudioManage = wx.getBackgroundAudioManager()
      global.getApp().globalData.bgAudioManage = bgAudioManage
      bgAudioManage.title = songInfo.name
      console.log(`${songInfo.ar.map(item => item.name).join('/')}`)
      bgAudioManage.singer = `${songInfo.ar.map(item => item.name).join('/')}`
      bgAudioManage.epname = `${songInfo.alia.map(item => item.name).join('/')}`
      bgAudioManage.coverImgUrl = songInfo.al.picUrl
      bgAudioManage.src = url
      let historySong = this.history_song
      console.log(songInfo)
      historySong.push(songInfo)
      historySong = removeRepeatObject(historySong, 'id')
      console.log(historySong)
      bgAudioManage.onPlay(res => {
        console.log('开始播放')
        this.isPlay = true
        this.history_song = historySong
      })
      bgAudioManage.onEnded(() => {
        console.log(this)
        this.isPlay = false
        // this.go_lastSong()
      })
      bgAudioManage.onError(() => {
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
