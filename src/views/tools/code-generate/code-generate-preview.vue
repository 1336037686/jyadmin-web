<template>
  <el-drawer
    :title="title"
    :visible.sync="tmpVisible"
    :direction="'rtl'"
    :wrapper-closable="false"
    size="90%"
    class="jy-drawer"
  >
    <div
      v-loading="tmpLoading"
      element-loading-text="加载中，请稍后..."
      element-loading-spinner="el-icon-loading"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in codeDatas" :key="'code_' + index" :label="item.name" :name="item.name" />
      </el-tabs>
      <div class="json-editor" style="margin: 5px;border: 1px solid #ccc;">
        <codemirror v-model="code" class="code" :options="cmOptions" />
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/keymap/sublime' // sublime编辑器效果
import 'codemirror/theme/dracula.css'// 配置里面也需要theme设置为monokai

import 'codemirror/addon/selection/active-line' // 光标行背景高亮，配置里面也需要styleActiveLine设置为true

// language js
import 'codemirror/mode/vue/vue.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/clike/clike'
// merge js
import 'codemirror/addon/merge/merge.js'

// theme css
import 'codemirror/theme/base16-dark.css'

import codeGenApi from '@/api/tools/code-generate/code-generate'
export default {
  components: { codemirror },
  props: {
    title: {
      type: String,
      default: 'Demo'
    },
    id: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tmpLoading: false,
      tmpVisible: this.visible,
      codeDatas: [],
      activeName: null,
      code: null,
      cmOptions: {
        tabSize: 4, // tab的空格个数
        // theme: 'monokai',
        lineNumbers: true, // 是否显示行数
        lineWrapping: false, // 是否自动换行
        styleActiveLine: true, // line选择是是否加亮
        matchBrackets: true, // 括号匹配
        mode: 'text/x-java', // 实现代码高亮
        theme: 'base16-dark', // 主题样式
        readOnly: true// 只读
      }
    }
  },
  watch: {
    visible(newVal) {
      this.tmpVisible = newVal
      // 如果有ID则为修改操作
      if (this.id && newVal) {
        this.getById(this.id)
      }
    },
    tmpVisible(newVal) {
      this.$emit('update:visible', newVal)
    },
    deep: true
  },
  methods: {
    getById(id) {
      this.tmpLoading = true
      codeGenApi.preview(id).then(res => {
        this.codeDatas = res.data
        this.tmpLoading = false
        if (this.codeDatas && this.codeDatas.length > 0) {
          this.activeName = this.codeDatas[0].name
          this.handleClick()
        }
      }).catch(e => {
        this.tmpLoading = false
      })
    },
    handleClick() {
      for (let i = 0; i < this.codeDatas.length; i++) {
        if (this.codeDatas[i].name === this.activeName) {
          this.code = this.codeDatas[i].code
          this.cmOptions.mode = this.getMode(this.codeDatas[i].type)
        }
      }
    },
    getMode(type) {
      if (type === 'java') return 'text/x-java'
      if (type === 'js') return 'text/javascript'
      if (type === 'xml') return 'application/xml'
      if (type === 'vue') return 'text/x-vue'
    },
    handleReset() {
      this.getById(this.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.code {
  height: 100%;
  position: relative;

  ::v-deep {
    .CodeMirror {
      height: auto;
      min-height: 500px;
    }

    .CodeMirror-scroll {
      min-height: 500px;
    }

    .cm-s-rubyblue span.cm-string {
      color: #F08047;
    }
  }
}

</style>
