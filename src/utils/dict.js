import request from '@/utils/request-api'

/**
 * 根据code查询字典
 * @param code 字典父节点code
 * @returns {AxiosPromise} 字典list
 */
function getDictByCode(code) {
  return request({
    url: '/api/simple-data-dict-detail/queryByCode/' + code,
    method: 'get'
  })
}

/**
 *
 * @param datadicts 字典列表
 * @param code 字典code
 * @returns {null|*} 字典名称
 */
function getNameByCode(datadicts, code) {
  if (!datadicts) return null
  for (let i = 0; i < datadicts.length; i++) {
    const dict = datadicts[i]
    if (dict.code === code) return dict.name
  }
}

export default {
  install(Vue) {
    /**
     * 根据code获取字典列表
     * @param code 字典code
     * @returns {AxiosPromise}
     */
    Vue.prototype.getDictByCode = getDictByCode

    /**
       * 根据code获取字典名称
       * getNameByCode
       */
    Vue.prototype.getNameByCode = getNameByCode
  }
}
