<template>
  <div style="margin: 10px">
    <el-card class="box-card" shadow="always">
      <el-form :inline="true" size="mini" :model="queryForm" label-width="100px">
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
        <el-button type="primary" size="mini"  icon="el-icon-view" @click="handleShow">查 看</el-button>
        <el-button type="success" size="mini"  icon="el-icon-plus" @click="handleCreate">新 增</el-button>
        <el-button type="warning" size="mini"  icon="el-icon-edit-outline" @click="handleUpdate">修 改</el-button>
        <el-button type="danger"  size="mini" icon="el-icon-delete" @click="handleRemove">删 除</el-button>
      </div>
    </el-card>

    <el-row>
      <el-col :span="18">
        <el-card class="box-card" shadow="always" style="margin-top: 5px">
          <div slot="header" class="clearfix">
            <span>角色列表</span>
          </div>
          <el-table
            ref="table"
            :data="tableData.records"
            highlight-current-row
            style="width: 100%"
            empty-text="暂无数据"
            :header-cell-style="{background:'#FAFAFA'}"
            @row-click="handleTableRowClick"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="name" align="center" label="角色名称" />
            <el-table-column prop="code" align="center" label="角色编码" />
            <el-table-column prop="sort" align="center" label="排序" />
            <el-table-column prop="status" align="center" label="状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 1" size="mini" effect="plain" type="success"> 启 用 </el-tag>
                <el-tag v-if="scope.row.status === 0" size="mini" effect="plain" type="danger"> 禁 用 </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="角色描述" width="450" />
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
      </el-col>
      <el-col :span="6" style="padding-left: 10px">
        <el-card class="box-card" shadow="always" style="margin-top: 5px">
        <div slot="header" class="clearfix">
          <span>菜单分配</span>
          <el-button style="float: right;" size="mini" type="primary" icon="el-icon-circle-check" @click="handleUpdateRoleMenus">保存</el-button>
        </div>
          <el-tree
            :data="menuTreeData"
            show-checkbox
            node-key="id"
            empty-text="暂无数据"
            ref="menuTree"
            highlight-current
            :check-strictly="true"
            :props="{children: 'children', label: 'name' }">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span style="font-size: 14px;">{{ node.label }}</span>
              <span>
                <span style="margin-right: 10px">{{data.code}}</span>
                <el-tag v-if="data.type === 0" size="mini" effect="plain"> C 目 录</el-tag>
                <el-tag v-if="data.type === 1" size="mini" effect="plain" type="success"> M 菜 单</el-tag>
                <el-tag v-if="data.type === 2" size="mini" effect="plain" type="warning"> B 按 钮</el-tag>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
    </el-row>

    <jy-role-form :id="editData.id" :title="editData.title" :visible.sync="editData.visiable" />
    <jy-role-detail :id="showData.id" :title="showData.title" :visible.sync="showData.visiable" />
  </div>
</template>

<script>
import roleApi from '@/api/jy-role'
import menuApi from '@/api/jy-permission-menu'
import JyRoleDetail from "@/views/jy-system/role/jy-role-detail";
import JyRoleForm from "@/views/jy-system/role/jy-role-form";
export default {
  name: 'JyRole',
  components: {JyRoleForm, JyRoleDetail},
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
      },
      menuTreeData: []
    }
  },
  created() {
    this.getList()
    this.getTree()
  },
  methods: {
    getList() {
      const queryForm = { ...this.queryForm, pageNumber: this.tableData.pageNumber, pageSize: this.tableData.pageSize }
      roleApi.getList(queryForm).then(response => {
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
        type: 'warning'
      }).then(() => {
        const ids = []
        for (let i = 0; i < this.$refs.table.selection.length; i++) ids.push(this.$refs.table.selection[i].id)
        roleApi.remove(ids).then(response => {
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

      // 获取角色菜单
      this.getRoleMenus()
    },
    handleChangePage(page) {
      this.tableData.pageNumber = page
      this.getList()
    },

    getTree() {
      menuApi.layer().then(response => {
        this.menuTreeData = response.data
      })
    },
    getRoleMenus() {
      this.$refs.menuTree.setCheckedKeys([]);
      if (!this.selectData.current) return
      menuApi.getFromRole(this.selectData.current.id).then(response => {
        let checkedKeys = response.data
        checkedKeys = !checkedKeys ? [] : checkedKeys
        this.$refs.menuTree.setCheckedKeys(checkedKeys);
      })
    },
    handleUpdateRoleMenus() {
      if (!this.selectData.current) {
        this.$notify.warning({title: '警告', message: '请先选择一条数据'})
        return
      }
      let checkedNodes = this.$refs.menuTree.getCheckedNodes()
      let menuIds = []
      if (checkedNodes && checkedNodes.length > 0) {
        for (let i = 0; i < checkedNodes.length; i++) {
          menuIds.push(checkedNodes[i].id)
        }
      }
      menuApi.addFromRole(this.selectData.current.id, menuIds).then(response => {
        this.$notify.success({ title: '成功', message: '设置成功' })
        this.getRoleMenus()
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '设置失败' })
      })
    },
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
