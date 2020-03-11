<!--
 * @Date: 2020-02-14 19:41:22
 * @LastEditors: gxm
 * @LastEditTime: 2020-03-10 13:54:43
 * @FilePath: \webfrontend\src\components\BreadCrumb.vue
 -->
<template>
  <div class="el-breadcrumbDiv">
    <div class="el-breadcrumbSlot">
      <slot> 
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <slot name="index"><el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item></slot>
          <slot name="first"><el-breadcrumb-item></el-breadcrumb-item></slot>
          <slot name="second"><el-breadcrumb-item></el-breadcrumb-item></slot>
        </el-breadcrumb>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "BreadCrumb"
  }
</script>

<style scoped>
  .el-breadcrumbDiv{
    position: relative;
    padding: 10px 10px;
    line-height: 20px;
    color: white;
    background-color: #fff;
    min-width: 400px;
  }
  .el-breadcrumbSlot{
    margin-bottom: 10px;
    padding: 10px;
    line-height: 18px;
    border-left: 5px solid #009688;
    border-radius: 0 2px 2px 0;
    background-color: #f2f2f2;
  }
</style>