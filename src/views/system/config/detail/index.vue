<template>
  <div style="margin: 10px">
    <el-row style="margin-top: 10px">
      <el-col :span="7" style="padding-right: 15px">
        <el-card class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-caret-right" /> 配置模板列表</span>
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
            @row-click="configTemplateRowClick"
          >
            <el-table-column type="index" label="序号" align="center" width="80" />
            <el-table-column prop="name" label="模板名称" align="center" show-overflow-tooltip />
            <el-table-column prop="code" label="模板编码" align="center" show-overflow-tooltip />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="17">
        <el-card v-if="!configTemplateSelectData.current" class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-caret-right" /> 具体配置</span>
          </div>
          <div>
            <el-empty description="请先指定某个模板" />
            <!--            <el-alert title="请先指定某个模板" type="info" :closable="false" />-->
          </div>
        </el-card>
        <el-card v-if="configTemplateSelectData.current" class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-caret-right" /> 具体配置</span>
          </div>
          <div>
            <el-form :inline="true" label-width="90px" size="mini">
              <el-form-item>
                <el-button type="success" size="mini" icon="el-icon-plus" @click="configDetailCreate">新 增</el-button>
                <el-button type="warning" size="mini" icon="el-icon-edit-outline" @click="configDetailUpdate">修 改</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="configDetailRemove">删 除</el-button>
              </el-form-item>
            </el-form>
          </div>

          <el-table
            ref="configDetailTable"
            v-loading="configDetailTableData.loading"
            element-loading-text="加载中，请稍后..."
            element-loading-spinner="el-icon-loading"
            :data="configDetailTableData.records"
            highlight-current-row
            style="width: 100%"
            empty-text="暂无数据"
            :header-cell-style="{background:'#F5F7FA', color: '#303133', fontWeight: 700}"
            @row-click="configDetailTableRowClick"
          >
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column prop="name" label="配置名称" align="center" show-overflow-tooltip />
            <el-table-column prop="code" label="配置编码" align="center" show-overflow-tooltip />
            <el-table-column prop="status" label="是否启用" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="启用"
                  inactive-text="禁用"
                  :active-value="1"
                  :inactive-value="0"
                  @change="configDetailStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip />
            <el-table-column label="操作" align="center" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="configDetailShow(scope.row.id)">查看配置详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <jy-config-detail-form :id="configDetailEditData.id" :title="configDetailEditData.title" :template="configDetailEditData.template" :visible.sync="configDetailEditData.visiable" />
    <jy-config-detail-detail :id="configDetailShowData.id" :title="configDetailShowData.title" :visible.sync="configDetailShowData.visiable" />
  </div>
</template>

<script>
import configTemplateApi from '@/api/system/config/jy-config-template.js'
import configDetailApi from '@/api/system/config/jy-config-detail.js'
import JyConfigDetailForm from '@/views/system/config/detail/config-detail-form'
import JyConfigDetailDetail from '@/views/system/config/detail/config-detail-detail'

export default {
  components: { JyConfigDetailForm, JyConfigDetailDetail },
  data() {
    return {
      queryFormVisiable: true,
      configTemplateQueryForm: {
        name: ''
      },
      configTemplateTableData: {
        loading: false,
        records: []
      },
      configTemplateSelectData: {
        current: null
      },
      configDetailQueryForm: {
        templateId: null
      },
      configDetailTableData: {
        loading: false,
        records: []
      },
      configDetailSelectData: {
        current: null
      },
      configDetailEditData: {
        template: null,
        visiable: false,
        title: null,
        id: null
      },
      configDetailShowData: {
        visiable: false,
        title: null,
        id: null
      }
    }
  },
  created() {
    this.getConfigTemplateList()
  },
  methods: {
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
        this.getConfigDetailList()
      })
    },
    configTemplateHandleReset() {
      this.configTemplateQueryForm.name = ''
      this.getConfigTemplateList()
    },
    configTemplateRowClick(row, column, event) {
      this.configTemplateSelectData.current = row
      this.getConfigDetailList()
    },
    getConfigDetailList() {
      this.configDetailQueryForm.templateId = this.configTemplateSelectData.current.id
      this.configDetailSelectData.current = null
      this.configDetailTableData.loading = true
      configDetailApi.getList(this.configDetailQueryForm).then(response => {
        this.configDetailTableData.records = response.data
        this.configDetailTableData.loading = false
      })
    },
    configDetailTableRowClick(row, column, event) {
      this.configDetailSelectData.current = row
      this.$refs.configDetailTable.toggleRowSelection(row)
    },
    configDetailShow(configDetailId) {
      this.configDetailShowData.title = '查看配置'
      this.configDetailShowData.id = configDetailId
      this.configDetailShowData.visiable = true
    },
    configDetailCreate() {
      this.configDetailEditData.template = this.configTemplateSelectData.current
      this.configDetailEditData.title = '新增'
      this.configDetailEditData.id = null
      this.configDetailEditData.visiable = true
    },
    configDetailUpdate() {
      if (!this.configDetailSelectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.configDetailEditData.template = this.configTemplateSelectData.current
      this.configDetailEditData.title = '修改'
      this.configDetailEditData.id = this.configDetailSelectData.current.id
      this.configDetailEditData.visiable = true
    },
    configDetailRemove() {
      const selectRows = this.configDetailSelectData.current
      if (!selectRows) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'jy-message-box'
      }).then(() => {
        const ids = [this.configDetailSelectData.current.id]
        configDetailApi.remove(ids).then(response => {
          this.getConfigDetailList()
          this.$notify.success({ title: '成功', message: '删除成功' })
        }).catch(e => {
          console.error(e)
        })
      })
    },
    configDetailStatusChange(data) {
      configDetailApi.update(data).then(response => {
        this.$notify.success({ title: '成功', message: '状态修改成功' })
        this.getConfigDetailList()
      }).catch(e => {
        console.error(e)
      })
    }
  }
}
</script>
<style scoped>

</style>

