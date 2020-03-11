import Vue from 'vue'
import VueX from 'vuex'

Vue.use(VueX)

const store = new VueX.Store({
  state: {
    //1.定义变量
    //存储token
    Authorization:sessionStorage.getItem('Authorization') ? sessionStorage.getItem('Authorization') : '',
    USER_ACCOUNT:sessionStorage.getItem('USER_ACCOUNT')?sessionStorage.getItem('USER_ACCOUNT'):'',
  },
  mutations: {
    //2.赋值
    changeLogin:(state,account) =>{
      state.Authorization = account.Authorization.token
      sessionStorage.setItem('Authorization',account.Authorization.token)
    },
    SET_ACCOUNT_NAME:(state,accountName) =>{
      state.USER_ACCOUNT = accountName
      sessionStorage.setItem('USER_ACCOUNT',accountName)
    }
  },
  actions: {
    // 3. 外部调用方法修改值
    saveUserToken({commit},token){
      commit('changeLogin',token)
    },
    SaveAccountName({
      commit
    },accountName){
      commit('SET_ACCOUNT_NAME',accountName)
    }
  },
  getters:{
    //4. 将值注入到state中的变量中去
    USER_ACCOUNT:state => state.USER_ACCOUNT
  },
  modules: {
  }
})

export default store
