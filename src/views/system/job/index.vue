<template>
  <div
    v-loading="deleteLoading"
    style="margin: 10px"
    element-loading-text="删除中，请稍后..."
    element-loading-spinner="el-icon-loading"
  >
    <el-card class="box-card" shadow="always">
      <el-form v-show="queryFormVisiable" :inline="true" :model="queryForm" size="mini" label-width="100px">
        <el-form-item label="任务编号：">
          <el-input v-model="queryForm.code" placeholder="任务编号" />
        </el-form-item>
        <el-form-item label="任务名称：">
          <el-input v-model="queryForm.name" placeholder="任务名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查 询</el-button>
          <el-button type="info" icon="el-icon-circle-close" @click="handleReset">重 置</el-button>
        </el-form-item>
      </el-form>

      <div style="margin-top: 5px">
        <el-button type="primary" size="mini" icon="el-icon-view" @click="handleShow">查 看</el-button>
        <el-button type="success" size="mini" icon="el-icon-plus" @click="handleCreate">新 增</el-button>
        <el-button type="warning" size="mini" icon="el-icon-edit-outline" @click="handleUpdate">修 改</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleRemove">删 除</el-button>
      </div>
    </el-card>

    <el-card class="box-card" shadow="always " style="margin-top: 5px">
      <div slot="header" class="clearfix">
        <span style="line-height: 30px"><i class="el-icon-caret-right" /> 任务列表</span>
        <el-row style="float: right">
          <el-button icon="el-icon-search" circle size="mini" @click="() => this.queryFormVisiable = !this.queryFormVisiable" />
          <el-button icon="el-icon-refresh" circle size="mini" @click="getList()" />
        </el-row>
      </div>
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
        @row-click="handleTableRowClick"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" width="55" label="序号" align="center" />
        <el-table-column prop="code" label="任务编号" align="center" show-overflow-tooltip />
        <el-table-column prop="name" label="任务名称" align="center" show-overflow-tooltip />
        <el-table-column prop="cronExpression" align="center" label="cron表达式" show-overflow-tooltip />
        <el-table-column prop="bean" label="定时任务类" align="center" show-overflow-tooltip />
        <el-table-column prop="method" label="定时任务方法" align="center" show-overflow-tooltip />
        <el-table-column prop="jobStatus" label="任务状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.jobStatus === 1" size="mini" effect="plain" type="success"> 执 行 </el-tag>
            <el-tag v-if="scope.row.jobStatus === 0" size="mini" effect="plain" type="danger"> 暂 停 </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="runStatus" label="执行情况" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.runStatus === 1" size="mini" effect="plain" type="danger"> 运行异常 </el-tag>
            <el-tag v-if="scope.row.runStatus === 0" size="mini" effect="plain" type="success"> 运行正常 </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isAlarm" label="异常告警" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isAlarm === 1" size="mini" effect="plain" type="success"> 启 用 </el-tag>
            <el-tag v-if="scope.row.isAlarm === 0" size="mini" effect="plain" type="danger"> 禁 止 </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="principal" label="负责人" align="center" show-overflow-tooltip />
        <el-table-column prop="email" label="邮箱" align="center" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="150" align="center" />
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" :disabled="scope.row.jobStatus === 1" :loading="scope.row.jobStatusStartLoading" @click="handleUpdateJobStatus(scope.row, 1)">启用</el-button>
            <el-button type="text" :disabled="scope.row.jobStatus === 0" :loading="scope.row.jobStatusStopLoading" @click="handleUpdateJobStatus(scope.row, 0)">暂停</el-button>
            <el-button type="text" @click="handleShowLog(scope.row.id)">查看日志</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 10px">
        <el-pagination
          v-model="tableData.pageNumber"
          background
          layout="total, prev, pager, next"
          :page-size="tableData.pageSize"
          :hide-on-single-page="true"
          :total="tableData.total"
          @current-change="handleChangePage"
        />
      </div>
    </el-card>
    <job-form :id="editData.id" :title="editData.title" :visible.sync="editData.visiable" />
    <job-detail :id="showData.id" :title="showData.title" :visible.sync="showData.visiable" />
    <job-log :id="showLogData.id" :title="showLogData.title" :visible.sync="showLogData.visiable" />
  </div>
</template>

