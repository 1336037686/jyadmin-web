<template>
  <div>
    <iframe id="docIframe" :src="iframeUrl" width="100%" height="100%" frameborder="0" />
  </div>
</template>

<script>
export default {
  name: 'DataBase',
  data() {
    return {
      iframeUrl: 'http://localhost:8081/druid'
    }
  },
  mounted() {
    /**
     * iframe-宽高自适应显示
     */
    const oIframe = document.getElementById('docIframe')
    const deviceWidth = document.documentElement.clientWidth
    const deviceHeight = document.documentElement.clientHeight
    oIframe.style.width = (deviceWidth - 50) + 'px'
    oIframe.style.height = (deviceHeight - 100) + 'px'
  }
}
</script>

<style scoped>

</style>
