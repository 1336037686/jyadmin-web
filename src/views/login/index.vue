<template>
  <div class="login-container" :style="{ backgroundImage: 'url(' + loginBasicSettings.sysLoginWallpaper + ')' }">
    <el-row style="height: auto;margin-top: 250px">
      <el-col v-if="loginBasicSettings.sysLoginOpenHtmlEnable === '1'" :span="16" :offset="1" v-html="loginBasicSettings.sysLoginOpenHtml" />
      <el-col :span="5" :offset="loginBasicSettings.sysLoginOpenHtmlEnable === '1' ? 1 : 18">
        <el-card>
          <!--登录-->
          <el-form v-show="isLogin" ref="loginForm" :model="loginForm" :rules="loginRules" autocomplete="on" label-position="left">
            <div class="title-container">
              <h3 class="title"> {{ loginBasicSettings.sysSiteName }} </h3>
            </div>
            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input ref="username" v-model="loginForm.username" placeholder="用户名" name="username" type="text" tabindex="1" autocomplete="on" />
            </el-form-item>
            <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
              <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="密码"
                  name="password"
                  tabindex="2"
                  autocomplete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>
            </el-tooltip>
            <el-row>
              <el-col :span="15">
                <el-form-item prop="captcha">
                  <span class="svg-container">
                    <svg-icon icon-class="chart" />
                  </span>
                  <el-input ref="username" v-model="loginForm.captcha" placeholder="验证码" name="captcha" type="text" tabindex="1" autocomplete="on" />
                </el-form-item>
              </el-col>
              <el-col :span="9" style="padding-left: 10px">
                <img width="100%" height="50px" :src="captchaImg" @click="reloadCaptcha">
              </el-col>
            </el-row>
            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:10px;" @click.native.prevent="handleLogin">登 陆</el-button>
          </el-form>
          <!--注册-->
          <el-form v-show="!isLogin" ref="registerForm" :model="registerForm" :rules="registerRules" autocomplete="on" label-position="left">
            <div class="title-container">
              <h3 class="title"> {{ loginBasicSettings.sysSiteName }} </h3>
            </div>
            <el-form-item prop="phone">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input ref="registerForm-phone" v-model="registerForm.phone" placeholder="手机号" name="phone" type="text" tabindex="1" autocomplete="on" />
            </el-form-item>
            <el-row>
              <el-col :span="15">
                <el-form-item prop="captcha">
                  <span class="svg-container">
                    <svg-icon icon-class="chart" />
                  </span>
                  <el-input ref="registerForm-captcha" v-model="registerForm.captcha" placeholder="验证码" name="captcha" type="text" tabindex="1" autocomplete="on" />
                </el-form-item>
              </el-col>
              <el-col :span="9" style="padding-left: 5px">
                <el-button v-if="!retryLoading" type="primary" style="width: 100%;height: 50px" @click="getPhoneCaptcha">获取验证码</el-button>
                <el-button v-if="retryLoading" style="width: 100%;height: 50px">{{ retryCountDown }}秒后重新获取</el-button>
              </el-col>
            </el-row>
            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:10px;" @click.native.prevent="handleRegister">注 册</el-button>
          </el-form>
          <div style="text-align: right">
            <span v-if="isLogin"><a class="forget-pwd" @click="isLogin = false">用户注册</a> / </span>
            <span v-if="!isLogin"><a class="forget-pwd" @click="isLogin = true">用户登录</a> / </span>
            <span><a class="forget-pwd" @click="forgetPwd">忘记密码</a></span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="div_foot" style="color: white" v-html="loginBasicSettings.sysCopyright" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { guid, deepClone } from '@/utils'
