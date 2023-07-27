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
        label-width="120px"
        element-loading-text="加载中，请稍后..."
        element-loading-spinner="el-icon-loading"
      >
        <el-form-item label="部门名称：" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="部门编码：" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="是否顶级部门：" prop="isRoot">
          <el-radio-group v-model="form.isRoot" @input="changeIsRoot">
            <el-radio-button :label="0">否</el-radio-button>
            <el-radio-button :label="1">是</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.isRoot === 0" label="上级部门：" prop="parentId">
          <treeselect
            v-model="form.parentId"
            :options="depts"
            :clearable="true"
            placeholder=""
            :normalizer="normalizer"
            class="treeselect-main"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio-button :label="0">禁用</el-radio-button>
            <el-radio-button :label="1">启用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门排序：" prop="sort">
          <el-input v-model.number="form.sort" />
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input v-model="form.description" type="textarea" />
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
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import deptApi from '@/api/system/department/jy-department'
export default {
  components: { Treeselect },
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
    const validateParentId = (rule, value, callback) => {
      if (this.form.isRoot === 0) {
        if (value === '' || value === null || value === undefined) callback(new Error('上级部门不允许为空'))
        else if (this.form.id && this.form.id === value) callback(new Error('上级部门不允许选择本身'))
        else callback()
      } else {
        callback()
      }
    }
    return {
      initloading: false,
      submitLoading: false,
      tmpVisible: this.visible,
      type: 'insert',
      form: {
        id: '',
        name: '',
        code: '',
        isRoot: 1,
        parentId: '0',
        status: 1,
        sort: null,
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入部门编码', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        isRoot: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: validateParentId, trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ]
      },
      depts: []
    }
  },
  watch: {
    visible(newVal) {
      this.getDeptTree()
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
      deptApi.add(this.form).then(response => {
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
      deptApi.update(this.form).then(response => {
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
      deptApi.getById(id).then(response => {
        this.initloading = false
        this.form = response.data
      }).catch(e => {
        this.initloading = false
      })
    },
    changeIsRoot(label) {
      if (label === 0) this.form.parentId = null
      if (label === 1) this.form.parentId = '0'
    },
    getDeptTree() {
      deptApi.layer().then(response => {
        this.depts = (!response.data || response.data.length === 0) ? [] : response.data
      })
    },
    resetForm(formName) {
      this.form.id = null
      this.$refs[formName].resetFields()
      this.tmpVisible = false
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    }
  }
}
</script>

<style scoped>

</style>

