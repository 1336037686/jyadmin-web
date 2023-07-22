<template>
  <div
    v-loading="deleteLoading"
    style="margin: 10px"
    element-loading-text="删除中，请稍后..."
    element-loading-spinner="el-icon-loading"
  >
    <el-card class="box-card" shadow="always">
      <el-form v-show="queryFormVisiable" :inline="true" size="mini" :model="queryForm" label-width="100px">
        <el-form-item label="角色名称：">
          <el-input v-model="queryForm.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="角色编码：">
          <el-input v-model="queryForm.code" placeholder="角色编码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查 询</el-button>
          <el-button type="info" icon="el-icon-circle-close" @click="handleReset">重 置</el-button>
        </el-form-item>
      </el-form>

      <div style="margin-top: 5px">
        <el-button v-permission="['role:show']" type="primary" size="mini" icon="el-icon-view" @click="handleShow">查 看</el-button>
        <el-button v-permission="['role:add']" type="success" size="mini" icon="el-icon-plus" @click="handleCreate">新 增</el-button>
        <el-button v-permission="['role:update']" type="warning" size="mini" icon="el-icon-edit-outline" @click="handleUpdate">修 改</el-button>
        <el-button v-permission="['role:delete']" type="danger" size="mini" icon="el-icon-delete" @click="handleRemove">删 除</el-button>
      </div>
    </el-card>

    <el-row>
      <el-col :span="18">
        <el-card class="box-card" shadow="always" style="margin-top: 5px">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-caret-right" /> 角色列表</span>
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
            @select="handleTableRowSelect"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column type="index" width="55" label="序号" align="center" />
            <el-table-column v-if="checkColumnDisplayed('name', columnsData.columns)" prop="name" align="center" label="角色名称" show-overflow-tooltip />
            <el-table-column v-if="checkColumnDisplayed('code', columnsData.columns)" prop="code" align="center" label="角色编码" show-overflow-tooltip />
            <el-table-column v-if="checkColumnDisplayed('apiPermission', columnsData.columns)" prop="apiPermission" label="角色接口权限" align="center" width="220" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag>{{ getNameByCode(apiPermissionOptions, scope.row.apiPermission) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="checkColumnDisplayed('dataScope', columnsData.columns)" prop="dataScope" label="数据范围" align="center" width="180" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ getNameByCode(dataScopeOptions, scope.row.dataScope) }}
              </template>
            </el-table-column>
            <el-table-column v-if="checkColumnDisplayed('status', columnsData.columns)" prop="status" align="center" label="状态" width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 1" size="mini" effect="plain" type="success"> 启 用 </el-tag>
                <el-tag v-if="scope.row.status === 0" size="mini" effect="plain" type="danger"> 禁 用 </el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="checkColumnDisplayed('sort', columnsData.columns)" prop="sort" align="center" label="排序" width="100" />
            <el-table-column v-if="checkColumnDisplayed('createTime', columnsData.columns)" prop="createTime" label="创建时间" width="220" align="center" />
            <el-table-column v-if="checkColumnDisplayed('description', columnsData.columns)" prop="description" label="角色描述" />
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
      </el-col>
      <el-col :span="6" style="padding-left: 10px">
        <el-card
          v-loading="selectData.loading"
          class="box-card"
          shadow="always"
          style="margin-top: 5px"
          element-loading-text="加载中，请稍后..."
          element-loading-spinner="el-icon-loading"
        >
          <div slot="header" class="clearfix">
            <span><i class="el-icon-caret-right" /> 菜单分配</span>
            <el-button v-permission="['role:menu']" style="float: right;" size="mini" type="primary" icon="el-icon-circle-check" :loading="savePermissionLoading" @click="handleUpdateRoleMenus">保存</el-button>
          </div>
          <el-tree
            ref="menuTree"
            :data="menuTreeData"
            show-checkbox
            node-key="id"
            empty-text="暂无数据"
            highlight-current
            :check-strictly="true"
            :props="{children: 'children', label: 'name' }"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span style="font-size: 14px;">{{ node.label }}</span>
              <span>
                <span style="margin-right: 10px">{{ data.code }}</span>
                <el-tag v-if="data.type === 0" size="mini" effect="plain"> C 目 录</el-tag>
                <el-tag v-if="data.type === 1" size="mini" effect="plain" type="success"> M 菜 单</el-tag>
                <el-tag v-if="data.type === 2" size="mini" effect="plain" type="warning"> B 按 钮</el-tag>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
    </el-row>

    <role-form :id="editData.id" :title="editData.title" :visible.sync="editData.visiable" />
    <role-detail :id="showData.id" :title="showData.title" :visible.sync="showData.visiable" />
    <select-columns :title="columnsData.title" :columns="columnsData.columns" :visible.sync="columnsData.visiable" />
  </div>
