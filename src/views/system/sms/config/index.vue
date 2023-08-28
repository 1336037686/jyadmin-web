<template>
  <el-tabs v-model="tab" type="border-card" style="margin: 10px">
    <el-tab-pane label="短信配置" name="config">
      <el-row style="margin-top: 10px">
        <el-col :span="6">
          <el-card
            v-loading="loading"
            shadow="never"
            element-loading-text="加载中，请稍后..."
            element-loading-spinner="el-icon-loading"
          >
            <div slot="header" class="clearfix">
              <span><i class="el-icon-caret-right" />  短信配置</span>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
              <el-form-item label="发送平台：" prop="storageType">
                <el-select v-model="form.storageType" placeholder="请选择短信平台" style="width: 100%" @change="storageTypeChange">
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

        <el-col :span="17" style="margin-left: 20px">
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
        <el-form ref="smsForm" :model="smsForm" :rules="smsFormRules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="接收人" prop="receiver">
            <el-input v-model="smsForm.receiver" type="phone" style="width: 700px" placeholder="请填写手机号码" />
          </el-form-item>
          <el-form-item>
            <el-button @click="onResetSms('smsForm')">重置表单</el-button>
            <el-button type="primary" @click="onSendSms('smsForm')">发送短信</el-button>
          </el-form-item>
        </el-form>
        <div>{{ result ? '发送结果：' + JSON.stringify(result) : '' }}</div>
      </el-card>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import smsConfigApi from '@/api/system/sms/jy-sms-config'
import smsProcessApi from '@/api/system/sms/jy-sms-process'
import { guid } from '@/utils'
import fileConfigApi from '@/api/system/file/jy-file-config'

export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入电话号码'))
      }
      if (value.length !== 11) {
        callback(new Error('请输入正确电话号码'))
      }
      if (value.length !== 11) {
        callback(new Error('请输入正确电话号码'))
      }
      // 验证电话号码手机号码，包含至今所有号段? ?
      var ab = /^[1][3,4,5,7,8][0-9]{9}$/
      if (ab.test(value) === false) {
        callback(new Error('请输入正确电话号码'))
      }
      callback()
    }
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
      smsForm: {
        uniqueId: guid(),
        relevance: 'test',
        receiver: null
      },
      smsFormRules: {
        receiver: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        subject: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      result: null
    }
  },
  created() {
    this.getDictByCode('sys_sms_platform').then(res => {
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
      smsConfigApi.getConfig().then(res => {
        this.loading = false
        this.form = res.data
        if (this.form.storageType) {
          fileConfigApi.getConfigDetails(this.form.storageType).then(res2 => {
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
      smsConfigApi.getConfigDetails(val).then(res2 => {
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
          smsConfigApi.update(this.form).then(res => {
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
    onSendSms(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          smsProcessApi.sendVerificationCode(this.smsForm).then(res => {
            this.result = res.data
            this.$notify.success({ title: '成功', message: '发送成功' })
          }).catch(e => {
            this.$notify.error({ title: '失败', message: '发送失败' })
          })
        }
      })
    },
    onResetSms() {
      this.smsForm.receiver = null
      this.smsForm.relevance = 'test'
      this.smsForm.body = [guid()]
      this.result = null
    }
  }
}
</script>

<style scoped>

</style>
