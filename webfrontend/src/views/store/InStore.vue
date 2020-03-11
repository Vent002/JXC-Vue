<!--
 * @Date: 2020-02-12 18:18:52
 * @LastEditors: gxm
 * @LastEditTime: 2020-03-09 21:43:31
 * @FilePath: \webfrontend\src\views\store\InStore.vue
 -->
<template>
   <div>
    <div class="main" v-title data-title="订单入库"></div>
    <bread-crumb>
      <el-breadcrumb-item slot="first">库存管理</el-breadcrumb-item>
      <el-breadcrumb-item slot="second">订单入库</el-breadcrumb-item>
    </bread-crumb>
  </div>
</template>

<script>
  import {request} from '../../network/request'
  const BreadCrumb = () => import('../../components/BreadCrumb')
  export default {
    name: "InStore",
    components:{
      BreadCrumb
    }
  }
</script>

<style scoped>

</style>