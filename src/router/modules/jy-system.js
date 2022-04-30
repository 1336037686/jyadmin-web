/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/jy-system',
  component: Layout,
  redirect: '/jy-system/category',
  name: 'jy-system',
  meta: {
    title: '系统管理',
    icon: 'table'
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/jy-system/user/index'),
      name: 'jy-system-user',
      meta: { title: '用户管理', icon: 'table' }
    },
    {
      path: 'role',
      component: () => import('@/views/jy-system/role/index'),
      name: 'jy-system-role',
      meta: { title: '角色管理', icon: 'table' }
    },
    {
      path: 'permission-group',
      component: () => import('@/views/jy-system/permission-action/index'),
      name: 'jy-system-permission-group',
      meta: { title: '接口管理', icon: 'table' }
    },
    {
      path: 'menu',
      component: () => import('@/views/jy-system/permission-menu/index'),
      name: 'jy-system-permission-menu',
      meta: { title: '菜单管理', icon: 'table' }
    },
    {
      path: 'datadict',
      component: () => import('@/views/jy-blog/tag/index'),
      name: 'jy-system-datadict',
      meta: { title: '数据字典管理', icon: 'table' }
    },
    {
      path: 'handle-log',
      component: () => import('@/views/jy-system/log/index'),
      name: 'jy-system-handle-log',
      meta: { title: '操作日志管理', icon: 'table' }
    }
  ]
}

export default tableRouter
