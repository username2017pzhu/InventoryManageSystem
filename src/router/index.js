import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      component: resolve => require(['../components/pages/Login/Login.vue'], resolve),
      redirect:'/login',
    },
    {
      path: '/login',
      component: resolve => require(['../components/pages/Login/Login.vue'], resolve),
      name: '登录',
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      children: [{
        path: '/employee',
        component: resolve => require(['../components/pages/Person/Employee.vue'], resolve),
        name: '员工管理',
        meta:{
          requiresAuth:true
        }
      },
      {
        path: '/supplier',
        component: resolve => require(['../components/pages/Person/Supplier.vue'], resolve),
        name: '供应商管理',
        meta:{
          requiresAuth:true
        }
      }]
    },
    {
      path: '/home',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      redirect:'/goods',
      children: [{
        path: '/goods',
        component: resolve => require(['../components/pages/Goods/Goods.vue'], resolve),
        name: '商品管理',
        meta:{
          requiresAuth:true
        }
      },
      {
        path: '/types',
        component: resolve => require(['../components/pages/Goods/Types.vue'], resolve),
        name: '分类管理',
        meta:{
          requiresAuth:true
        }
      }
    ]
    },

    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      children: [{
        path: '/stock',
        component: resolve => require(['../components/pages/Procurement/Stock.vue'], resolve),
        name: '采购管理',
        meta:{
          requiresAuth:true
        }
      },
      {
        path: '/stockReturn',
        component: resolve => require(['../components/pages/Procurement/StockReturn.vue'], resolve),
        name: '采购退货',
        meta:{
          requiresAuth:true
        }
      }]
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      children: [{
        path: '/sales',
        component: resolve => require(['../components/pages/Sales/SalesAdd.vue'], resolve),
        name: '销售添加',
        meta:{
          requiresAuth:true
        }
      },
      {
        path: '/salesManage',
        component: resolve => require(['../components/pages/Sales/SalesManage.vue'], resolve),
        name: '销售管理',
        meta:{
          requiresAuth:true
        }
      },
      {
        path: '/salesReturn',
        component: resolve => require(['../components/pages/Sales/SalesReturn.vue'], resolve),
        name: '销售退货',
        meta:{
          requiresAuth:true
        }
      }]
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      children: [{
        path: '/inventory',
        component: resolve => require(['../components/pages/Inventory/Inventory.vue'], resolve),
        name: '库存管理',
        meta:{
          requiresAuth:true
        }
      }]
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      children: [
        {
        path: 'salesTable',
        component: resolve => require(['../components/pages/Tables/SalesTable.vue'], resolve),
        name: '员工销售表',
        meta:{
          requiresAuth:true
        }
      },
        {
        path: 'supplierTable',
        component: resolve => require(['../components/pages/Tables/SupplierTable.vue'], resolve),
        name: '供应商报表',
        meta:{
          requiresAuth:true
        }
      },
        {
        path: 'procurementTable',
        component: resolve => require(['../components/pages/Tables/ProcurementTable.vue'], resolve),
        name: '商品采购表',
        meta:{
          requiresAuth:true
        }
      },
      {
        path: '/employeeInfo',
        component: resolve => require(['../components/pages/Tables/EmployeeInfo.vue'], resolve),
        name: '员工信息',
        meta:{
          requiresAuth:true
        }
      }
    ]
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      children: [
        {
          path: '/profitAn',
          component: resolve => require(['../components/pages/DataAn/ProfitAn.vue'], resolve),
          name: '盈利分析',
          meta:{
            requiresAuth:true
          }
        },
        {
          path: '/goodsSalesAn',
          component: resolve => require(['../components/pages/DataAn/GoodsSalesAn.vue'], resolve),
          name: '商品销售分析',
          meta:{
            requiresAuth:true
          }
        },
        {
          path: '/empSalesAn',
          component: resolve => require(['../components/pages/DataAn/EmpSalesAn.vue'], resolve),
          name: '员工销售分析',
          meta:{
            requiresAuth:true
          }
        }
      ]
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      children: [
        {
          path: '/changeInfo',
          component: resolve => require(['../components/pages/System/ChangeInfo.vue'], resolve),
          name: '修改资料',
          meta:{
            requiresAuth:true
          }
        },
        {
          path: '/changePermission',
          component: resolve => require(['../components/pages/System/ChangePermission.vue'], resolve),
          name: '权限管理',
          meta:{
            requiresAuth:true
          }
        }
      ]
    },
  ]
})
