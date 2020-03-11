<template>
  <div v-loading="loading">
    <div class="main" v-title data-title="销售订单"></div>
    <bread-crumb>
      <el-breadcrumb-item slot="first">销售管理</el-breadcrumb-item>
      <el-breadcrumb-item slot="second">销售订单</el-breadcrumb-item>
    </bread-crumb>
    <!-- 图表区 -->
    <div class="graph">
      <div class="stackChart" ref="chart"></div>
    </div>
    <!-- table区 -->
    <div class="sales-table">
      <el-card class="inventories-table">
        <div slot="header" class="clearfix">
          <span>销售情况统计表</span>
        </div>
         <!-- 搜索内容  -->
        <div class="sales-search">
          <span>选择搜索方式</span><br/>
          <el-divider class="divider"></el-divider>
          <div class="search-content">
            <div class="checkModel">
              <!-- <el-radio-group v-model="isName">
                <el-radio :label="3">姓名</el-radio>
                <el-radio :label="6">日期</el-radio>
                <el-radio :label="9">日期段</el-radio>
              </el-radio-group> -->
              <el-checkbox v-model="isName" :checked="isName" disabled label="员工姓名"></el-checkbox>
              <!-- <el-checkbox v-model="isDate" :change="" label="日期"></el-checkbox> -->
              <el-checkbox v-model="isDateSpan" :change="changeInput()" label="时间段"></el-checkbox>
            </div>
            <div class="search-codition" >
              <div class="searchByName" style="display: inline;" v-if="isName">
                <el-input 
                  placeholder="请输入员工姓名"
                  v-model="employeeName"
                  clearable style="width:200px;padding-right:20px">
                </el-input>
                <el-button icon="el-icon-search" circle></el-button>
              </div>

              <div class="search_date_picker" style="display: inline;" v-if="isDateSpan" >
                <el-date-picker
                  v-model="searchDateSpan.startDate"
                  style="width:150px"
                  type="date"
                  placeholder="开始日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                <el-date-picker
                  v-model="searchDateSpan.endDate"
                  style="width:150px; padding-right:20px"
                  type="date"
                  placeholder="结束日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                <el-button icon="el-icon-search" circle></el-button>
              </div>
            <el-button class="el-icon-plus" style="margin-left:20px" type="primary">添加</el-button> 
            </div>
          </div>
        </div>

        <el-table
          fit
          :data="pageInfo"
          style="width: 100%"
          > 
          <el-table-column
            label="#"
            type='index'
            fit>
          </el-table-column>

          <el-table-column
            prop="num"
            label="登记日期"
            fit>
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.saleDate }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="name"
            label="商品名称"
            fit>
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.goodsTypeInfo.goodsTypeName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="date"
            label="销售数量"
            sortable
            fit>
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.saleCount }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="price"
            label="价格"
            sortable
            fit>
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.saleMoney }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="desc"
            label="售卖人"
            fit>
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.employeeAccount }}</span>
            </template>
          </el-table-column>

        </el-table>
        <!-- //分页 -->
        <div class="page">
          <el-pagination
            background
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
  </div>
</template>

