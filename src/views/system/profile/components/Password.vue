<template>
  <el-card shadow="never">
    <el-form ref="form" :label-position="'left'" :rules="rules" :model="currUserInfo">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model.trim="currUserInfo.oldPassword" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model.trim="currUserInfo.newPassword" type="password" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="newPassword2">
        <el-input v-model.trim="currUserInfo.newPassword2" type="password" />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="primary" size="small" style="margin-top: 10px;margin-left: 10px" icon="el-icon-edit" @click="submit">确认修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import userApi from '@/api/system/user/jy-user'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          createTime: '',
          id: null,
          username: '',
          nickname: '',
          avatar: '',
          phone: '',
          type: null
        }
      }
    }
  },
  watch: {
    user: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.currUserInfo.id = this.user.id
        }
      },
      // 开启深度监听
      deep: true
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.currUserInfo.newPassword !== '') {
          this.$refs.form.validateField('newPassword2')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.currUserInfo.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      currUserInfo: {
        id: null,
        newPassword: null,
        newPassword2: null,
        oldPassword: null
      },
      rules: {
        oldPassword: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        newPassword2: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          userApi.updateUserPassword(this.currUserInfo).then(res => {
            this.$notify.success({ title: '成功', message: '修改成功，请重新登陆!' })
            this.logout()
          }).catch(e => {
            this.$notify.error({ title: '失败', message: '修改失败!' })
          })
        }
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style scoped>

</style>
