<template>
<div>
  <div class="main" v-title data-title="客户管理">
  </div>
    <bread-crumb>
      <el-breadcrumb-item slot="first">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item slot="second">客户信息</el-breadcrumb-item>
    </bread-crumb>
  <div class="el-table">
    <div class="el-add">
      <el-input
        placeholder="请输入搜索内容"
        v-model="search"
        style="float: left;width: 200px"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button slot="reference" type="primary" style="margin-left: 20px" @click="addCustomerVisible = true">
        <i class="el-icon-plus"></i>
        添加
      </el-button>
    </div>
    <!-- 客户信息表 -->
    <el-table
      v-loading="loading"
            :data="searchInfo"
            style="width: 100%">
      <el-table-column
              label="#"
              type="index"
              align="center"
              fit>
      </el-table-column>
      <el-table-column
              label="姓名"
              align="center"
              fit>
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.customerName }}</p>
            <p>住址: {{ scope.row.customerAddress }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.customerName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
              label="Email"
              align="center"
              fit>
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span size="medium">{{ scope.row.customerEmail }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
              label="电话"
              align="center"
              fit>
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span size="medium">{{ scope.row.customerPhone }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
              label="第一次到店时间"
              fit>
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <i class="el-icon-time"></i>
            <span size="medium" style="margin-left: 10px">{{ scope.row.createDate }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
              label="备注"
              align="center"
              fit>
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span size="medium">{{ scope.row.customerDesc }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加客户信息dialog -->
    <el-dialog class="dialog" width="35%"
               title="添加客户信息"
               :destroy-on-close="true"
               :close-on-click-modal="true"
               :visible.sync="addCustomerVisible">
      <el-form :model="formCustomer" :rules="formCustomerRule" ref="formCustomerRule">
        <el-form-item label="客户姓名" :label-width="formLabelWidth" prop="customerName">
          <el-input size="small" v-model="formCustomer.customerName" placeholder="eg:张三"  clearable></el-input>
        </el-form-item>
        <el-form-item label="客户性别" :label-width="formLabelWidth" prop="customerSex">
          <el-select v-model="formCustomer.customerSex"
            filterable
            clearable
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in gender"
              :key='item'
              :label="item"
              :value="item"
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户地址" :label-width="formLabelWidth" prop="customerAddress">

          <el-select
            v-model="province"
            filterable
            clearable
            placeholder="请选择省级"
            size="small"
            with="100%"
            @change="getProvince()"
          >
            <el-option
              v-for="item in dataProvinceList"
              :key="item.city_name"
              :label="item.city_name"
              :value="item.city_name"
            ></el-option>
          </el-select>
          <el-select
            v-model="city"
            filterable
            clearable
            placeholder="请选择市级"
            size="small"
            @change="getCity()"
            v-if="dataCityList"
          >
            <el-option
              v-for="item in dataCityList"
              :key="item.city_name"
              :label="item.city_name"
              :value="item.city_name"
            >
            </el-option>
          </el-select>
          <el-select
          v-model="country"
          filterable
          clearable
          size="small"
          placeholder="请选择区县"
          v-if="dataCountryList"
        >
          <el-option
            v-for="item in dataCountryList"
            :key="item.city_name"
            :label="item.city_name"
            :value="item.city_name"
          ></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth" prop="detailsAddress">
          <el-input size="small" v-model="detailsAddress" placeholder="eg:某某街道某某小区" clearable />
        </el-form-item>
        <el-form-item label="Email" :label-width="formLabelWidth" prop="customerEmail">
          <el-input size="small" type="email" v-model="formCustomer.customerEmail" placeholder="eg:xxx@xxx.com" clearable />
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="customerPhone">
          <el-input size="small" maxlength="11" minlenth="11" v-model="formCustomer.customerPhone" placeholder="请输入电话号码" clearable show-word-limit />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="customerDesc">
          <el-input :rows="3" type="textarea" v-model="formCustomer.customerDesc" style="width: 50%" placeholder="eg:视力情况" />
        </el-form-item>
        <el-button @click.native="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="addCustomer('formCustomerRule')">确 定</el-button>
      </el-form>
    </el-dialog>
    <!-- 分页按钮-->
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
    </div>
  </div>
</template>

<script>
  import {request} from "../../network/request";

  const BreadCrumb =() => import('../../components/BreadCrumb')
  import {getCustomerInfos, addCustomerInfo} from "../../network/home";
  import map from '../../assets/city'
  export default {
    name: "CustomerInfo",
    components: {
      BreadCrumb,
    },
    data() {
      let checkName = (rule,value,callback) => {
        if(!value){
          return callback(new Error('客户姓名不能为空'))
        }else{
          return callback()
        }
      }
      let checkPhone = (rule,value,callback) =>{
        if(!value){
          return callback(new Error('客户电话不能为空'))
        }
        else if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))){
          return callback(new Error('输入正确的电话号码'))
        }
        else{
          return callback()
        }
      }
      let checkEmail =(rule,value,callback) =>{
        let reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
        if(!(reg.test(value))){
          return callback(new Error('输入有效邮箱'))
        }
        else{
          return callback()
        }
      }
      return {
        customers:[],
        search:'',
        addCustomerVisible:false,
        formLabelWidth:'150px',
        formCustomer:{
          customerName:'',
          customerSex:'',
          customerAddress:'',
          customerEmail:'',
          customerPhone:'',
          customerDesc:'',
          createDateTime:''
        },
        gender:{
          female:'女',
          male:'男'
        },
        detailsAddress:'',
        formCustomerRule:{
          customerName:[{validator:checkName,trigger:'blur'}],
          customerPhone:[{validator:checkPhone,trigger:'blur'}],
          customerEmail:[{validator:checkEmail,trigger:'blur'}]
        },
        //省市县三级联动
        //记录省市县
        dataProvinceList: '',
        province:'',
        dataCityList: '',
        city:'',
        dataCountryList: '',
        country:'',

        //分页操作数据
        currentPage: 1,//当前页
        pageSizes: [5, 8, 10],
        total: 0,
        pageSize: 10,//每页数据
        layout: 'total, sizes, prev, pager, next, jumper',
        loading:true
      }
    },
    methods: {
      //select 三级联动
      //选择省
      getProvince(){
        this.dataCityList = []
        let cityArr = []
        let aCityArr = []
        let checkProvince = this.province
        for(let item in this.dataProvinceList) {
          if (checkProvince === this.dataProvinceList[item].city_name) {
            cityArr = this.dataProvinceList[item].cityArr
            for(let key in cityArr){
              aCityArr.push(cityArr[key])
            }
            break
          }
        }
        this.dataCityList = aCityArr
      },
      //选择市
      getCity(){
        let countryArr = []
        let aCountryArr = []
        let checkCity = this.city
        for(let item in this.dataCityList){
          if(checkCity === this.dataCityList[item].city_name){
            countryArr = this.dataCityList[item].areaArr
            for(let key in countryArr){
              aCountryArr.push(countryArr[key])
            }
            break
          }
        }
        this.dataCountryList = aCountryArr
      },

      //添加客户
      addCustomer(){
        this.$refs.formCustomerRule.validate(valid =>{
          if(valid){
            /*
            * vue表单验证一直不能通过
            * 1.model里的值一定要和 js里面data的名称(formValidate)对应
            * 2.rules里面的值要和js里面设定的表单规则(ruleValidate)对应
            * 3.prop里面的值要和规则(name)里面的对应
            * 4.自定义的规则(ruleValidate)里面的属性名(name)也要和(formValidate)里面的属性名一致(name)
            * */
            this.formCustomer.customerAddress = this.province+this.city+this.country+this.detailsAddress
            let data = new Object(this.formCustomer)
            addCustomerInfo(data).then( res => {
              if(res.code === 200){
                this.addCustomerVisible = false
                this.$message({
                  type: 'success',
                  message: '添加成功'
                });
                this.getCustomerInfos();
              }
            }).catch(err => {
              console.log(err);
              this.$message.error("添加失败")
            })
          }
        })
      },
      closeDialog(){
        this.addCustomerVisible = false
        this.$message({
          type: 'info',
          message: '已取消添加'
        });
        //清除值
        this.formCustomer = {}
        this.province = ''
        this.city = ''
        this.country = ''
        this.detailsAddress = ''
        this.dataCityList = ''
        this.dataCountryList = ''
      },
      //翻页
      handleSizeChange(size) {
        this.currentPage = 1; //第一页
        this.pageSize = size; //每页先显示多少数据
        this.getCustomerInfos()
      },
      handleCurrentChange(page) {
        this.currentPage=page
        this.getCustomerInfos()
      },

      getCityData(){
        this.dataProvinceList = []
        let provinceArr = []
        for(let item in map.data){
          provinceArr = map.data[item];
          this.dataProvinceList.push(provinceArr);
        }
      },
      //获取客户信息
      getCustomerInfos( ) {
        request({
          method: 'get',
          url: `/api/customers/${this.currentPage}/${this.pageSize}`
        }).then(res => {
          console.log(res)
          let customers = JSON.parse(res.data.customerInfos);
          this.total = customers.total;
          this.customers = customers.list;
          this.loading = false
        }).catch(err => {
          console.log(err);
        })
      }
    },
    computed:{
      searchInfo()
      {
        const search = this.search
        if (search) {
          return this.customers.filter(data => {
            return Object.keys(data).some(key => {
              return String(data[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.customers
      }
    },
    created() {
     this.getCustomerInfos();
     this.getCityData()
    }
  }
</script>

<style scoped>
  .el-table{
    margin-top: 30px;
  }
  .el-add {
    margin: 20px;
    display: flex;
  }
  .el-input,
  .el-select{
    width: 50%;
  }
  .Pagination{
    display: flex;
    justify-content: flex-start;
    margin-top: 10px;
  }
</style>
