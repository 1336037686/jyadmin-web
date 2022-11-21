<template>
  <el-row style="margin-top: 10px">
    <el-col :span="6" :offset="1">
      <el-card>
        <div slot="header" class="clearfix">
          <span><i class="el-icon-caret-right"/>  附件配置</span>
        </div>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="存储平台：" prop="storageType">
            <el-select v-model="form.storageType" placeholder="请选择存储平台" style="width: 100%" @change="storageTypeChange">
              <el-option v-for="item in storageTypeOptions" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="相应配置：" prop="config">
            <el-select v-model="form.config" placeholder="请选择相应配置" style="width: 100%" @change="configChange">
              <el-option v-for="item in configOptions" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="float: right; margin-left: 10px" @click="onSubmit">保存配置</el-button>
            <el-button style="float: right" @click="onReset">重置配置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>

    <el-col :span="15" :offset="1">
      <el-card>
        <div slot="header" class="clearfix">
          <span><i class="el-icon-caret-right"/>  所选配置详情</span>
        </div>

        <el-table
          border
          ref="configDetailInfoTable"
          :data="form.jsonObjs"
          highlight-current-row
          style="width: 100%"
          empty-text="暂无数据"
        >
          <el-table-column prop="name" label="字段名称" width="150" align="center" show-overflow-tooltip />
          <el-table-column prop="code" label="字段编码" width="150" align="center" show-overflow-tooltip />
          <el-table-column prop="type" label="字段类型" width="150" align="center" show-overflow-tooltip />
          <el-table-column prop="defaultValue" label="缺省值" width="150" align="center" show-overflow-tooltip />
          <el-table-column prop="value" label="具体值" width="150" align="center" show-overflow-tooltip />
          <el-table-column prop="comment" label="注释" align="center" show-overflow-tooltip />
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import fileConfigApi from '@/api/system/file/jy-file-config'

export default {
  data() {
    return {
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
      }
    }
  },
  created() {
    this.getDictByCode('sys_file_storageType').then(res => {
      this.storageTypeOptions = res.data
    })
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      fileConfigApi.getConfig().then(res => {
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
          fileConfigApi.update(this.form).then(res => {
            this.$notify.success({ title: '成功', message: '保存成功' })
          }).catch(e => {
            this.$notify.error({ title: '失败', message: '保存失败' })
          })
        }
      })
    },
    onReset() {
      this.init()
    }
  }
}
</script>

<style scoped>

</style>
