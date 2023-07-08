<template>
  <div
    v-loading="deleteLoading"
    style="margin: 10px"
    element-loading-text="删除中，请稍后..."
    element-loading-spinner="el-icon-loading"
  >
    <el-card class="box-card" shadow="always">
      <el-form v-show="queryFormVisiable" :inline="true" :model="queryForm" label-width="100px">
        <el-form-item label="操作用户：">
          <el-input v-model="queryForm.username" placeholder="操作用户" />
        </el-form-item>
        <el-form-item label="操作名称：">
          <el-input v-model="queryForm.handleName" placeholder="操作名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查 询</el-button>
          <el-button type="info" icon="el-icon-circle-close" @click="handleReset">重 置</el-button>
        </el-form-item>
      </el-form>

      <div style="margin-top: 5px">
        <el-button type="primary" icon="el-icon-view" @click="handleShow">查 看</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleRemove">删 除</el-button>
      </div>
    </el-card>

    <el-card class="box-card" shadow="always" style="margin-top: 5px">
      <div slot="header" class="clearfix">
        <span><i class="el-icon-caret-right" /> 行为日志列表</span>
        <el-row style="float: right">
          <el-button icon="el-icon-search" circle size="mini" @click="() => this.queryFormVisiable = !this.queryFormVisiable" />
          <el-button icon="el-icon-refresh" circle size="mini" @click="getList()" />
        </el-row>
      </div>
      <el-table
        ref="table"
        v-loading="loading"
        element-loading-text="加载中，请稍后..."
        element-loading-spinner="el-icon-loading"
        :data="tableData.records"
        highlight-current-row
        style="width: 100%"
        empty-text="暂无数据"
        :header-cell-style="{background:'#F5F7FA', color: '#303133', fontWeight: 700}"
        @row-click="handleTableRowClick"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" width="55" label="序号" align="center" />
        <el-table-column prop="username" label="操作用户" align="center" width="180" show-overflow-tooltip />
        <el-table-column prop="handleName" label="操作名称" align="center" show-overflow-tooltip />
        <el-table-column prop="handleDesc" label="操作描述" align="center" show-overflow-tooltip />
        <el-table-column prop="ipAddress" label="IP地址" align="center" width="150" show-overflow-tooltip />
        <el-table-column prop="ipArea" label="所属地区" align="center" width="150" show-overflow-tooltip />
        <!--        <el-table-column prop="browser" label="浏览器" align="center"  width="150" />-->
        <!--        <el-table-column prop="application" label="设备" />-->
        <el-table-column prop="requestPath" label="请求路径" align="center" show-overflow-tooltip />
        <el-table-column prop="requestMethod" label="请求类型" align="center" width="100" show-overflow-tooltip />
        <!--        <el-table-column prop="requestParam" label="请求参数" />-->
        <el-table-column prop="requestTime" label="请求时间" align="center" show-overflow-tooltip />
        <!--        <el-table-column prop="method" label="请求类方法" />-->
        <el-table-column prop="executeStatus" label="执行状态" align="center" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.executeStatus === 1" size="mini" effect="plain" type="success"> 成 功 </el-tag>
            <el-tag v-if="scope.row.executeStatus === 0" size="mini" effect="plain" type="danger"> 失 败 </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="executeTime" label="耗时(ms)" align="center" width="100" />
        <!--        <el-table-column prop="responseData" label="返回数据" :show-overflow-tooltip="true" />-->
        <!--        <el-table-column prop="errorDesc" label="异常内容" />-->
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="primary" size="mini">
                更多详情<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1" @click.native="handleShowParam(1, '请求参数', scope.row)">请求参数</el-dropdown-item>
                <el-dropdown-item command="2" @click.native="handleShowParam(2, '返回数据', scope.row)">返回数据</el-dropdown-item>
                <el-dropdown-item command="3" @click.native="handleShowParam(3, '异常内容', scope.row)">异常内容</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
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
    <jy-log-detail :id="showData.id" :title="showData.title" :visible.sync="showData.visiable" />
    <el-drawer
      size="40%"
      :wrapper-closable="false"
      :title="showParam.title"
      :visible.sync="showParam.visiable"
      class="jy-drawer"
    >
      <div class="json-editor" style="margin: 5px">
        <codemirror v-model="showParam.code" class="code" :options="showParam.cmOptions" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import logApi from '@/api/monitor/log/jy-log'
import JyLogDetail from '@/views/monitor/log/activity-log/log-detail'

import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/keymap/sublime' // sublime编辑器效果
import 'codemirror/theme/dracula.css'// 配置里面也需要theme设置为monokai
import 'codemirror/mode/vue/vue.js' // 配置里面也需要mode设置为vue
import 'codemirror/addon/selection/active-line' // 光标行背景高亮，配置里面也需要styleActiveLine设置为true

export default {
  components: { JyLogDetail, codemirror },
  data() {
    return {
      queryFormVisiable: true,
      deleteLoading: false,
      queryForm: {
        username: '',
        handleName: ''
      },
      loading: false,
      tableData: {
        pageNumber: 1,
        pageSize: 10,
        pages: 1,
        total: 1,
        records: [],
        hasPrevious: false,
        hasNext: false
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
      showParam: {
        visiable: false,
        title: '',
        // 代码
        code: 'hello world',
        cmOptions: {
          tabSize: 4, // tab的空格个数
          theme: 'monokai', // 主题样式
          lineNumbers: true, // 是否显示行数
          lineWrapping: false, // 是否自动换行
          styleActiveLine: true, // line选择是是否加亮
          matchBrackets: true, // 括号匹配
          mode: 'json', // 实现javascript代码高亮
          readOnly: true// 只读
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const queryForm = { ...this.queryForm, pageNumber: this.tableData.pageNumber, pageSize: this.tableData.pageSize }
      logApi.getActiveList(queryForm).then(response => {
        this.tableData = response
        this.loading = false
      })
    },
    handleQuery() {
      this.tableData.pageNumber = 1
      this.getList()
    },
    handleReset() {
      this.queryForm.handleName = ''
      this.queryForm.username = ''
      this.tableData.pageNumber = 1
      this.getList()
    },
    handleShow() {
      if (!this.selectData.current) {
        this.$notify.warning({ title: '警告', message: '请先选择一条数据' })
        return
      }
      this.showData.title = '查看日志'
      this.showData.id = this.selectData.current.id
      this.showData.visiable = true
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
        logApi.remove(ids).then(response => {
          this.deleteLoading = false
          this.getList()
          this.$notify.success({ title: '成功', message: '删除成功' })
        }).catch(e => {
          this.deleteLoading = false
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
    },
    handleShowParam(command, title, row) {
      console.log(command, title, row)
      this.showParam.title = title
      this.showParam.visiable = true
      this.showParam.code = command === 1 ? row.requestParam : (command === 2 ? row.responseData : row.errorDesc)
      this.showParam.code = this.showParam.code ? this.showParam.code : ''
    }
  }
}
</script>
<style lang="scss" scoped>
  .code {
    height: 100%;
    position: relative;

    ::v-deep {
      .CodeMirror {
        height: auto;
        min-height: 500px;
      }

      .CodeMirror-scroll {
        min-height: 500px;
      }

      .cm-s-rubyblue span.cm-string {
        color: #F08047;
      }
    }
  }
</style>
