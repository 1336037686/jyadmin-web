<template>
  <div
    v-loading="deleteLoading"
    style="margin: 10px"
    element-loading-text="删除中，请稍后..."
    element-loading-spinner="el-icon-loading"
  >

    <el-row style="margin-top: 10px">
      <el-col :span="6" style="padding-right: 15px">
        <el-card class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-caret-right" /> 接口分组</span>
          </div>
          <div>
            <el-form :inline="true" label-width="100px" size="mini">
              <el-form-item>
                <el-button v-permission="['action:api-show']" type="primary" size="mini" icon="el-icon-view" @click="groupHandleShow" />
                <el-button v-permission="['action:api-add']" type="success" size="mini" icon="el-icon-plus" @click="groupHandleCreate" />
                <el-button v-permission="['action:api-update']" type="warning" size="mini" icon="el-icon-edit-outline" @click="groupHandleUpdate" />
                <el-button v-permission="['action:api-delete']" type="danger" size="mini" icon="el-icon-delete" @click="groupHandleRemove" />
              </el-form-item>
            </el-form>
          </div>
          <el-table
            ref="table"
            v-loading="groupTableData.loading"
            element-loading-text="加载中，请稍后..."
            element-loading-spinner="el-icon-loading"
            :data="groupTableData.records"
            highlight-current-row
            style="width: 100%"
            empty-text="暂无数据"
            :header-cell-style="{background:'#F5F7FA', color: '#303133', fontWeight: 700}"
            @row-click="groupHandleTableRowClick"
          >
            <el-table-column type="index" label="序号" align="center" width="80" />
            <el-table-column prop="name" label="分组名称" show-overflow-tooltip />
            <el-table-column prop="code" label="标识" align="center" width="100" show-overflow-tooltip />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card v-if="!groupSelectData.current" class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-caret-right" /> 接口列表</span>
          </div>
          <div>
            <el-empty description="请先指定某个分组" />
            <!--            <el-alert title="请先指定某个分组" type="info" :closable="false" />-->
          </div>
        </el-card>
        <el-card v-if="groupSelectData.current" class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-caret-right" /> 接口列表</span>
            <el-row style="float: right">
              <el-button icon="el-icon-search" circle size="mini" @click="() => this.queryFormVisiable = !this.queryFormVisiable" />
              <el-button icon="el-icon-refresh" circle size="mini" @click="getActionList()" />
              <el-button icon="el-icon-s-grid" circle size="mini" @click="selectColumns()" />
            </el-row>
          </div>
          <div>
            <el-form v-show="queryFormVisiable" :inline="true" :model="actionQueryForm" label-width="90px" size="mini">
              <el-form-item label="接口名称：">
                <el-input v-model="actionQueryForm.name" placeholder="接口名称" />
              </el-form-item>
              <el-form-item label="权限标识：">
                <el-input v-model="actionQueryForm.code" placeholder="权限标识" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getActionList">查 询</el-button>
                <el-button type="info" icon="el-icon-circle-close" @click="actionHandleReset">重 置</el-button>
              </el-form-item>
            </el-form>
            <div>
              <el-button v-permission="['action:group-show']" type="primary" size="mini" icon="el-icon-view" @click="actionHandleShow">查 看</el-button>
              <el-button v-permission="['action:group-add']" type="success" size="mini" icon="el-icon-plus" @click="actionHandleCreate">新 增</el-button>
              <el-button v-permission="['action:group-update']" type="warning" size="mini" icon="el-icon-edit-outline" @click="actionHandleUpdate">修 改</el-button>
              <el-button v-permission="['action:group-delete']" type="danger" size="mini" icon="el-icon-delete" @click="actionHandleRemove">删 除</el-button>
            </div>
          </div>

          <el-table
            ref="actionTable"
            v-loading="actionTableData.loading"
            element-loading-text="加载中，请稍后..."
            element-loading-spinner="el-icon-loading"
            :data="actionTableData.records"
            highlight-current-row
            style="width: 100%;margin-top: 10px"
            empty-text="暂无数据"
            :header-cell-style="{background:'#F5F7FA', color: '#303133', fontWeight: 700}"
            @row-click="actionHandleTableRowClick"
          >
            <el-table-column type="selection" width="60" align="center" />
            <el-table-column type="index" width="55" label="序号" align="center" />
            <el-table-column v-if="checkColumnDisplayed('name', columnsData.columns)" prop="name" label="接口名称" width="200" align="center" show-overflow-tooltip />
            <el-table-column v-if="checkColumnDisplayed('code', columnsData.columns)" prop="code" label="权限标识" width="200" align="center" show-overflow-tooltip />
            <el-table-column v-if="checkColumnDisplayed('sort', columnsData.columns)" prop="sort" label="排序" align="center" width="80" />
            <el-table-column v-if="checkColumnDisplayed('status', columnsData.columns)" prop="status" label="状态" width="150" align="center">
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
            <el-table-column v-if="checkColumnDisplayed('createTime', columnsData.columns)" prop="createTime" label="创建时间" width="220" align="center" />
            <el-table-column v-if="checkColumnDisplayed('description', columnsData.columns)" prop="description" label="描述" :show-overflow-tooltip="true" />
          </el-table>
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
    <select-columns :title="columnsData.title" :columns="columnsData.columns" :visible.sync="columnsData.visiable" />
  </div>
