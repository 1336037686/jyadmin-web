<template>
  <el-dialog
    :title="title"
    :visible.sync="tmpVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    width="60%"
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="配置名称：" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配置编码：" prop="code">
              <el-input v-model="form.code" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属模板：">
              {{ template ? template.name : '' }} ( {{ template ? template.code : '' }} )
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用：" prop="status">
              <el-switch
                v-model="form.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="禁用"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table
              ref="configTemplateInfoTable"
              border
              stripe
              :data="form.jsonObjs"
              highlight-current-row
              style="width: 100%"
              empty-text="暂无数据"
              :header-cell-style="{background:'#F5F7FA', color: '#303133', fontWeight: 700}"
              max-height="500"
            >
              <el-table-column prop="name" label="字段名称" width="160" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'jsonObjs.' + scope.$index + '.name'" :rules="rules.name" label-width="0">
                    {{ scope.row.name }}
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="code" label="字段编码" width="160" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'jsonObjs.' + scope.$index + '.code'" :rules="rules.code" label-width="0">
                    {{ scope.row.code }}
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="字段类型" width="160" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'jsonObjs.' + scope.$index + '.type'" :rules="rules.type" label-width="0">
                    {{ scope.row.type }}
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="defaultValue" label="缺省值" width="160" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'jsonObjs.' + scope.$index + '.defaultValue'" :rules="rules.defaultValue" label-width="0">
                    {{ scope.row.defaultValue }}
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="value" label="值" width="160" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'jsonObjs.' + scope.$index + '.value'" :rules="rules.value" label-width="0">
                    <el-input v-model="scope.row.value" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="sort" label="排序" width="100" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'jsonObjs.' + scope.$index + '.sort'" :rules="rules.sort" label-width="0">
                    {{ scope.row.sort }}
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="comment" label="注释" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'jsonObjs.' + scope.$index + '.comment'" :rules="rules.comment" label-width="0">
                    <el-input v-model="scope.row.comment" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetForm('form')">取 消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/api/system/config/jy-config-detail.js'
export default {
  props: {
    template: {
      type: Object,
      default: () => {
        return { name: '', code: '' }
      }
    },
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
        id: null,
        name: null,
        templateId: null,
        code: null,
        status: 0,
        data: null,
        jsonObjs: []
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
        type: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        value: [
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
          this.form.templateId = this.template.id
          this.form.jsonObjs = JSON.parse(JSON.stringify(this.template.jsonObjs))
          // 对value赋值
          if (this.form.jsonObjs) {
            for (let i = 0; i < this.form.jsonObjs.length; i++) {
              if (this.form.jsonObjs[i].defaultValue) {
                this.form.jsonObjs[i].value = this.form.jsonObjs[i].defaultValue
              }
            }
          }
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
      this.form.data = JSON.stringify(this.form.jsonObjs)
      this.submitLoading = true
      api.add(this.form).then(response => {
        this.submitLoading = false
        this.$notify.success({ title: '成功', message: '添加成功' })
        this.$parent.getConfigDetailList()
        this.tmpVisible = false

        this.resetForm('form')
        this.form.id = null
      }).catch(e => {
        this.submitLoading = false
      })
    },
    handleUpdate() {
      this.form.data = JSON.stringify(this.form.jsonObjs)
      this.submitLoading = true
      api.update(this.form).then(response => {
        this.submitLoading = false
        this.$notify.success({ title: '成功', message: '修改成功' })
        this.$parent.getConfigDetailList()
        this.tmpVisible = false

        this.resetForm('form')
        this.form.id = null
      }).catch(e => {
        this.submitLoading = false
      })
    },
    getById(id) {
      this.initloading = true
      api.getById(id).then(response => {
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
/deep/ ::-webkit-scrollbar {
  width: 7px;
}

/deep/ ::-webkit-scrollbar-track {
  background-color: #f3f3f3;
}

/deep/ ::-webkit-scrollbar-thumb {
  background-color: #aaa;
}

/deep/ ::-webkit-scrollbar-thumb:hover {
  background-color: #aaa;
}

/deep/ ::-webkit-scrollbar-thumb:active {
  background-color: #aaa;
}
</style>
