<template>
  <el-dialog
    :title="title"
    :visible.sync="tmpVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    width="30%"
  >
    <div>
      <el-descriptions :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            角色名称
          </template>
          {{ form.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            角色编码
          </template>
          {{ form.code }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            角色状态
          </template>
          {{ form.status === 0 ? '禁用' : '启用' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            角色排序
          </template>
          {{ form.sort }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            角色描述
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
import roleApi from '@/api/jy-role'
export default {
  name: 'JyRoleDetail',
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
      form: {
        id: '',
        name: '',
        code: '',
        status: '',
        sort: '',
        description: ''
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
      roleApi.getById(id).then(response => {
        this.form = response.data
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '获取数据失败' })
      })
    }
  }
}
</script>

<style scoped>

</style>
