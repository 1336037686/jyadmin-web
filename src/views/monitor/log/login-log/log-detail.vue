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
            操作用户
          </template>
          {{ form.username }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            操作名称
          </template>
          {{ form.handleName }}
        </el-descriptions-item>

        <el-descriptions-item :span="2">
          <template slot="label">
            操作描述
          </template>
          {{ form.handleDesc }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            ip地址
          </template>
          {{ form.ipAddress }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            所属地区
          </template>
          {{ form.ipArea }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            浏览器
          </template>
          {{ form.browser }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            设备
          </template>
          {{ form.application }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            请求时间
          </template>
          {{ form.requestTime }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="tmpVisible = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import logApi from '@/api/monitor/log/jy-log'
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
      initloading: false,
      tmpVisible: this.visible,
      form: {
        id: '',
        handleName: '',
        handleDesc: '',
        ipAddress: '',
        ipArea: '',
        browser: '',
        application: '',
        requestPath: '',
        requestMethod: '',
        requestParam: '',
        requestTime: '',
        method: '',
        executeStatus: '',
        executeTime: '',
        responseData: '',
        errorDesc: '',
        username: ''
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
      logApi.getById(id).then(response => {
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
