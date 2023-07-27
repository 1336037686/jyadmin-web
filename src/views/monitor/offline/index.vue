<template>
  <div
    v-loading="deleteLoading"
    style="margin: 10px;"
    element-loading-text="删除中，请稍后..."
    element-loading-spinner="el-icon-loading"
  >
    <el-card class="box-card" shadow="always">
      <el-form :inline="true" :model="queryForm" label-width="100px">
        <el-form-item label="用户名：">
          <el-input v-model="queryForm.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查 询</el-button>
          <el-button type="info" icon="el-icon-circle-close" @click="handleReset">重 置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card" shadow="always" style="margin-top: 5px">
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
      >
        <el-table-column type="index" width="120" label="序号" align="center" />
        <el-table-column prop="username" label="登录用户" />
        <el-table-column prop="ipAddress" label="IP地址" />
        <el-table-column prop="ipArea" label="归属地" />
        <el-table-column prop="browser" label="浏览器" />
        <el-table-column prop="createTime" label="登陆时间" />
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" icon="el-icon-delete-solid" @click="handleRemove(scope.row.username)">强制退出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

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
  </div>
</template>

<script>
import jyOfflineApi from '@/api/monitor/offline/jy-offline'
export default {
  data() {
    return {
      deleteLoading: false,
      queryForm: {
        username: ''
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
      jyOfflineApi.getList(queryForm).then(response => {
        this.tableData = response
        this.loading = false
      })
    },
    handleQuery() {
      this.tableData.pageNumber = 1
      this.getList()
    },
    handleReset() {
      this.queryForm.username = ''
      this.tableData.pageNumber = 1
      this.getList()
    },
    handleRemove(username) {
      this.$confirm('此操作将强制退出该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'jy-message-box'
      }).then(() => {
        this.deleteLoading = true
        jyOfflineApi.forcedOffline(username).then(response => {
          this.getList()
          this.deleteLoading = false
          this.$notify.success({ title: '成功', message: '强退成功' })
        }).catch(e => {
          this.deleteLoading = false
        })
      })
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
