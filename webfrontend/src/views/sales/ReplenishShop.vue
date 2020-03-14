<template>
  <div v-loading="loading">
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
                         align="center"
                         fit>
        </el-table-column>

        <el-table-column prop="num"
                         label="登记日期"
                         align="center"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.applyDate }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="name"
                         label="商品名称"
                         align="center"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{scope.row.inventoryInfo.goodsTypeInfo.goodsTypeName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="date"
                         label="申请数量"
                         align="center"
                         sortable
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.applyCounts }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="applyePersonName"
                         label="申请人"
                         align="center"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.applyPersonName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status"
                         label="申请状态"
                         align="center"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.applyDesc }}</span>
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
                      prop="goodsTypeName">
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
        <el-button :loading="btnloading"
                   type="primary"
                   @click="applyGoodsInfo('formApplyInfoRule')">确 定</el-button>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { request } from '../../network/request'
import { applyGoodsToShop } from '../../network/home'
const BreadCrumb = () => import('../../components/BreadCrumb')
import { mapGetters } from 'vuex'
export default {
  name: 'ReplenishShop',
  components: {
    BreadCrumb
  },
  data() {
    let checkFormGoodsTypeName = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error('请选择商品类型'))
      } else {
        return callback()
      }
    }
    let checkFormSalesCounts = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error('请输入入库数量'))
      } else {
        return callback()
      }
    }
    return {
      //申请状态
      //商品名称
      selectGoodsTypeName:[],
      //商品数据
      salesInfoResult:[],
      goodsTypeInfo:[],
      //数据库获取数据
      applyGoodsList:[],
      //申请数据
      applyGoodsCount: {
        goodsTypeId:Number ,
        goodsTypeName: '',
        goodsCount: '',
        applyName: ''
      },
      formApplyInfoRule:{
        goodsTypeName:[{validator:checkFormGoodsTypeName,trigger:'blur'}],
        goodsCount:[{validator:checkFormSalesCounts,trigger:'blur'}],
      },
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
    //获取当前用户申请信息
    getApplyInfoByEmployeeName(){
      this.loading = true
      let userAccount = this.userAccount
      request({
        method:'get',
        url:`/api/apply/employee/${this.currentPage}/${this.pageSize}/query?query=${userAccount}`
      }).then(res =>{
        let result = JSON.parse(res.data.applyList)
        this.applyGoodsList = result.list
        this.total = result.total
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    //申请
    applyGoodsInfo(){
      this.$refs.formApplyInfoRule.validate(valid =>{
        if(valid){
          this.btnloading = true
          this.applyGoodsCount.applyName = this.userAccount
          this.salesInfoResult.forEach(element =>{
            if(element.goodsTypeName === this.applyGoodsCount.goodsTypeName){
              this.applyGoodsCount.goodsTypeId = element.goodsTypeId
              return
            }
          })
          let data = new Object(this.applyGoodsCount)
          applyGoodsToShop(data).then(res => {
            if(res.code === 200){
              this.addSalesInfoVisible = false
              this.btnloading = false
              this.$message({
                type:'success',
                message:'申请成功，请等待审核'
              })
              this.getApplyInfoByEmployeeName()
            }else{
              this.$message.error("申请失败，请重新申请")
              this.btnloading = false
            }
          }).catch(err =>{
            this.btnloading = false
            console.log(err)
          })
        }
      })
    },

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
          this.salesInfoResult = JSON.parse(res.data.salesInfoList)

          //将商品种类名称存入
          for (let key in this.salesInfoResult) {
            this.selectGoodsTypeName.push(
              this.salesInfoResult[key].goodsTypeName
            )
          }
          for(let key in this.salesInfoResult){
            this.goodsTypeInfo.push({
              goodsTypeId:this.salesInfoResult[key].goodsTypeId,
              goodsTypeName:this.salesInfoResult[key].goodsTypeName
            })
          }
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          //刷新页面
        })
    },
  },
  created(){
    this.getGoodsName()
    this.getApplyInfoByEmployeeName()
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