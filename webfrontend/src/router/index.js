import Vue from 'vue'
import VueRouter from 'vue-router'

const Login =() => import('@/views/Login')
const Home =() => import('@/views/Home')
const main =() => import('@/views/index')
const Account =() => import('@/views/user/Account')
const CustomerInfo =() => import('@/views/user/CustomerInfo')
const SupplierInfo =() => import('@/views/user/SupplierInfo')
const GoodsType =() => import('@/views/store/GoodsType')
const Inventory =() => import('@/views/store/Inventory')
const InStore =() => import('@/views/store/InStore')
const OrderInfo =() => import('@/views/store/OrderInfo')
const SalesInfo =() =>　import('@/views/sales/SalesInfo')
const SalesOut =() => import('@/views/sales/SalesOut')
const Replenish =() => import('@/views/sales/ReplenishShop')
const VerifyCheck =() => import('@/views/sales/VerifyCheck')
const Verify =() => import('@/views/sales/verify/Verify')
const CheckSales =() => import('@/views/sales/verify/CheckSales')
const notFount =() => import('@/views/sys/NotFound')

Vue.use(VueRouter)

// 解决同一路由多次添加问题
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to){
  return VueRouterPush.call(this,to).catch(err => err)
}

//固定的路由表
const routes = [
  {
    path:'',
    redirect:'/login',
    meta:{
      title:'登录'
    }
  },
  {
    path: '/login',
    component:Login,
    name:'登录',
    meta:{
      title:'登录'
    }
  },
  {
    path:'/404',
    name:'Not Found',
    component:notFount,
  },
  {
    path: '/home',
    component: Home,
    meta: {
      title: '首页',
      // roles:['0','1'],// 权限判断，0为管理员,1为普通员工
      // icon:'el-icon-s-home'
    },
    children:[
      {
        path:'',
        name:'首页',
        redirect:'/home/main'
      },
      {
        path:'/home/main',
        name:'首页',
        component:main
      },
      {
        path:'/home/account',
        name:'账号管理',
        component:Account,
        meta:{
          roles:['0']
        }
      },
      {
        path:'/home/customer',
        name:'客户管理',
        component:CustomerInfo,
        meta:{
          roles:['0'],
        }
      },
      {
        path:'/home/supplier',
        component:SupplierInfo,
        mete:{
          title:'供货商管理'
        }
      },
      {
        path:'/home/goods',
        name:'商品种类',
        component:GoodsType
      },
      {
        path:'/home/inventory',
        name:'库存盘点',
        component:Inventory
      },
      {
        path:'/home/inStore',
        name:'订单入库',
        component:InStore
      },
      {
        path:'/home/order',
        name:'采购订单',
        component:OrderInfo
      },
      {
        path:'/home/sales',
        name:'销售订单',
        component:SalesInfo
      },
      {
        path:'/home/salesOut',
        name:'销售出库',
        component:SalesOut
      },
      {
        path:'/home/replenish',
        name:'店铺补货',
        component:Replenish
      },
      {
        path:'/home/verify',
        component:VerifyCheck,
        children:[
          {
              path:'',
              name:'审核补货单',
              redirect:'/home/verify/replenish'
          },
          {
            path:'/home/verify/replenish',
            name:'审核补货单',
            component:Verify,
          },
          {
            path:'/home/verify/check',
            name:'验收销售单',
            component:CheckSales,
          }
      ]
      }
    ]
  },
  {
    path:'*',
    redirect:'/404',
    name:'Not Found'
  }
]

const router = new VueRouter({
  routes,
  mode:'history',
  base:'InvoicingManagementSystem',
  linkActiveClass:'active'
})
/*全局前置守卫*/
router.beforeEach((to,from,next) => {
  document.title = to.matched[0].meta.title
  //判断用户是否登录 没登录跳转到登录界面
  if(to.path === '/login' || to.path === ''){
    next()
  }else{
    let token = sessionStorage.getItem('Authorization')
    if(!token){
      alert("请先登录")
       router.push({
        path:'/login'
      })
    }else{
      next()
    }
  }
})

export default router
