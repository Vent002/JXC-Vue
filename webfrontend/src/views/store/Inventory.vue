<template>
  <div v-loading='loading'>
    <div class="main"
         v-title
         data-title="库存统计"></div>
    <div class="inventories-body">
      <bread-crumb>
        <el-breadcrumb-item slot="first">库存管理</el-breadcrumb-item>
        <el-breadcrumb-item slot="second">库存盘点</el-breadcrumb-item>
      </bread-crumb>
      <div class="inventories-contant">
        <!-- 图 -->
        <div class="graph">
          <div style="float:left"
               class='inventorisCharts'
               ref='chart'></div>
          <div class="line-stack"
               ref="lineStack"></div>
        </div>

        <!-- //库存table表 -->
        <el-card class="inventories-table">
          <div slot="header"
               class="clearfix">
            <span>库存总量统计表</span>
          </div>
          <el-table fit
                    :data="pageInfo"
                    style="width: 100%">
            <el-table-column label="#"
                             type='index'
                             align="center"
                             fit>
            </el-table-column>

            <el-table-column prop="goodsTypeNum"
                             label="编号"
                             align="center"
                             sortable
                             fit>
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.goodsTypeNum }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="goodsTypeName"
                             label="名称"
                             align="center"
                             fit>
              <template slot-scope="scope">
                <span style="margin-left: 10px"
                      v-if='scope.row.goodsInventory >= 10'>{{ scope.row.goodsTypeInfo.goodsTypeName }}</span>
                <el-badge value="请登记"
                          class="item"
                          v-else-if='scope.row.goodsTypeInfo.goodsTypeName === null'>
                  <span style="margin-left: 10px">
                    {{scope.row.goodsTypeInfo.goodsTypeName}}
                  </span>
                </el-badge>
                <el-badge value="hot"
                          class="item"
                          v-else>
                  <span style="margin-left: 10px;color:red;">{{ scope.row.goodsTypeInfo.goodsTypeName }}</span>
                </el-badge>
              </template>
            </el-table-column>

            <el-table-column prop="createDate"
                             label="创建日期"
                             align="center"
                             sortable
                             fit>
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.goodsTypeInfo.createDate }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="goodsInventory"
                             label="库存量"
                             align="center"
                             sortable
                             fit>
              <template slot-scope="scope">
                <span style="margin-left: 10px"
                      v-if='scope.row.goodsInventory >= 10'>{{ scope.row.goodsInventory }}</span>
                <span style="margin-left: 10px;color:red;font-size:18px"
                      v-else>{{ scope.row.goodsInventory }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="price"
                             label="价格"
                             align="center"
                             sortable
                             fit>
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.goodsTypeInfo.goodsPrice }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="desc"
                             label="备注"
                             align="center"
                             fit>
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.storeDesc }}</span>
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
    </div>
  </div>
</template>

<script>
// 引入 ECharts 主模块
const echarts = require('echarts')

const BreadCrumb = () => import('../../components/BreadCrumb')
import { request } from '../../network/request'
export default {
  name: 'Inventory',
  components: {
    BreadCrumb
  },
  data() {
    return {
      pageInfo: [],
      inventoryChart: '',
      barTickAlign: '',
      notRecord: '未登记',
      inventories: [], //获取的初始数据
      inventoriesInfosEcharts: [],
      goodsTypeName: [],
      goodsTypeInventories: [],
      //分页操作数据
      currentPage: 1, //当前页
      pageSizes: [5, 8, 10],
      total: 0,
      pageSize: 5, //每页数据
      layout: 'total, sizes, prev, pager, next, jumper',
      loading: true,
      //饼图表数据
      option: {
        title: {
          text: '库存统计饼图',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.goodsTypeName
        },
        series: [
          {
            name: '商品类型',
            type: 'pie',
            radius: '60%',
            center: ['50%', '60%'],
            data: this.goodsTypeName,
            roseType: 'angle',
            itemStyle: {
              // 阴影水平方向上的偏移
              shadowOffsetX: 0,
              // 阴影垂直方向上的偏移
              shadowOffsetY: 0
            }
          }
        ]
      }
    }
  },
  watch: {
    inventoriesInfosEcharts(newValue, oldValue) {
      this.option.series[0].data = newValue
      this.inventoryChart.setOption(this.option)
    },
    goodsTypeName(newValue, oldValue) {
      this.option.legend.data = newValue
      this.inventoryChart.setOption(this.option)
    },

    deep: true
  },
  methods: {
    //获取分页数据
    getInventoryInfos() {
      request({
        method: 'get',
        url: '/api/inventories/' + this.currentPage + '/' + this.pageSize
      })
        .then(res => {
          console.log(res)
          let pageInfo = JSON.parse(res.data.inventoryInfos)
          this.pageInfo = pageInfo.list
          this.total = pageInfo.total
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
    //获取饼表数据
    getInventoryInfo() {
      request({
        method: 'get',
        url: '/api/inventories'
      })
        .then(res => {
          let goodsTypeInfo = []
          let goodsInventoriesInfo = []
          let goodsTypeName = []
          this.inventories = JSON.parse(res.data.inventoryInfos)
          let goodsInventories = this.inventories
          for (let key in goodsInventories) {
            goodsTypeInfo.push(goodsInventories[key].goodsTypeInfo)
          }
          goodsInventories.forEach(element => {
            this.inventoriesInfosEcharts.push({
              value: element.goodsInventory,
              name: element.goodsTypeInfo.goodsTypeName
            })
          })
          this.inventoriesInfosEcharts.forEach(element => {
            this.goodsTypeName.push(element.name)
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    drawPie(){
    //// 基于准备好的dom，初始化echarts实例
    this.inventoryChart = echarts.init(this.$refs.chart)
    this.inventoryChart.showLoading()
    this.inventoryChart.hideLoading()
    //绘制图表
    this.inventoryChart.setOption(this.option)
    }
  },
  mounted() {
    //获取分页数据
    this.getInventoryInfos()
    //制表数据
    this.getInventoryInfo()
    this.drawPie()
    //不加的效果（当浏览器窗口缩小的时候,超过了div的界限（红色边框）)
    // window.addEventListener("resize",function(){
    //   this.inventoryChart.resize()
    // })
    window.onresize = () => {
      this.inventoryChart.resize()
    }
  },
  beforeDestroy() {
    if (this.echart) {
      this.echart.clear()
      this.echart.dispose()
      window.onresize = null
    }
  }
}
</script>

<style scoped>
.inventories-table {
  min-width: 400px;
}
.inventories-body {
  min-width: 600px;
}
.inventories-contant {
  margin-top: 20px;
}
.inventorisCharts {
  margin-top: 20px;
  width: 600px;
  height: 400px;
}
.clearfix {
  text-align: left;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>