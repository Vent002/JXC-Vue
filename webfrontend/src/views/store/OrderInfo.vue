<!--
 * @Date: 2020-02-12 18:19:18
 * @LastEditors: gxm
 * @LastEditTime: 2020-03-09 21:43:23
 * @FilePath: \webfrontend\src\views\store\OrderInfo.vue
 -->
<template>
  <div>
    <div class="main" v-title data-title="采购订单"></div>
    <bread-crumb>
      <el-breadcrumb-item slot="first">库存管理</el-breadcrumb-item>
      <el-breadcrumb-item slot="second">采购订单</el-breadcrumb-item>
    </bread-crumb>
  </div>
</template>

<script>
  import {request} from '../../network/request'
  const BreadCrumb = () => import('../../components/BreadCrumb')
  export default {
    name: "OutStore",
    components:{
      BreadCrumb
    }
  }
</script>

<style scoped>

</style>