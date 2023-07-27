<template>
  <el-row style="margin: 10px">
    <el-col :span="24">
      <el-card
        v-loading="loading"
        shadow="always"
        element-loading-text="加载中，请稍后..."
        element-loading-spinner="el-icon-loading"
      >
        <div slot="header" class="clearfix">
          <span><i class="el-icon-caret-right" />  系统基础信息配置</span>
        </div>
        <el-form ref="form" :model="form" :rules="rules" label-width="180px">
          <el-row>
            <el-col v-for="(item, index) in form.tableData" :key="'form_col_' + index" :span="12">
              <el-form-item :key="'form_item_' + index" :label="item.name + '：'">
                <el-input v-model="item.value" :placeholder="'code为 ' + item.code">
                  <el-tooltip slot="append" class="item" effect="dark" :content="item.description" placement="top-start">
                    <el-button type="info" icon="el-icon-question" plain />
                  </el-tooltip>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" style="float: right; margin-left: 10px" @click="onSubmit">保存配置</el-button>
            <el-button style="float: right" @click="onReset">重置配置</el-button>
          </el-form-item>

        </el-form>

      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import basicSettingApi from '@/api/system/basic-setting/jy-basic-settings'
export default {
  data() {
    return {
      loading: false,
      form: {
        tableData: []
      },
      rules: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      basicSettingApi.getList().then(res => {
        this.loading = false
        this.form.tableData = res.data
      })
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log(this.form.tableData)
          this.loading = true
          basicSettingApi.update(this.form.tableData).then(res => {
            this.loading = false
            this.$notify.success({ title: '成功', message: '保存成功' })
          }).catch(e => {
            this.loading = false
          })
        }
      })
    },
    onReset() {
      this.form.tableData = []
      this.init()
    }
  }
}
</script>

<style scoped>

</style>