<script>
  // 引入 ECharts 主模块
  const echarts = require('echarts')

  import {request} from '../../network/request'
  const BreadCrumb = () => import('../../components/BreadCrumb')
  export default {
    name: "SalesInfo",
    components:{
      BreadCrumb
    },
    data(){
      return{
        //table分页数据
        pageInfo:[],
        //挂载图名
        salesInfoChart:'',
        dataShadow:[],
        yMax:25,
        //销售信息数据
        salesInfo:[],
        //图表数据
        salesData:[],
        goodsTypeName:[],
        lineSalesData:[],
        lineSalesDateGoodsName:[],
        //分页操作数据
        currentPage: 1,//当前页
        pageSizes: [5, 8, 10],
        total: 0,
        pageSize: 5,//每页数据
        layout: 'total, sizes, prev, pager, next, jumper',
        loading:true,
        //搜索数据
        employeeName:'',
        searchDate:'',
        startDate:'',
        endDate:'',
        //判断搜索类型
        isName:true,
        isDateSpan:false,
        //折线图option
        option:{
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
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
           title: {
            text: '销售情况统计表',
            subtext: '每类商品统计销售情况'
          },
          legend: {
            data:this.goodsTypeName
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
            data:this.goodsTypeName
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
            { // For shadow
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
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#83bff6'},
                    {offset: 0.5, color: '#188df0'},
                    {offset: 1, color: '#188df0'}
                  ]
                )
              },
              emphasis: {
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#2378f7'},
                      {offset: 0.7, color: '#2378f7'},
                      {offset: 1, color: '#83bff6'}
                    ]
                  )
                }
              },
              data:this.salesData
            },
            {
              name:this.lineSalesDateGoodsName,
              type:'line',
              data:this.salesInfoChart,
            }
          ]
        }          
      }
    },
    watch:{
      goodsTypeName(newValue,oldValue){
        this.option.xAxis.data = newValue
        this.option.legend.data = newValue
        this.salesInfoChart.setOption(this.option)
      },
      salesData(newValue,oldValue){
        this.option.series[1].data = newValue
        this.salesInfoChart.setOption(this.option,true)//加true 是解决相同数据合并问题
      },
      lineSalesData:{
        handler: function(newValue,oldValue){
          this.option.series[2].data = newValue
          this.salesInfoChart.setOption(this.option,true)
        }
      },
      deep:true
    },
    methods:{

      //搜索checkbox
      changeInput(){
       if(this.isDateSpan == true){
         this.isName = false
         this.employeeName = ''
       }else if(this.isDate == false){
         this.searchDateSpan = ''
          this.isName = true
       }
      },
      handleSizeChange(size){
        this.currentPage = 1; //第一页
        this.pageSize = size; //每页先显示多少数据
        this.getSalesPageInfo()
      },
      handleCurrentChange(page){
        this.currentPage = page
        this.getSalesPageInfo()
      },
      //获取分页数据用于table
      getSalesPageInfo(){
        request({
          method:'get',
          url:'/api/sales/'+this.currentPage+'/'+this.pageSize
        }).then( res => {
          console.log(res.data)
          let pageInfo = JSON.parse(res.data.salesInfos)
          this.pageInfo = pageInfo.list
          this.total = pageInfo.total
        })
      },
      //获取后台数据绘制图表
      getChartSalesInfo(){
        request({
          method:'get',
          url:'/api/sales'
        }).then( res => {
          let salesInfoResult = JSON.parse(res.data.salesInfoList)
          for(let key in salesInfoResult){
            this.goodsTypeName.push(salesInfoResult[key].goodsTypeName)
            this.salesData.push(salesInfoResult[key].saleCount)
          }
          for(let key in salesInfoResult){
              this.lineSalesData.push(
                salesInfoResult[key].saleCount
              )
            }
          let lineSalesDataGoodsName =[]
          for(let key in this.goodsTypeName){
            lineSalesDataGoodsName.push(this.goodsTypeName[key])
          }
          this.lineSalesDateGoodsName.push({name:lineSalesDataGoodsName})
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
        }).catch(err => {
          console.log(err)
        })
      }
    },
    mounted(){
      this.getChartSalesInfo()
      // 基于准备好的dom，初始化echarts实例
      for (var i = 0; i < this.salesData.length; i++) {
        this.dataShadow.push(this.yMax);
      }
      // this.salesInfoChart = echarts.init(this.$refs.chart,'light')// light 主题
      this.salesInfoChart = echarts.init(this.$refs.chart)
      //绘制图表
      this.salesInfoChart.setOption(this.option)

      //不加的效果（当浏览器窗口缩小的时候,超过了div的界限（红色边框）)
      window.onresize = () =>{
        this.salesInfoChart.resize()
      }
    },
    created(){
      this.getSalesPageInfo()
    },
    beforeDestroy(){
      if(this.salesInfoChart){
        this.salesInfoChart.clear()
        this.salesInfoChart.dispose()
        window.onresize = null
      }

    }
  }
</script>

<style scoped>
  .checkModel{
    margin: 10px 0;
  }
  .divider{
    margin: 10px 0;    
  }
  .search-codition div{
    width: 400px;
  }
  .sales-search{
    width:100%;
    height: 120px;
    text-align: left;
  }
  .search-content{
    padding: 10px 0;
    display: inline;
  }
  .clearfix{
    text-align: center;
  }
  .sales-table{
    margin-top: 20px;  
  }
  .graph{
    margin-top: 20px;
    text-align: center;
  }
  .stackChart{
    height: 450px;
    width: 100%;
    margin-bottom: 20px;
  }
</style>