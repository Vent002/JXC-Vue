<template>
  <div class="indexStyle">
    <div class="welcome">
      <el-card class="welcomeCard">
        <div class="welcome-quote">
          <span >欢迎你：<i style="color:red">{{userAccount}}</i></span>
        </div>

      </el-card>
    </div>
    <!-- 系统信息 -->
    <div class="systemInfo">
      <el-card>
      <div slot="header" class="clearfix">
        <span>系统信息</span>
      </div>

        <table class="tableStyle">
          <tbody>
            <tr>
                <th>进销存管理系统版本</th>
                <td>2.0.1</td></tr>
            <tr>
                <th>服务器地址</th>
                <td><a href="http://study.hsmxg1204.cn">study.hsmxg1204.cn</a></td>
            </tr>
            <tr>
                <th>操作系统</th>
                <td>CentOS</td></tr>
            <tr>
                <th>运行环境</th>
                <td>Apache Tomcat 8.5</td></tr>
            <tr>
            <tr>
                <th>JDK</th>
                <td>1.8</td></tr>
            <tr>
                <th>Vue版本</th>
                <td>3.x</td></tr>
            <tr>
                <th>MYSQL版本</th>
                <td>5.7</td></tr>
            <tr>
                <th>执行时间限制</th>
                <td>10s</td>
            </tr>
            <tr>
                <th>剩余空间</th>
                <td>86015.2M</td>
            </tr>
          </tbody>
        </table>
      </el-card>
    </div>
    
    <!-- 开发团队信息 -->
    <div class="termInfo">
      <el-card>
        <div slot="header" class="clearfix">
          <span>开发团队</span>
        </div>
        <table class="tableStyle">
          <tbody>
            <tr>
                <th>版权所有</th>
                <td>gxminglee</td></tr>
            <tr>
                <th>开发者</th>
                <td>高兴明(<a href="https://www.github.com/Vent002">www.github.com/Vent002</a>)</td>
            </tr>
          </tbody>
        </table>
      </el-card>
    </div>
    
  </div>
</template>

<script>
import BreadCrumb from '../components/BreadCrumb'
import {mapGetters} from 'vuex'
  export default {
    name: "index",
    components:{
      BreadCrumb
    },
    data(){
      return{
      }
    },
    computed:{
      ...mapGetters({
        // 将userAccount 映射为 $store.state.USER_ACCOUNT
        userAccount:'USER_ACCOUNT'
      })
    }
  }
</script>

<style scoped>
  .welcome-quote{
    margin-bottom: 5px;
    padding: 10px;
    line-height: 22px;
    border-left: 5px solid #009688;
    border-radius: 0 2px 2px 0;
    background-color: #f2f2f2;
    text-align: left;
  }
  .termInfo{
    margin-top: 20px;
  }
  .systemInfo{
    margin: 10px 0;
  }
  .welcome{
    margin-bottom: 20px;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
  }
  .welcomeCard{
    position: relative;
    line-height: 24px;
  }
  a{
    text-decoration: none;
    color: cornflowerblue;
  }
  .tableStyle{
    width: 100%;
    background-color: #fff;
    color: #666;
  }
  .tableStyle tr:hover{
    cursor: pointer;
    background-color: #f8f8f8;
  }
  
  .tableStyle th{
    width: 25%;
    min-width: 80px;
    position: relative;
    padding: 9px 15px;
    min-height: 20px;
    line-height: 20px;
  }
  .tableStyle td{
    padding: 9px 15px;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  th,td{
    border-width: 1px;
    border-style: solid;
    border-color: #e6e6e6;
    text-align: left;
    font-weight: 400;
    word-break: break-all;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .clearfix span{
    float: left;
  }
</style>