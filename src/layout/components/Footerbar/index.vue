<template>
  <div class="footer-bar" v-html="sysCopyright" />
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['basicSettings'])
  },
  data() {
    return {
      sysCopyright: null
    }
  },
  created() {
    this.sysCopyright = this.basicSettings['sys_copyright']
  }
}
</script>

<style lang="scss" scoped>
  .footer-bar {
    background-color: white;
    height: 35px;
    line-height: 35px;
    width: 100%;
    text-align: center;
    display: inline-block;
    position: fixed;
    bottom: 0;
    color: #BBB;
    font-size: 14px;
  }
</style>
