<template>
  <div>
    <!-- 引自 https://github.com/JakHuang/form-generator 表单设计工具， 后续需参照其进行二次开发，封装成一个单独的组件进行引入 -->
    <iframe :src="iframeUrl" width="100%" height="800px" scrolling="no" frameborder="0"  id="docIframe"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iframeUrl: 'https://mrhj.gitee.io/form-generator'
    }
  }
}
</script>

<style lang="css" scoped>

</style>
