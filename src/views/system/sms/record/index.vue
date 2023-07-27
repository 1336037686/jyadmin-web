<template>
  <div
    v-loading="deleteLoading"
    element-loading-text="删除中，请稍后..."
    element-loading-spinner="el-icon-loading"
  >
    <el-card class="box-card" shadow="always">
      <el-form v-show="queryFormVisiable" :inline="true" :model="queryForm" size="mini" label-width="90px">
        <el-form-item label="接收人：">
          <el-input v-model="queryForm.phone" placeholder="接收人" />
        </el-form-item>
        <el-form-item label="发送平台：">
          <el-input v-model="queryForm.source" placeholder="所属平台" />
        </el-form-item>
        <el-form-item label="业务标识：">
          <el-input v-model="queryForm.relevance" placeholder="业务标识" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查 询</el-button>
          <el-button type="info" icon="el-icon-circle-close" @click="handleReset">重 置</el-button>
        </el-form-item>
      </el-form>

      <div style="margin-top: 5px">
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleRemove">删 除</el-button>
      </div>
    </el-card>

    <el-card class="box-card" shadow="always " style="margin-top: 5px">
      <div slot="header" class="clearfix">
        <span><i class="el-icon-caret-right" /> 短信发送记录</span>
        <el-row style="float: right">
          <el-button icon="el-icon-search" circle size="mini" @click="() => this.queryFormVisiable = !this.queryFormVisiable" />
          <el-button icon="el-icon-refresh" circle size="mini" @click="handleQuery()" />
          <el-button icon="el-icon-s-grid" circle size="mini" @click="selectColumns()" />
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
        <el-table-column v-if="checkColumnDisplayed('phone', columnsData.columns)" prop="phone" label="接收人" align="center" show-overflow-tooltip />
        <el-table-column v-if="checkColumnDisplayed('source', columnsData.columns)" prop="source" label="发送平台" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getNameByCode(storageTypeOptions, scope.row.source) }}
          </template>
        </el-table-column>
        <el-table-column v-if="checkColumnDisplayed('relevance', columnsData.columns)" prop="relevance" label="业务标识" align="center" show-overflow-tooltip />
        <el-table-column v-if="checkColumnDisplayed('content', columnsData.columns)" prop="content" label="短信内容" width="500" align="center" show-overflow-tooltip />
        <el-table-column v-if="checkColumnDisplayed('createTime', columnsData.columns)" prop="createTime" label="创建时间" align="center" />
        <!--        <el-table-column label="操作" width="120" align="center">-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-button type="text" @click="preview(scope.row)">查看</el-button>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
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
    <select-columns :title="columnsData.title" :columns="columnsData.columns" :visible.sync="columnsData.visiable" />

    <!--    <el-drawer-->
    <!--      :title="showData.title"-->
    <!--      :visible.sync="showData.visiable"-->
    <!--      :before-close="handleDrawerClose">-->
    <!--      <div v-html="showData.data.body" style="margin: 20px"></div>-->
    <!--    </el-drawer>-->
  </div>
</template>

<script>
import api from '@/api/system/sms/jy-sms-record'
import SelectColumns from '@/components/SelectColumns'
export default {
  components: { SelectColumns },
  data() {
    return {
      deleteLoading: false,
      storageTypeOptions: [],
      queryFormVisiable: true,
      queryForm: {
        phone: null,
        source: null,
        relevance: null
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
      showData: {
        visiable: false,
        title: '',
        data: {
          body: null
        }
      },
      selectData: {
        current: null,
        record: []
      },
      columnsData: {
        visiable: false,
        columns: [
          { key: 'phone', label: '接收人', _showed: true },
          { key: 'source', label: '发送平台', _showed: true },
          { key: 'relevance', label: '业务标识', _showed: true },
          { key: 'content', label: '短信内容', _showed: true },
          { key: 'createTime', label: '创建时间', _showed: true }
        ]
      }
    }
  },
  created() {
    this.getDictByCode('sys_sms_platform').then(res => {
      this.storageTypeOptions = res.data
    })
    this.getList()
  },
  methods: {
    getList() {
      this.tableData.loading = true
      const queryForm = { ...this.queryForm, pageNumber: this.tableData.pageNumber, pageSize: this.tableData.pageSize }
      api.getList(queryForm).then(response => {
        this.tableData.loading = false
        this.tableData = response
      })
    },
    selectColumns() {
      this.columnsData.visiable = true
    },
    handleQuery() {
      this.tableData.pageNumber = 1
      this.getList()
    },
    handleReset() {
      this.queryForm.phone = null
      this.queryForm.relevance = null
      this.queryForm.source = null
      this.tableData.pageNumber = 1
      this.getList()
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
        api.remove(ids).then(response => {
          this.deleteLoading = false
          this.getList()
          this.$notify.success({ title: '成功', message: '删除成功' })
        }).catch(e => {
          this.deleteLoading = false
        })
      })
    },
    preview(data) {
      this.showData.visiable = true
      this.showData.data = data
      this.showData.title = data.subject
    },
    handleDrawerClose(done) {
      this.showData.title = null
      this.showData.data = {
        body: null
      }
      done()
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
