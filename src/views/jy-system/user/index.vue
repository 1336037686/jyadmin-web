<template>
  <div style="margin: 10px">
    <el-card class="box-card" shadow="never">
      <el-form :inline="true" :model="queryForm" size="mini" label-width="100px">
        <el-form-item label="用户名：">
          <el-input v-model="queryForm.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="昵称：">
          <el-input v-model="queryForm.nickname" placeholder="昵称" />
        </el-form-item>
        <el-form-item label="电话：">
          <el-input v-model="queryForm.phone" placeholder="电话" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查 询</el-button>
          <el-button type="info" icon="el-icon-circle-close" @click="handleReset">重 置</el-button>
        </el-form-item>
      </el-form>

      <div style="margin-top: 5px">
        <el-button type="primary" size="mini"  icon="el-icon-view" @click="handleShow">查 看</el-button>
        <el-button type="success" size="mini"  icon="el-icon-plus" @click="handleCreate">新 增</el-button>
        <el-button type="success" size="mini"  icon="el-icon-user-solid" @click="handleRole">角色分配</el-button>
        <el-button type="warning" size="mini"  icon="el-icon-edit-outline" @click="handleUpdate">修 改</el-button>
        <el-button type="warning" size="mini"  icon="el-icon-s-tools" @click="handleUpdatePassword">重置密码</el-button>
        <el-button type="danger"  size="mini" icon="el-icon-delete" @click="handleRemove">删 除</el-button>
      </div>
    </el-card>

    <el-card class="box-card" shadow="never" style="margin-top: 5px">
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
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="type" label="用户类型" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 1" size="mini" effect="plain"> 管理员 </el-tag>
            <el-tag v-if="scope.row.type === 0" size="mini" effect="plain" type="success"> 普通用户 </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="用户状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" size="mini" effect="plain" type="success"> 启 用 </el-tag>
            <el-tag v-if="scope.row.status === 0" size="mini" effect="plain" type="danger"> 禁 用 </el-tag>
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

    <jy-user-form :id="editData.id" :title="editData.title" :visible.sync="editData.visiable" />
    <jy-user-detail :id="showData.id" :title="showData.title" :visible.sync="showData.visiable" />
    <jy-user-role :id="roleEditData.id" :name="roleEditData.name" :title="roleEditData.title" :visible.sync="roleEditData.visiable" />
    <jy-user-password :id="passwordEditData.id" :name="passwordEditData.name" :title="passwordEditData.title" :visible.sync="passwordEditData.visiable" />
  </div>
</template>

<script>
import userApi from '@/api/jy-user'
import JyUserDetail from "@/views/jy-system/user/jy-user-detail";
import JyUserForm from "@/views/jy-system/user/jy-user-form";
import JyUserRole from "@/views/jy-system/user/jy-user-role";
import JyUserPassword from "@/views/jy-system/user/jy-user-password";
export default {
  name: 'JyTag',
  components: {JyUserPassword, JyUserRole, JyUserForm, JyUserDetail },
  data() {
    return {
      queryForm: {
        username: '',
        nickname: '',
        phone: ''
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
      roleEditData: {
        visiable: false,
        title: '',
        name: '',
        id: null
      },
      passwordEditData: {
        visiable: false,
        title: '',
        name: '',
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
      userApi.getList(queryForm).then(response => {
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
      this.showData.title = '查看用户'
      this.showData.id = this.selectData.current.id
      this.showData.visiable = true
    },
    handleCreate() {
      this.editData.title = '新增用户'
      this.editData.id = null
      this.editData.visiable = true
    },
    handleRole() {
      if (!this.selectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }

      this.roleEditData.title = '角色分配'
      this.roleEditData.id = this.selectData.current.id
      this.roleEditData.name = this.selectData.current.username
      this.roleEditData.visiable = true
    },
    handleUpdate() {
      if (!this.selectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.editData.title = '修改用户'
      this.editData.id = this.selectData.current.id
      this.editData.visiable = true
    },
    handleUpdatePassword() {
      if (!this.selectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }

      this.passwordEditData.title = '重置密码'
      this.passwordEditData.id = this.selectData.current.id
      this.passwordEditData.name = this.selectData.current.username
      this.passwordEditData.visiable = true
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
        userApi.remove(ids).then(response => {
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