</template>

<script>
import groupApi from '@/api/system/permission/jy-permission-group'
import actionApi from '@/api/system/permission/jy-permission-action'
import JyPermissionGroupForm from '@/views/system/permission-action/permission-group-form'
import JyPermissionGroupDetail from '@/views/system/permission-action/permission-group-detail'
import JyPermissionActionForm from '@/views/system/permission-action/permission-action-form'
import JyPermissionActionDetail from '@/views/system/permission-action/permission-action-detail'
import SelectColumns from '@/components/SelectColumns'
export default {
  name: 'JyPermissionGroup',
  components: { JyPermissionActionDetail, JyPermissionActionForm, JyPermissionGroupDetail, JyPermissionGroupForm, SelectColumns },
  data() {
    return {
      deleteLoading: false,
      groupTableData: {
        loading: false,
        records: []
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
        current: null
      },
      // action
      queryFormVisiable: true,
      actionQueryForm: {
        groupId: '',
        name: '',
        code: ''
      },
      actionTableData: {
        loading: false,
        records: []
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
      },
      columnsData: {
        visiable: false,
        columns: [
          { key: 'name', label: '接口名称', _showed: true },
          { key: 'code', label: '权限标识', _showed: true },
          { key: 'sort', label: '排序', _showed: true },
          { key: 'status', label: '状态', _showed: true },
          { key: 'createTime', label: '创建时间', _showed: true },
          { key: 'description', label: '描述', _showed: true }
        ]
      }
    }
  },
  created() {
    this.getGroupList()
  },
  methods: {
    // group
    getGroupList() {
      this.groupTableData.loading = true
      groupApi.getList().then(response => {
        this.groupTableData.records = response.data
        if (!this.groupTableData.records && this.groupTableData.records.length === 0) {
          this.groupSelectData.current = null
          return
        }

        const firstRow = this.groupTableData.records[0]
        this.groupSelectData.current = firstRow
        this.$refs.table.setCurrentRow(firstRow)
        this.groupTableData.loading = false
        this.getActionList()
      })
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
      const selectRow = this.groupSelectData.current
      if (!selectRow) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'jy-message-box'
      }).then(() => {
        const ids = [selectRow.id]
        this.deleteLoading = true
        groupApi.remove(ids).then(response => {
          this.deleteLoading = false
          this.getGroupList()
          this.$notify.success({ title: '成功', message: '删除成功' })
        }).catch(e => {
          this.deleteLoading = false
        })
      })
    },
    groupHandleTableRowClick(row, column, event) {
      this.groupSelectData.current = row
      // 获取接口信息
      this.actionSelectData.current = null
      this.getActionList()
    },
    // action
    getActionList() {
      this.actionTableData.loading = true
      this.actionQueryForm.groupId = this.groupSelectData.current.id
      actionApi.list(this.actionQueryForm).then(response => {
        this.actionTableData.records = response.data
        this.actionTableData.loading = false
      })
    },
    selectColumns() {
      this.columnsData.visiable = true
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
        type: 'warning',
        customClass: 'jy-message-box'
      }).then(() => {
        const ids = []
        for (let i = 0; i < this.$refs.actionTable.selection.length; i++) ids.push(this.$refs.actionTable.selection[i].id)
        this.deleteLoading = true
        actionApi.remove(ids).then(response => {
          this.deleteLoading = false
          this.getActionList()
          this.$notify.success({ title: '成功', message: '删除成功' })
        }).catch(e => {
          this.deleteLoading = false
        })
      })
    },
    actionHandleTableRowClick(row, column, event) {
      this.actionSelectData.current = row
      this.$refs.actionTable.toggleRowSelection(row)
    },
    actionStatusChange(data) {
      actionApi.update(data).then(response => {
        this.$notify.success({ title: '成功', message: '状态修改成功' })
        this.getActionList()
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '状态修改失败' })
      })
    }
  }
}
</script>
<style scoped>

</style>
