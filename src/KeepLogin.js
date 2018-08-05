import router from './router'
import store from './store'
import checkToken from '@/token/checkToken'
router.beforeEach((to, from, next) => {
  const token = store.state.user.token
  if (to.path === '/login' || to.path === '/') {
    if (token) {
      next({
        path: '/home'
      })
    } else {
      next()
    }
  } else {
    next()
  }
  if (token) {
    const role = checkToken(token, 'cysto').role
    if (role === 'editor' && (to.path === '/employee')) {
      next({
        path: '/goods'
      })
    } else {
      next()
    }
  }
})
