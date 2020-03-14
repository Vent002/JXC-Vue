<template>
  <div v-loading="loading">
    <div class="main"
         v-title
         data-title="销售订单"></div>
    <bread-crumb>
      <el-breadcrumb-item slot="first">销售管理</el-breadcrumb-item>
      <el-breadcrumb-item slot="second">销售订单</el-breadcrumb-item>
    </bread-crumb>
    <!-- 图表区 -->
    <div class="graph">
      <div class="stackChart"
           ref="chart"></div>
    </div>
    <!-- table区 -->
    <div class="sales-table">
      <el-card class="inventories-table">
        <div slot="header"
             class="clearfix">
          <span>销售情况统计表</span>
        </div>
        <!-- 搜索内容  -->
        <div class="sales-search">
          <span>选择搜索方式</span>
          <el-divider class="divider"></el-divider>
          <div class="search-content">
            <div class="checkModel">
              <!-- <el-radio-group v-model="isName">
                <el-radio :label="3">姓名</el-radio>
                <el-radio :label="6">日期</el-radio>
                <el-radio :label="9">日期段</el-radio>
              </el-radio-group> -->
              <el-checkbox v-model="isName"
                           :checked="isName"
                           disabled
                           label="姓名"></el-checkbox>
              <!-- <el-checkbox v-model="isDate" :change="" label="日期"></el-checkbox> -->
              <!-- <el-checkbox v-model="isDateSpan"
                           :change="changeInput()"
                           label="时间段"></el-checkbox> -->
            </div>
            <el-row>
              <el-col>
                <el-form :inline="true"
                        :model="formSearchName"
                        ref="formSearchName"
                        label-width="100px"
                        class="searchUser">
                  <!-- <el-form-item prop="searchEmployeeName"
                                  :rules="[
                        { required: true, message: '搜索内容不能为空'},
                        { type: 'string', message: '姓名必须为汉字或英语'}
                      ]"> -->
                  <el-form-item>
                    <el-input size="small"
                              type="searchEmployeeName"
                              placeholder="输入搜索姓名"
                              v-model="formSearchName.searchEmployeeName"
                              autocomplete="off">
                      <el-button slot="append"
                                icon="el-icon-search"
                                @click="searchInfoByName('formSearchName')"></el-button>
                    </el-input>
                    <el-button class="el-icon-plus"
                         size="small"
                         type="primary"
                         style="display:inline"
                         @click="addSalesInfoVisible = true">添加</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
        </div>
          <el-table fit
                    :data="pageInfo"
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

            <el-table-column prop="price"
                             label="价格"
                             align="center"
                             sortable
                             fit>
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.saleMoney }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="desc"
                             label="售卖人"
                             align="center"
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
    </div>

    <!-- 添加销售订单dialog -->
    <el-dialog class="dialog"
               width="30%"
               title="添加销售订单信息"
               :destroy-on-close="true"
               :close-on-click-modal="true"
               :visible.sync="addSalesInfoVisible">
      <el-form :model="formSalesInfo"
               :rules="formSalesInfoRule"
               ref="formSalesInfoRule">

        <el-form-item label="用户名"
                      :label-width="formLabelWidth">
          {{ userAccount }}
        </el-form-item>

        <el-form-item label="姓名"
                      :label-width="formLabelWidth"
                      prop="formEmployeeName">
          <el-input class="inputSaleCount"
                    v-model="formSalesInfo.formEmployeeName"
                    size="small"
                    placeholder="你的名字"
                    clearable />
        </el-form-item>

        <el-form-item label="商品名称"
                      :label-width="formLabelWidth"
                      prop="formGoodsTypeName">
          <el-select size="small"
                     v-model="formSalesInfo.formGoodsTypeName"
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

        <el-form-item label="销售量"
                      :label-width="formLabelWidth"
                      prop="formSalesCounts">
          <el-input class="inputSaleCount"
                    v-model="formSalesInfo.formSalesCounts"
                    type="number"
                    :min="0"
                    size="small"
                    placeholder="销售额"
                    clearable />
        </el-form-item>

        <el-button @click.native="closeAddSalesInfoDialog()">取 消</el-button>
        <el-button :loading="btnloading"
                   type="primary"
                   @click="addsalesInfo('formSalesInfoRule')">确 定</el-button>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
// 引入 ECharts 主模块
const echarts = require('echarts')

