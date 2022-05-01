import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const roles = store.getters && store.getters.permissions

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionCodes = value

      const hasPermission = roles.some(permission => {
        return permissionCodes.includes(permission)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need permissionCode! Like v-permission="['order:add','order:delete']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
