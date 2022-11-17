<template>
  <el-dialog
    :title="title"
    :visible.sync="tmpVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    width="55%"
  >
    <div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-table
          border
          stripe
          ref="configTemplateInfoTable"
          :data="form.jsonObjs"
          highlight-current-row
          style="width: 100%"
          empty-text="暂无数据"
          :header-cell-style="{background:'#FAFAFA'}"
        >
          <el-table-column prop="name" label="字段名称" width="160" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'jsonObjs.' + scope.$index + '.name'" :rules="rules.name" label-width="0" >
                <el-input v-model="scope.row.name" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="字段编码" width="160"  align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'jsonObjs.' + scope.$index + '.code'" :rules="rules.code" label-width="0" >
                <el-input v-model="scope.row.code" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="字段类型" width="200" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'jsonObjs.' + scope.$index + '.type'" :rules="rules.type" label-width="0" >
                <el-select v-model="scope.row.type" placeholder="请选择">
                  <el-option
                    v-for="item in typeDict"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="defaultValue" label="缺省值" width="160" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'jsonObjs.' + scope.$index + '.defaultValue'" :rules="rules.defaultValue" label-width="0" >
                <el-input v-model="scope.row.defaultValue" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="100"  align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'jsonObjs.' + scope.$index + '.sort'" :rules="rules.sort" label-width="0" >
                <el-input v-model.number="scope.row.sort" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="comment" label="注释" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'jsonObjs.' + scope.$index + '.comment'" :rules="rules.comment" label-width="0" >
                <el-input v-model="scope.row.comment" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="handler" width="100" label="操作" align="center">
            <template slot-scope="scope">
              <el-form-item label-width="0" >
                <el-button type="danger" @click="delField(scope.$index)">删除</el-button>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addField">新增字段</el-button>
      <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>
      <el-button @click="resetForm('form')">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/api/system/config/jy-config-template'
export default {
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
      typeDict: [],
      form: {
        id: '',
        name: '',
        code: '',
        template: '',
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
        type: [
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
        // 如果有ID则为编辑操作
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
  created() {
    this.getDictByCode('sys_configTemplate_fieldType').then(res => {
      this.typeDict = res.data
    })
  },
  methods: {
    addField() {
      this.form.jsonObjs.push({
        name: null,
        code: null,
        type: null,
        defaultValue: null,
        sort: null,
        comment: null
      })
    },
    delField(index) {
      this.form.jsonObjs.splice(index, 1)
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleUpdate()
        }
      })
    },
    handleUpdate() {
      this.form.template = JSON.stringify(this.form.jsonObjs)
      api.update(this.form).then(response => {
        this.$notify.success({ title: '成功', message: '编辑成功' })
        this.$parent.getConfigTemplateList()
        this.tmpVisible = false

        this.resetForm('form')
        this.form.id = null
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '编辑失败' })
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
      this.form.id = null
      this.$refs[formName].resetFields()
      this.tmpVisible = false
    }
  }
}
</script>

<style scoped>

</style>
