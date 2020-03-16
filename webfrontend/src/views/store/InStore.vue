<template>
  <div :loading="loading">
    <div class="main"
         v-title
         data-title="订单入库"></div>
    <bread-crumb>
      <el-breadcrumb-item slot="first">库存管理</el-breadcrumb-item>
      <el-breadcrumb-item slot="second">订单入库</el-breadcrumb-item>
    </bread-crumb>

    <el-card class="inInventory-table">
      <div style="text-align:left">
        <el-button size="small"
                   type="primary"
                   @click="getHistory()"
                   v-if="showHistory"
                   :loading="btnLoading">历史记录</el-button>
        <el-button size="small"
                   type="primary"
                   v-if="showInfo"
                   @click="getInInventoryInfos()"
                   :loading="btnLoading">返回</el-button>
      </div>

      <el-table fit
                :data="verifyOrderGoodsInfoList"
                style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope"
                    v-if="scope.row.goodsTypeInfo != null">
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

        <el-table-column label="操作"
                         v-if="operate"
                         fit>
          <template slot-scope="scope">
            <el-button size="small"
                       :plain='true'
                       @click="handleEdit(scope.$index,scope.row)"
                       type="success"
                       icon="el-icon-check"
                       circle></el-button>
          </template>
        </el-table-column>
        <el-table-column label="入库时间"
                         v-else-if="history"
                         fit>
          <template slot-scope="scope"
                    v-if="scope.row != null">
            <span style="margin-left: 10px">{{ scope.row.orderInInventory.verifyDate }}</span>
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
    <!-- 入库dialog -->
    <el-dialog class="dialog"
               width="30%"
               title="入库"
               :destroy-on-close="true"
               :close-on-click-modal="true"
               :visible.sync="addInventoryInfoVisible">
      <el-form :model="addInventoryInfo"
               :rules="addInventoryInfoRule"
               ref="addInventoryInfoRule">

        <el-form-item label="用户名"
                      :label-width="formLabelWidth">
          {{ userAccount }}
        </el-form-item>

        <el-form-item label="商品名称"
                      :label-width="formLabelWidth"
                      prop="goodsTypeName">
          <el-input v-model="addInventoryInfo.orderName"
                    :min="0"
                    size="small"
                    style="width:50%"
                    disabled
                    clearable></el-input>
        </el-form-item>

        <el-form-item label="商品编号"
                      :label-width="formLabelWidth"
                      prop="goodsTypeName">
          <el-input v-model="addInventoryInfo.orderGoodsType"
                    :min="0"
                    size="small"
                    style="width:50%"
                    disabled
                    clearable></el-input>
        </el-form-item>

        <el-form-item label="商品简介"
                      :label-width="formLabelWidth"
                      prop="goodsTypeName">
          <el-input v-model="addInventoryInfo.orderContent"
                    :min="0"
                    size="small"
                    style="width:50%"
                    disabled
                    clearable></el-input>
        </el-form-item>

        <el-form-item label="商品数量"
                      :label-width="formLabelWidth"
                      prop="goodsCount">
          <el-input class="inputSaleCount"
                    v-model="addInventoryInfo.orderGoodsNum"
                    disabled
                    type="number"
                    :min="0"
                    size="small"
                    style="width:50%"
                    placeholder="数量"
                    clearable />
        </el-form-item>

        <el-form-item label="检查完成"
                      prop="verifyApplyStatus">
          <el-switch v-model="addInventoryInfo.changeSatuts"></el-switch>
        </el-form-item>

        <el-button @click.native="closeAddInventoryDialog()">取 消</el-button>
        <el-button :loading="btnLoading"
                   type="primary"
                   @click="addInventoryInfoDialog('formApplyInfoRule')">确 定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '../../network/request'
const BreadCrumb = () => import('../../components/BreadCrumb')
import { mapGetters } from 'vuex'
export default {
  name: 'InStore',
  components: {
    BreadCrumb
  },
  data() {
    return {
      showHistory: true,
      showInfo: false,
      history: false,
      operate: true,
      addInventoryInfo: {
        id: Number,
        orderNum: '',
        orderName: '',
        orderContent: '',
        orderGoodsType: Number,
        orderGoodsNum: Number,
        orderStatus: '',
        changeSatuts: false,
        operatorAccount: ''
      },
      addInventoryInfoRule: {},
      addInventoryInfoVisible: false,
      formLabelWidth: '100px',
      verifyOrderGoodsInfoList: [],
      //分页操作数据
      currentPage: 1, //当前页
      pageSizes: [5, 8, 10],
      total: 0,
      pageSize: 5, //每页数据
      layout: 'total, sizes, prev, pager, next, jumper',
      loading: true,
      btnLoading: false
    }
  },
  computed: {
    ...mapGetters({
      // 将userAccount 映射为 $store.state.USER_ACCOUNT
      userAccount: 'USER_ACCOUNT'
    })
  },
  methods: {
    addInventoryInfoDialog() {
      if (!this.addInventoryInfo.changeSatuts) {
        alert('请点击检查完成')
      } else {
        this.btnLoading = true
        this.addInventoryInfo.operatorAccount = this.userAccount
        let orderInfo = new Object(this.addInventoryInfo)
        request({
          method: 'put',
          url: '/api/order',
          data: orderInfo
        })
          .then(res => {
            this.btnLoading = false
            this.addInventoryInfoVisible = false
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '入库成功'
              })
              getInInventoryInfos()
            } else if (res.code === 10004) {
              this.$message.error('已完成订单不能再修改')
            }
          })
          .catch(err => {
            this.btnLoading = false
          })
      }
    },
    closeAddInventoryDialog() {
      this.addInventoryInfoVisible = false
    },
    getHistory() {
      this.btnLoading = true
      request({
        method: 'get',
        url: '/api/orders/history/' + this.currentPage + '/' + this.pageSize
      })
        .then(res => {
          this.operate = false
          this.showHistory = false
          this.history = true
          this.showInfo = true
          let orderGoodsList = JSON.parse(res.data.orderGoodsList)
          this.verifyOrderGoodsInfoList = orderGoodsList.list
          this.total = orderGoodsList.total
          this.btnLoading = false
        })
        .catch(err => {
          this.btnLoading = false
          console.log(err)
        })
    },
    handleEdit(index, addInventoryInfo) {
      this.addInventoryInfoVisible = true
      this.addInventoryInfo = Object.assign({}, addInventoryInfo)
    },
    //每页数据
    handleSizeChange(size) {
      this.currentPage = 1 //第一页
      this.pageSize = size //每页先显示多少数据
      if (this.showHistory) {
        this.getInInventoryInfos()
      } else {
        this.getHistory()
      }
    },
    //当前页
    handleCurrentChange(page) {
      this.currentPage = page
      if (this.showHistory) {
        this.getInInventoryInfos()
      } else {
        this.getHistory()
      }
    },
    getInInventoryInfos() {
      this.loading = true
      request({
        method: 'get',
        url: '/api/orders/' + this.currentPage + '/' + this.pageSize
      })
        .then(res => {
          this.showHistory = true
          this.showInfo = false
          this.history = false
          this.operate = true
          let orderGoodsList = JSON.parse(res.data.orderGoodsList)
          this.verifyOrderGoodsInfoList = orderGoodsList.list
          this.total = orderGoodsList.total
          this.loading = false
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getInInventoryInfos()
  }
}
</script>

<style scoped>
.inInventory-table {
  text-align: left;
  margin: 20px 0;
}
</style>