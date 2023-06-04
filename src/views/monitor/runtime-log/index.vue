<template>
  <div style="margin: 10px">
    <el-row style="margin-top: 10px">
      <!-- 左 -->
      <el-col :span="5" style="padding-right: 15px">
        <el-card
          v-loading="logTreeData.loading"
          class="box-card"
          shadow="always"
          style="margin-top: 5px"
          element-loading-text="加载中，请稍后..."
          element-loading-spinner="el-icon-loading"
        >
          <div slot="header" class="clearfix">
            <span><i class="el-icon-caret-right" /> 文件列表</span>
            <el-row style="float: right">
              <el-button icon="el-icon-refresh" circle size="mini" @click="getLogTree()" />
            </el-row>
          </div>
          <el-tree
            ref="deptTree"
            :data="logTreeData.records"
            node-key="id"
            empty-text="暂无数据"
            highlight-current
            :check-strictly="true"
            :props="{children: 'children', label: 'name' }"
            @node-click="clickLogTreeNode"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <i v-if="data.type === 'dir'" class="el-icon-folder" />
              <i v-else class="el-icon-document" />
              {{ data.name }}
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="19" style="padding-right: 15px">
        <el-card id="logContent" class="box-card" shadow="always" style="margin-top: 5px">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-caret-right" /> 日志内容</span>
            <el-row style="float: right">
              <el-button icon="el-icon-refresh" circle size="mini" @click="getLogContent()" />
            </el-row>
          </div>
          <el-empty v-show="queryForm.type === 'dir'" description="暂无数据" />
          <div v-show="queryForm.type === 'file'" class="json-editor" style="margin: 10px;border: 1px solid #ccc;">
            <codemirror v-model="logContentData.content" class="code" :options="cmOptions" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
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
import runTimeLogApi from '@/api/monitor/runtime-log/runtime-log'
export default {
  components: { codemirror },
  data() {
    return {
      queryFormVisiable: true,
      queryForm: {
        name: null,
        path: null,
        type: null
      },
      logTreeData: {
        loading: false,
        records: [
          { name: '系统日志', path: '/', type: 'dir' }
        ]
      },
      logContentData: {
        loading: false,
        content: null
      },
      cmOptions: {
        tabSize: 4, // tab的空格个数
        // theme: 'monokai',
        lineNumbers: true, // 是否显示行数
        lineWrapping: false, // 是否自动换行
        styleActiveLine: true, // line选择是是否加亮
        matchBrackets: true, // 括号匹配
        theme: 'base16-dark', // 主题样式
        readOnly: true// 只读
      }
    }
  },
  created() {
    this.getLogTree()
  },
  methods: {
    getLogTree() {
      this.logTreeData.loading = true
      runTimeLogApi.getLogTree().then(res => {
        const datas = [{ name: '系统日志', path: '/', type: 'dir', children: res.data }]
        this.logTreeData.records = datas
        this.logTreeData.loading = false
        this.clickLogTreeNode(datas[0])
      })
    },
    getLogContent() {
      if (this.queryForm.type === 'dir') return
      this.logContentData.loading = true
      runTimeLogApi.getLogContent(this.queryForm).then(res => {
        this.logContentData.content = res.data
        this.logContentData.loading = false
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '获取数据' })
      })
    },
    clickLogTreeNode(data) {
      this.queryForm.name = data.name
      this.queryForm.path = data.path
      this.queryForm.type = data.type
      this.getLogContent()
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  display: flex;
  align-items: center;
}
.custom-tree-node i {
  font-size: 18px;
  margin-right: 8px;
}

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
