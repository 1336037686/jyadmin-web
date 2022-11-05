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
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="接口名称：" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="权限标识：" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio-button :label="0">禁用</el-radio-button>
            <el-radio-button :label="1">启用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model.number="form.sort" />
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>
      <el-button @click="resetForm('form')">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/api/jy-permission-action'
export default {
  name: 'JyPermissionActionForm',
  props: {
    title: {
      type: String,
      default: 'Demo'
    },
    id: {
      type: String,
      default: null
    },
    groupName: {
      type: String,
      default: null
    },
    groupId: {
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
      type: 'insert',
      form: {
        id: '',
        name: '',
        code: '',
        parentId: '0',
        sort: '',
        groupId: '',
        status: 1,
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ]
      }
    }
  },
  watch: {
    visible(newVal) {
      this.tmpVisible = newVal
      if (newVal) {
        // 如果有ID则为修改操作
        if (this.id) {
          this.type = 'update'
          this.getById(this.id)
        } else {
        // 否则为新增操作
          this.type = 'insert'
        }
      }
      this.form.groupId = this.groupId
    },
    tmpVisible(newVal) {
      this.$emit('update:visible', newVal)
    },
    deep: true
  },
  methods: {
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type === 'insert') this.handleCreate()
          else this.handleUpdate()
        }
      })
    },
    handleCreate() {
      api.add(this.form).then(response => {
        this.$notify.success({ title: '成功', message: '添加成功' })
        this.$parent.getActionList()
        this.tmpVisible = false

        this.resetForm('form')
        this.form.id = null
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '添加失败' })
      })
    },
    handleUpdate() {
      api.update(this.form).then(response => {
        this.$notify.success({ title: '成功', message: '修改成功' })
        this.$parent.getActionList()
        this.tmpVisible = false

        this.resetForm('form')
        this.form.id = null
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '修改失败' })
      })
    },
    getById(id) {
      api.getById(id).then(response => {
        this.form = response.data
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '获取数据失败' })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form.id = null
      this.tmpVisible = false
    }
  }
}
</script>

<style scoped>

</style>
