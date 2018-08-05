import axios from 'axios'
import store from '@/store'
import router from '../router'
const instance=axios.create({
  timeout:5000
});
instance.interceptors.request.use(config=>{
  if(store.state.user.token){
    config.headers['cy-token']=`${store.state.user.token}`
  }
  return config
},
error=>{
  return Promise.reject(error)
})
export default instance