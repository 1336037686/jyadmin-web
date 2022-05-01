<template>
  <el-dialog
    :title="title"
    :visible.sync="tmpVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    width="40%"
  >
    <div>

      <el-form ref="form" :rules="rules" size="mini" :model="form" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="菜单类型：" prop="type">
              <el-radio-group v-model="form.type" :disabled="type === 'update'">
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
              <el-form-item label="目录编码：" prop="code">
                <el-input v-model="form.code" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目录图标：" prop="icon">
                <el-input v-model="form.icon" />
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
                <el-input v-model="form.path" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="排序：" prop="sort">
                <el-input v-model="form.sort" />
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
                <el-input v-model="form.icon" />
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
                <el-input v-model="form.sort" />
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
                <el-input v-model="form.path" />
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
                <el-input v-model="form.sort" />
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
      <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import menuApi from '@/api/jy-permission-menu'
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'JyPermissionMenuForm',
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
      tmpVisible: this.visible,
      type: 'insert',
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
        sort: '',
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
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type === 'insert') this.handleCreate()
          else this.handleUpdate()
        }
      })
    },
    handleCreate() {
      menuApi.add(this.form).then(response => {
        this.$notify.success({ title: '成功', message: '添加成功' })
        this.$parent.getList()
        this.tmpVisible = false

        this.resetForm('form')
        this.form.id = null
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '添加失败' })
      })
    },
    handleUpdate() {
      menuApi.update(this.form).then(response => {
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
      menuApi.getById(id).then(response => {
        this.form = response.data
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '获取数据失败' })
      })
    },
    getMenuTree() {
      menuApi.layer().then(response => {
        console.log(response.data)
        this.menus = [{id: '0', name: '顶级目录', children: response.data }]
        console.log(this.menus)
      })
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      }
    },
    resetForm(formName) {
      this.form.id = null
      this.$refs[formName].resetFields()
      this.tmpVisible = false
    }
  }
}
</script>

<style lang="scss">
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
