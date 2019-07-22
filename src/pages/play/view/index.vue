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
        <img
          v-if="songInfo && songInfo.al && songInfo.al.picUrl"
          class="show-img"
          :src="songInfo.al.picUrl" />
      </div>
      <div class="play-control">
        <i class="iconfont icon-shangyishou" @click="go_prevSong" />
        <i class="iconfont" :class="isPlay ? 'icon-zanting' : 'icon-bofang'" @click="handleToggleBGAudio" />
        <i class="iconfont icon-xiayishou" @click="go_nextSong" />
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
      isShow: true,
      parentFunc: {},
      songInfo: {},
      isPlay: '',
      songId: [],
      song: [],
      history_song: [],
      isStop: false
    }
  },
  onLoad (options) {
    const audioId = options.id
    const historySong = wx.getStorageSync('history_song')
    const { currentSongId, bgAudioManage } = global.getApp().globalData
    this.history_song = historySong || []
    if (bgAudioManage && Object.keys(bgAudioManage).length > 0) {
      const isPaused = bgAudioManage.paused // true表示音乐暂停
      if (audioId !== currentSongId) {
        this.play(audioId)
      } else {
        this.isPlay = !isPaused
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
        this.songId = audioId
        this.getSongDetail({
          ids: audioId,
          url
        })
      }
    },
    createBgAudio (url, audioId) {
      let { songInfo = {}, bgAudioManage } = global.getApp().globalData
      if (!bgAudioManage) {
        bgAudioManage = wx.getBackgroundAudioManager()
        global.getApp().globalData.bgAudioManage = bgAudioManage
      }
      bgAudioManage.title = songInfo.name
      bgAudioManage.singer = `${songInfo.ar && songInfo.ar.map(item => item.name).join('/')}`
      bgAudioManage.epname = `${songInfo.alia && songInfo.alia.map(item => item.name).join('/')}`
      bgAudioManage.coverImgUrl = songInfo.al && songInfo.al.picUrl
      bgAudioManage.src = url
      let historySong = this.history_song
      historySong.push(songInfo)
      historySong = removeRepeatObject(historySong, 'id')
      bgAudioManage.onPlay(res => {
        this.isPlay = true
        this.history_song = historySong
        this.song = historySong
        wx.setStorageSync('history_song', historySong)
      })
      bgAudioManage.onPause(() => {
        this.isPlay = false
      })
      bgAudioManage.onStop(() => {
        this.isStop = true
        this.isPlay = false
      })
      bgAudioManage.onEnded(() => {
        this.isPlay = false
        this.go_nextSong()
      })
      bgAudioManage.onError((e) => {
        API.showErrNotice()
      })
    },
    handleToggleBGAudio () {
      const bgAudioManage = global.getApp().globalData.bgAudioManage
      const url = this.url + `${this.songId}.mp3`
      if (bgAudioManage && Object.keys(bgAudioManage).length > 0) {
        if (this.isPlay) {
          bgAudioManage.pause()
          this.isPlay = !this.isPlay
        } else {
          const currentTime = bgAudioManage.currentTime
          if (currentTime === 0 || this.isStop) {
            this.createBgAudio(url, this.songId)
          } else {
            bgAudioManage.play()
            this.isPlay = !this.isPlay
          }
        }
      } else {
        this.createBgAudio(url, this.songId)
      }
    },
    go_prevSong () {
      const currentIndex = this.song.findIndex(item => Number(item.id) === Number(this.songId))
      const length = this.song.length
      const index = currentIndex - 1
      let info = {}
      if (index >= 0) {
        info = this.song[index]
      } else {
        info = this.song[length - 1]
      }
      this.play(info.id)
    },
    go_nextSong () {
      const currentIndex = this.song.findIndex(item => Number(item.id) === Number(this.songId))
      const length = this.song.length
      const index = currentIndex + 1
      let info = {}
      if (index < length) {
        info = this.song[index]
      } else {
        info = this.song[0]
      }

      this.play(info.id)
    }
  }
}
</script>
