<!--
 * @Date: 2020-03-02 21:25:55
 * @LastEditors: gxm
 * @LastEditTime: 2020-03-09 21:33:03
 * @FilePath: \webfrontend\src\views\sales\SalesOut.vue
 -->
<template>
  <div>
    <div class="main" v-title data-title="销售出库"></div>
    <bread-crumb>
      <el-breadcrumb-item slot="first">销售管理</el-breadcrumb-item>
      <el-breadcrumb-item slot="second">销售出库</el-breadcrumb-item>
    </bread-crumb>
  </div>
</template>

<script>
  import {request} from '../../network/request'
  const BreadCrumb = () => import('../../components/BreadCrumb')
  export default {
    name: "SalesOut",
    components:{
      BreadCrumb
    }
  }
</script>

<style scoped>

</style>
