<template>
  <div class="page-main" >
      <el-card class="form-main">
        <div slot="header" class="clearfix">
        <span><h2>欢迎登录</h2></span>
      </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" >
          <el-form-item label="账号" prop="username">
            <el-input type="text" v-model="ruleForm.username" autocomplete="off" placeholder="请输入账号" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password"  placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="login">登录</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
  
    <div class="bottom_layer">
      <a rel="nofollow" href="http://www.beian.miit.gov.cn/" target="_blank">蜀ICP备20005394号</a>
    </div>
  </div>
</template>

<script>
  import {request} from "../network/request";
  import { mapMutations } from 'vuex';
  export default {
    name: "Login",
    data() {
      return {
        ruleForm: {
          username: 'yuan001',
          password: 'yuan001',
        },
        rules: {
          username: [
            {required:true, message:'账号不能为空',trigger: 'blur' }
          ],
          password: [
            { required:true,message:'密码不能为空',trigger: 'blur' }
          ],
        },
        loading:false,
      }
    },
    methods:{
      ...mapMutations(['changeLogin']),
      login(){
        this.$refs.ruleForm.validate(valid => {
          if(valid) {
            this.loading = true
            let data =  this.$qs.stringify({
              username: this.ruleForm.username,
              password: this.ruleForm.password,
            })
            request({
                method:'post',
                url:'/api/login',
                data:data
              }).then( res => {
                let code = res.code
                if(code === 200 ){
                  this.$notify({
                    title: '登录提示',
                    message: '登录成功',
                    position: 'bottom-right',
                    type:'success'
                  })
                  setTimeout(() => {
                    let accountToken = res.data
                    this.changeLogin({Authorization:accountToken})
                    this.$store.dispatch('SaveAccountName',accountToken.accountName)
                    this.$store.dispatch('SaveId',accountToken.power)
                    this.$router.replace({
                      path:'/home'
                    })
                  },2000)
                }else{
                  this.$notify.error({
                    title: '登录提示',
                    message: '登录失败',
                    position: 'bottom-right',
                  })
                  this.loading = false
                }
              }).catch(err => {
              this.$notify.error({
                  title: '登录提示',
                  message: err,
                  position: 'bottom-right',
                })
                this.loading = false
              })
            }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
.bottom_layer,
.bottom_layer a {
    width: 100%;
    min-width: 1250px;
    position: fixed;
    z-index: 302;
    bottom: 0;
    left: 0;
    height: 36px;
    overflow: hidden;
    zoom: 1;
    margin: 0;
    text-align: center;
    line-height: 36px;
    font-size: 12px;
    text-decoration: none;
}
  .page-main{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f7f9fb;
  }
  .form-main{
    position: absolute;
    min-width: 220px;
    left: 50%;
    top: 50%;
    width: 18%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    padding: 10px 30px;
    border-radius: 10px;
    line-height: 28px;
    font-size: 14px;
  }
</style>