</template>

<script>
import roleApi from '@/api/system/role/jy-role'
import menuApi from '@/api/system/permission/jy-permission-menu'
import RoleDetail from './role-detail'
import RoleForm from './role-form'
import SelectColumns from '@/components/SelectColumns'
export default {
  components: { RoleForm, RoleDetail, SelectColumns },
  data() {
    return {
      queryFormVisiable: true,
      deleteLoading: false,
      savePermissionLoading: false,
      queryForm: {
        name: '',
        code: ''
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
      selectData: {
        loading: false,
        current: null,
        record: []
      },
      columnsData: {
        visiable: false,
        columns: [
          { key: 'name', label: '角色名称', _showed: true },
          { key: 'code', label: '角色编码', _showed: true },
          { key: 'apiPermission', label: '角色接口权限', _showed: true },
          { key: 'dataScope', label: '数据范围', _showed: true },
          { key: 'status', label: '状态', _showed: true },
          { key: 'sort', label: '排序', _showed: true },
          { key: 'createTime', label: '创建时间', _showed: true },
          { key: 'description', label: '角色描述', _showed: true }
        ]
      },
      menuTreeData: [],
      apiPermissionOptions: [],
      dataScopeOptions: []
    }
  },
  created() {
    this.getDataDict()
    this.getList()
    this.getTree()
  },
  methods: {
    getDataDict() {
      this.getDictByCode('sys_role_api_permission').then(res => {
        this.apiPermissionOptions = res.data
      })
      this.getDictByCode('sys_role_data_scope').then(res => {
        this.dataScopeOptions = res.data
      })
    },
    getList() {
      this.tableData.loading = true
      const queryForm = { ...this.queryForm, pageNumber: this.tableData.pageNumber, pageSize: this.tableData.pageSize }
      roleApi.getList(queryForm).then(response => {
        this.tableData = response
        this.tableData.loading = false
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
      this.showData.title = '查看角色'
      this.showData.id = this.selectData.current.id
      this.showData.visiable = true
    },
    handleCreate() {
      this.editData.title = '新增角色'
      this.editData.id = null
      this.editData.visiable = true
    },
    handleUpdate() {
      if (!this.selectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.editData.title = '修改角色'
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
        roleApi.remove(ids).then(response => {
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
      // 获取角色菜单
      this.getRoleMenus()
    },
    handleTableRowSelect(selection, row) {
      this.selectData.current = row
      this.$refs.table.setCurrentRow(row)
      // 获取角色菜单
      this.getRoleMenus()
    },
    handleChangePage(page) {
      this.tableData.pageNumber = page
      this.getList()
    },

    getTree() {
      this.selectData.loading = true
      menuApi.layer().then(response => {
        this.menuTreeData = response.data
        this.selectData.loading = false
      })
    },
    getRoleMenus() {
      this.selectData.loading = true
      this.$refs.menuTree.setCheckedKeys([])
      if (!this.selectData.current) return
      menuApi.getFromRole(this.selectData.current.id).then(response => {
        let checkedKeys = response.data
        checkedKeys = !checkedKeys ? [] : checkedKeys
        this.$refs.menuTree.setCheckedKeys(checkedKeys)
        this.selectData.loading = false
      })
    },
    handleUpdateRoleMenus() {
      if (!this.selectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      const checkedNodes = this.$refs.menuTree.getCheckedNodes()
      const menuIds = []
      if (checkedNodes && checkedNodes.length > 0) {
        for (let i = 0; i < checkedNodes.length; i++) {
          menuIds.push(checkedNodes[i].id)
        }
      }
      this.savePermissionLoading = true
      menuApi.addFromRole(this.selectData.current.id, menuIds).then(response => {
        this.savePermissionLoading = false
        this.$notify.success({ title: '成功', message: '设置成功' })
        this.getRoleMenus()
      }).catch(e => {
        this.savePermissionLoading = false
      })
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
