<template>
  <el-dialog
    :title="title"
    :visible.sync="tmpVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    width="40%"
    class="jy-dialog"
  >
    <div>
      <el-form
        ref="form"
        v-loading="initloading"
        :rules="rules"
        :model="form"
        label-width="110px"
        element-loading-text="加载中，请稍后..."
        element-loading-spinner="el-icon-loading"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="菜单类型：" prop="type">
              <el-radio-group v-model="form.type" :disabled="type === 'update'" @change="menuTypeChange">
                <el-radio-button :label="0">目录</el-radio-button>
                <el-radio-button :label="1">菜单</el-radio-button>
                <el-radio-button :label="2">按钮</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 目录 -->
        <el-row v-if="form.type === 0">
          <el-row>
            <el-col :span="12">
              <el-form-item label="目录名称：" prop="name">
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上级类目：" prop="parentId">
                <treeselect
                  v-model="form.parentId"
                  :options="menus"
                  :clearable="true"
                  placeholder=""
                  :normalizer="normalizer"
                  class="treeselect-main"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="目录编码：" prop="code">
                <el-input v-model="form.code" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目录图标：" prop="icon">
                <e-icon-picker v-model="form.icon" :width="iconSelect.width" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否显示：" prop="visiable">
                <el-radio-group v-model="form.visiable">
                  <el-radio-button :label="0">否</el-radio-button>
                  <el-radio-button :label="1">是</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否外链：" prop="link">
                <el-radio-group v-model="form.link">
                  <el-radio-button :label="0">否</el-radio-button>
                  <el-radio-button :label="1">是</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="路由地址：" prop="url">
                <el-input v-model="form.url" placeholder="一级路由必须以/开头，如/system" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态：" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio-button :label="0">禁用</el-radio-button>
                  <el-radio-button :label="1">启用</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="组件名称：" prop="component">
                <el-input v-model="form.component" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组件地址：" prop="path">
                <el-input v-model="form.path" placeholder="顶级根路径可用Layout" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="排序：" prop="sort">
                <el-input v-model.number="form.sort" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>

        <!-- 菜单 -->
        <el-row v-if="form.type === 1">
          <el-row>
            <el-col :span="12">
              <el-form-item label="菜单名称：" prop="name">
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上级类目：" prop="parentId">
                <treeselect
                  v-model="form.parentId"
                  :options="menus"
                  :clearable="true"
                  placeholder=""
                  :normalizer="normalizer"
                  class="treeselect-main"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="菜单编码：" prop="code">
                <el-input v-model="form.code" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单图标：" prop="icon">
                <e-icon-picker v-model="form.icon" :width="iconSelect.width" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否缓存：" prop="cache">
                <el-radio-group v-model="form.cache">
                  <el-radio-button :label="0">否</el-radio-button>
                  <el-radio-button :label="1">是</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态：" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio-button :label="0">禁用</el-radio-button>
                  <el-radio-button :label="1">启用</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否显示：" prop="visiable">
                <el-radio-group v-model="form.visiable">
                  <el-radio-button :label="0">否</el-radio-button>
                  <el-radio-button :label="1">是</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否外链：" prop="link">
                <el-radio-group v-model="form.link">
                  <el-radio-button :label="0">否</el-radio-button>
                  <el-radio-button :label="1">是</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="路由地址：" prop="url">
                <el-input v-model="form.url" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序：" prop="sort">
                <el-input v-model.number="form.sort" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="组件名称：" prop="component">
                <el-input v-model="form.component" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组件地址：" prop="path">
                <el-input v-model="form.path" placeholder="二级根路径可用SubLayout" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>

        <!-- 按钮 -->
        <el-row v-if="form.type === 2">
          <el-row>
            <el-col :span="12">
              <el-form-item label="按钮名称：" prop="name">
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上级类目：" prop="parentId">
                <treeselect
                  v-model="form.parentId"
                  :options="menus"
                  :clearable="true"
                  placeholder=""
                  :normalizer="normalizer"
                  class="treeselect-main"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="权限编码：" prop="code">
                <el-input v-model="form.code" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态：" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio-button :label="0">禁用</el-radio-button>
                  <el-radio-button :label="1">启用</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="排序：" prop="sort">
                <el-input v-model.number="form.sort" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>

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
import menuApi from '@/api/system/permission/jy-permission-menu'
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { EIconPicker } from 'e-icon-picker'

export default {
  name: 'JyPermissionMenuForm',
  components: { Treeselect, EIconPicker },
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
      if (value === '' || value === null || value === undefined) callback(new Error('上级目录不允许为空'))
      else if (this.form.id && this.form.id === value) callback(new Error('上级目录不允许选择本身'))
      else callback()
    }
    return {
      initloading: false,
      submitLoading: false,
      tmpVisible: this.visible,
      type: 'insert',
      iconSelect: {
        width: 350
      },
      form: {
        id: '',
        type: 0,
        name: '',
        code: '',
        parentId: null,
        icon: '',
        cache: 0,
        visiable: 1,
        link: 0,
        status: 1,
        url: '',
        sort: null,
        component: '',
        path: '',
        method: '',
        style: '',
        description: ''
      },
      baseForm: {
        name: '',
        code: '',
        parentId: null,
        icon: '',
        cache: 0,
        visiable: 1,
        link: 0,
        status: 1,
        url: '',
        sort: null,
        component: '',
        path: '',
        method: '',
        style: '',
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
        parentId: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: validateParentId, trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        visiable: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        cache: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ]
      },
      menus: []
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
        // 获取菜单目录树
        this.getMenuTree()
      }
    },
    tmpVisible(newVal) {
      this.$emit('update:visible', newVal)
    },
    deep: true
  },
  methods: {
    menuTypeChange() {
      for (const baseFormKey in this.baseForm) {
        this.form[baseFormKey] = this.baseForm[baseFormKey]
      }
      this.clearFormValidate('form')
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
      menuApi.add(this.form).then(response => {
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
      menuApi.update(this.form).then(response => {
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
      menuApi.getById(id).then(response => {
        this.initloading = false
        this.form = response.data
      }).catch(e => {
        this.initloading = false
      })
    },
    getMenuTree() {
      menuApi.layer().then(response => {
        console.log(response.data)
        this.menus = [{ id: '0', name: '顶级目录', children: response.data }]
        console.log(this.menus)
      })
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form.id = null
      this.tmpVisible = false
    },
    clearFormValidate(formName) {
      this.$refs[formName].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
  /* Treeselect */
  .treeselect-main {
    width: 100%;
    line-height: 28px;
    .vue-treeselect__placeholder {
      line-height: 28px;
    }
    .vue-treeselect__control {
      height: 28px;
    }
  }

</style>
