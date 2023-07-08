<template>
  <el-dialog
    :title="title"
    :visible.sync="tmpVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    width="60%"
    class="jy-dialog"
  >
    <div
      v-loading="initloading"
      element-loading-text="加载中，请稍后..."
      element-loading-spinner="el-icon-loading"
    >
      <el-table
        ref="configDetailInfoTable"
        border
        :data="form.jsonObjs"
        highlight-current-row
        style="width: 100%"
        empty-text="暂无数据"
        :header-cell-style="{background:'#F5F7FA', color: '#303133', fontWeight: 700}"
        max-height="500"
      >
        <el-table-column prop="name" label="字段名称" width="180" align="center" show-overflow-tooltip />
        <el-table-column prop="code" label="字段编码" width="180" align="center" show-overflow-tooltip />
        <el-table-column prop="type" label="字段类型" width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getNameByCode(fieldTypeOptions, scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="defaultValue" label="缺省值" width="180" align="center" show-overflow-tooltip />
        <el-table-column prop="value" label="具体值" width="180" align="center" show-overflow-tooltip />
        <el-table-column prop="comment" label="注释" align="center" show-overflow-tooltip />
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="tmpVisible = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/api/system/config/jy-config-detail.js'
export default {
  props: {
    title: {
      type: String,
      default: 'Demo'
    },
    id: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      initloading: false,
      tmpVisible: this.visible,
      fieldTypeOptions: [],
      form: {
        id: null,
        name: null,
        templateId: null,
        code: null,
        status: 1,
        data: null,
        jsonObjs: []
      }
    }
  },
  watch: {
    visible(newVal) {
      this.tmpVisible = newVal
      if (newVal) {
        this.getById(this.id)
      }
    },
    tmpVisible(newVal) {
      this.$emit('update:visible', newVal)
    },
    deep: true
  },
  created() {
    this.getDictByCode('sys_configTemplate_fieldType').then(res => {
      this.fieldTypeOptions = res.data
    })
  },
  methods: {
    getById(id) {
      this.initloading = true
      api.getById(id).then(response => {
        this.initloading = false
        this.form = response.data
      }).catch(e => {
        this.initloading = false
      })
    }
  }
}
</script>

<style scoped>
/deep/ ::-webkit-scrollbar {
  width: 7px;
}

/deep/ ::-webkit-scrollbar-track {
  background-color: #f3f3f3;
}

/deep/ ::-webkit-scrollbar-thumb {
  background-color: #aaa;
}

/deep/ ::-webkit-scrollbar-thumb:hover {
  background-color: #aaa;
}

/deep/ ::-webkit-scrollbar-thumb:active {
  background-color: #aaa;
}
</style>