import { request } from '../../network/request'
import { addSalesInfo } from '../../network/home'
const BreadCrumb = () => import('../../components/BreadCrumb')
import { mapGetters } from 'vuex'
export default {
  name: 'SalesInfo',
  components: {
    BreadCrumb
  },
  data() {
    let checkEmployeeName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('搜索内容不能为空'))
      } else {
        return callback()
      }
    }
    let checkFormEmplyeeName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入姓名'))
      } else {
        return callback()
      }
    }
    let checkFormGoodsTypeName = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error('请选择商品类型'))
      } else {
        return callback()
      }
    }
    let checkFormSalesCounts = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error('请输入销售额'))
      } else {
        return callback()
      }
    }
    return {
      //select数据
      selectGoodsTypeInfo: [],
      //增加数据
      addSalesInfoVisible: false,
      formSalesInfo: {
        formEmployeeName: '',
        formGoodsTypeName: '',
        formGoodsTypeId: Number,
        formSalesCounts: '',
        formGoodsPrice: ''
      },
      formLabelWidth: '100px',
      //添加信息数据有效性判断
      formSalesInfoRule: {
        formEmployeeName: [
          { validator: checkFormEmplyeeName, trigger: 'blur' }
        ],
        formGoodsTypeName: [
          { validator: checkFormGoodsTypeName, trigger: 'blur' }
        ],
        formSalesCounts: [{ validator: checkFormSalesCounts, trigger: 'blur' }]
      },
      //table分页数据
      pageInfo: [],
      //挂载图名
      salesInfoChart: '',
      dataShadow: [],
      yMax: 30,
      //销售信息数据
      salesInfo: [],
      //图表数据
      salesData: [],
      goodsTypeName: [],
      lineSalesData: [],
      lineSalesDateGoodsName: [],
      lineSalesPriceTotal: [],
      //分页操作数据
      currentPage: 1, //当前页
      pageSizes: [5, 8, 10],
      total: 0,
      pageSize: 5, //每页数据
      layout: 'total, sizes, prev, pager, next, jumper',
      loading: false,
      btnloading: false,
      //搜索数据
      formSearchName: {
        searchEmployeeName: ''
      },
      startDate: '',
      endDate: '',
      //判断搜索类型
      isName: true,
      isDateSpan: false,
      //折线图option
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        title: {
          text: '销售情况统计表',
          subtext: '每类商品统计销售情况'
        },
        legend: {
          data: this.goodsTypeName
        },
        xAxis: {
          axisLabel: {
            inside: true,
            textStyle: {
              color: '#fff'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10,
          data: this.goodsTypeName
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          {
            // For shadow
            type: 'bar',
            itemStyle: {
              color: 'rgba(0,0,0,0.05)'
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            data: this.dataShadow,
            animation: false
          },
          {
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ])
              }
            },
            data: this.salesData
          },
          {
            name: this.lineSalesDateGoodsName,
            type: 'line',
            data: this.salesInfoChart
          },
          {
            name: this.lineSalesDataGoodsName,
            type: 'line',
            data: this.lineSalesPriceTotal
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      // 将userAccount 映射为 $store.state.USER_ACCOUNT
      userAccount: 'USER_ACCOUNT'
    })
  },
  watch: {
    goodsTypeName(newValue, oldValue) {
      this.option.xAxis.data = newValue
      this.option.legend.data = newValue
      this.salesInfoChart.setOption(this.option)
    },
    salesData(newValue, oldValue) {
      this.option.series[1].data = newValue
      this.salesInfoChart.setOption(this.option, true) //加true 是解决相同数据合并问题
    },
    lineSalesData: {
      handler: function(newValue, oldValue) {
        this.option.series[2].data = newValue
        this.salesInfoChart.setOption(this.option, true)
      }
    },
    // lineSalesPriceTotal:{
    //   handler:function(newValue,oldValue){
    //     this.option.series[3].data = newValue
    //     this.salesInfoChart.setOption(this.option,true)
    //   }
    // },
    deep: true
  },
  methods: {
    //关闭dialog
    closeAddSalesInfoDialog() {
      this.addSalesInfoVisible = false
      this.formSalesInfo = {}
    },
    //添加销售订单
    addsalesInfo() {
      this.$refs.formSalesInfoRule.validate(valid => {
        if (valid) {
          this.btnloading = true
          for (let key in this.selectGoodsTypeInfo) {
            if (
              this.selectGoodsTypeInfo[key].goodsTypeName ==
              this.formSalesInfo.formGoodsTypeName
            ) {
              this.formSalesInfo.formGoodsTypeId = this.selectGoodsTypeInfo[
                key
              ].goodsTypeId
              this.formSalesInfo.formGoodsPrice =
                this.selectGoodsTypeInfo[key].goodsTypeprice *
                this.formSalesInfo.formSalesCounts
            }
          }
          let newSalesInfo = new Object(this.formSalesInfo)
          addSalesInfo(newSalesInfo)
            .then(res => {
              this.addSalesInfoVisible = false
              this.formSalesInfo = {}
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '添加成功，等待审核'
                })
                this.btnloading = false
              } else {
                this.$message.error('添加失败')
                this.btnloading = false
              }
            })
            .catch(err => {
              console.log(err)
              this.btnloading = false
            })
        }
      })
    },
    //根据名字模糊查找
    searchInfoByName() {
      this.getSalesPageInfo()
    },
    //搜索checkbox
    changeInput() {
      if (this.isDateSpan == true) {
        this.isName = false
        this.employeeName = ''
      } else if (this.isDateSpan == false) {
        this.searchDateSpan = ''
        this.isName = true
      }
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
    //获取分页数据用于table
    getSalesPageInfo() {
      this.loading = false
      request({
        method: 'get',
        url: `/api/sales/?query=${this.formSearchName.searchEmployeeName}&currentPage=${this.currentPage}&pageSize=${this.pageSize}`
      }).then(res => {
        let pageInfos = JSON.parse(res.data.salesInfos)
        this.pageInfo = pageInfos.list
        this.total = pageInfos.total
      })
    },
    //获取后台数据绘制图表
    getChartSalesInfo() {
      this.loading = true
      request({
        method: 'get',
        url: '/api/sales'
      })
        .then(res => {
          let salesInfoResult = JSON.parse(res.data.salesInfoList)
          let salesPriceInfoResult = JSON.parse(res.data.salesTotalPrice)

          for (let key in salesPriceInfoResult) {
            this.lineSalesPriceTotal.push(
              salesPriceInfoResult[key].salesTotalPrice
            )
          }

          for (let key in salesInfoResult) {
            this.goodsTypeName.push(salesInfoResult[key].goodsTypeName)
            this.salesData.push(salesInfoResult[key].saleCount)
          }
          for (let key in salesInfoResult) {
            this.lineSalesData.push(salesInfoResult[key].saleCount)
          }
          let lineSalesDataGoodsName = []
          for (let key in this.goodsTypeName) {
            lineSalesDataGoodsName.push(this.goodsTypeName[key])
          }
          this.lineSalesDateGoodsName.push({ name: lineSalesDataGoodsName })
          //将商品种类名称存入
          for (let key in salesInfoResult) {
            this.selectGoodsTypeInfo.push({
              goodsTypeId: salesInfoResult[key].goodsTypeId,
              goodsTypeName: salesInfoResult[key].goodsTypeName,
              goodsTypeprice: salesInfoResult[key].goodsPrice
            })
          }
          // let goodsTypeName = []
          // this.salesInfo = JSON.parse(res.data.salesInfoList)
          // goodsTypeName = JSON.parse(res.data.goodsTypeName)
          // //获取商品信息
          // let goodsTypeInfo = []
          // //销售日期信息
          // let goodsSalesDay = []
          // let salesDateTemp = []
          // goodsTypeName.forEach(element =>{
          //   this.goodsTypeName.push(element.goodsTypeName)
          // })

          // this.salesInfo.forEach(element =>{
          //   salesDateTemp.push(element.saleDate)
          // })

          // //取出日期重复项
          // const tmp = new Map()
          // for(let i =0;i<salesDateTemp.length;i++){
          //   if(!tmp.get(salesDateTemp[i])){
          //     tmp.set(salesDateTemp[i],1)
          //     this.salesDate.push(salesDateTemp[i])
          //   }
          // }

          // //销售情况
          // //根据商品名称字段将销售额重新分组
          // let salesGoodsTypeName = ''

          // if(this.salesInfo.length > 0){
          //   // salesGoodsTypeName = this.salesInfo[][]
          // }
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          alert(err)
          //刷新页面
        })
    }
  },
  mounted() {
    this.getChartSalesInfo()
    // 基于准备好的dom，初始化echarts实例
    for (var i = 0; i < this.salesData.length; i++) {
      this.dataShadow.push(this.yMax)
    }
    // this.salesInfoChart = echarts.init(this.$refs.chart,'light')// light 主题
    this.salesInfoChart = echarts.init(this.$refs.chart)
    //绘制图表
    this.salesInfoChart.setOption(this.option)
    //不加的效果（当浏览器窗口缩小的时候,超过了div的界限（红色边框）)
    window.onresize = () => {
      this.salesInfoChart.resize()
    }
  },
  created() {
    this.getSalesPageInfo()
  },
  beforeDestroy() {
    if (this.salesInfoChart) {
      this.salesInfoChart.clear()
      this.salesInfoChart.dispose()
      window.onresize = null
    }
  }
}
</script>

<style scoped>
.searchUser{
  width:300px;
  min-width: 100px;
}
.checkModel {
  margin: 10px 0;
}
.divider {
  margin: 15px 0;
}
.sales-search {
  width: 100%;
  height: 120px;
  text-align: left;
}
.search-codition {
  float: left;
}
.search-content {
  padding: 10px 0;
  display: inline;
}
.clearfix {
  text-align: center;
}
.sales-table {
  margin-top: 20px;
}
.graph {
  margin-top: 20px;
  text-align: center;
}
.stackChart {
  height: 450px;
  width: 100%;
  margin-bottom: 20px;
}
.el-select {
  width: 50%;
  min-width: 80px;
}
.inputSaleCount {
  width: 50%;
  min-width: 80px;
}
</style>