<template>
  <el-dialog
    :title="title"
    :visible.sync="tmpVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    width="30%"
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
            用户名
          </template>
          {{ form.username }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            昵称
          </template>
          {{ form.nickname }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            电话
          </template>
          {{ form.phone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            账号类型
          </template>
          {{ form.type === 0 ? '普通用户' : form.type === 1 ? '管理员' : '系统会员' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            状态
          </template>
          {{ form.status === 0 ? '禁用' : '启用' }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="tmpVisible = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import userApi from '@/api/system/user/jy-user'
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
        username: '',
        nickname: '',
        phone: '',
        type: '',
        status: ''
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
      userApi.getById(id).then(response => {
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
