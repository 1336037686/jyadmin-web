<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          createTime: null,
          id: null,
          username: null,
          nickname: null,
          avatar: null,
          phone: null,
          type: null
        }
      }
    }
  },
  data() {
    return {
      timeline: [
        {
          timestamp: '2019/4/20',
          title: '系统认证：用户登录',
          content: 'IP地址：xxxxxxx，IP区域：xxxxxxx，客户端：xxxxxxx'
        }
      ]
    }
  }
}
</script>
