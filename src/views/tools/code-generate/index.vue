<template>
  <div
    v-loading="deleteLoading"
    style="margin: 10px"
    element-loading-text="删除中，请稍后..."
    element-loading-spinner="el-icon-loading"
  >
    <el-card class="box-card" shadow="always">
      <el-form v-show="queryFormVisiable" :inline="true" size="mini" :model="queryForm" label-width="100px">
        <el-form-item label="数据表名称：">
          <el-input v-model="queryForm.tableName" placeholder="数据表名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查 询</el-button>
          <el-button type="info" icon="el-icon-circle-close" @click="handleReset">重 置</el-button>
        </el-form-item>
      </el-form>
      <div style="margin-top: 5px">
        <el-button type="primary" icon="el-icon-view" size="mini" @click="handleShow">查 看</el-button>
        <el-button type="success" icon="el-icon-plus" size="mini" @click="handleCreate">导 入</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleRemove">删 除</el-button>
      </div>
    </el-card>

    <el-card class="box-card" shadow="always" style="margin-top: 5px">
      <div slot="header" class="clearfix">
        <span><i class="el-icon-caret-right" /> 数据库表记录</span>
        <el-row style="float: right">
          <el-button icon="el-icon-search" circle size="mini" @click="() => this.queryFormVisiable = !this.queryFormVisiable" />
          <el-button icon="el-icon-refresh" circle size="mini" @click="handleQuery()" />
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
        <el-table-column type="index" width="80" label="序号" align="center" />
        <el-table-column prop="tableName" label="表名" align="center" show-overflow-tooltip />
        <el-table-column prop="tableRemark" label="备注" align="center" show-overflow-tooltip />
        <el-table-column prop="tableEngine" label="存储引擎" width="180" align="center" show-overflow-tooltip />
        <el-table-column prop="tableCharset" label="字符集" width="180" align="center" show-overflow-tooltip />
        <el-table-column prop="tableOrder" label="排序方式" width="180" align="center" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="200" align="center" show-overflow-tooltip />
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleSync(scope.$index, scope.row)"
            >同步</el-button>
            <el-button
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              @click="handlePreview(scope.$index, scope.row)"
            >预览</el-button>
            <el-button
              type="text"
              @click="handleDownload(scope.$index, scope.row)"
            >下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

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

    <code-generate-form :title="importData.title" :visible.sync="importData.visiable" />
    <code-generate-edit :id="editData.id" :title="editData.title" :visible.sync="editData.visiable" />
    <code-generate-preview :id="previewData.id" :title="previewData.title" :visible.sync="previewData.visiable" />
    <code-generate-detail :id="showData.id" :title="showData.title" :visible.sync="showData.visiable" />
  </div>
</template>

<script>
import codeGenApi from '@/api/tools/code-generate/code-generate'
import CodeGenerateForm from '@/views/tools/code-generate/code-generate-form.vue'
import CodeGenerateDetail from '@/views/tools/code-generate/code-generate-detail'
import CodeGenerateEdit from '@/views/tools/code-generate/code-generate-edit'
import CodeGeneratePreview from '@/views/tools/code-generate/code-generate-preview'
export default {
  components: { CodeGeneratePreview, CodeGenerateDetail, CodeGenerateForm, CodeGenerateEdit },
  data() {
    return {
      queryFormVisiable: true,
      deleteLoading: false,
      queryForm: {
        tableName: ''
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
      importData: {
        visiable: false,
        title: ''
      },
      editData: {
        visiable: false,
        title: '',
        id: null
      },
      previewData: {
        visiable: false,
        title: '',
        id: null
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
      this.tableData.loading = true
      const queryForm = { ...this.queryForm, pageNumber: this.tableData.pageNumber, pageSize: this.tableData.pageSize }
      codeGenApi.getList(queryForm).then(response => {
        this.tableData.loading = false
        this.tableData = response
      }).catch(e => {
        this.tableData.loading = false
      })
    },
    handleQuery() {
      this.tableData.pageNumber = 1
      this.getList()
    },
    handleReset() {
      this.queryForm.tableName = ''
      this.tableData.pageNumber = 1
      this.getList()
    },
    handleShow() {
      if (!this.selectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.showData.title = '查看'
      this.showData.id = this.selectData.current.id
      this.showData.visiable = true
    },
    handleCreate() {
      this.importData.title = '导入'
      this.importData.id = null
      this.importData.visiable = true
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
        codeGenApi.remove(ids).then(response => {
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
    },
    handleSync(index, data) {
      this.tableData.loading = true
      codeGenApi.tableSync(data.id).then(res => {
        this.tableData.loading = false
        this.$notify.success({ title: '成功', message: '同步成功' })
        this.getList()
      }).catch(e => {
        this.tableData.loading = false
        this.getList()
      })
    },
    handleEdit(index, data) {
      this.editData.title = '编辑'
      this.editData.id = data.id
      this.editData.visiable = true
    },
    handlePreview(index, data) {
      this.previewData.title = '预览'
      this.previewData.id = data.id
      this.previewData.visiable = true
    },
    handleDownload(index, data) {
      codeGenApi.download(data.id).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'code-generate.zip') // 设置下载文件的文件名
        document.body.appendChild(link)
        link.click()
        link.remove() // 下载完成后移除该元素
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '下载失败' })
        this.getList()
      })
    }
  }
}
</script>

<style scoped>

</style>
