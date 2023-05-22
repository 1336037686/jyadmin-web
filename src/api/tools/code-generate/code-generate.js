import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/code-generator/query',
      method: 'get',
      params: query
    })
  },
  getById(id) {
    return request({
      url: '/api/code-generator/query/' + id,
      method: 'get'
    })
  },
  preview(tableId) {
    return request({
      url: '/api/code-generator/generate-preview/' + tableId,
      method: 'get'
    })
  },
  getFieldType() {
    return request({
      url: '/api/code-generator/query-field-type',
      method: 'get'
    })
  },
  getSingleTableById(id) {
    return request({
      url: '/api/code-generator/query-sigle-table/' + id,
      method: 'get'
    })
  },
  getTableOptions(query) {
    return request({
      url: '/api/code-generator/query-table-options',
      method: 'get',
      params: query
    })
  },
  add(data) {
    return request({
      url: '/api/code-generator/create',
      method: 'post',
      data
    })
  },
  importTable(tableName) {
    return request({
      url: '/api/code-generator/create/table/' + tableName,
      method: 'post'
    })
  },
  updateConfig(data) {
    return request({
      url: '/api/code-generator/update/table-config',
      method: 'put',
      data
    })
  },
  tableSync(tableId) {
    return request({
      url: '/api/code-generator/update/table/' + tableId,
      method: 'put'
    })
  },
  remove(data) {
    return request({
      url: '/api/code-generator/remove/table',
      method: 'delete',
      data
    })
  },
  download(id) {
    return request({
      url: '/api/code-generator/generate/' + id,
      method: 'get',
      responseType: 'blob'
    })
  }
}
