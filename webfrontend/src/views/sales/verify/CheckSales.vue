<template>
  <div>
    <div class="main"
         v-title
         data-title="销售验收"></div>
    <bread-crumb>
      <el-breadcrumb-item slot="first">销售管理</el-breadcrumb-item>
      <el-breadcrumb-item slot="first">审核申请</el-breadcrumb-item>
      <el-breadcrumb-item slot="second">销售验收</el-breadcrumb-item>
    </bread-crumb>
    <el-card class="applyGoodsCard">

      <el-table fit
                :data="verifyGoodsInfo"
                style="width: 100%">
        <el-table-column label="#"
                         type='index'
                         align="center"
                         fit>
        </el-table-column>

        <el-table-column prop="num"
                         label="销售日期"
                         align="center"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.saleDate }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="name"
                         label="商品名称"
                         align="center"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.goodsTypeInfo.goodsTypeName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="date"
                         label="销售数量"
                         align="center"
                         sortable
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.saleCount }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="employeeAccount"
                         label="责任人"
                         align="center"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.employeeAccount }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="employeeAccount"
                         label="操作"
                         align="center"
                         fit>
          <template slot-scope="scope">
            <div slot="reference"
                 class="name-wrapper">
              <el-switch @change="verifyStatus(scope.row)"
                         v-model="scope.row.status"
                         active-color="#13ce66"
                         inactive-color="#ff4949">
              </el-switch>
            </div>
          </template>
        </el-table-column>

      </el-table>

      <!-- //分页 -->
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
import { request } from '../../../network/request'
import { updateSalesStatus } from '../../../network/home'
const BreadCrumb = () => import('../../../components/BreadCrumb')
import { mapGetters } from 'vuex'
export default {
  name: 'CheckSales',
  components: {
    BreadCrumb
  },
  data() {
    return {
      //数据库获取数据
      verifyGoodsInfo: [],
      //分页操作数据
      currentPage: 1, //当前页
      pageSizes: [5, 8, 10],
      total: 0,
      pageSize: 5, //每页数据
      layout: 'total, sizes, prev, pager, next, jumper',
      loading: false,
      btnloading: false
    }
  },
  computed: {
    ...mapGetters({
      // 将userAccount 映射为 $store.state.USER_ACCOUNT
      userAccount: 'USER_ACCOUNT'
    })
  },
  methods: {
    verifyStatus(goods) {
      let goodsId = goods.id

      updateSalesStatus(goodsId)
        .then(res => {
          if (res.code === 200) {
            this.applyGoodsInfo()
            this.$message({
              type: 'success',
              message: '已审核'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    applyGoodsInfo() {
      this.loading = true
      request({
        method: 'get',
        url: '/api/sales/verify/' + this.currentPage + '/' + this.pageSize
      })
        .then(res => {
          let salesInfoResult = JSON.parse(res.data.verifySales)
          this.verifyGoodsInfo = salesInfoResult.list
          this.total = salesInfoResult.total
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          //alert(err)
          //刷新页面
        })
    },
    handleSizeChange(size) {
      this.currentPage = 1 //第一页
      this.pageSize = size //每页先显示多少数据
      this.applyGoodsInfo()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.applyGoodsInfo()
    }
  },
  created() {
    this.applyGoodsInfo()
  }
}
</script>

<style scoped>
.applyGoodsCard {
  margin: 20px 0;
}
.applyGoods {
  text-align: left;
}
</style>