<template>
  <div
    v-loading="deleteLoading"
    style="margin: 10px"
    element-loading-text="删除中，请稍后..."
    element-loading-spinner="el-icon-loading"
  >
    <el-row style="margin-top: 10px">
      <el-col :span="8" style="padding-right: 15px">
        <el-card class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-caret-right" /> 配置模板</span>
            <el-row style="float: right">
              <el-button icon="el-icon-search" circle size="mini" @click="() => this.queryFormVisiable = !this.queryFormVisiable" />
              <el-button icon="el-icon-refresh" circle size="mini" @click="getConfigTemplateList()" />
            </el-row>
          </div>
          <div>
            <el-form v-show="queryFormVisiable" :inline="true" label-width="85px" size="mini">
              <el-form-item label="模板名称：">
                <el-input v-model="configTemplateQueryForm.name" placeholder="模板名称" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getConfigTemplateList">查 询</el-button>
                <el-button type="info" icon="el-icon-circle-close" @click="configTemplateHandleReset">重 置</el-button>
              </el-form-item>
            </el-form>
            <div>
              <el-button type="primary" size="mini" icon="el-icon-view" @click="configTemplateHandleShow" />
              <el-button type="success" size="mini" icon="el-icon-plus" @click="configTemplateHandleCreate" />
              <el-button type="warning" size="mini" icon="el-icon-edit-outline" @click="configTemplateHandleUpdate" />
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="configTemplateHandleRemove" />
            </div>
          </div>
          <el-table
            ref="table"
            v-loading="configTemplateTableData.loading"
            element-loading-text="加载中，请稍后..."
            element-loading-spinner="el-icon-loading"
            :data="configTemplateTableData.records"
            highlight-current-row
            style="width: 100%;margin-top: 10px"
            empty-text="暂无数据"
            :header-cell-style="{background:'#F5F7FA', color: '#303133', fontWeight: 700}"
            @row-click="configTemplateHandleTableRowClick"
          >
            <el-table-column type="index" label="序号" align="center" width="80" />
            <el-table-column prop="name" label="模板名称" align="center" show-overflow-tooltip />
            <el-table-column prop="code" label="模板编码" align="center" show-overflow-tooltip />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card v-if="!configTemplateSelectData.current" class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-caret-right" /> 模板明细</span>
          </div>
          <div>
            <el-empty description="请先指定某个模板" />
            <!--            <el-alert title="请先指定某个模板" type="info" :closable="false" />-->
          </div>
        </el-card>
        <el-card v-if="configTemplateSelectData.current" class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-caret-right" /> 模板明细</span>
          </div>
          <div>
            <el-form :inline="true" label-width="90px" size="mini">
              <el-form-item>
                <el-button type="success" size="mini" icon="el-icon-plus" @click="configTemplateInfoHandleCreate">编 辑</el-button>
              </el-form-item>
            </el-form>
          </div>

          <el-table
            ref="actionTable"
            :data="configTemplateSelectData.current.jsonObjs"
            highlight-current-row
            style="width: 100%"
            empty-text="暂无数据"
            :header-cell-style="{background:'#F5F7FA', color: '#303133', fontWeight: 700}"
          >
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column prop="name" label="字段名称" width="200" align="center" show-overflow-tooltip />
            <el-table-column prop="code" label="字段编码" width="200" align="center" show-overflow-tooltip />
            <el-table-column prop="type" label="字段类型" width="200" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ getNameByCode(typeDict, scope.row.type) }}
              </template>
            </el-table-column>
            <el-table-column prop="defaultValue" label="缺省值" width="200" align="center" show-overflow-tooltip />
            <el-table-column prop="sort" label="排序" width="100" align="center" show-overflow-tooltip />
            <el-table-column prop="comment" label="注释" align="center" show-overflow-tooltip />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <jy-config-template-form :id="configTemplateEditData.id" :title="configTemplateEditData.title" :visible.sync="configTemplateEditData.visiable" />
    <jy-config-template-detail :id="configTemplateShowData.id" :title="configTemplateShowData.title" :visible.sync="configTemplateShowData.visiable" />
    <jy-config-template-info-form :id="configTemplateInfoEditData.id" :title="configTemplateInfoEditData.title" :visible.sync="configTemplateInfoEditData.visiable" />

  </div>
