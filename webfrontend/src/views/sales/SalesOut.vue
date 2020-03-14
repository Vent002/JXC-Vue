<!--
 * @Date: 2020-03-02 21:25:55
 * @LastEditors: gxm
 * @LastEditTime: 2020-03-14 12:12:19
 * @FilePath: \webfrontend\src\views\sales\SalesOut.vue
 -->
<template>
  <div v-loading="loading">
    <div class="main"
         v-title
         data-title="销售出库"></div>
    <bread-crumb>
      <el-breadcrumb-item slot="first">销售管理</el-breadcrumb-item>
      <el-breadcrumb-item slot="second">销售出库</el-breadcrumb-item>
    </bread-crumb>

    <el-card class="salesOutCard">
      <el-table fit
                :data="salesOutInfo"
                style="width: 100%">
        <el-table-column label="#"
                         type='index'
                         fit>
        </el-table-column>

        <el-table-column prop="num"
                         label="商品编号"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.inventoryInfo.goodsTypeNum}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="name"
                         label="商品名称"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.goodsTypeInfo.goodsTypeName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="date"
                         label="店内数量"
                         sortable
                         fit>
          <template slot-scope="scope">
            <span v-if="scope.row.outCount > 5" style="margin-left: 10px">{{ scope.row.outCount }}</span>
            <span v-else style="margin-left: 10px;color:red">{{ scope.row.outCount }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="price"
                         label="商品价格"
                         sortable
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.goodsTypeInfo.goodsPrice }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="num"
                         label="更新日期"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.outDate}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="desc"
                         label="操作员"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.employeeAccount }}</span>
          </template>
        </el-table-column>

      </el-table>

      <!-- 分页按钮-->
      <div class="page">
        <el-pagination background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size="pageSize"
                       :layout="layout"
                       :total="total">
        </el-pagination>
      </div>
    </el-card>

  </div>
</template>

<script>
import { request } from '../../network/request'
const BreadCrumb = () => import('../../components/BreadCrumb')
export default {
  name: 'SalesOut',
  components: {
    BreadCrumb
  },
  data() {
    return {
      salesOutInfo: [],
      //分页操作数据
      currentPage: 1, //当前页
      pageSizes: [5, 8, 10],
      total: 0,
      pageSize: 8, //每页数据
      layout: 'total, sizes, prev, pager, next, jumper',
      loading: true
    }
  },
  methods: {
    handleCurrentChange(page) {
      this.currentPage = 1
      this.currentPage = page
      this.getSalesOutInfo()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.getSalesOutInfo()
    },
    //获取数据
    getSalesOutInfo() {
      request({
        method: 'get',
        url: '/api/outStores/' + this.currentPage + '/' + this.pageSize
      })
        .then(res => {
          console.log(res)
          let pageInfo = JSON.parse(res.data.outStoreInfos)
          this.salesOutInfo = pageInfo.list
          console.log(this.salesOutInfo)
          this.total = pageInfo.total
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.$router.go(0)
          // if(err==='Network Error'){
          //刷新页面
          // }
        })
    }
  },
  created() {
    this.getSalesOutInfo()
  }
}
</script>

<style scoped>
.salesOutCard{
  margin: 20px 0;
}
</style>
