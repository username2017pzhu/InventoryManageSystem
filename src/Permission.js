import router from './router'
import store from './store'
const checkToken = require('./token/checkToken')
router.beforeEach((to, from, next) => {
  const token = store.state.user.token
  const decoded = checkToken(token, 'cysto')
  const role = decoded.role
  if (token && role === 'editor' &&
    (to.path === '/employee' ||
      to.path === '/supplier' ||
      to.path === '/salesTable' ||
      to.path === '/employeeInfo' ||
      to.path === '/profitAn' ||
      to.path === '/empSalesAn' ||
      to.path === '/salesAn')) {
    next(false)
  } 
  else if(!token && to.path==='/login'){
    next({path:'/login'})
  }
  else{
    next()
  }
})
