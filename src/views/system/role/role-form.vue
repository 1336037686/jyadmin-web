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
    <div>
      <el-form
        ref="form"
        v-loading="initloading"
        :rules="rules"
        :model="form"
        label-width="160px"
        element-loading-text="加载中，请稍后..."
        element-loading-spinner="el-icon-loading"
      >
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="角色编码：" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="角色接口权限：" prop="apiPermission">
          <template slot="label">
            角色接口权限
            <el-tooltip style="diaplay: inline" effect="light">
              <div slot="content" style="width: 300px">
                角色接口权限指接口配置管理中配置的接口<br>
                1、设置 <b style="color: red">拥有全部接口权限</b> 则默认该角色拥有接口配置管理中所有配置过的接口权限；<br>
                2、设置 <b style="color: red">根据系统配置限制接口权限</b> 则默认该角色拥有的是角色所拥有的菜单所对应的接口权限。<br>
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
            ：
          </template>
          <el-select v-model="form.apiPermission" placeholder="" style="width: 100%">
            <el-option v-for="item in apiPermissionOptions" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据范围：" prop="dataScope">
          <template slot="label">
            数据范围
            <el-tooltip style="diaplay: inline" effect="light">
              <div slot="content" style="width: 300px">
                数据范围指该角色可以查看的数据范围权限<br>
                1、设置 <b style="color: red">全部</b> 则默认该角色能查看所有数据，包括本级、下级、以及上级数据；<br>
                2、设置 <b style="color: red">本级</b> 则默认该角色只能查看当前级别的数据；<br>
                3、设置 <b style="color: red">自定义</b> 管理员可以自行设置角色的数据查阅级别。<br>
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
            ：
          </template>

          <el-select v-model="form.dataScope" placeholder="" style="width: 100%">
            <el-option v-for="item in dataScopeOptions" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.dataScope === 'other'" label="自定义数据范围：" prop="userDefineDataScopeList">
          <treeselect
            v-model="form.userDefineDataScopeList"
            :multiple="true"
            :options="deptOptions"
            :clearable="true"
            placeholder="自定义数据范围"
            :flat="true"
            :normalizer="normalizer"
            class="treeselect-main"
            @input="inputUserDefineDataScope"
          />
        </el-form-item>
        <el-form-item label="角色状态：" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio-button :label="0">禁用</el-radio-button>
            <el-radio-button :label="1">启用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色排序：" prop="sort">
          <el-input v-model.number="form.sort" />
        </el-form-item>
        <el-form-item label="角色描述：" prop="description">
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
import roleApi from '@/api/system/role/jy-role'
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
    var validateUserDefineDataScopeList = (rule, value, callback) => {
      if (!value || value.length === 0 || this.form.userDefineDataScope === null) callback(new Error('不能为空'))
      else callback()
    }
    return {
      initloading: false,
      submitLoading: false,
      tmpVisible: this.visible,
      type: 'insert',
      apiPermissionOptions: [],
      dataScopeOptions: [],
      deptOptions: [],
      form: {
        id: null,
        name: null,
        code: null,
        status: 1,
        sort: null,
        apiPermission: 'api_permission_portion',
        dataScope: 'all',
        userDefineDataScopeList: [],
        userDefineDataScope: null,
        description: null
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
        apiPermission: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        dataScope: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        userDefineDataScopeList: [
          { type: 'array', required: true, message: '不能为空', trigger: 'change' },
          { validator: validateUserDefineDataScopeList, trigger: 'blur' }
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
        // 获取字典
        this.getDataDict()
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
    getDataDict() {
      this.getDictByCode('sys_role_api_permission').then(res => {
        this.apiPermissionOptions = res.data
      })
      this.getDictByCode('sys_role_data_scope').then(res => {
        this.dataScopeOptions = res.data
      })
      deptApi.layer({ status: 1 }).then(response => {
        this.deptOptions = (!response.data || response.data.length === 0) ? [] : response.data
      })
    },
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
      roleApi.add(this.form).then(response => {
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
      roleApi.update(this.form).then(response => {
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
      roleApi.getById(id).then(response => {
        this.initloading = false
        this.form = response.data
        if (this.form.userDefineDataScope) this.form.userDefineDataScopeList = this.form.userDefineDataScope.split(',')
      }).catch(e => {
        this.initloading = false
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
    },
    inputUserDefineDataScope() {
      console.log(this.form.userDefineDataScopeList)
      if (this.form.userDefineDataScopeList && this.form.userDefineDataScopeList.length > 0) this.form.userDefineDataScope = this.form.userDefineDataScopeList.join(',')
      else this.form.userDefineDataScope = null
      console.log('userDefineDataScope', this.form.userDefineDataScope)
    }
  }
}
</script>

<style scoped>

</style>
