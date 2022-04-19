<template>
  <div style="margin: 10px">
    <el-card class="box-card" shadow="never">
      <el-form :inline="true" :model="queryForm" label-width="100px">
        <el-form-item label="标签名称：">
          <el-input v-model="queryForm.name" placeholder="标签名称" />
        </el-form-item>
        <el-form-item label="标签编码：">
          <el-input v-model="queryForm.code" placeholder="标签编码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查 询</el-button>
          <el-button type="info" icon="el-icon-circle-close" @click="handleReset">重 置</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" icon="el-icon-view" @click="handleShow">查 看</el-button>
          <el-button type="success" icon="el-icon-plus" @click="handleCreate">新 增</el-button>
          <el-button type="warning" icon="el-icon-edit-outline" @click="handleUpdate">修 改</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="handleRemove">删 除</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card" shadow="never" style="margin-top: 5px">
      <el-table
        ref="table"
        :data="tableData.records"
        border
        highlight-current-row
        style="width: 100%"
        empty-text="暂无数据"
        :header-cell-style="{background:'#FAFAFA'}"
        @row-click="handleTableRowClick"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="name" label="标签名称" />
        <el-table-column prop="code" label="标签编码" />
        <el-table-column prop="intro" label="标签简介" width="800" />
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

    <jy-tag-form :id="editData.id" :title="editData.title" :visible.sync="editData.visiable" />
    <jy-tag-detail :id="showData.id" :title="showData.title" :visible.sync="showData.visiable" />
  </div>
</template>

<script>
import jyTagApi from '@/api/jy-tag'
import JyTagForm from '@/views/jy-blog/tag/tag-form'
import JyTagDetail from '@/views/jy-blog/tag/tag-detail'
export default {
  name: 'JyTag',
  components: { JyTagDetail, JyTagForm },
  data() {
    return {
      queryForm: {
        name: '',
        code: ''
      },
      tableData: {
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
      const queryForm = { ...this.queryForm, pageNumber: this.tableData.pageNumber, pageSize: this.tableData.pageSize }
      jyTagApi.getList(queryForm).then(response => {
        this.tableData = response
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
      this.showData.title = '查看标签'
      this.showData.id = this.selectData.current.id
      this.showData.visiable = true
    },
    handleCreate() {
      this.editData.title = '新增标签'
      this.editData.id = null
      this.editData.visiable = true
    },
    handleUpdate() {
      if (!this.selectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.editData.title = '修改标签'
      this.editData.id = this.selectData.current.id
      this.editData.visiable = true
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
        type: 'warning'
      }).then(() => {
        const ids = []
        for (let i = 0; i < this.$refs.table.selection.length; i++) ids.push(this.$refs.table.selection[i].id)
        jyTagApi.remove(ids).then(response => {
          this.getList()
          this.$notify.success({ title: '成功', message: '删除成功' })
        }).catch(e => {
          this.$notify.error({ title: '失败', message: '删除失败' })
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
<style scoped>

</style>
