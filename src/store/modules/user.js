import checkToken from '../../token/checkToken'
const user = {
  state: {
    token: window.localStorage.getItem('token'),
    admName: '',
    role: '',
  },
  actions: {
    userLogin({
      commit
    }, data) {
      commit('LOGIN', data);
    },
    userLogout({
      commit
    }) {
      commit('LOGOUT');
    },
    getRole({
      commit
    }) {
      commit('GET_ROLE')
    }
  },
  mutations: {
    ['LOGIN']: (state, data) => {
      //更改token的值
      state.token = data;
      window.localStorage.setItem('token', data);
    },
    ['LOGOUT']: (state) => {
      //登出的时候要清除token
      state.token = null;
      window.localStorage.removeItem('token');
    },
    ['GET_ROLE']: (state) => {
      const decoded=checkToken(state.token, 'cysto')
      state.admName=decoded.admName
      state.role = decoded.role
    },
  },
  getters: {
    role:state=>state.role  
  }
}

export default user
