<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="历史行为" name="timeline">
                <timeline :user="user" />
              </el-tab-pane>
              <el-tab-pane label="账号信息" name="account">
                <account :user="user" />
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="password">
                <password :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Timeline from './components/Timeline'
import Account from './components/Account'
import userApi from '@/api/system/user/jy-user'
import Password from '@/views/system/profile/components/Password'

export default {
  name: 'Profile',
  components: { Password, UserCard, Timeline, Account },
  data() {
    return {
      user: {
        id: null,
        username: null,
        nickname: null,
        avatar: null,
        phone: null,
        type: null,
        departmentName: null,
        postName: null,
        createTime: null,
        roleNames: []
      },
      activeTab: 'timeline'
    }
  },
  computed: {
    ...mapGetters([
      'id'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      userApi.getById(this.id).then(res => {
        this.user = res.data
      })
    }
  }
}
</script>
