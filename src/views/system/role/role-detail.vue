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
            角色接口权限
          </template>
          {{ getNameByCode(apiPermissionOptions, form.apiPermission) }}
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
import roleApi from '@/api/system/role/jy-role'
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
      initloading: false,
      tmpVisible: this.visible,
      apiPermissionOptions: [],
      form: {
        id: '',
        name: '',
        code: '',
        status: '',
        sort: '',
        apiPermission: '',
        description: ''
      }
    }
  },
  watch: {
    visible(newVal) {
      this.tmpVisible = newVal
      if (newVal) {
        this.getApiPermissionOptions()
        this.getById(this.id)
      }
    },
    tmpVisible(newVal) {
      this.$emit('update:visible', newVal)
    },
    deep: true
  },
  methods: {
    getApiPermissionOptions() {
      this.getDictByCode('sys_role_api_permission').then(res => {
        this.apiPermissionOptions = res.data
      })
    },
    getById(id) {
      this.initloading = true
      roleApi.getById(id).then(response => {
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
