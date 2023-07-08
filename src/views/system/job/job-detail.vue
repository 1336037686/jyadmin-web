<template>
  <el-dialog
    :title="title"
    :visible.sync="tmpVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    width="35%"
    class="jy-dialog"
  >
    <div
      v-loading="initloading"
      element-loading-text="加载中，请稍后..."
      element-loading-spinner="el-icon-loading"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item :span="1">
          <template slot="label">
            任务编号
          </template>
          {{ form.code }}
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template slot="label">
            任务名称
          </template>
          {{ form.name }}
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template slot="label">
            cron表达式
          </template>
          {{ form.cronExpression }}
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template slot="label">
            定时任务类
          </template>
          {{ form.bean }}
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template slot="label">
            定时任务方法
          </template>
          {{ form.method }}
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template slot="label">
            任务状态
          </template>
          {{ form.jobStatus === 0 ? '暂停' : '执行' }}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            定时任务参数（JSON）
          </template>
          {{ form.params }}
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template slot="label">
            执行情况
          </template>
          {{ form.runStatus === 0 ? '运行正常' : '运行异常' }}
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template slot="label">
            异常告警
          </template>
          {{ form.isAlarm === 0 ? '禁用' : '启用' }}
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template slot="label">
            负责人
          </template>
          {{ form.principal }}
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template slot="label">
            邮箱
          </template>
          {{ form.email }}
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template slot="label">
            创建时间
          </template>
          {{ form.createTime }}
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template slot="label">
            修改时间
          </template>
          {{ form.updateTime }}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            描述
          </template>
          {{ form.description }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="tmpVisible = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/api/system/job/jy-quartz-job'
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
        createTime: null,
        updateTime: null,
        id: null,
        code: null,
        name: null,
        bean: null,
        method: null,
        params: null,
        cronExpression: null,
        jobStatus: null,
        runStatus: null,
        principal: null,
        email: null,
        isAlarm: null,
        description: null
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
      api.getById(id).then(response => {
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
