<template>
  <div style="margin: 10px;">
    <el-card class="box-card" shadow="always">
      <el-form :inline="true" :model="queryForm" label-width="100px" size="mini">
        <el-form-item label="字典名称：">
          <el-input v-model="queryForm.name" placeholder="字典名称"/>
        </el-form-item>
        <el-form-item label="字典编码：">
          <el-input v-model="queryForm.code" placeholder="字典编码"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查 询</el-button>
          <el-button type="info" icon="el-icon-circle-close" @click="handleReset">重 置</el-button>
        </el-form-item>
      </el-form>

      <div style="margin-top: 5px">
        <el-button type="primary" size="mini" icon="el-icon-view" @click="handleShow" v-permission="['menu:show']">查 看</el-button>
        <el-button type="success" size="mini" icon="el-icon-plus" @click="handleCreate" v-permission="['menu:add']">新 增</el-button>
        <el-button type="warning" size="mini" icon="el-icon-edit-outline" @click="handleUpdate" v-permission="['menu:update']">修 改</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleRemove" v-permission="['menu:delete']">删 除</el-button>
      </div>
    </el-card>

    <el-row>
      <el-col :span="24">
        <el-card class="box-card" shadow="always" style="margin-top: 5px">
          <div slot="header" class="clearfix">
            <span>字典列表</span>
          </div>
          <el-table
            ref="table"
            :data="tableData.records"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            row-key="id"
            highlight-current-row
            style="width: 100%"
            empty-text="暂无数据"
            :header-cell-style="{background:'#FAFAFA'}"
            @row-click="handleTableRowClick"
          >
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column prop="name" label="字典名称" width="250" :show-overflow-tooltip="true"/>
            <el-table-column prop="code" label="字典编码" width="230" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="dictType" label="字典类型" width="210" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="sort" label="排序" align="center" width="210" :show-overflow-tooltip="true" />
            <el-table-column prop="createTime" label="创建时间" align="center" :show-overflow-tooltip="true" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <jy-dict-form :id="editData.id" :title="editData.title" :parentName="editData.parentName" :parentId="editData.parentId" :visible.sync="editData.visiable"/>
    <jy-dict-detail :id="showData.id" :title="showData.title" :visible.sync="showData.visiable"/>
  </div>
</template>

<script>
import dictApi from '@/api/jy-dict'
import JyDictForm from '@/views/system/datadict/cascade-dict/jy-dict-form'
import JyDictDetail from '@/views/system/datadict/cascade-dict/jy-dict-detail'
import permission from '@/directive/permission' // 权限判断指令
export default {
  directives: { permission },
  name: 'JyDict',
  components: { JyDictDetail, JyDictForm},
  data() {
    return {
      queryForm: {
        name: '',
        code: ''
      },
      tableData: {
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
      actionTreeData: [],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const queryForm = {...this.queryForm}
      dictApi.layer(queryForm).then(response => {
        this.tableData.records = response.data
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
        this.$notify.warning({title: '警告', message: '请先选择一条数据'})
        return
      }
      this.showData.title = '查看字典'
      this.showData.id = this.selectData.current.id
      this.showData.visiable = true
    },
    handleCreate() {
      this.editData.title = '新增字典'
      this.editData.id = null
      this.editData.visiable = true
      if(this.selectData.current){
        this.editData.parentId = this.selectData.current.id
        this.editData.parentName = this.selectData.current.name
      }
    },
    handleUpdate() {
      if (!this.selectData.current) {
        this.$notify.warning({title: '警告', message: '请先选择一条数据'})
        return
      }
      this.editData.title = '修改字典'
      this.editData.id = this.selectData.current.id
      this.editData.visiable = true
    },
    handleRemove() {
      const selectRows = this.$refs.table.selection
      if (!selectRows || selectRows.length === 0) {
        this.$notify.warning({title: '警告', message: '请先选择一条数据'})
        return
      }
      this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        for (let i = 0; i < this.$refs.table.selection.length; i++) ids.push(this.$refs.table.selection[i].id)
        menuApi.remove(ids).then(response => {
          this.getList()
          this.$notify.success({title: '成功', message: '删除成功'})
        }).catch(e => {
          this.$notify.error({title: '失败', message: '删除失败'})
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
