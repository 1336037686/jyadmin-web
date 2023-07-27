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
        <el-descriptions-item span="2">
          <template slot="label">
            公告标题
          </template>
          {{ form.title }}
        </el-descriptions-item>
        <el-descriptions-item span="2">
          <template slot="label">
            公告状态
          </template>
          <el-tag v-if="form.status === 'draft'" type="info" effect="plain">{{ getNameByCode(statusOptions, form.status) }}</el-tag>
          <el-tag v-if="form.status === 'published'" effect="plain">{{ getNameByCode(statusOptions, form.status) }}</el-tag>
          <el-tag v-if="form.status === 'expired'" type="danger" effect="plain">{{ getNameByCode(statusOptions, form.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item span="2">
          <template slot="label">
            公告内容
          </template>
          {{ form.content }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="tmpVisible = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import AnnouncementsApi from '@/api/system/announcements/announcements'

export default {
  name: 'AnnouncementsDetail',
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
        id: null,
        title: null,
        content: null,
        status: null
      },
      statusOptions: []
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
  created() {
    this.getStatusOptions()
  },
  methods: {
    getById(id) {
      this.initloading = true
      AnnouncementsApi.getById(id).then(response => {
        this.initloading = false
        this.form = response.data
      }).catch(e => {
        this.initloading = false
      })
    },
    getStatusOptions() {
      this.getDictByCode('sys_announcements_status').then(res => {
        this.statusOptions = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
