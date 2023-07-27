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
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item v-if="type === 'insert'" label="密码：" prop="password">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item label="昵称：" prop="nickname">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="电话：" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="所属部门：" prop="department">
          <treeselect
            v-model="form.department"
            :options="deptOptions"
            :clearable="true"
            placeholder=""
            :normalizer="normalizer"
            class="treeselect-main"
          />
        </el-form-item>
        <el-form-item label="所属岗位：" prop="post">
          <el-select v-model="form.post" filterable placeholder="" style="width: 100%">
            <el-option v-for="item in postOptions" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型：" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio-button :label="0">普通用户</el-radio-button>
            <el-radio-button :label="1">管理员</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户状态：" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio-button :label="0">禁用</el-radio-button>
            <el-radio-button :label="1">启用</el-radio-button>
          </el-radio-group>
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
import userApi from '@/api/system/user/jy-user'
import deptApi from '@/api/system/department/jy-department'
import postApi from '@/api/system/post/jy-post'
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
    return {
      initloading: false,
      submitLoading: false,
      tmpVisible: this.visible,
      type: 'insert',
      form: {
        id: '',
        username: '',
        password: '',
        nickname: '',
        phone: '',
        department: null,
        post: null,
        type: 0,
        status: 1
      },
      rules: {
        username: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入标签编码', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      },
      deptOptions: [],
      postOptions: []
    }
  },
  watch: {
    visible(newVal) {
      this.getDeptTree()
      this.getPostOptions()
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
      userApi.add(this.form).then(response => {
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
      userApi.update(this.form).then(response => {
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
      userApi.getById(id).then(response => {
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
    getDeptTree() {
      deptApi.layer({ status: 1 }).then(response => {
        this.deptOptions = (!response.data || response.data.length === 0) ? [] : response.data
      })
    },
    getPostOptions() {
      postApi.getOptionList({ status: 1 }).then(response => {
        this.postOptions = (!response.data || response.data.length === 0) ? [] : response.data
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
