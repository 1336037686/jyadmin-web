<template>
  <div style="margin: 10px;">
    <el-card class="box-card" shadow="always">
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

    <el-row>
      <el-col :span="24">
        <el-card class="box-card" shadow="always" style="margin-top: 5px">
          <div slot="header" class="clearfix">
            <span>部门列表</span>
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
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            row-key="id"
            highlight-current-row
            style="width: 100%"
            empty-text="暂无数据"
            :header-cell-style="{background:'#FAFAFA'}"
            @row-click="handleTableRowClick"
          >
            <el-table-column type="selection" width="60" align="center" />
            <el-table-column prop="name" label="部门名称" :show-overflow-tooltip="true" />
            <el-table-column prop="code" label="部门编码" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="status" label="状态" align="center" :show-overflow-tooltip="true" >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 1" size="mini" effect="plain" type="success"> <i class="el-icon-success"/> 启 用</el-tag>
                <el-tag v-if="scope.row.status === 0" size="mini" effect="plain" type="danger"> <i class="el-icon-error"/> 禁 用</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="createTime" label="创建时间" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="description" label="描述" align="center" width="350" :show-overflow-tooltip="true" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <dept-form :id="editData.id" :title="editData.title" :visible.sync="editData.visiable" />
    <dept-detail :id="showData.id" :title="showData.title" :visible.sync="showData.visiable" />
  </div>
</template>

<script>
import deptApi from '@/api/system/department/jy-department'
import DeptForm from '@/views/system/department/dept-form'
import DeptDetail from '@/views/system/department/dept-detail'
import permission from '@/directive/permission' // 权限判断指令
export default {
  directives: { permission },
  components: { DeptDetail, DeptForm },
  data() {
    return {
      queryFormVisiable: true,
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
      })
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
        type: 'warning'
      }).then(() => {
        const ids = []
        for (let i = 0; i < this.$refs.table.selection.length; i++) ids.push(this.$refs.table.selection[i].id)
        deptApi.remove(ids).then(response => {
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
