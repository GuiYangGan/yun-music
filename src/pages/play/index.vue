<template>
  <div>
    <tab-Bar :selectNavIndex="1" />
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
      parentFunc: {}
    }
  }
}
</script>
