<!--
 * @Date: 2020-02-12 18:19:18
 * @LastEditors: gxm
 * @LastEditTime: 2020-03-15 20:13:25
 * @FilePath: \webfrontend\src\views\store\OrderInfo.vue
 -->
<template>
  <div :loading='loading'>
    <div class="main"
         v-title
         data-title="采购订单"></div>
    <bread-crumb>
      <el-breadcrumb-item slot="first">库存管理</el-breadcrumb-item>
      <el-breadcrumb-item slot="second">采购订单</el-breadcrumb-item>
    </bread-crumb>

    <el-card class="order-table">
      <div slot="header"
           class="clearfix">
        <span>采购订单信息表</span>
      </div>

      <!-- 搜索内容  -->
      <div class="sales-search">
        <span>添加采购订单</span>
        <el-divider class="divider"></el-divider>
        <el-row>
          <el-col>

            <el-button class="el-icon-plus"
                       size="small"
                       type="primary"
                       style="display:inline"
                       @click="addOrderInfoVisible = true">添加</el-button>
          </el-col>
        </el-row>
      </div>

      <el-table fit
                :data="orderGoodsInfoList"
                style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope" v-if="scope.row.goodsTypeInfo !=null">
            <el-form label-position="left"
                     inline
                     class="table-expand">
              <el-form-item label="供货商姓名">
                <span style="color:red">{{ scope.row.goodsTypeInfo.supplierInfo.supplierName }}</span>
              </el-form-item>
              <el-form-item label="联系方式">
                <span style="color:red">{{ scope.row.goodsTypeInfo.supplierInfo.supplierPhone }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="#"
                         type='index'
                         align="center"
                         fit>
        </el-table-column>

        <el-table-column prop="goodsTypeName"
                         label="名称"
                         align="center"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.orderName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="createDate"
                         label="类型编号"
                         align="center"
                         sortable
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.orderGoodsType }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="orderGoodsNum"
                         label="采购量"
                         align="center"
                         sortable
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.orderGoodsNum }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="orderDate"
                         label="日期"
                         align="center"
                         sortable
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.orderDate }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="orderDESC"
                         label="备注"
                         align="center"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.orderDESC }}</span>
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
    <!-- //新增采购订单 -->
    <el-dialog class="dialog"
               width="30%"
               title="添加采购订单信息"
               :destroy-on-close="true"
               :close-on-click-modal="true"
               :visible.sync="addOrderInfoVisible">
      <el-form :model="formOrderInfo"
               :rules="formOrderInfoRule"
               ref="formOrderInfoRule">

        <el-form-item label="商品名称"
                      :label-width="formLabelWidth"
                      prop="goodsTypeName">
          <el-select size="small"
                     v-model="formOrderInfo.goodsTypeName"
                     style="width:50%"
                     clearable>
            <el-option label="请选择"
                       disabled
                       :value="-1"></el-option>
            <el-option :label="item"
                       v-for="(item,index) in this.goodsTypeName"
                       :key="index"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="采购内容"
                      :label-width="formLabelWidth"
                      prop="goodsTypeContent">
          <el-input size="small"
                    style="width:50%"
                    v-model="formOrderInfo.goodsTypeContent"
                    placeholder="采购详情"
                    clearable
                    show-word-limit />
        </el-form-item>

        <el-form-item label="采购数量"
                      :label-width="formLabelWidth"
                      prop="goodsOrderCount">
          <el-input type="number"
                    size="small"
                    style="width:50%"
                    :min='0'
                    v-model="formOrderInfo.goodsOrderCount"
                    placeholder="采购数量"
                    clearable
                    show-word-limit />
        </el-form-item>

        <el-form-item label="备注信息"
                      :label-width="formLabelWidth"
                      prop="OrderDesc">
          <el-input size="small"
                    type="textarea"
                    style="width:50%"
                    v-model="formOrderInfo.OrderDesc"
                    placeholder="备注信息"
                    clearable ></el-input>
        </el-form-item>

        <el-button @click.native="closeDialog()">取 消</el-button>
        <el-button type="primary"
                    :loading="btnLoading"
                   @click="addOrderInfo('formOrderInfoRule')">确 定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '../../network/request'
