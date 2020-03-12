<template>
  <div>
    <div class="main"
         v-title
         data-title="补货申请"></div>
    <bread-crumb>
      <el-breadcrumb-item slot="first">销售管理</el-breadcrumb-item>
      <el-breadcrumb-item slot="second">店铺补货</el-breadcrumb-item>
    </bread-crumb>
    <el-card class="applyGoodsCard">
      <div class="applyGoods">
        <el-button class="el-icon-plus"
                   size="small"
                   type="primary"
                   @click="addSalesInfoVisible = true">申请</el-button>
      </div>

      <el-table fit
                :data="applyGoodsList"
                style="width: 100%">
        <el-table-column label="#"
                         type='index'
                         fit>
        </el-table-column>

        <el-table-column prop="num"
                         label="登记日期"
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
                         label="申请数量"
                         sortable
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.saleCount }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="employeeAccount"
                         label="申请人"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.employeeAccount }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="employeeAccount"
                         label="申请状态"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.employeeAccount }}</span>
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

    <!-- 取货dialog -->
    <el-dialog class="dialog"
               width="30%"
               title="添加取货信息"
               :destroy-on-close="true"
               :close-on-click-modal="true"
               :visible.sync="addSalesInfoVisible">
      <el-form :model="applyGoodsCount"
               :rules="formApplyInfoRule"
               ref="formApplyInfoRule">

        <el-form-item label="用户名"
                      :label-width="formLabelWidth">
          {{ userAccount }}
        </el-form-item>

        <el-form-item label="商品名称"
                      :label-width="formLabelWidth"
                      prop="goodsCount">
          <el-select size="small"
                     v-model="applyGoodsCount.goodsTypeName"
                     style="width:50%"
                     clearable>
            <el-option label="请选择"
                       disabled
                       :value="-1"></el-option>
            <el-option :label="item"
                       v-for="(item,index) in this.selectGoodsTypeName"
                       :key="index"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品数量"
                      :label-width="formLabelWidth"
                      prop="goodsCount">
          <el-input class="inputSaleCount"
                    v-model="applyGoodsCount.goodsCount"
                    type="number"
                    :min="0"
                    size="small"
                    style="width:50%"
                    placeholder="数量"
                    clearable />
        </el-form-item>

        <el-button @click.native="closeApplyGoodsDialog()">取 消</el-button>
        <el-button v-loading="btnloading"
                   type="primary"
                   @click="applyGoodsInfo('formApplyInfoRule')">确 定</el-button>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { request } from '../../network/request'
const BreadCrumb = () => import('../../components/BreadCrumb')
import { mapGetters } from 'vuex'
export default {
  name: 'ReplenishShop',
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