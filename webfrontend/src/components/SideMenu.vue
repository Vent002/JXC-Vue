<!--
 * @Date: 2020-02-14 13:21:09
 * @LastEditors: gxm
 * @LastEditTime: 2020-03-09 19:08:38
 * @FilePath: \webfrontend\src\components\SideMenu.vue
 -->
<template>
  <div class="aside">
    <el-row>
      <el-menu
        router
        default-active="2"
        @open="handleOpen"
        @close="handleClose"
        background-color="#eeeeee"
        active-text-color="#">
        <el-menu-item index="/main">
          <i class="el-icon-menu"></i>
          <span slot="title" >首页</span>
        </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-user"></i>
          用户管理
        </template> 
        <el-menu-item index="/account">
          <i class="el-icon-info"></i>
          账号信息
        </el-menu-item>
        <el-menu-item index="/customer">
          <i class="el-icon-s-custom"></i>
          客户信息
        </el-menu-item>
        <el-menu-item index="/supplier">
          <i class="el-icon-suitcase"></i>
          供货商信息
        </el-menu-item>
      </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-goods"></i>
            库存管理
          </template>
          <el-menu-item index="/goods">
            <i class="el-icon-coordinate"></i>
            商品类型
          </el-menu-item>
          <el-menu-item index="/order">
            <i class="el-icon-shopping-cart-full"></i>
            采购订单
          </el-menu-item>
          <el-menu-item index="/inStore">
            <i class="el-icon-notebook-2"></i>
            订单入库</el-menu-item>
          <el-menu-item index="/inventory">
            <i class="el-icon-house"></i>
            库存盘点
          </el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-data-line"></i>
            销售管理</template>
          <el-menu-item index="/sales">
            <i class="el-icon-sell"></i>
            销售订单
          </el-menu-item>
          <el-menu-item index="/salesOut">
            <i class="el-icon-sold-out"></i>
            销售出库
          </el-menu-item>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-setting"></i>
            系统管理
          </template>
          <el-menu-item index="4-1">权限管理</el-menu-item>
          <el-menu-item index="4-1">角色管理</el-menu-item>
          <el-menu-item index="4-1">查看日志</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "SideMenu",
    data(){
      return{
      }
    },
    methods:{
      handleOpen(key, keyPath) {
      },
      handleClose(key, keyPath) {
      },
    }
  }
</script>

<style scoped>
  /*自定义菜单宽度、背景色*/
  .el-menu{
    width: 220px;
    border: 0 solid #eeeeee;
  }
</style>
