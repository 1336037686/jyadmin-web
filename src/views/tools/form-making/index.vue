<template>
  <!-- 引自 https://github.com/JakHuang/form-generator 表单设计工具， 后续需参照其进行二次开发，封装成一个单独的组件进行引入 -->
  <!--<iframe :src="iframeUrl" width="100%" height="800px" scrolling="no" frameborder="0"  id="docIframe"></iframe>-->
  <el-card shadow="never" style="padding: 0;margin: 0">
    <!--  官方文档：https://www.yuque.com/variantdev/vform  -->
    <v-form-designer ref="vfDesigner" :designer-config="designerConfig" />
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      iframeUrl: 'https://mrhj.gitee.io/form-generator',
      designerConfig: {
        // 是否显示语言切换菜单
        languageMenu: false,
        // 是否显示GitHub、文档等外部链接
        externalLink: false,
        // 是否显示表单模板
        formTemplates: false,
        // 是否显示导入JSON按钮
        importJsonButton: false,
        // 是否显示导出JSON器按钮
        exportJsonButton: false,
        // 是否显示导出代码按钮
        exportCodeButton: false
      }
    }
  },
  mounted() {
    this.removeHeader()
  },
  methods: {
    // 删除头组件
    removeHeader() {
      const cleardom = document.querySelectorAll('.main-header')
      Array.from(cleardom).forEach((item) => {
        item.remove()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  body {
    margin: 0;  /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
  }

  .main-container {
    margin-left: 0px !important;
  }

  .el-header.main-header {
    display: none !important;
  }

  .main-container {
    background-color: #ffffff!important;
  }
</style>
