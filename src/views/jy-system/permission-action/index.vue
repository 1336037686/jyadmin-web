<template>
  <div style="margin: 10px">

    <el-row style="margin-top: 10px">
      <el-col :span="9" style="padding-right: 15px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>组别</span>
          </div>
          <div>
            <el-form :inline="true" :model="groupQueryForm" label-width="100px" size="mini">
              <el-form-item label="组别名称：">
                <el-input v-model="groupQueryForm.name" placeholder="组别名称" />
              </el-form-item>
<!--              <el-form-item label="组别编码：">-->
<!--                <el-input v-model="groupQueryForm.code" placeholder="组别标识" />-->
<!--              </el-form-item>-->
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="groupHandleQuery">查 询</el-button>
                <el-button type="info" icon="el-icon-circle-close" @click="groupHandleReset">重 置</el-button>
              </el-form-item>
              <br>
              <el-form-item>
                <el-button type="primary" icon="el-icon-view" @click="groupHandleShow">查 看</el-button>
                <el-button type="success" icon="el-icon-plus" @click="groupHandleCreate">新 增</el-button>
                <el-button type="warning" icon="el-icon-edit-outline" @click="groupHandleUpdate">修 改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="groupHandleRemove">删 除</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table
            ref="table"
            :data="groupTableData.records"
            highlight-current-row
            style="width: 100%"
            empty-text="暂无数据"
            :header-cell-style="{background:'#FAFAFA'}"
            @row-click="groupHandleTableRowClick"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="name" label="组别名称" width="120" />
            <el-table-column prop="code" label="组别标识" width="120" />
            <el-table-column prop="sort" label="排序" width="100" align="center" />
            <el-table-column prop="description" label="描述" />
          </el-table>
          <div style="text-align: center;margin-top: 10px">
            <el-pagination
              v-model="groupTableData.pageNumber"
              background
              layout="prev, pager, next"
              :page-size="groupTableData.pageSize"
              :hide-on-single-page="true"
              :total="groupTableData.total"
              @current-change="groupHandleChangePage"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="15">
        <el-card v-if="!groupSelectData.current" class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>数据接口</span>
          </div>
          <div>
            <el-alert title="请先指定某个分组" type="info" :closable="false" />
          </div>
        </el-card>
        <el-card v-if="groupSelectData.current" class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>数据接口【{{ groupSelectData.current.name }} - {{ groupSelectData.current.code }}】</span>
          </div>
          <div>
            <el-form :inline="true" :model="actionQueryForm" label-width="90px" size="mini">
              <el-form-item label="接口名称：">
                <el-input v-model="actionQueryForm.name" placeholder="接口名称" />
              </el-form-item>
              <el-form-item label="权限标识：">
                <el-input v-model="actionQueryForm.code" placeholder="权限标识" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="actionHandleQuery">查 询</el-button>
                <el-button type="info" icon="el-icon-circle-close" @click="actionHandleReset">重 置</el-button>
              </el-form-item>
              <br>
              <el-form-item>
                <el-button type="primary" icon="el-icon-view" @click="actionHandleShow">查 看</el-button>
                <el-button type="success" icon="el-icon-plus" @click="actionHandleCreate">新 增</el-button>
                <el-button type="warning" icon="el-icon-edit-outline" @click="actionHandleUpdate">修 改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="actionHandleRemove">删 除</el-button>
              </el-form-item>
            </el-form>
          </div>

          <el-table
            ref="actionTable"
            :data="actionTableData.records"
            highlight-current-row
            style="width: 100%"
            empty-text="暂无数据"
            :header-cell-style="{background:'#FAFAFA'}"
            @row-click="actionHandleTableRowClick"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="name" label="接口名称" width="120" />
            <el-table-column prop="code" label="权限标识" width="120" />
            <el-table-column prop="sort" label="排序" width="100" align="center" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="status" label="状态" width="180" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="启用"
                  inactive-text="禁用"
                  :active-value="1"
                  :inactive-value="0"
                  @change="actionStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>

          <div style="text-align: center;margin-top: 10px">
            <el-pagination
              v-model="actionTableData.pageNumber"
              background
              layout="prev, pager, next"
              :page-size="actionTableData.pageSize"
              :hide-on-single-page="true"
              :total="actionTableData.total"
              @current-change="actionHandleChangePage"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <jy-permission-group-form :id="groupEditData.id" :title="groupEditData.title" :visible.sync="groupEditData.visiable" />
    <jy-permission-group-detail :id="groupShowData.id" :title="groupShowData.title" :visible.sync="groupShowData.visiable" />

    <jy-permission-action-form
      :id="actionEditData.id"
      :title="actionEditData.title"
      :visible.sync="actionEditData.visiable"
      :group-id="actionEditData.groupId"
    />
    <jy-permission-action-detail
      :id="actionShowData.id"
      :title="actionShowData.title"
      :visible.sync="actionShowData.visiable"
      :group-name="actionShowData.groupName"
    />
  </div>
</template>

<script>
import groupApi from '@/api/jy-permission-group'
import actionApi from '@/api/jy-permission-action'
import JyPermissionGroupForm from '@/views/jy-system/permission-action/permission-group-form'
import JyPermissionGroupDetail from '@/views/jy-system/permission-action/permission-group-detail'
import JyPermissionActionForm from '@/views/jy-system/permission-action/permission-action-form'
import JyPermissionActionDetail from '@/views/jy-system/permission-action/permission-action-detail'
import api from '@/api/jy-permission-action'