import { encryptByRSA } from '@/utils/rsa-util'
import SmsProcessApi from '@/api/system/sms/jy-sms-process'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位数字'))
      } else {
        callback()
      }
    }
    return {
      captchaImg: null,
      captchaUniqueId: null,
      isLogin: true,
      loginForm: {
        username: 'admin',
        password: 'admin123',
        captcha: null,
        uniqueId: null
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captcha: [{ required: true, trigger: 'blur', message: '请输入正确的验证码' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      registerForm: {
        phone: null,
        uniqueId: guid().replaceAll('-', ''),
        captcha: null
      },
      registerRules: {
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      retryLoading: false,
      retryCountDown: 60,
      retryTimer: null,
      loginBasicSettings: {
        sysSiteName: null,
        sysLogo: null,
        sysLoginWallpaper: null,
        sysCopyright: null,
        sysMsgEnable: false,
        sysMsgContent: null,
        sysLoginOpenHtmlEnable: false,
        sysLoginOpenHtml: null,
        sysLoginForgetpwdMsg: null
      }
    }
  },
  computed: {
    ...mapGetters(['basicSettings'])
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // 加载初始化数据
    this.loadBasicSettings()
    // window.addEventListener('storage', this.afterQRScan)
    this.reloadCaptcha()
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    async loadBasicSettings() {
      await this.$store.dispatch('basicSettings/getRsaPublicKey')
      await this.$store.dispatch('basicSettings/getBasicSettings').then(() => {
        // 加载属性
        this.setLoginBasicSettingsParams()
        // 在页面加载完成后根据配置信息判断是否弹出欢迎提示框
        if (this.loginBasicSettings.sysMsgEnable === '1') {
          this.$notify({
            title: '通知',
            message: this.loginBasicSettings.sysMsgContent,
            type: 'success',
            duration: 30000
          })
        }
      })
    },
    setLoginBasicSettingsParams() {
      this.loginBasicSettings.sysSiteName = this.basicSettings['sys_site_name']
      this.loginBasicSettings.sysLogo = this.basicSettings['sys_logo']
      this.loginBasicSettings.sysLoginWallpaper = this.basicSettings['sys_login_wallpaper']
      if (!this.loginBasicSettings.sysLoginWallpaper) this.loginBasicSettings.sysLoginWallpaper = '/bg.jpg' // 登录背景默认使用 /bg.jpg
      this.loginBasicSettings.sysCopyright = this.basicSettings['sys_copyright']
      this.loginBasicSettings.sysMsgEnable = this.basicSettings['sys_msg_enable']
      this.loginBasicSettings.sysMsgContent = this.basicSettings['sys_msg_content']
      this.loginBasicSettings.sysLoginOpenHtmlEnable = this.basicSettings['sys_login_open_html_enable']
      this.loginBasicSettings.sysLoginOpenHtml = this.basicSettings['sys_login_open_html']
      this.loginBasicSettings.sysLoginForgetpwdMsg = this.basicSettings['sys_login_forgetpwd_msg']
    },
    reloadCaptcha() {
      this.captchaUniqueId = guid().replaceAll('-', '')
      this.captchaImg = '/api/auth/captcha/' + this.captchaUniqueId
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.loginForm.uniqueId = this.captchaUniqueId
      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          this.loading = true
          // 拷贝表单
          const cloneLoginForm = deepClone(this.loginForm)
          cloneLoginForm.password = encryptByRSA(cloneLoginForm.password)
          this.$store.dispatch('user/login', cloneLoginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getPhoneCaptcha() {
      // 对phone字段进行校验
      this.$refs['registerForm'].validateField(['phone'], errorMessage => {
        if (!errorMessage) {
          this.registerForm.uniqueId = guid().replaceAll('-', '')
          SmsProcessApi.sendVerificationCode(
            { uniqueId: this.registerForm.uniqueId, receiver: this.registerForm.phone, relevance: 'register' }
          ).then(res => {
            this.retryLoading = true
            this.retryTimer = setInterval(() => {
              this.retryCountDown -= 1
              if (this.retryCountDown === 0) {
                this.retryLoading = false
                if (this.retryTimer != null) clearInterval(this.retryTimer)
                this.retryCountDown = 60
                this.retryTimer = null
              }
            }, 1000)
          })
        }
      })
    },
    handleRegister() {
      this.$refs['registerForm'].validate(valid => {
        if (valid) {
          this.$store.dispatch('user/register', this.registerForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    forgetPwd() {
      const msg = this.loginBasicSettings.sysLoginForgetpwdMsg ? this.loginBasicSettings.sysLoginForgetpwdMsg : ''
      this.$alert(msg, '提示', {
        confirmButtonText: '确定',
        customClass: 'jy-message-box'
      })
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>
<style lang="scss">
  .forget-pwd {
    font-size: 14px;
  }
  .forget-pwd:hover {
    color: #00a4ff; /* Set the link color to blue when hovering over it */
    text-decoration: underline;
  }
</style>
<style lang="scss">

/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #fff;
$light_gray: #000;
$cursor: #000;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(230, 230, 230, 0.4);
    border-radius: 5px;
    color: #fff;
  }
}
</style>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #000;

.login-container {
  min-height: 100%;
  width: 100%;
  //background-color: $bg;
  //background-image: url("/bg.jpg");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}

.div_foot {
  position:fixed;
  bottom:0px;
  left:0px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  width: 100%;
}

</style>
