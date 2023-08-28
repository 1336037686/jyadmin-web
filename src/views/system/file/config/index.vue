<template>
  <el-tabs v-model="tab" type="border-card" style="margin: 10px">
    <el-tab-pane label="附件配置" name="config">
      <el-row style="margin-top: 10px">
        <el-col :span="6">
          <el-card
            v-loading="loading"
            shadow="never"
            element-loading-text="加载中，请稍后..."
            element-loading-spinner="el-icon-loading"
          >
            <div slot="header" class="clearfix">
              <span><i class="el-icon-caret-right" />  附件配置</span>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
              <el-form-item label="存储平台：" prop="storageType">
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
    <el-tab-pane label="上传测试" name="test">
      <el-upload
        ref="fileUpload"
        :auto-upload="false"
        action="Fake Action"
        drag
        name="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        :limit="1"
        :on-change="fileUploadHandleChange"
        :file-list="fileList"
        :http-request="fileUploadHandleRequest"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
      </el-upload>
      <el-button type="primary" size="small" style="margin-top: 10px" @click="fileUploadHandleSubmit">上传文件</el-button>
      <div v-if="result" style="margin-top: 10px">
        <div>{{ '上传结果： ' + JSON.stringify(result) }}</div>
        <div style="margin-top: 10px">
          <img shape="square" width="400px" :src="result.url">
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import fileConfigApi from '@/api/system/file/jy-file-config'
import fileProcessApi from '@/api/system/file/jy-file-process'

export default {
  data() {
    return {
      tab: 'config',
      loading: false,
      fileList: [],
      storageTypeOptions: [],
      fieldTypeOptions: [],
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
      result: null
    }
  },
  created() {
    this.getDictByCode('sys_file_storageType').then(res => {
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
      fileConfigApi.getConfig().then(res => {
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
      fileConfigApi.getConfigDetails(val).then(res2 => {
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
          fileConfigApi.update(this.form).then(res => {
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
    fileUploadHandleChange(file, fileList) {
      const isIMAGE = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png' || file.raw.type === 'image/gif')
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片格式!')
        fileList.splice(0, 1)
        this.fileList = fileList
        return false
      }
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 1MB!')
        fileList.splice(0, 1)
        this.fileList = fileList
        return false
      }
      this.fileList = fileList
    },
    fileUploadHandleRequest() {

    },
    fileUploadHandleSubmit() {
      console.log('fileUploadHandleSubmit', this.fileList)
      if (!this.fileList || this.fileList.length === 0) {
        this.$message.error('请选择上传文件!')
        return
      }
      const relevance = 'test' // 测试模块
      const formData = new FormData()
      this.fileList.forEach(item => {
        formData.append('file', item.raw)
      })
      fileProcessApi.upload(relevance, formData).then(res => {
        this.result = res.data
        // 清空上传文件
        this.$refs.fileUpload.fileList.splice(0, 1)
        this.fileList.splice(0, 1)
      })
    }
  }
}
</script>

<style scoped>

</style>
