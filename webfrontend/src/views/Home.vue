<template>
  <div class="app_wapper">
    <el-container>
      <el-aside class="slider_container" style="width:222px">
                  <!-- 左侧菜单 -->
        <div class="carouselDiv">
          <el-carousel direction="vertical" :autoplay="true" height="60px">
            <el-carousel-item v-for="item in 2" :key="item">
            </el-carousel-item>
          </el-carousel>
        </div>
        <el-menu class="sub_meuns_wapper" mode="vertical" unique-opened :default-active="$route.path">
          <!-- 菜单组件 -->
            <side-menu/>
        </el-menu>
      </el-aside>
      <!-- 右侧内容区域 -->
      <el-container class="app_content">

        <el-header >
          <div>
            <div style="text-align: left; font-size: 22px;font-weight: bold;width: 200px;float: left">
              进销存管理系统
            </div>
            <div style="text-align: right; font-size: 12px;float: right">
              <i class="el-icon-setting" style="margin-right: 15px"></i>
              <el-button @click="outSystem" size="mini" plain type="primary">退出</el-button>
            </div>
          </div>
        </el-header>
        <!-- 内容区域 -->
        <el-main>
          <keep-alive>
            <router-view />
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  const sideMenu =() => import('../components/SideMenu')
  export default {
    name: 'Home',
    data(){
      return{
        isCollapse:true
      }
    },
    methods:{
      outSystem(){
        this.$router.push('/')
        setTimeout(() =>{
          sessionStorage.removeItem("Authorization");
        },3000)
      }
    },
    components: {
      sideMenu
    },
    created() {
    }
  }
</script>
<style scoped>
  /*wapper*/
  .app_wapper {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .app_content {
    min-height: 500px;
    border: 1px solid #eee;
    box-sizing: border-box;
    margin-left: 221px;
  }

  .el-header {
    background-color: #01aaed;
    color: #fff;
    line-height: 60px;
    width: 100%;
  }

  .app_wapper .el-aside,
  .slider_container{
    width: 221px;
    color: #333;
    transition: width .28s;
    border-right: 1px solid #ffffff;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    background-color: #eeeeee;
    /* background-color: rgb(48, 65, 86); */
  }
  .carouselDiv{
    width: 221px;
    min-width: 221px;
  }
 .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 60px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #b0c1cc;
     background-image: url("../assets/img/logo1.jpg");
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #a0aec9;
     background-image: url("../assets/img/logo3.jpg");
  }
</style>