</template>

<script>
import configTemplateApi from '@/api/system/config/jy-config-template.js'
import JyConfigTemplateForm from '@/views/system/config/template/config-template-form'
import JyConfigTemplateDetail from '@/views/system/config/template/config-template-detail'
import JyConfigTemplateInfoForm from '@/views/system/config/template/config-template-info-form'

export default {
  components: { JyConfigTemplateForm, JyConfigTemplateDetail, JyConfigTemplateInfoForm },
  data() {
    return {
      typeDict: [],
      deleteLoading: false,
      queryFormVisiable: true,
      configTemplateQueryForm: {
        name: ''
      },
      configTemplateTableData: {
        loading: false,
        records: []
      },
      configTemplateEditData: {
        visiable: false,
        title: '',
        id: null
      },
      configTemplateInfoEditData: {
        visiable: false,
        title: '',
        id: null
      },
      configTemplateShowData: {
        visiable: false,
        title: '',
        id: null
      },
      configTemplateSelectData: {
        current: null
      }
    }
  },
  created() {
    this.init()
    this.getConfigTemplateList()
  },
  methods: {
    init() {
      this.getDictByCode('sys_configTemplate_fieldType').then(res => {
        this.typeDict = res.data
      })
    },
    // configTemplate
    getConfigTemplateList() {
      this.configTemplateTableData.loading = true
      configTemplateApi.getList(this.configTemplateQueryForm).then(response => {
        this.configTemplateTableData.records = response.data
        if (!this.configTemplateTableData.records && this.configTemplateTableData.records.length === 0) {
          this.configTemplateSelectData.current = null
          return
        }

        const firstRow = this.configTemplateTableData.records[0]
        this.configTemplateSelectData.current = firstRow
        this.$refs.table.setCurrentRow(firstRow)
        this.configTemplateTableData.loading = false
      })
    },
    configTemplateHandleReset() {
      this.configTemplateQueryForm.name = ''
      this.getConfigTemplateList()
    },
    configTemplateHandleShow() {
      if (!this.configTemplateSelectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.configTemplateShowData.title = '查看'
      this.configTemplateShowData.id = this.configTemplateSelectData.current.id
      this.configTemplateShowData.visiable = true
    },
    configTemplateHandleCreate() {
      this.configTemplateEditData.title = '新增'
      this.configTemplateEditData.id = null
      this.configTemplateEditData.visiable = true
    },
    configTemplateHandleUpdate() {
      if (!this.configTemplateSelectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.configTemplateEditData.title = '修改'
      this.configTemplateEditData.id = this.configTemplateSelectData.current.id
      this.configTemplateEditData.visiable = true
    },
    configTemplateHandleRemove() {
      const selectRow = this.configTemplateSelectData.current
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
        configTemplateApi.remove(ids).then(response => {
          this.deleteLoading = false
          this.$notify.success({ title: '成功', message: '删除成功' })
          this.getConfigTemplateList()
        }).catch(e => {
          this.deleteLoading = false
        })
      })
    },
    configTemplateHandleTableRowClick(row, column, event) {
      this.configTemplateSelectData.current = row
    },
    configTemplateInfoHandleCreate() {
      const selectRow = this.configTemplateSelectData.current
      if (!selectRow) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.configTemplateInfoEditData.title = '编辑'
      this.configTemplateInfoEditData.id = selectRow.id
      this.configTemplateInfoEditData.visiable = true
    }
  }
}
</script>
<style scoped>

</style>