<script>
import quartzJobApi from '@/api/system/job/jy-quartz-job'
import JobDetail from '@/views/system/job/job-detail'
import JobForm from '@/views/system/job/job-form'
import JobLog from '@/views/system/job/job-log' // 权限判断指令
export default {
  components: { JobLog, JobForm, JobDetail },
  data() {
    return {
      queryFormVisiable: true,
      deleteLoading: false,
      queryForm: {
        username: '',
        nickname: '',
        phone: ''
      },
      tableData: {
        loading: false,
        pageNumber: 1,
        pageSize: 10,
        pages: 1,
        total: 1,
        records: [],
        hasPrevious: false,
        hasNext: false
      },
      editData: {
        visiable: false,
        title: '',
        id: null
      },
      showData: {
        visiable: false,
        title: '',
        id: null
      },
      showLogData: {
        visiable: false,
        title: '',
        id: null
      },
      selectData: {
        current: null,
        record: []
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableData.loading = true
      const queryForm = { ...this.queryForm, pageNumber: this.tableData.pageNumber, pageSize: this.tableData.pageSize }
      quartzJobApi.getList(queryForm).then(response => {
        this.tableData.loading = false
        this.tableData = response
        for (let i = 0; i < this.tableData.records.length; i++) {
          this.tableData.records[i].jobStatusStartLoading = false
          this.tableData.records[i].jobStatusStopLoading = false
        }
      })
    },
    handleQuery() {
      this.tableData.pageNumber = 1
      this.getList()
    },
    handleReset() {
      this.queryForm.name = ''
      this.queryForm.code = ''
      this.tableData.pageNumber = 1
      this.getList()
    },
    handleShow() {
      if (!this.selectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.showData.title = '查看任务'
      this.showData.id = this.selectData.current.id
      this.showData.visiable = true
    },
    handleShowLog(id) {
      this.showLogData.title = '查看日志'
      this.showLogData.id = id
      this.showLogData.visiable = true
    },
    handleCreate() {
      this.editData.title = '新增任务'
      this.editData.id = null
      this.editData.visiable = true
    },
    handleUpdate() {
      if (!this.selectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      if (this.selectData.current.jobStatus === 1) {
        this.$notify.warning({ title: '警告', message: '请先暂停任务在进行修改' })
        return
      }
      this.editData.title = '修改任务'
      this.editData.id = this.selectData.current.id
      this.editData.visiable = true
    },
    handleRemove() {
      const selectRows = this.$refs.table.selection
      if (!selectRows || selectRows.length === 0) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      for (let i = 0; i < this.$refs.table.selection.length; i++) {
        if (this.$refs.table.selection[i].jobStatus === 1) {
          this.$notify.warning({ title: '警告', message: '存在未暂停任务，请先暂停任务在进行删除' })
          return
        }
      }

      this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'jy-message-box'
      }).then(() => {
        const ids = []
        for (let i = 0; i < this.$refs.table.selection.length; i++) ids.push(this.$refs.table.selection[i].id)
        this.deleteLoading = true
        quartzJobApi.remove(ids).then(response => {
          this.deleteLoading = false
          this.getList()
          this.$notify.success({ title: '成功', message: '删除成功' })
        }).catch(e => {
          this.deleteLoading = false
        })
      })
    },
    handleUpdateJobStatus(row, jobStatus) {
      const id = row.id
      if (jobStatus === 0) row.jobStatusStopLoading = true
      else row.jobStatusStartLoading = true

      quartzJobApi.updateJobStatus({ id, jobStatus }).then(res => {
        this.$notify.success({ title: '成功', message: (jobStatus === 0 ? '暂停' : '启动') + '成功' })
        if (jobStatus === 0) row.jobStatusStopLoading = false
        else row.jobStatusStartLoading = false
        // 重新加载数据
        this.getList()
      }).catch(e => {
        this.$notify.error({ title: '失败', message: (jobStatus === 0 ? '暂停' : '启动') + '失败' })
        if (jobStatus === 0) row.jobStatusStopLoading = false
        else row.jobStatusStartLoading = false
      })
    },
    handleTableRowClick(row, column, event) {
      this.selectData.current = row
      this.$refs.table.toggleRowSelection(row)
    },
    handleChangePage(page) {
      this.tableData.pageNumber = page
      this.getList()
    }
  }
}
</script>
<style scoped>

</style>