const BreadCrumb = () => import('../../components/BreadCrumb')
export default {
  name: 'OutStore',
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
    let checkFormOrderCounts = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error('请输入采购数量'))
      } else {
        return callback()
      }
    }
    let checkFormOrderContent = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入详细描述'))
      } else {
        return callback()
      }
    }
    return {
      formOrderInfo: {
        goodsTypeName: '',
        goodsTypeContent: '',
        goodsOrderCount: '',
        OrderDesc: ''
      },
      formOrderInfoRule:{
        goodsTypeName:[{validator:checkFormGoodsTypeName,trigger:'blur'}],
        goodsTypeContent:[{validator:checkFormOrderContent,trigger:'blur'}],
        goodsOrderCount:[{validator:checkFormOrderCounts,trigger:'blur'}],
      },
      addOrderInfoVisible: false,
      formLabelWidth: '100px',
      //table表数据
      orderGoodsInfoList: [],
      //商品名称
      goodsTypeName: [],
      goodsTypeInfo: [],
      salesInfoResult: [],
      //分页操作数据
      currentPage: 1, //当前页
      pageSizes: [5, 8, 10],
      total: 0,
      pageSize: 5, //每页数据
      layout: 'total, sizes, prev, pager, next, jumper',
      loading: true,
      btnLoading:false
    }
  },
  methods: {
    addOrderInfo() {
      this.$refs.formOrderInfoRule.validate(valid =>{
        if(valid){
          this.btnLoading = true
          let orderInfo = new Object(this.formOrderInfo)
          request({
            method:'post',
            url:'/api/order',
            data:orderInfo
          }).then(res =>{
            if(res.code === 200){
              this.addOrderInfoVisible = false
              this.$message({
                type:'success',
                message:'添加成功'
              })
              this.btnLoading = false
              this.getOrderGoodsInfoList()
            }else{
              this.$message.error('添加失败')
              this.btnLoading = false
            }
          }).catch(err =>{
            this.btnLoading = false
          })
        }
      })
    },

    closeDialog() {
      this.formOrderInfo = {}
      this.addOrderInfoVisible = false
    },
    getOrderGoodsInfoList() {
      this.loading = true
      request({
        method: 'get',
        url: '/api/orders/' + this.currentPage + '/' + this.pageSize
      })
        .then(res => {
          console.log(res)
          let orderGoodsList = JSON.parse(res.data.orderGoodsList)
          this.orderGoodsInfoList = orderGoodsList.list
          console.log(this.orderGoodsInfoList)
          this.total = orderGoodsList.total
          this.loading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    //每页数据
    handleSizeChange(size) {
      this.currentPage = 1 //第一页
      this.pageSize = size //每页先显示多少数据
      this.getInventoryInfos()
    },
    //当前页
    handleCurrentChange(page) {
      this.currentPage = page
      this.getInventoryInfos()
    },
    //获取商品名称
    getGoodsName() {
      request({
        method: 'get',
        url: '/api/sales'
      })
        .then(res => {
          this.salesInfoResult = JSON.parse(res.data.salesInfoList)

          //将商品种类名称存入
          for (let key in this.salesInfoResult) {
            this.goodsTypeName.push(this.salesInfoResult[key].goodsTypeName)
          }
          for (let key in this.salesInfoResult) {
            this.goodsTypeInfo.push({
              goodsTypeId: this.salesInfoResult[key].goodsTypeId,
              goodsTypeName: this.salesInfoResult[key].goodsTypeName
            })
          }
        })
        .catch(err => {
          console.log(err)
          //刷新页面
        })
    }
  },
  created() {
    this.getOrderGoodsInfoList()
    this.getGoodsName()
  }
}
</script>

<style scoped>
.order-table {
  margin: 20px 0;
}
.divider {
  margin: 10px 0;
}
.sales-search {
  text-align: left;
}
</style>