<template>
  <el-drawer
    :title="title"
    :visible.sync="visible"
    :direction="'rtl'"
    :wrapper-closable="false"
    size="90%"
  >
    <div style="margin: 10px">
      <div style="margin-top: 10px; text-align: right;">
        <el-button type="warning" @click="handleSubmit('form')"> 重 置  </el-button>
        <el-button type="primary" @click="handleSubmit('form')"> 保 存  </el-button>
      </div>

      <el-card class="box-card" shadow="hover" style="margin-top: 10px;">
        <div slot="header" class="clearfix">
          <span>表信息</span>
        </div>
        <div>
          <el-form ref="tableForm" :rules="rules" :model="form" label-width="120px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="表名：" prop="tableName">
                  <el-input v-model="form.table.table.tableName" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="备注：" prop="tableRemark">
                  <el-input v-model="form.table.table.tableRemark" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="存储引擎：" prop="tableEngine">
                  <el-input v-model="form.table.table.tableEngine" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="字符集：" prop="tableCharset">
                  <el-input v-model="form.table.table.tableCharset" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="排序规则：" prop="tableOrder">
                  <el-input v-model="form.table.table.tableOrder" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="表创建DDL：" prop="remark">
                  <el-input v-model="form.table.table.tableDdl" :rows="10" readonly type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>

      <el-card class="box-card" style="margin-top: 10px" shadow="hover">
        <div slot="header" class="clearfix">
          <span>表配置信息</span>
        </div>
        <div>
          <el-form ref="tableForm" :rules="rules" :model="form" label-width="200px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="表类型 ：" prop="tableType">
                  <el-input v-model="form.table.tableConfig.tableType" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="作者：" prop="author">
                  <el-input v-model="form.table.tableConfig.author" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="后端代码包路径：" prop="packageName">
                  <el-input v-model="form.table.tableConfig.packageName" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="后端公共URL前缀：" prop="publicUrl">
                  <el-input v-model="form.table.tableConfig.publicUrl" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="后端去除表前缀字符：" prop="removeTablePrefix">
                  <el-input v-model="form.table.tableConfig.removeTablePrefix" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="后端去除表后缀字符：" prop="removeTableSuffix">
                  <el-input v-model="form.table.tableConfig.removeTableSuffix" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="后端去除属性前缀字符：" prop="removeFieldPrefix">
                  <el-input v-model="form.table.tableConfig.removeFieldPrefix" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="后端去除属性后缀字符：" prop="removeFieldSuffix">
                  <el-input v-model="form.table.tableConfig.removeFieldSuffix" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="swaggerAPI @Api value：" prop="swaggerApiValue">
                  <el-input v-model="form.table.tableConfig.swaggerApiValue" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="swaggerAPI @Api tags：" prop="swaggerApiTag">
                  <el-input v-model="form.table.tableConfig.swaggerApiTag" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="前端页面文件生成路径：" prop="pageViewPath">
                  <el-input v-model="form.table.tableConfig.pageViewPath" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>

      <el-card class="box-card" style="margin-top: 10px" shadow="hover">
        <div slot="header" class="clearfix">
          <span>属性信息</span>
        </div>

        <el-table :data="form.fields" style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="80" />
          <el-table-column prop="field.fieldName" label="字段名" show-overflow-tooltip width="150" align="center" />
          <el-table-column prop="field.fieldType" label="字段类型" show-overflow-tooltip width="150" align="center" />
          <el-table-column prop="field.fieldRemark" label="备注" show-overflow-tooltip width="120" align="center" />
          <el-table-column prop="field.pk" label="主键" show-overflow-tooltip width="100" align="center">
            <template slot-scope="scope">
              <el-select v-model="form.fields[scope.$index].field.pk" placeholder="请选择">
                <el-option
                  v-for="item in okOptions"
                  :key="'pk_' + item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="fieldConfig.javaType" label="java类型" align="center" />
          <el-table-column prop="fieldConfig.showPage" label="页面展示" show-overflow-tooltip width="100" align="center">
            <template slot-scope="scope">
              <el-select v-model="form.fields[scope.$index].fieldConfig.showPage" placeholder="请选择">
                <el-option
                  v-for="item in okIntOptions"
                  :key="'showPage_' + item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="fieldConfig.showDetail" label="详情页展示" show-overflow-tooltip width="100" align="center">
            <template slot-scope="scope">
              <el-select v-model="form.fields[scope.$index].fieldConfig.showDetail" placeholder="请选择">
                <el-option
                  v-for="item in okIntOptions"
                  :key="'showDetail_' + item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="fieldConfig.showForm" label="表单页展示" show-overflow-tooltip width="100" align="center">
            <template slot-scope="scope">
              <el-select v-model="form.fields[scope.$index].fieldConfig.showForm" placeholder="请选择">
                <el-option
                  v-for="item in okIntOptions"
                  :key="'showForm_' + item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="fieldConfig.formRequire" label="是否必填" show-overflow-tooltip width="100" align="center">
            <template slot-scope="scope">
              <el-select v-model="form.fields[scope.$index].fieldConfig.formRequire" placeholder="请选择">
                <el-option
                  v-for="item in okIntOptions"
                  :key="'formRequire_' + item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="fieldConfig.formType" label="表单类型" align="center" />
          <el-table-column prop="fieldConfig.showQuery" label="查询展示" show-overflow-tooltip width="100" align="center">
            <template slot-scope="scope">
              <el-select v-model="form.fields[scope.$index].fieldConfig.showQuery" placeholder="请选择">
                <el-option
                  v-for="item in okIntOptions"
                  :key="'showQuery_' + item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="fieldConfig.formSelectMethod" label="查询方法" align="center" />
          <el-table-column prop="fieldConfig.fieldIgnore" label="忽略字段" width="100" align="center">
            <template slot-scope="scope">
              <el-select v-model="form.fields[scope.$index].fieldConfig.fieldIgnore" placeholder="请选择">
                <el-option
                  v-for="item in okIntOptions"
                  :key="'fieldIgnore_' + item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </el-drawer>
</template>

<script>
import codeGenApi from '@/api/tools/code-generate/code-generate'
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
      okOptions: [
        { name: '否', code: '0' },
        { name: '是', code: '1' }
      ],
      okIntOptions: [
        { name: '否', code: 0 },
        { name: '是', code: 1 }
      ],
      form: {
        table: {
          table: {
            createTime: null,
            updateTime: null,
            id: null,
            tableName: null,
            tableRemark: null,
            tableEngine: null,
            tableCharset: null,
            tableOrder: null,
            tableDdl: null
          },
          tableConfig: {
            createTime: null,
            updateTime: null,
            id: null,
            tableId: null,
            tableType: null,
            author: null,
            packageName: null,
            publicUrl: null,
            removeTablePrefix: null,
            removeTableSuffix: null,
            removeFieldPrefix: null,
            removeFieldSuffix: null,
            swaggerApiValue: null,
            swaggerApiTag: null,
            pageViewPath: null
          }
        },
        fields: []
      }
    }
  },
  watch: {
    visible(newVal) {
      this.tmpVisible = newVal
      // 如果有ID则为修改操作
      if (this.id) {
        this.getById(this.id)
      }
    },
    tmpVisible(newVal) {
      this.$emit('update:visible', newVal)
    },
    deep: true
  },
  methods: {
    getById(id) {
      codeGenApi.getById(id).then(res => {
        this.form = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
