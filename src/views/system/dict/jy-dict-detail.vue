<template>
  <el-dialog
    :title="title"
    :visible.sync="tmpVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    width="30%"
  >
    <div>
      <el-descriptions :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            字典名称
          </template>
          {{ form.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            字典编码
          </template>
          {{ form.code }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            字典类型
          </template>
          {{ form.dictType }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            父字典值
          </template>
          {{ form.parentName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            字典排序
          </template>
          {{ form.sort }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="tmpVisible = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dictApi from '@/api/jy-dict'
export default {
  name: 'JyDictDetail',
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
    return {
      tmpVisible: this.visible,
      form: {
        id: '',
        name: '',
        code: '',
        status: '',
        sort: '',
        description: ''
      }
    }
  },
  watch: {
    visible(newVal) {
      this.tmpVisible = newVal
      if (newVal) {
        this.getById(this.id)
      }
    },
    tmpVisible(newVal) {
      this.$emit('update:visible', newVal)
    },
    deep: true
  },
  methods: {
    getById(id) {
      dictApi.getById(id).then(response => {
        this.form = response.data
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '获取数据失败' })
      })
    }
  }
}
</script>

<style scoped>

</style>
