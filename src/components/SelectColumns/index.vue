<template>
  <el-drawer
    :title="title"
    :visible.sync="tmpVisible"
    size="20%"
    :with-header="false"
    class="jy-drawer"
  >
    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
        empty-text="暂无数据"
        :header-cell-style="{background:'#F5F7FA', color: '#303133', fontWeight: 700}"
        border
      >
        <el-table-column type="index" align="center" width="80" label="序号" />
        <el-table-column prop="_showed" align="center" width="100" label="开关">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row._showed"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="true"
              :inactive-value="false"
              @change="changeStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="label" align="center" show-overflow-tooltip label="展示列" />
      </el-table>
    </div>
  </el-drawer>
</template>

<script>
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
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      initloading: false,
      tmpVisible: this.visible,
      tableData: [],
      form: {

      }
    }
  },
  watch: {
    visible(newVal) {
      this.tmpVisible = newVal
      this.tableData = this.columns
    },
    tmpVisible(newVal) {
      this.$emit('update:visible', newVal)
    },
    deep: true
  },
  methods: {
    changeStatus(row) {
      const count = this.tableData ? this.tableData.filter(item => item._showed === true).length : 0
      if (count === 0) {
        row._showed = true
        this.$notify.warning({ title: '警告', message: '至少有一个展示列' })
        return
      }
      this.$emit('update:columns', this.tableData)
    }
  }
}
</script>

<style scoped>

</style>
