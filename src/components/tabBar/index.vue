<template>
  <div class="tabbar-wrap" :class="isIphoneX ? 'isIphoneX' : ''">
    <ul class="tabbar">
      <li
        class="tabbar-item"
        :class="item.isSpecial ? 'wrapSpecial' : ''"
        v-for="(item, index) in navList"
        :key="index"
        @click="selectNavItem(index, item.pagePath)" >
        <p class="tabbar-icon" >
          <img
            alt="tabbar-icon"
            :src="selectNavIndex === index ? item.selectedIconPath : item.iconPath"
            :class="item.isSpecial ? 'imgSpecial' : ''" />
        </p>
        <p class="tabbar-text" :class="selectNavIndex === index ? 'active' : ''" >
          {{item.text}}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import './index.less'

  export default {
    props: {
      selectNavIndex: Number
    },
    data () {
      return {
        color: '#979795',
        selectedColor: '#45b7af',
        navList: [
          {
            pagePath: '/pages/index/main',
            iconPath: '/static/tabs/home.png',
            selectedIconPath: '/static/tabs/home-active.png',
            text: '首页'
          },
          {
            pagePath: '/pages/logs/main',
            iconPath: '/static/tabs/orders.png',
            selectedIconPath: '/static/tabs/orders-active.png',
            text: '订单'
          }
        ]
      }
    },
    mounted () {
      this.$store.dispatch('global/getSystemInfo')
    },
    methods: {
      /**
       * 点击导航栏
       */
      selectNavItem (index, pagePath) {
        if (index === this.selectNavIndex) {
          return false
        }

        this.bindNavigateTo(pagePath)
      },

      /**
       * 路由跳转
       */
      bindNavigateTo (url) {
        wx.switchTab({
          url,
          success: (result) => {},
          fail: () => {},
          complete: () => {}
        })
      }
    },
    computed: {
      ...mapState({
        systemInfo: state => state.global.systemInfo
      }),
      ...mapGetters('global', {
        isIphoneX: 'isIphoneX'
      })
    }
  }
</script>