export default {
  name: 'JyPermissionGroup',
  components: { JyPermissionActionDetail, JyPermissionActionForm, JyPermissionGroupDetail, JyPermissionGroupForm },
  data() {
    return {
      // group
      groupQueryForm: {
        name: '',
        code: ''
      },
      groupTableData: {
        pageNumber: 1,
        pageSize: 10,
        pages: 1,
        total: 1,
        records: [],
        hasPrevious: false,
        hasNext: false
      },
      groupEditData: {
        visiable: false,
        title: '',
        id: null
      },
      groupShowData: {
        visiable: false,
        title: '',
        id: null
      },
      groupSelectData: {
        current: null,
        record: []
      },
      // action
      actionQueryForm: {
        groupId: '',
        name: '',
        code: ''
      },
      actionTableData: {
        pageNumber: 1,
        pageSize: 10,
        pages: 1,
        total: 1,
        records: [],
        hasPrevious: false,
        hasNext: false
      },
      actionEditData: {
        visiable: false,
        groupId: '',
        title: '',
        id: null
      },
      actionShowData: {
        visiable: false,
        groupName: '',
        title: '',
        id: null
      },
      actionSelectData: {
        current: null,
        record: []
      }

    }
  },
  created() {
    this.getGroupList()
  },
  methods: {
    // group
    getGroupList() {
      const queryForm = { ...this.groupQueryForm, pageNumber: this.groupTableData.pageNumber, pageSize: this.groupTableData.pageSize }
      groupApi.getList(queryForm).then(response => {
        this.groupTableData = response
      })
    },
    groupHandleQuery() {
      this.groupTableData.pageNumber = 1
      this.getGroupList()
    },
    groupHandleReset() {
      this.groupQueryForm.name = ''
      this.groupQueryForm.code = ''
      this.groupTableData.pageNumber = 1
      this.getGroupList()
    },
    groupHandleShow() {
      if (!this.groupSelectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.groupShowData.title = '查看组别'
      this.groupShowData.id = this.groupSelectData.current.id
      this.groupShowData.visiable = true
    },
    groupHandleCreate() {
      this.groupEditData.title = '新增组别'
      this.groupEditData.id = null
      this.groupEditData.visiable = true
    },
    groupHandleUpdate() {
      if (!this.groupSelectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.groupEditData.title = '修改组别'
      this.groupEditData.id = this.groupSelectData.current.id
      this.groupEditData.visiable = true
    },
    groupHandleRemove() {
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
        groupApi.remove(ids).then(response => {
          this.getGroupList()
          this.$notify.success({ title: '成功', message: '删除成功' })
        }).catch(e => {
          this.$notify.error({ title: '失败', message: '删除失败' })
        })
      })
    },
    groupHandleTableRowClick(row, column, event) {
      this.groupSelectData.current = row
      this.$refs.table.toggleRowSelection(row)

      // 获取接口信息
      this.getActionList()
      this.actionHandleClean()
    },
    groupHandleChangePage(page) {
      this.groupTableData.pageNumber = page
      this.getGroupList()
    },

    // action
    getActionList() {
      this.actionQueryForm.groupId = this.groupSelectData.current.id
      const queryForm = { ...this.actionQueryForm, pageNumber: this.actionTableData.pageNumber, pageSize: this.actionTableData.pageSize }
      actionApi.getList(queryForm).then(response => {
        this.actionTableData = response
      })
    },
    actionHandleQuery() {
      this.actionTableData.pageNumber = 1
      this.getActionList()
    },
    actionHandleReset() {
      this.actionQueryForm.name = ''
      this.actionQueryForm.code = ''
      this.actionTableData.pageNumber = 1
      this.getActionList()
    },
    actionHandleShow() {
      if (!this.actionSelectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.actionShowData.groupName = this.groupSelectData.current.name
      this.actionShowData.title = '查看接口'
      this.actionShowData.id = this.actionSelectData.current.id
      this.actionShowData.visiable = true
    },
    actionHandleCreate() {
      this.actionEditData.groupId = this.groupSelectData.current.id
      this.actionEditData.title = '【' + this.groupSelectData.current.name + '】新增接口'
      this.actionEditData.id = null
      this.actionEditData.visiable = true
    },
    actionHandleUpdate() {
      console.log(this.actionSelectData.current)
      if (!this.actionSelectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.actionEditData.groupId = this.groupSelectData.current.id
      this.actionEditData.title = '【' + this.groupSelectData.current.name + '】修改接口'
      this.actionEditData.id = this.actionSelectData.current.id
      this.actionEditData.visiable = true
    },
    actionHandleRemove() {
      const selectRows = this.$refs.actionTable.selection
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
        for (let i = 0; i < this.$refs.actionTable.selection.length; i++) ids.push(this.$refs.actionTable.selection[i].id)
        actionApi.remove(ids).then(response => {
          this.getActionList()
          this.$notify.success({ title: '成功', message: '删除成功' })
        }).catch(e => {
          this.$notify.error({ title: '失败', message: '删除失败' })
        })
      })
    },
    actionHandleTableRowClick(row, column, event) {
      this.actionSelectData.current = row
      this.$refs.actionTable.toggleRowSelection(row)
    },
    actionHandleChangePage(page) {
      this.actionTableData.pageNumber = page
      this.getActionList()
    },
    actionHandleClean() {
      this.actionSelectData.current = null
    },
    actionStatusChange(data) {
      api.update(data).then(response => {
        this.$notify.success({ title: '成功', message: '状态修改成功' })
        this.getActionList()
        this.tmpVisible = false
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '状态修改失败' })
      })
    }
  }
}
</script>
<style scoped>

</style>
