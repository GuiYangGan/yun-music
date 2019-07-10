<template>
  <div>
    <tab-Bar :selectNavIndex="0" :searching="searching" />
    <search-bar :API="API" :parentFunc="parentFunc" :searching="searching" />
    <music-content :API="API" :parentFunc="parentFunc" />
  </div>
</template>

<script>
import API from '../../utils/api'
import { removeRepeat } from '../../utils/index'
import tabBar from '@/components/tabBar/index'
import './index.less'

export default {
  components: {
    tabBar
  },
  data () {
    return {
      API,
      searching: false,
      slideOffset: 0,
      parentFunc: {
        setSearch: this.setSearch,
        removeRepeat
      }
    }
  },
  onLoad () {},
  methods: {
    setSearch (searching) {
      this.searching = searching
    }
  }
}
</script>
