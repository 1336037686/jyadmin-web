<template>
  <el-dialog
    :title="title"
    :visible.sync="tmpVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    width="40%"
    class="jy-dialog"
  >
    <div
      v-loading="initloading"
      element-loading-text="加载中，请稍后..."
      element-loading-spinner="el-icon-loading"
    >
      <div>
        <el-form :inline="true" size="mini" :model="queryForm" label-width="80px">
          <el-form-item label="表名称：">
            <el-input v-model="queryForm.tableName" placeholder="表名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">查 询</el-button>
            <el-button type="info" icon="el-icon-circle-close" @click="handleReset">重 置</el-button>
          </el-form-item>
        </el-form>
      </div>
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
          <!--          <el-table-column type="selection" width="55" align="center" />-->
          <el-table-column type="index" width="100" label="序号" align="center" />
          <el-table-column prop="tableName" label="表名" align="center" show-overflow-tooltip />
          <el-table-column prop="tableRemark" label="备注" align="center" show-overflow-tooltip />
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleImport(scope.$index, scope.row)"
              >导入</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetForm('form')">取 消</el-button>
      <!--      <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>-->
    </span>
  </el-dialog>
</template>

<script>
import codeGenApi from '@/api/tools/code-generate/code-generate'
export default {
  props: {
    title: {
      type: String,
      default: 'Demo'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      initloading: false,
      tmpVisible: this.visible,
      queryForm: {
        tableName: ''
      },
      tableData: {
        loading: false,
        pageNumber: 1,
        pageSize: 8,
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
        this.getTableOptions()
      }
    },
    tmpVisible(newVal) {
      this.$emit('update:visible', newVal)
    },
    deep: true
  },
  methods: {
    getTableOptions() {
      this.tableData.loading = true
      const queryForm = { ...this.queryForm, pageNumber: this.tableData.pageNumber, pageSize: this.tableData.pageSize }
      codeGenApi.getTableOptions(queryForm).then(response => {
        this.tableData.loading = false
        this.tableData = response
      })
    },
    handleQuery() {
      this.tableData.pageNumber = 1
      this.getTableOptions()
    },
    handleReset() {
      this.queryForm.tableName = ''
      this.tableData.pageNumber = 1
      this.getTableOptions()
    },
    handleChangePage(page) {
      this.tableData.pageNumber = page
      this.getTableOptions()
    },
    handleImport(index, data) {
      this.tableData.loading = true
      codeGenApi.importTable(data.tableName).then(res => {
        this.tableData.loading = false
        this.$notify.success({ title: '成功', message: '导入成功' })
        this.$parent.getList()
        this.tmpVisible = false
      }).catch(e => {
        this.tableData.loading = false
      })
    },
    resetForm(formName) {
      this.tmpVisible = false
    }
  }
}
</script>

<style scoped>

</style>
