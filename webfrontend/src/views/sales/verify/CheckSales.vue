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
                :data="applyGoodsList"
                style="width: 100%">
        <el-table-column label="#"
                         type='index'
                         fit>
        </el-table-column>

        <el-table-column prop="num"
                         label="销售日期"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.saleDate }}</span>
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
                         label="销售数量"
                         sortable
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.saleCount }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="employeeAccount"
                         label="责任人"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.employeeAccount }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="employeeAccount"
                         label="操作"
                         fit>
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
            <el-switch
              @change="verifyStatus(scope.row)"
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
const BreadCrumb = () => import('../../../components/BreadCrumb')
import { mapGetters } from 'vuex'
export default {
  name: 'CheckSales',
  components: {
    BreadCrumb
  },
  data() {
    return {
      //商品名称
      selectGoodsTypeName:[],
      //数据库获取数据
      applyGoodsList:[],
      //申请数据
      applyGoodsCount: {
        goodsTypeName: '',
        goodsCount: '',
        applyName: ''
      },
      formApplyInfoRule:{},
      formLabelWidth: '100px',
      addSalesInfoVisible: false,
       //分页操作数据
      currentPage: 1, //当前页
      pageSizes: [5, 8, 10],
      total: 0,
      pageSize: 5, //每页数据
      layout: 'total, sizes, prev, pager, next, jumper',
      loading: false,
      btnloading: false,
    }
  },
  computed: {
    ...mapGetters({
      // 将userAccount 映射为 $store.state.USER_ACCOUNT
      userAccount: 'USER_ACCOUNT'
    })
  },
  methods:{
    verifyStatus(goods){},
    applyGoodsInfo(){},
    closeApplyGoodsDialog(){
      this.applyGoodsCount = {}
      this.addSalesInfoVisible = false
    },
    handleSizeChange(size) {
      this.currentPage = 1 //第一页
      this.pageSize = size //每页先显示多少数据
      this.getSalesPageInfo()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.getSalesPageInfo()
    },
    getGoodsName() {
      this.loading = true
      request({
        method: 'get',
        url: '/api/sales'
      })
        .then(res => {
          console.log(res)
          let salesInfoResult = JSON.parse(res.data.salesInfoList)

          //将商品种类名称存入
          for (let key in salesInfoResult) {
            this.selectGoodsTypeName.push(
              salesInfoResult[key].goodsTypeName
            )
          }

          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          alert(err)
          //刷新页面
        })
    },
  },
  created(){
    this.getGoodsName()
  }
}
</script>

<style scoped>
.applyGoodsCard{
  margin: 20px 0;
}
.applyGoods{
  text-align: left;
}
</style>