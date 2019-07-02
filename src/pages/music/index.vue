<template>
  <div>
    <tab-Bar :selectNavIndex="0" :searching="searching" />
    <search-bar-show :parentFunc="parentFunc" :searching="searching" />
    <search-bar :API="API" :parentFunc="parentFunc" :searching="searching" />
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
      API,
      searching: false,
      parentFunc: {
        setSearch: this.setSearch
      }
    }
  },
  methods: {
    setSearch (searching) {
      this.searching = searching
    }
  }
}
</script>
