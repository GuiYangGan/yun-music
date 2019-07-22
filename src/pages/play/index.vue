<template>
  <block>
    <tab-Bar :selectNavIndex="1" />
    <div class="wrapper">
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
          <i class="iconfont icon-shangyishou" @click="go_prevSong" />
          <i class="iconfont" :class="isPlay ? 'icon-zanting' : 'icon-bofang'" @click="handleToggleBGAudio" />
          <i class="iconfont icon-xiayishou" @click="go_nextSong" />
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
      song: [],
      isStop: false
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
        this.songId = songInfo.id
      }
      this.songInfo = songInfo
      // 获取音乐播放的状态，如： 暂停、进度等
      if (bgAudioManage && Object.keys(bgAudioManage).length > 0) {
        const isPaused = bgAudioManage.paused // true表示音乐暂停
        this.isPlay = !isPaused
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
    play (info, time = 0) {
      const bgAudioManage = global.getApp().globalData.bgAudioManage || wx.getBackgroundAudioManager()
      const url = this.url + `${info.id}.mp3`
      bgAudioManage.title = info.name
      bgAudioManage.singer = `${info.ar && info.ar.map(item => item.name).join('/')}`
      bgAudioManage.epname = `${info.alia && info.alia.map(item => item.name).join('/')}`
      bgAudioManage.coverImgUrl = info.al && info.al.picUrl
      bgAudioManage.src = url
      bgAudioManage.onPlay(res => {
        this.isPlay = true
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
      if (bgAudioManage && Object.keys(bgAudioManage).length > 0) {
        if (this.isPlay) {
          bgAudioManage.pause()
          this.isPlay = !this.isPlay
        } else {
          const currentTime = bgAudioManage.currentTime
          if (currentTime === 0 || this.isStop) {
            this.play(this.songInfo)
          } else {
            bgAudioManage.play()
            this.isPlay = !this.isPlay
          }
        }
      } else {
        this.play(this.songInfo)
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
      this.play(info)
      this.songInfo = info
      this.songId = info.id
    },
    go_nextSong () {
      const currentIndex = this.song.findIndex(item => Number(item.id) === Number(this.songId))
      const length = this.song.length
      console.log(this.songId)
      console.log(currentIndex)
      const index = currentIndex + 1
      console.log(index)
      let info = {}
      if (index < length) {
        info = this.song[index]
      } else {
        info = this.song[0]
      }

      this.play(info)
      this.songInfo = info
      this.songId = info.id
    }
  }
}
</script>
