/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/jy-blog',
  component: Layout,
  redirect: '/jy-blog/category',
  name: 'jy-blog',
  meta: {
    title: '博客管理',
    icon: 'table'
  },
  children: [
    {
      path: 'category',
      component: () => import('@/views/blog/category/index'),
      name: 'jy-blog-category',
      meta: { title: '类别管理', icon: 'table' }
    },
    {
      path: 'tag',
      component: () => import('@/views/blog/tag/index'),
      name: 'jy-blog-tag',
      meta: { title: '标签管理', icon: 'table' }
    }
  ]
}

export default tableRouter
