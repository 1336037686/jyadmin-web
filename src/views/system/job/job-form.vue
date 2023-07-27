<template>
  <el-dialog
    :title="title"
    :visible.sync="tmpVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    width="45%"
    class="jy-dialog"
  >
    <div>
      <el-form
        ref="form"
        v-loading="initloading"
        :rules="rules"
        :model="form"
        label-width="150px"
        element-loading-text="加载中，请稍后..."
        element-loading-spinner="el-icon-loading"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务编号：" prop="code">
              <el-input v-model="form.code" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务名称：" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="cron表达式：" prop="cronExpression">
              <el-input v-model="form.cronExpression" placeholder="* * * * * * ?" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="定时任务类：" prop="bean">
              <el-input v-model="form.bean" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="定时任务方法：" prop="method">
              <el-input v-model="form.method" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="异常告警：" prop="isAlarm">
              <el-radio-group v-model="form.isAlarm">
                <el-radio-button :label="0">禁用</el-radio-button>
                <el-radio-button :label="1">启用</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人：" prop="principal">
              <el-input v-model="form.principal" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="form.email" type="email" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="任务参数(JSON)：" prop="params">
              <el-input v-model="form.params" placeholder="{ name: 'zhangsan', age: 16 }" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述：" prop="email">
              <el-input v-model="form.description" type="textarea" />
            </el-form-item>
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
import api from '@/api/system/job/jy-quartz-job'
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
    const validateJson = (rule, value, callback) => {
      try {
        JSON.parse(value)
        callback()
      } catch (e) {
        callback(new Error('请输入正确的JSON参数'))
      }
    }

    return {
      tmpVisible: this.visible,
      initloading: false,
      submitLoading: false,
      type: 'insert',
      form: {
        createTime: null,
        updateTime: null,
        id: null,
        code: null,
        name: null,
        bean: null,
        method: null,
        params: null,
        cronExpression: null,
        jobStatus: 0,
        runStatus: 0,
        principal: null,
        email: null,
        isAlarm: 0,
        description: null
      },
      rules: {
        code: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        bean: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        method: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        params: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: validateJson, trigger: 'blur' }
        ],
        isAlarm: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        principal: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        description: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
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
      this.submitLoading = true
      api.add(this.form).then(response => {
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
      api.update(this.form).then(response => {
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

</style>
