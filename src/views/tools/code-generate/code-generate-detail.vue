<template>
  <el-dialog
    :title="title"
    :visible.sync="tmpVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    width="50%"
    class="jy-dialog"
  >
    <div
      v-loading="initloading"
      element-loading-text="加载中，请稍后..."
      element-loading-spinner="el-icon-loading"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            表名
          </template>
          {{ form.tableName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            备注
          </template>
          {{ form.tableRemark }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            存储引擎
          </template>
          {{ form.tableEngine }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            字符集
          </template>
          {{ form.tableCharset }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            排序方式
          </template>
          {{ form.tableOrder }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            创建时间
          </template>
          {{ form.createTime }}
        </el-descriptions-item>

        <el-descriptions-item :span="2">
          <template slot="label">
            建表语句
          </template>
          <span style="white-space: pre-line;">{{ form.tableDdl }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="tmpVisible = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import codeGenApi from '@/api/tools/code-generate/code-generate'
export default {
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
      tmpVisible: this.visible,
      initloading: false,
      form: {
        id: '',
        tableName: '',
        tableRemark: '',
        tableEngine: '',
        tableCharset: '',
        tableOrder: '',
        tableDdl: '',
        createTime: '',
        updateTime: ''
      }
    }
  },
  watch: {
    visible(newVal) {
      this.tmpVisible = newVal
      if (newVal) {
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
      this.initloading = true
      codeGenApi.getSingleTableById(id).then(response => {
        this.initloading = false
        this.form = response.data
      }).catch(e => {
        this.initloading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
