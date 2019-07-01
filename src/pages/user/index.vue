<template>
  <div>
    <tab-Bar :selectNavIndex="2" />
    <div>{{loading ? '登录中...' : '登录成功'}}</div>
  </div>
</template>

<script>
import API from '../../utils/api'
import tabBar from '@/components/tabBar/index'

export default {
  components: {
    tabBar
  },
  data () {
    return {
      loading: false
    }
  },
  mounted () {
    this.login()
  },
  methods: {
    // 用户登录
    async login (params = {phone: '18018372088', password: 'ganguiyang150..'}) {
      this.$data.loading = true
      try {
        const data = await API.login(params)
        console.log(data)
        this.$data.loading = false
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
