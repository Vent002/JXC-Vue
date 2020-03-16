<template>
  <div v-loading='loading'>
    <div class="main"
         v-title
         data-title="补货审核申请"></div>
    <bread-crumb>
      <el-breadcrumb-item slot="first">销售管理</el-breadcrumb-item>
      <el-breadcrumb-item slot="first">审核申请</el-breadcrumb-item>
      <el-breadcrumb-item slot="second">补货审核</el-breadcrumb-item>
    </bread-crumb>
    <el-card class="applyGoodsCard">
      <div style="text-align:left">
        <el-button size="small"
                   type="primary"
                   v-if="showHistory"
                   @click="getHistory()"
                   :loading="btnloading">历史记录</el-button>
        <el-button size="small"
                   type="primary"
                   v-if="back"
                   @click="getApplyGoodsInfo()"
                   :loading="btnloading">返回</el-button>
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
            <span style="margin-left: 10px">{{ scope.row.inventoryInfo.goodsTypeInfo.goodsTypeName }}</span>
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

        <el-table-column prop="employeeAccount"
                         label="申请人"
                         align="center"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.applyPersonName }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="operate"
                         label="操作"
                         align="center"
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

        <el-table-column prop="verifyDate"
                         v-if="verifyDate"
                         label="审核日期"
                         align="center"
                         fit>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.verifyDate }}</span>
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
    <!-- 审核出库申请 -->
    <el-dialog class="dialog"
               title="审核出库申请"
               width="30%"
               :visible.sync="editFormVisible"
               :close-on-click-modal="false">
      <el-form v-model="verifyApplyInfo"
               label-width="80px"
               :rules.sync="editFormRules"
               ref="editGoods">
        <el-form-item label="申请人"
                      prop="applyPersonName">
          <el-input type="text"
                    style="width:50%;min-width:80px"
                    v-model="verifyApplyInfo.applyPersonName"
                    auto-complete="off"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="商品名称"
                      prop="goodsTypeName">
          <el-input type="text"
                    style="width:50%;min-width:80px"
                    v-model="verifyApplyInfo.inventoryInfo.goodsTypeInfo.goodsTypeName"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="申请日期"
                      prop="applyDate">
          <div class="block">
            <el-date-picker v-model="verifyApplyInfo.applyDate"
                            type="datetime"
                            style="width:50%"
                            class="input-class"
                            disabled>
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="申请数量"
                      prop="applyCounts">
          <el-input type="number"
                    :min="0"
                    style="width:50%;min-width:80px"
                    v-model="verifyApplyInfo.applyCounts"></el-input><br/>
                    <span  v-if="isAbundant">剩余库存：<span style="color:red;margin-left:5px">{{inventory}}</span></span>
        </el-form-item>

        <el-form-item label="是否通过"
                      prop="verifyApplyStatus">
          <el-switch v-model="verifyApplyInfo.verifyApplyStatus"></el-switch>
        </el-form-item>

        <el-form-item label="否决原因"
                      prop="applyDesc">
          <el-input type="textarea"
                    style="width:50%;min-width:80px"
                    placeholder="eg:库存不够，正在订货..."
                    v-model="verifyApplyInfo.applyDesc"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeEditSubmit()">取消</el-button>
        <el-button type="primary"
                   :loading="btnloading"
                   @click="verifySubmit(verifyApplyInfo)">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { request } from '../../../network/request'
const BreadCrumb = () => import('../../../components/BreadCrumb')
import { mapGetters } from 'vuex'
export default {
  name: 'Verify',
  components: {
    BreadCrumb
  },
  data() {
    return {
      //剩余库存
      inventory:Number,
      isAbundant:false,
      //button
      showHistory: true,
      back: false,
      //table
      operate: true,
      verifyDate: false,
      //商品名称
      selectGoodsTypeName: [],
      //审核出库数据
      verifyApplyInfo: {
        id: Number,
        applyDate: '',
        applyGoodsName: '',
        applyCounts: Number,
        applyPersonName: '',
        applyStatus: '',
        verifyApplyStatus: false,
        applyDesc: '',
        inventoryInfo: {
          goodsTypeInfo: {
            goodsTypeName: ''
          }
        }
      },
      editFormVisible: false,
      //验证
      editFormRules: {},
      //数据库获取数据
      applyGoodsList: [],
      //申请数据
      applyGoodsCount: {
        goodsTypeName: '',
        goodsCount: '',
        applyName: ''
      },
      formApplyInfoRule: {},
      formLabelWidth: '100px',
      addSalesInfoVisible: false,
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
    getHistory() {
      this.btnloading = true
      request({
        method: 'get',
        url: '/api/apply/history/' + this.currentPage + '/' + this.pageSize
      })
        .then(res => {
          this.showHistory = false
          this.back = true
          this.operate = false
          this.verifyDate = true
          let salesInfoResult = JSON.parse(res.data.applyList)
          this.applyGoodsList = salesInfoResult.list
          this.total = salesInfoResult.total
          this.btnloading = false
        })
        .catch(err => {
          this.btnloading = false
          console.log(err)
          //刷新页面
        })
    },
    verifySubmit(verifyInfo) {
      if (!verifyInfo.verifyApplyStatus && verifyInfo.applyDesc == '') {
        alert('请输入否决原因 ')
        return
      } else {
        this.btnloading = true
        let applyInfo = new Object(verifyInfo)
        if (verifyInfo.verifyApplyStatus) {
          applyInfo.applyStatus = 1
        } else {
          applyInfo.applyStatus = 2
        }
        request({
          method: 'put',
          url: '/api/apply/' + verifyInfo.id,
          data: applyInfo
        })
          .then(res => {
            if (res.code === 200) {
              this.editFormVisible = false
              this.$message({
                type: 'success',
                message: '审核完成'
              })
              this.getApplyGoodsInfo()
              this.btnloading = false
            }
            if(res.code === 10002){
              this.btnloading = false
              this.isAbundant = true
              this.inventory  = res.data.inventoryTotal
              this.$message({
                type:'warning',
                message:'剩余库存不足'
              })
            }
          })
          .catch(err => {
            console.log(err)
            this.btnloading = false
            this.$message.error('出错了')
          })
      }
    },

    handleEdit: function(index, applyGoods) {
      this.editFormVisible = true
      this.verifyApplyInfo = Object.assign({}, applyGoods)
    },

    closeEditSubmit() {
      this.editFormVisible = false
      this.isAbundant = false
    },
    handleSizeChange(size) {
      this.currentPage = 1 //第一页
      this.pageSize = size //每页先显示多少数据
      if(this.showHistory){
        this.getApplyGoodsInfo()
      }else{
        this.getHistory()
      }
    },
    handleCurrentChange(page) {
      this.currentPage = page
      if(this.showHistory){
        this.getApplyGoodsInfo()
      }else{
        this.getHistory()
      }
    },
    getApplyGoodsInfo() {
      this.loading = true
      request({
        method: 'get',
        url: '/api/apply/' + this.currentPage + '/' + this.pageSize
      })
        .then(res => {
          this.showHistory = true
          this.back = false
          this.operate = true
          this.verifyDate = false
          let salesInfoResult = JSON.parse(res.data.applyList)
          this.applyGoodsList = salesInfoResult.list
          this.total = salesInfoResult.total

          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          //刷新页面
        })
    }
  },
  created() {
    this.getApplyGoodsInfo()
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