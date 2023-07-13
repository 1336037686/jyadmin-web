<template>
  <div
    v-loading="deleteLoading"
    style="margin: 10px;"
    element-loading-text="删除中，请稍后..."
    element-loading-spinner="el-icon-loading"
  >
    <el-card class="jy-card-query" shadow="never">
      <el-form v-show="queryFormVisiable" :inline="true" :model="queryForm" label-width="100px" size="mini">
        <el-form-item label="部门名称：">
          <el-input v-model="queryForm.name" placeholder="部门名称" />
        </el-form-item>
        <el-form-item label="部门编码：">
          <el-input v-model="queryForm.code" placeholder="部门编码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查 询</el-button>
          <el-button type="info" icon="el-icon-circle-close" @click="handleReset">重 置</el-button>
        </el-form-item>
      </el-form>

      <div style="margin-top: 5px">
        <el-button v-permission="['department:show']" type="primary" size="mini" icon="el-icon-view" @click="handleShow">查 看</el-button>
        <el-button v-permission="['department:add']" type="success" size="mini" icon="el-icon-plus" @click="handleCreate">新 增</el-button>
        <el-button v-permission="['department:update']" type="warning" size="mini" icon="el-icon-edit-outline" @click="handleUpdate">修 改</el-button>
        <el-button v-permission="['department:delete']" type="danger" size="mini" icon="el-icon-delete" @click="handleRemove">删 除</el-button>
      </div>
    </el-card>

    <el-row style="margin-top: 10px">
      <el-col :span="24">
        <el-card class="jy-card-content" shadow="never">
          <div slot="header" class="clearfix">
            <span>部门列表</span>
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
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            row-key="id"
            highlight-current-row
            style="width: 100%"
            empty-text="暂无数据"
            :header-cell-style="{background:'#F5F7FA', color: '#303133', fontWeight: 700}"
            @row-click="handleTableRowClick"
            @select="handleTableRowSelect"
          >
            <el-table-column type="selection" width="60" align="center" />
            <el-table-column v-if="checkColumnDisplayed('name', columnsData.columns)" prop="name" label="部门名称" :show-overflow-tooltip="true" />
            <el-table-column v-if="checkColumnDisplayed('code', columnsData.columns)" prop="code" label="部门编码" align="center" :show-overflow-tooltip="true" />
            <el-table-column v-if="checkColumnDisplayed('status', columnsData.columns)" prop="status" label="状态" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 1" size="mini" effect="plain" type="success"> <i class="el-icon-success" /> 启 用</el-tag>
                <el-tag v-if="scope.row.status === 0" size="mini" effect="plain" type="danger"> <i class="el-icon-error" /> 禁 用</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="checkColumnDisplayed('sort', columnsData.columns)" prop="sort" label="排序" align="center" :show-overflow-tooltip="true" />
            <el-table-column v-if="checkColumnDisplayed('createTime', columnsData.columns)" prop="createTime" label="创建时间" align="center" :show-overflow-tooltip="true" />
            <el-table-column v-if="checkColumnDisplayed('description', columnsData.columns)" prop="description" label="描述" align="center" width="350" :show-overflow-tooltip="true" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <dept-form :id="editData.id" :title="editData.title" :visible.sync="editData.visiable" />
    <dept-detail :id="showData.id" :title="showData.title" :visible.sync="showData.visiable" />
    <select-columns :title="columnsData.title" :columns="columnsData.columns" :visible.sync="columnsData.visiable" />
  </div>
</template>

<script>
import deptApi from '@/api/system/department/jy-department'
import DeptForm from '@/views/system/department/dept-form'
import DeptDetail from '@/views/system/department/dept-detail'
import SelectColumns from '@/components/SelectColumns'
export default {
  components: { DeptDetail, DeptForm, SelectColumns },
  data() {
    return {
      queryFormVisiable: true,
      deleteLoading: false,
      queryForm: {
        name: '',
        code: ''
      },
      tableData: {
        loading: false,
        records: []
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
      },
      columnsData: {
        visiable: false,
        columns: [
          { key: 'name', label: '部门名称', _showed: true },
          { key: 'code', label: '部门编码', _showed: true },
          { key: 'status', label: '状态', _showed: true },
          { key: 'sort', label: '排序', _showed: true },
          { key: 'createTime', label: '创建时间', _showed: true },
          { key: 'description', label: '描述', _showed: true }
        ]
      },
      actionTreeData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableData.loading = true
      const queryForm = { ...this.queryForm }
      deptApi.layer(queryForm).then(response => {
        this.tableData.records = response.data
        this.tableData.loading = false
      }).catch(e => {
        this.tableData.loading = false
      })
    },
    selectColumns() {
      this.columnsData.visiable = true
    },
    handleQuery() {
      this.getList()
    },
    handleReset() {
      this.queryForm.name = ''
      this.queryForm.code = ''
      this.getList()
    },
    handleShow() {
      if (!this.selectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.showData.title = '查看部门'
      this.showData.id = this.selectData.current.id
      this.showData.visiable = true
    },
    handleCreate() {
      this.editData.title = '新增部门'
      this.editData.id = null
      this.editData.visiable = true
      if (this.selectData.current) {
        this.editData.parentId = this.selectData.current.id
        this.editData.parentName = this.selectData.current.name
      }
    },
    handleUpdate() {
      if (!this.selectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.editData.title = '修改字典'
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
        type: 'warning',
        customClass: 'jy-message-box'
      }).then(() => {
        const ids = []
        for (let i = 0; i < this.$refs.table.selection.length; i++) ids.push(this.$refs.table.selection[i].id)
        this.deleteLoading = true
        deptApi.remove(ids).then(response => {
          this.deleteLoading = false
          this.$notify.success({ title: '成功', message: '删除成功' })
          this.getList()
        }).catch(e => {
          this.deleteLoading = false
        })
      })
    },
    handleTableRowClick(row, column, event) {
      this.selectData.current = row
      this.$refs.table.toggleRowSelection(row)
    },
    handleTableRowSelect(selection, row) {
      this.selectData.current = row
      this.$refs.table.setCurrentRow(row)
    }
  }
}
</script>
<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
