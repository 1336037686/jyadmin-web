<template>
  <el-card shadow="never">
    <el-form ref="form" :label-position="'left'" :rules="rules" :model="currUserInfo">
      <el-form-item label="">
        <el-avatar shape="square" :size="100" :fit="'fill'" :src="currUserInfo.avatar" />
        <el-button type="text" style="margin-left: 10px" @click="uploadAvatar">修改头像</el-button>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model.trim="currUserInfo.nickname" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model.trim="currUserInfo.phone" />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="default" size="small" style="margin-top: 10px" icon="el-icon-refresh" @click="reset">重置信息</el-button>
        <el-button type="primary" size="small" style="margin-top: 10px;margin-left: 10px" icon="el-icon-edit" @click="submit">确认修改</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="上传头像" :visible.sync="dialogVisible" width="30%">
      <el-row>
        <el-col :span="17">
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
          <el-button type="primary" size="small" style="margin-top: 10px" @click="fileUploadHandleSubmit">上传头像</el-button>
        </el-col>
        <el-col :span="7">
          <el-avatar shape="square" :size="150" :src="result.url" />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadAvatarSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import userApi from '@/api/system/user/jy-user'
import fileProcessApi from '@/api/system/file/jy-file-process'
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
  data() {
    const isMobileNumber = (rule, value, callback) => {
      if (!value) {
        return new Error('请输入电话号码')
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        const isPhone = reg.test(value)
        value = Number(value) // 转换为数字
        if (typeof value === 'number' && !isNaN(value)) { // 判断是否为数字
          value = value.toString() // 转换成字符串
          if (value.length < 0 || value.length > 12 || !isPhone) { // 判断是否为11位手机号
            callback(new Error('手机号码格式如:138xxxx8754'))
          } else {
            callback()
          }
        } else {
          callback(new Error('请输入电话号码'))
        }
      }
    }

    return {
      dialogVisible: false,
      fileList: [],
      imgUrlPrefix: '/api/file-process/download/',
      result: {
        fileRecordId: '',
        url: ''
      },
      currUserInfo: {
        createTime: null,
        id: null,
        username: null,
        nickname: null,
        avatar: null,
        phone: null,
        type: null
      },
      rules: {
        nickname: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: isMobileNumber, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    user: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.getUserById()
        }
      },
      // 开启深度监听
      deep: true
    }
  },
  methods: {
    getUserById() {
      userApi.getById(this.user.id).then(res => {
        this.currUserInfo = res.data
      })
    },
    uploadAvatar() {
      this.dialogVisible = true
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
      const relevance = 'user' // 测试模块
      const formData = new FormData()
      this.fileList.forEach(item => {
        formData.append('file', item.raw)
      })
      fileProcessApi.upload(relevance, formData).then(res => {
        this.result = res.data
        if (!this.result.url) this.result.url = this.imgUrlPrefix + this.result.fileRecordId
        // 清空上传文件
        this.$refs.fileUpload.fileList.splice(0, 1)
        this.fileList.splice(0, 1)
      })
    },
    uploadAvatarSubmit() {
      if (!this.result.fileRecordId) {
        this.$message.error('请先上传头像!')
        return
      }
      this.currUserInfo.avatar = this.imgUrlPrefix + this.result.fileRecordId
      this.dialogVisible = false
    },
    reset() {
      this.getUserById()
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          userApi.update(this.currUserInfo).then(res => {
            this.$notify.success({ title: '成功', message: '修改成功!' })
          }).catch(e => {
            this.$notify.success({ title: '失败', message: '修改失败!' })
          })
        }
      })
    }
  }
}
</script>
<style scoped>
/deep/ .el-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/deep/ .el-avatar img {
  max-width: 100%;
  max-height: 100%;
}
</style>
