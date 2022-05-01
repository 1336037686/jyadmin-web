<template>
  <div style="margin: 10px;">
    <el-card class="box-card" shadow="always">
      <el-form :inline="true" :model="queryForm" label-width="100px" size="mini">
        <el-form-item label="菜单名称：">
          <el-input v-model="queryForm.name" placeholder="菜单名称"/>
        </el-form-item>
        <el-form-item label="菜单标识：">
          <el-input v-model="queryForm.code" placeholder="菜单标识"/>
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
      <el-col :span="18">
        <el-card class="box-card" shadow="always" style="margin-top: 5px">
          <div slot="header" class="clearfix">
            <span>菜单列表</span>
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
            <el-table-column prop="name" label="菜单标题" width="180"/>
            <!-- <el-table-column prop="code" label="菜单标识" width="200" align="center"/>-->
            <el-table-column prop="icon" label="图标" width="80" align="center">
              <template slot-scope="scope">
                <i :class="scope.row.icon"/>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="菜单类别" width="100" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.type === 0" size="mini" effect="plain"> C 目 录</el-tag>
                <el-tag v-if="scope.row.type === 1" size="mini" effect="plain" type="success"> M 菜 单</el-tag>
                <el-tag v-if="scope.row.type === 2" size="mini" effect="plain" type="warning"> B 按 钮</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="url" label="路由地址" align="center"/>
            <el-table-column prop="path" label="组件路径" align="center"/>
            <el-table-column prop="link" label="外链" width="80" align="center">
              <template slot-scope="scope">
                {{ scope.row.link === 0 ? '否' : '是' }}
              </template>
            </el-table-column>
            <el-table-column prop="cache" label="缓存" width="80" align="center">
              <template slot-scope="scope">
                {{ scope.row.cache === 0 ? '否' : '是' }}
              </template>
            </el-table-column>
            <el-table-column prop="visiable" label="可见" width="80" align="center">
              <template slot-scope="scope">
                {{ scope.row.visiable === 0 ? '否' : '是' }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 1" size="mini" effect="plain" type="success"> 启 用</el-tag>
                <el-tag v-if="scope.row.status === 0" size="mini" effect="plain" type="danger"> 禁 用</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="80" align="center"/>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="6" style="padding-left: 10px">
        <el-card class="box-card" shadow="always" style="margin-top: 5px">
          <div slot="header" class="clearfix">
            <span>接口分配</span>
            <el-button style="float: right;" size="mini" type="primary" icon="el-icon-circle-check" @click="handleUpdateMenuActions" v-permission="['menu:addAction']">保存</el-button>
          </div>

          <el-tree
            :data="actionTreeData"
            show-checkbox
            node-key="id"
            empty-text="暂无数据"
            ref="actionTree"
            highlight-current
            default-expand-all
            :props="{children: 'children', label: 'name' }">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span style="font-size: 14px;">{{ node.label }}</span>
              <span>{{data.code}}</span>
            </span>
          </el-tree>

        </el-card>
      </el-col>
    </el-row>
    <jy-permission-menu-form :id="editData.id" :title="editData.title" :visible.sync="editData.visiable"/>
    <jy-permission-menu-detail :id="showData.id" :title="showData.title" :visible.sync="showData.visiable"/>
  </div>
</template>

<script>
import menuApi from '@/api/jy-permission-menu'
import actionApi from '@/api/jy-permission-action'
import JyPermissionMenuForm from '@/views/jy-system/permission-menu/permission-menu-form'
import JyPermissionMenuDetail from '@/views/jy-system/permission-menu/permission-menu-detail'
import permission from '@/directive/permission/index.js' // 权限判断指令
export default {
  directives: { permission },
  name: 'JyPermissionMenu',
  components: { JyPermissionMenuDetail, JyPermissionMenuForm},
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
    this.getTree()
  },
  methods: {
    getList() {
      const queryForm = {...this.queryForm}
      menuApi.layer(queryForm).then(response => {
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
      this.showData.title = '查看菜单'
      this.showData.id = this.selectData.current.id
      this.showData.visiable = true
    },
    handleCreate() {
      this.editData.title = '新增菜单'
      this.editData.id = null
      this.editData.visiable = true
    },
    handleUpdate() {
      if (!this.selectData.current) {
        this.$notify.warning({title: '警告', message: '请先选择一条数据'})
        return
      }
      this.editData.title = '修改菜单'
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

      // 获取菜单权限
      this.getMenuActions()
    },
    getTree() {
      actionApi.tree().then(response => {
        this.actionTreeData = response.data
      })
    },
    getMenuActions() {
      this.$refs.actionTree.setCheckedKeys([]);

      if (!this.selectData.current) return
      if (this.selectData.current.type === 0) return
      actionApi.getFromMenu(this.selectData.current.id).then(response => {
        let checkedKeys = response.data
        checkedKeys = !checkedKeys ? [] : checkedKeys
        this.$refs.actionTree.setCheckedKeys(checkedKeys);
      })
    },
    handleUpdateMenuActions() {
      if (!this.selectData.current) {
        this.$notify.warning({title: '警告', message: '请先选择一条数据'})
        return
      }

      if (this.selectData.current.type === 0) {
        this.$notify.warning({title: '警告', message: '目录类型记录无法配置权限，请选择菜单或者按钮'})
        return
      }

      let checkedNodes = this.$refs.actionTree.getCheckedNodes()
      let actionIds = []
      if (checkedNodes && checkedNodes.length > 0) {
        for (let i = 0; i < checkedNodes.length; i++) {
          if (checkedNodes[i].type === 'action') {
            actionIds.push(checkedNodes[i].id)
          }
        }
      }

      actionApi.addFromMenu(this.selectData.current.id, actionIds).then(response => {
        this.$notify.success({ title: '成功', message: '设置成功' })
        this.getMenuActions()
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
