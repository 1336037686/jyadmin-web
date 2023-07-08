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
    <div>
      <el-form
        ref="form"
        v-loading="initloading"
        :rules="rules"
        :model="form"
        label-width="80px"
        element-loading-text="加载中，请稍后..."
        element-loading-spinner="el-icon-loading"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="标签编码" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="标签简介" prop="intro">
          <el-input v-model="form.intro" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetForm('form')">取 消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import jyTagApi from '@/api/module/jy-tag'
export default {
  name: 'JyTagForm',
  props: {
    title: {
      type: String,
      default: 'Demo'
    },
    idempotentToken: {
      type: String,
      default: null
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
      submitLoading: false,
      type: 'insert',
      form: {
        id: '',
        name: '',
        code: '',
        intro: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入标签编码', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
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
      this.submitLoading = true
      jyTagApi.add(this.form, this.idempotentToken).then(response => {
        this.submitLoading = false
        this.$notify.success({ title: '成功', message: '添加成功' })
        this.$parent.getList()
        this.tmpVisible = false

        this.resetForm('form')
        this.form.id = null
      }).catch(e => {
        this.submitLoading = false
      })
    },
    handleUpdate() {
      this.submitLoading = true
      jyTagApi.update(this.form, this.idempotentToken).then(response => {
        this.submitLoading = false
        this.$notify.success({ title: '成功', message: '修改成功' })
        this.$parent.getList()
        this.tmpVisible = false

        this.resetForm('form')
        this.form.id = null
      }).catch(e => {
        this.submitLoading = false
      })
    },
    getById(id) {
      this.initloading = true
      jyTagApi.getById(id).then(response => {
        this.initloading = false
        this.form = response.data
      }).catch(e => {
        this.initloading = false
      })
    },
    resetForm(formName) {
      this.form.id = null
      this.$refs[formName].resetFields()
      this.tmpVisible = false
    }
  }
}
</script>

<style scoped>

</style>
