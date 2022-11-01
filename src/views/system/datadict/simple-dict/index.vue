<template>
  <div style="margin: 10px">

    <el-row style="margin-top: 10px">
      <el-col :span="8" style="padding-right: 15px">
        <el-card class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-caret-right"/> 通用字典</span>
          </div>
          <div>
            <el-form :inline="true" label-width="100px" size="mini">
              <el-form-item label="字典名称：">
                <el-input v-model="groupQueryForm.name" placeholder="字典名称" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getGroupList">查 询</el-button>
                <el-button type="info" icon="el-icon-circle-close" @click="groupHandleReset">重 置</el-button>
              </el-form-item>
              <br>
              <el-form-item>
                <el-button type="primary" size="mini"  icon="el-icon-view" @click="groupHandleShow"></el-button>
                <el-button type="success" size="mini"  icon="el-icon-plus" @click="groupHandleCreate"></el-button>
                <el-button type="warning" size="mini"  icon="el-icon-edit-outline" @click="groupHandleUpdate"></el-button>
                <el-button type="danger"  size="mini" icon="el-icon-delete" @click="groupHandleRemove"></el-button>
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
            :header-cell-style="{background:'#FAFAFA'}"
            @row-click="groupHandleTableRowClick"
          >
            <el-table-column type="index" label="序号" align="center" width="80"/>
            <el-table-column prop="name" label="字典名称" align="center" show-overflow-tooltip  />
            <el-table-column prop="code" label="字典编码" align="center" show-overflow-tooltip />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card v-if="!groupSelectData.current" class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-caret-right"/> 字典明细</span>
          </div>
          <div>
            <el-alert title="请先指定某个分组" type="info" :closable="false" />
          </div>
        </el-card>
        <el-card v-if="groupSelectData.current" class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-caret-right"/> 字典明细</span>
          </div>
          <div>
            <el-form :inline="true" :model="actionQueryForm" label-width="90px" size="mini">
              <el-form-item label="字段名称：">
                <el-input v-model="actionQueryForm.name" placeholder="字段名称" />
              </el-form-item>
              <el-form-item label="字段编码：">
                <el-input v-model="actionQueryForm.code" placeholder="字段编码" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getActionList">查 询</el-button>
                <el-button type="info" icon="el-icon-circle-close" @click="actionHandleReset">重 置</el-button>
              </el-form-item>
              <br>
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-view" @click="actionHandleShow">查 看</el-button>
                <el-button type="success" size="mini" icon="el-icon-plus" @click="actionHandleCreate">新 增</el-button>
                <el-button type="warning" size="mini" icon="el-icon-edit-outline" @click="actionHandleUpdate">修 改</el-button>
                <el-button type="danger"  size="mini" icon="el-icon-delete" @click="actionHandleRemove">删 除</el-button>
              </el-form-item>
            </el-form>
          </div>

          <el-table
            ref="actionTable"
            v-loading="actionTableData.loading"
            element-loading-text="加载中，请稍后..."
            element-loading-spinner="el-icon-loading"
            :data="actionTableData.records"
            highlight-current-row
            style="width: 100%"
            empty-text="暂无数据"
            :header-cell-style="{background:'#FAFAFA'}"
            @row-click="actionHandleTableRowClick"
          >
            <el-table-column type="selection" width="60" align="center" />
            <el-table-column prop="name" label="字段名称" align="center" show-overflow-tooltip />
            <el-table-column prop="code" label="字段编码" align="center" show-overflow-tooltip />
            <el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip />
            <el-table-column prop="remark" label="备注" width="200" align="center" show-overflow-tooltip />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <jy-simple-dict-form :id="groupEditData.id" :title="groupEditData.title" :visible.sync="groupEditData.visiable" />
    <jy-simple-dict-detail :id="groupShowData.id" :title="groupShowData.title" :visible.sync="groupShowData.visiable" />

    <jy-simple-dict-detail-form
      :id="actionEditData.id"
      :title="actionEditData.title"
      :visible.sync="actionEditData.visiable"
      :data-dict-id="actionEditData.dataDictId"
    />
    <jy-simple-dict-detail-info
      :id="actionShowData.id"
      :title="actionShowData.title"
      :visible.sync="actionShowData.visiable"
      :group-name="actionShowData.groupName"
    />
  </div>
</template>

<script>
import groupApi from '@/api/jy-simple-data-dict'
import actionApi from '@/api/jy-simple-data-dict-detail'
import JySimpleDictForm from '@/views/system/datadict/simple-dict/simple-dict-form'
import JySimpleDictDetail from '@/views/system/datadict/simple-dict/simple-dict-detail'
import JySimpleDictDetailForm from '@/views/system/datadict/simple-dict/simple-dict-detail-form'
import JySimpleDictDetailInfo from '@/views/system/datadict/simple-dict/simple-dict-detail-info'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  directives: { permission },
  components: { JySimpleDictDetailForm, JySimpleDictDetailInfo, JySimpleDictDetail, JySimpleDictForm },
  data() {
    return {
      groupQueryForm: {
        name: ''
      },
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
      actionQueryForm: {
        dataDictId: null,
        name: '',
        code: ''
      },
      actionTableData: {
        loading: false,
        records: []
      },
      actionEditData: {
        visiable: false,
        dataDictId: '',
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
      this.groupTableData.loading = true
      groupApi.getList(this.groupQueryForm).then(response => {
        this.groupTableData.records = response.data
        if (!this.groupTableData.records && this.groupTableData.records.length === 0) {
          this.groupSelectData.current = null
          return
        }

        let firstRow = this.groupTableData.records[0]
        this.groupSelectData.current = firstRow
        this.$refs.table.setCurrentRow(firstRow)
        this.groupTableData.loading = false
        this.getActionList()
      })
    },
    groupHandleReset() {
      this.groupQueryForm.name = ''
      this.getGroupList()
    },
    groupHandleShow() {
      if (!this.groupSelectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.groupShowData.title = '查看'
      this.groupShowData.id = this.groupSelectData.current.id
      this.groupShowData.visiable = true
    },
    groupHandleCreate() {
      this.groupEditData.title = '新增'
      this.groupEditData.id = null
      this.groupEditData.visiable = true
    },
    groupHandleUpdate() {
      if (!this.groupSelectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.groupEditData.title = '修改'
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
        type: 'warning'
      }).then(() => {
        const ids = [selectRow.id]
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
      // 获取接口信息
      this.actionSelectData.current = null
      this.getActionList()
    },
    // action
    getActionList() {
      this.actionTableData.loading = true
      this.actionQueryForm.dataDictId = this.groupSelectData.current.id
      actionApi.getList(this.actionQueryForm).then(response => {
        this.actionTableData.records = response.data
        this.actionTableData.loading = false
      })
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
      this.actionShowData.title = '查看'
      this.actionShowData.id = this.actionSelectData.current.id
      this.actionShowData.visiable = true
    },
    actionHandleCreate() {
      this.actionEditData.dataDictId = this.groupSelectData.current.id
      this.actionEditData.title = '【' + this.groupSelectData.current.name + '】新增'
      this.actionEditData.id = null
      this.actionEditData.visiable = true
    },
    actionHandleUpdate() {
      if (!this.actionSelectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.actionEditData.dataDictId = this.groupSelectData.current.id
      this.actionEditData.title = '【' + this.groupSelectData.current.name + '】修改'
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
    }
  }
}
</script>
<style scoped>

</style>
