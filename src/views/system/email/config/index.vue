<template>
  <el-tabs v-model="tab" type="border-card" style="margin: 10px">
    <el-tab-pane label="邮件配置" name="config">
      <el-row style="margin-top: 10px">
        <el-col :span="6">
          <el-card
            v-loading="loading"
            shadow="never"
            element-loading-text="加载中，请稍后..."
            element-loading-spinner="el-icon-loading"
          >
            <div slot="header" class="clearfix">
              <span><i class="el-icon-caret-right" />  邮件配置</span>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
              <el-form-item label="发送平台：" prop="storageType">
                <el-select v-model="form.storageType" placeholder="请选择存储平台" style="width: 100%" @change="storageTypeChange">
                  <el-option v-for="(item, index) in storageTypeOptions" :key="'storageType_' + index" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
              <el-form-item label="相应配置：" prop="config">
                <el-select v-model="form.config" placeholder="请选择相应配置" style="width: 100%" @change="configChange">
                  <el-option v-for="(item, index) in configOptions" :key="'config_' + index" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" style="float: right; margin-left: 10px" @click="onSubmit">保存配置</el-button>
                <el-button style="float: right" @click="onReset">重置配置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="18">
          <el-card shadow="never">
            <div slot="header" class="clearfix">
              <span><i class="el-icon-caret-right" />  所选配置详情</span>
            </div>

            <el-table
              ref="configDetailInfoTable"
              border
              :data="form.jsonObjs"
              highlight-current-row
              style="width: 100%"
              empty-text="暂无数据"
              :header-cell-style="{background:'#F5F7FA', color: '#303133', fontWeight: 700}"
            >
              <el-table-column prop="name" label="字段名称" width="150" align="center" show-overflow-tooltip />
              <el-table-column prop="code" label="字段编码" width="150" align="center" show-overflow-tooltip />
              <el-table-column prop="type" label="字段类型" width="150" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ getNameByCode(fieldTypeOptions, scope.row.type) }}
                </template>
              </el-table-column>
              <el-table-column prop="defaultValue" label="缺省值" width="150" align="center" show-overflow-tooltip />
              <el-table-column prop="value" label="具体值" width="150" align="center" show-overflow-tooltip />
              <el-table-column prop="comment" label="注释" align="center" show-overflow-tooltip />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="发送测试" name="test">
      <el-card shadow="never" style="width: 900px">
        <el-form ref="emailForm" :model="emailForm" :rules="emailFormRules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="接收人" prop="receiver">
            <el-input v-model="emailForm.receiver" style="width: 700px" />
          </el-form-item>
          <el-form-item label="邮件主题" prop="subject">
            <el-input v-model="emailForm.subject" style="width: 700px" />
          </el-form-item>
          <el-form-item label="邮件内容" prop="body">
            <Tinymce ref="editor" v-model="emailForm.body" :height="400" :width="700" />
          </el-form-item>
          <el-form-item>
            <el-button @click="onResetEmail('emailForm')">重置表单</el-button>
            <el-button type="primary" @click="onSendEmail('emailForm')">发送邮件</el-button>
          </el-form-item>
        </el-form>
        <div>{{ result ? '发送结果：' + JSON.stringify(result) : '' }}</div>
      </el-card>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import emailConfigApi from '@/api/system/email/jy-email-config'
import emailProcessApi from '@/api/system/email/jy-email-process'
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  data() {
    return {
      tab: 'config',
      loading: false,
      fileList: [],
      fieldTypeOptions: [],
      storageTypeOptions: [],
      configOptions: [],
      form: {
        storageType: '',
        config: '',
        jsonObjs: []
      },
      rules: {
        storageType: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        config: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      emailForm: {
        body: null,
        relevance: 'test',
        subject: null,
        receiver: null
      },
      emailFormRules: {
        receiver: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        subject: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        body: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      result: null
    }
  },
  created() {
    this.getDictByCode('sys_email_platform').then(res => {
      this.storageTypeOptions = res.data
    })
    this.getDictByCode('sys_configTemplate_fieldType').then(res => {
      this.fieldTypeOptions = res.data
    })
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      emailConfigApi.getConfig().then(res => {
        this.loading = false
        this.form = res.data
        if (this.form.storageType) {
          emailConfigApi.getConfigDetails(this.form.storageType).then(res2 => {
            this.configOptions = res2.data
            for (let i = 0; i < this.configOptions.length; i++) {
              if (this.form.config === this.configOptions[i].code) {
                this.form.jsonObjs = this.configOptions[i].jsonObjs
                break
              }
            }
          })
        }
      })
    },
    storageTypeChange(val) {
      emailConfigApi.getConfigDetails(val).then(res2 => {
        this.configOptions = res2.data
      })
      this.form.config = null
    },
    configChange(val) {
      for (let i = 0; i < this.configOptions.length; i++) {
        if (this.form.config === this.configOptions[i].code) {
          this.form.jsonObjs = this.configOptions[i].jsonObjs
          break
        }
      }
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          emailConfigApi.update(this.form).then(res => {
            this.loading = false
            this.$notify.success({ title: '成功', message: '保存成功' })
          }).catch(e => {
            this.loading = false
          })
        }
      })
    },
    onReset() {
      this.init()
    },
    onSendEmail(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          emailProcessApi.send(this.emailForm).then(res => {
            this.result = res.data
            this.$notify.success({ title: '成功', message: '发送成功' })
          }).catch(e => {
            this.$notify.error({ title: '失败', message: '发送失败' })
          })
        }
      })
    },
    onResetEmail() {
      this.emailForm.subject = null
      this.emailForm.receiver = null
      this.emailForm.body = null
      this.$refs.editor.setContent('')
    }
  }
}
</script>

<style scoped>

</style>
