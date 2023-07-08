<template>
  <el-drawer
    :title="title"
    :visible.sync="tmpVisible"
    :wrapper-closable="false"
    direction="rtl"
    size="70%"
    class="jy-drawer"
  >
    <div>
      <el-table
        ref="table"
        v-loading="tableData.loading"
        element-loading-text="加载中，请稍后..."
        element-loading-spinner="el-icon-loading"
        :data="tableData.records"
        highlight-current-row
        style="width: 100%"
        empty-text="暂无数据"
        :header-cell-style="{background:'#F5F7FA', color: '#303133', fontWeight: 700}"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div style="margin: 10px">
              <el-card shadow="never">
                异常信息：{{ props.row.execStatus === 0 ? props.row.errorDesc : '暂无异常' }}
              </el-card>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="任务编号" align="center" show-overflow-tooltip />
        <el-table-column prop="name" label="任务名称" align="center" show-overflow-tooltip />
        <el-table-column prop="cronExpression" align="center" label="cron表达式" show-overflow-tooltip />
        <el-table-column prop="bean" label="任务类" align="center" show-overflow-tooltip />
        <el-table-column prop="method" label="任务方法" align="center" show-overflow-tooltip />
        <el-table-column prop="jobStatus" label="执行状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.execStatus === 1" size="mini" effect="plain" type="success"> 执行成功 </el-tag>
            <el-tag v-if="scope.row.execStatus === 0" size="mini" effect="plain" type="danger"> 执行失败 </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="execTime" label="耗时（ms）" align="center" show-overflow-tooltip />
        <el-table-column prop="isAlarm" label="是否告警" width="80" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isNotify === 1" size="mini" effect="plain" type="success"> 已告警 </el-tag>
            <el-tag v-if="scope.row.isNotify === 0" size="mini" effect="plain" type="danger"> 未告警 </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="principal" label="负责人" align="center" show-overflow-tooltip />
        <el-table-column prop="email" label="邮箱" align="center" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="150" align="center" />
      </el-table>

      <div style="text-align: center;margin-top: 10px">
        <el-pagination
          v-model="tableData.pageNumber"
          background
          layout="prev, pager, next"
          :page-size="tableData.pageSize"
          :hide-on-single-page="true"
          :total="tableData.total"
          @current-change="handleChangePage"
        />
      </div>
    </div>
  </el-drawer>
</template>

<script>
import api from '@/api/system/job/jy-quartz-log'
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
    return {
      tmpVisible: this.visible,
      tableData: {
        loading: false,
        pageNumber: 1,
        pageSize: 15,
        pages: 1,
        total: 1,
        records: [],
        hasPrevious: false,
        hasNext: false
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
      this.tableData.loading = true
      const queryForm = { jobId: id, pageNumber: this.tableData.pageNumber, pageSize: this.tableData.pageSize }
      api.getList(queryForm).then(response => {
        this.tableData = response
        this.tableData.loading = false
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '获取数据失败' })
        this.tableData.loading = false
      })
    },
    handleChangePage(page) {
      this.tableData.pageNumber = page
      this.getById(this.id)
    }
  }
}
</script>

<style scoped>

</style>
