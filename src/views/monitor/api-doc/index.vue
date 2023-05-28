<template>
  <div>
    <iframe id="docIframe" :src="iframeUrl" width="100%" height="100%" scrolling="no" frameborder="0" />
  </div>
</template>

<script>
export default {
  name: 'ApiDoc',
  data() {
    return {
      iframeUrl: 'http://localhost:8081/doc.html'
    }
  },
  mounted() {
    /**
     * iframe-宽高自适应显示
     */
    const oIframe = document.getElementById('docIframe')
    const deviceWidth = document.documentElement.clientWidth
    const deviceHeight = document.documentElement.clientHeight
    oIframe.style.width = (deviceWidth - 10) + 'px'
    oIframe.style.height = (deviceHeight - 100) + 'px'
  }
}
</script>

<style scoped>

</style>
