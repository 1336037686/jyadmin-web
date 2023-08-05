<template>
  <div
    v-loading="deleteLoading"
    style="margin: 10px"
    element-loading-text="删除中，请稍后..."
    element-loading-spinner="el-icon-loading"
  >
    <el-card class="box-card" shadow="always">
      <el-form v-show="queryFormVisiable" :inline="true" :model="queryForm" label-width="100px">
        <el-form-item label="操作用户：">
          <el-input v-model="queryForm.username" placeholder="操作用户" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查 询</el-button>
          <el-button type="info" icon="el-icon-circle-close" @click="handleReset">重 置</el-button>
        </el-form-item>
      </el-form>

      <div style="margin-top: 5px">
        <el-button type="primary" icon="el-icon-view" @click="handleShow">查 看</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleRemove">删 除</el-button>
      </div>
    </el-card>

    <el-card class="box-card" shadow="always" style="margin-top: 5px">
      <div slot="header" class="clearfix">
        <span><i class="el-icon-caret-right" /> 登录日志列表</span>
        <el-row style="float: right">
          <el-button icon="el-icon-search" circle size="mini" @click="() => this.queryFormVisiable = !this.queryFormVisiable" />
          <el-button icon="el-icon-refresh" circle size="mini" @click="getList()" />
        </el-row>
      </div>
      <el-table
        ref="table"
        v-loading="loading"
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
        <el-table-column prop="username" label="操作用户" align="center" show-overflow-tooltip />
        <el-table-column prop="handleName" label="操作名称" align="center" show-overflow-tooltip />
        <el-table-column prop="handleDesc" label="操作描述" align="center" show-overflow-tooltip />
        <el-table-column prop="ipAddress" label="IP地址" align="center" show-overflow-tooltip />
        <el-table-column prop="ipArea" label="所属地区" align="center" show-overflow-tooltip />
        <el-table-column prop="browser" label="浏览器" align="center" />
        <el-table-column prop="application" label="设备" align="center" />
        <el-table-column prop="executeTime" label="耗时(ms)" align="center" width="100" />
        <el-table-column prop="requestTime" label="请求时间" align="center" show-overflow-tooltip />
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
    <jy-log-detail :id="showData.id" :title="showData.title" :visible.sync="showData.visiable" />
  </div>
</template>

<script>
import logApi from '@/api/monitor/log/jy-log'
import JyLogDetail from '@/views/monitor/log/login-log/log-detail'

export default {
  components: { JyLogDetail },
  data() {
    return {
      queryFormVisiable: true,
      deleteLoading: false,
      queryForm: {
        username: '',
        handleName: ''
      },
      loading: false,
      tableData: {
        pageNumber: 1,
        pageSize: 10,
        pages: 1,
        total: 1,
        records: [],
        hasPrevious: false,
        hasNext: false
      },
      showData: {
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
      this.loading = true
      const queryForm = { ...this.queryForm, pageNumber: this.tableData.pageNumber, pageSize: this.tableData.pageSize }
      logApi.getLoginList(queryForm).then(response => {
        this.tableData = response
        this.loading = false
      })
    },
    handleQuery() {
      this.tableData.pageNumber = 1
      this.getList()
    },
    handleReset() {
      this.queryForm.handleName = ''
      this.queryForm.username = ''
      this.tableData.pageNumber = 1
      this.getList()
    },
    handleShow() {
      if (!this.selectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.showData.title = '查看日志'
      this.showData.id = this.selectData.current.id
      this.showData.visiable = true
    },
    handleRemove() {
      const selectRows = this.$refs.table.selection
      if (!selectRows || selectRows.length === 0) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
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
        logApi.remove(ids).then(response => {
          this.deleteLoading = false
          this.getList()
          this.$notify.success({ title: '成功', message: '删除成功' })
        }).catch(e => {
          this.deleteLoading = false
        })
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
<style lang="scss" scoped>
</style>
