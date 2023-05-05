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
        <el-form-item label="字典名称：" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="字典编码：" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="字典类型：" prop="dictType">
          <el-input v-model="form.dictType" />
        </el-form-item>
        <el-form-item label="父字典值：" v-if="type === 'insert'">
          <el-input v-model="form.parentName" disabled />
        </el-form-item>
        <el-form-item label="字典排序：" prop="sort">
          <el-input v-model="form.sort" />
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
import dictApi from '@/api/system/datadict/jy-dict'
export default {
  name: 'RoleForm',
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
    },
    parentName: {
      type: String,
      default: null
    },
    parentId: {
      type: String,
      default: null
    },
  },
  data() {
    return {
      tmpVisible: this.visible,
      type: 'insert',
      form: {
        id: '',
        name: '',
        dictType: '',
        parentName: '',
        code: '',
        sort: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入字典名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入字典编码', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        dictType: [
          { required: true, message: '请输入字典类型', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
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
          this.form.parentName = this.parentName
          this.form.parentId = this.parentId
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
      if(this.form.parentId){
        dictApi.addNode(this.form).then(response => {
          this.$notify.success({ title: '成功', message: '添加成功' })
          this.$parent.getList()
          this.tmpVisible = false
          this.resetForm('form')
          this.form.id = null
        }).catch(e => {
          this.$notify.error({ title: '失败', message: '添加失败' })
        })
      }else{
        dictApi.addRoot(this.form).then(response => {
          this.$notify.success({ title: '成功', message: '添加成功' })
          this.$parent.getList()
          this.tmpVisible = false
          this.resetForm('form')
          this.form.id = null
        }).catch(e => {
          this.$notify.error({ title: '失败', message: '添加失败' })
        })
      }

    },
    handleUpdate() {
      dictApi.update(this.form).then(response => {
        this.$notify.success({ title: '成功', message: '修改成功' })
        this.$parent.getList()
        this.tmpVisible = false

        this.resetForm('form')
        this.form.id = null
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '修改失败' })
      })
    },
    getById(id) {
      dictApi.getById(id).then(response => {
        this.form = response.data
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '获取数据失败' })
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
