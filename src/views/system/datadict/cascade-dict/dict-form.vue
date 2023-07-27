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
        <el-form-item label="字典名称：" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="字典编码：" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="字典类型：" prop="dictType">
          <el-input v-model="form.dictType" />
        </el-form-item>
        <el-form-item label="上级字典：" prop="parentId">
          <treeselect
            v-model="form.parentId"
            :options="dicts"
            :clearable="true"
            placeholder=""
            :normalizer="normalizer"
            class="treeselect-main"
          />
        </el-form-item>
        <el-form-item label="字典排序：" prop="sort">
          <el-input v-model.number="form.sort" type="number" />
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
import dictApi from '@/api/system/datadict/jy-dict'
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
      if (value === '' || value === null || value === undefined) callback(new Error('上级字典不允许为空'))
      else if (this.form.id && this.form.id === value) callback(new Error('上级字典不允许选择本身'))
      else callback()
    }
    return {
      tmpVisible: this.visible,
      initloading: false,
      submitLoading: false,
      type: 'insert',
      form: {
        id: '',
        name: '',
        dictType: '',
        parentName: '',
        code: '',
        parentId: null,
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
        parentId: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: validateParentId, trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ]
      },
      dicts: []
    }
  },
  watch: {
    visible(newVal) {
      this.tmpVisible = newVal
      this.getDictTree()
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
      this.submitLoading = true
      if (this.form.parentId && this.form.parentId !== '0') {
        dictApi.addNode(this.form).then(response => {
          this.submitLoading = false
          this.$notify.success({ title: '成功', message: '添加成功' })
          this.$parent.getList()
          this.tmpVisible = false
          this.resetForm('form')
          this.form.id = null
        }).catch(e => {
          this.submitLoading = false
        })
      } else {
        dictApi.addRoot(this.form).then(response => {
          this.submitLoading = false
          this.$notify.success({ title: '成功', message: '添加成功' })
          this.$parent.getList()
          this.tmpVisible = false
          this.resetForm('form')
          this.form.id = null
        }).catch(e => {
          this.submitLoading = false
        })
      }
    },
    handleUpdate() {
      this.submitLoading = true
      dictApi.update(this.form).then(response => {
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
      dictApi.getById(id).then(response => {
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
    },
    getDictTree() {
      dictApi.layer().then(response => {
        this.dicts = [{ id: '0', name: '顶级字典', children: response.data }]
      })
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
