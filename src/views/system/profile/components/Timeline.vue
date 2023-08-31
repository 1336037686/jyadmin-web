<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card shadow="never">
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import logApi from '@/api/monitor/log/jy-log'
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
    return {
      timeline: []
    }
  },
  watch: {
    user: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.getUserLoginList()
        }
      },
      // 开启深度监听
      deep: true
    }
  },
  methods: {
    getUserLoginList() {
      this.timeline = []
      logApi.getUserLoginList(this.user.id, { pageNumber: 1, pageSize: 4 }).then(res => {
        if (res.records && res.records.length > 0) {
          for (let i = 0; i < res.records.length; i++) {
            this.timeline.push({
              timestamp: res.records[i].requestTime,
              title: res.records[i].handleName,
              content: 'IP地址：' + res.records[i].ipAddress + '，IP区域：' + res.records[i].ipArea + '，客户端：' + res.records[i].browser
            })
          }
        }
      })
    }
  }
}
</script>
