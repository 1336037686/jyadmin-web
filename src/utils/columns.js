/**
 * 检查table的列是否展示
 * @param code 列的key
 * @param columns 所有列数组
 * @returns {boolean} /
 */
function checkColumnDisplayed(code, columns) {
  if (!columns || columns.length === 0) return false
  for (let i = 0; i < columns.length; i++) {
    if (code === columns[i].key && columns[i]._showed) return true
  }
  return false
}

export default {
  install(Vue) {
    /**
     * 检查table的列是否展示
     * @param code 列的key
     * @param columns 所有列数组
     * @returns {boolean} /
     */
    Vue.prototype.checkColumnDisplayed = checkColumnDisplayed
  }
}
