<template>
  <div
    v-loading="deleteLoading"
    style="margin: 10px"
    element-loading-text="删除中，请稍后..."
    element-loading-spinner="el-icon-loading"
  >
    <el-card class="box-card" shadow="always">
      <el-form v-show="queryFormVisiable" :inline="true" :model="queryForm" size="mini" label-width="90px">
        <el-form-item label="原文件名：">
          <el-input v-model="queryForm.realName" placeholder="原文件名" />
        </el-form-item>
        <el-form-item label="文件后缀：">
          <el-input v-model="queryForm.suffix" placeholder="文件后缀" />
        </el-form-item>
        <el-form-item label="所属平台：">
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
        <span><i class="el-icon-caret-right" /> 附件列表</span>
        <el-row style="float: right">
          <el-button icon="el-icon-search" circle size="mini" @click="() => this.queryFormVisiable = !this.queryFormVisiable" />
          <el-button icon="el-icon-refresh" circle size="mini" @click="getList()" />
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
        <el-table-column v-if="checkColumnDisplayed('name', columnsData.columns)" prop="name" label="文件名" align="center" show-overflow-tooltip />
        <el-table-column v-if="checkColumnDisplayed('realName', columnsData.columns)" prop="realName" label="原文件名称" align="center" show-overflow-tooltip />
        <el-table-column v-if="checkColumnDisplayed('source', columnsData.columns)" prop="source" label="文件存储平台" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getNameByCode(storageTypeOptions, scope.row.source) }}
          </template>
        </el-table-column>
        <el-table-column v-if="checkColumnDisplayed('type', columnsData.columns)" prop="type" label="文件类型" align="center" show-overflow-tooltip />
        <el-table-column v-if="checkColumnDisplayed('suffix', columnsData.columns)" prop="suffix" label="文件后缀" align="center" show-overflow-tooltip />
        <el-table-column v-if="checkColumnDisplayed('relevance', columnsData.columns)" prop="relevance" label="业务标识" align="center" show-overflow-tooltip />
        <el-table-column v-if="checkColumnDisplayed('size', columnsData.columns)" prop="size" label="文件大小" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ (scope.row.size / 1024).toFixed(2) }} kb</span>
          </template>
        </el-table-column>
        <el-table-column v-if="checkColumnDisplayed('path', columnsData.columns)" prop="path" label="文件路径" align="center" show-overflow-tooltip />
        <el-table-column v-if="checkColumnDisplayed('relativePath', columnsData.columns)" prop="relativePath" label="相对路径" align="center" show-overflow-tooltip />
        <el-table-column v-if="checkColumnDisplayed('createTime', columnsData.columns)" prop="createTime" label="创建时间" width="180" align="center" />
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="download(scope.row)">下载</el-button>
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
    <select-columns :title="columnsData.title" :columns="columnsData.columns" :visible.sync="columnsData.visiable" />
  </div>
</template>

<script>
import api from '@/api/system/file/jy-file-record'
import processApi from '@/api/system/file/jy-file-process'
import SelectColumns from '@/components/SelectColumns'
export default {
  components: { SelectColumns },
  data() {
    return {
      deleteLoading: false,
      storageTypeOptions: [],
      queryFormVisiable: true,
      queryForm: {
        name: null,
        type: null,
        suffix: null,
        source: null,
        realName: null,
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
        id: null
      },
      selectData: {
        current: null,
        record: []
      },
      columnsData: {
        visiable: false,
        columns: [
          { key: 'name', label: '文件名', _showed: true },
          { key: 'realName', label: '原文件名称', _showed: true },
          { key: 'source', label: '文件存储平台', _showed: true },
          { key: 'type', label: '文件类型', _showed: true },
          { key: 'suffix', label: '文件后缀', _showed: true },
          { key: 'relevance', label: '业务标识', _showed: true },
          { key: 'size', label: '文件大小', _showed: true },
          { key: 'path', label: '文件路径', _showed: true },
          { key: 'relativePath', label: '相对路径', _showed: true },
          { key: 'createTime', label: '创建时间', _showed: true }
        ]
      }
    }
  },
  created() {
    this.getDictByCode('sys_file_storageType').then(res => {
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
      this.queryForm.realName = null
      this.queryForm.relevance = null
      this.queryForm.type = null
      this.queryForm.source = null
      this.queryForm.suffix = null
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
    download(data) {
      processApi.download(data.id)
        .then(response => {
          console.log(data)
          const filename = data.realName
          const url = window.URL.createObjectURL(new Blob([response.data], { type: data.type }))
          const obj = document.createElement('a')
          obj.style.display = 'none'
          obj.href = url
          obj.setAttribute('download', filename)
          document.body.appendChild(obj)
          obj.click()
          obj.remove()
        }).catch(function(error) {
          console.error(error)
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
