<template>
  <div v-loading='loading'>
    <div class="main" v-title data-title="供销商信息"></div>
      <bread-crumb>
        <el-breadcrumb-item slot="first">用户管理</el-breadcrumb-item>
        <el-breadcrumb-item slot="second">供货商信息</el-breadcrumb-item>
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
          <el-button slot="reference" type="primary" style="margin-left: 20px" @click="addSupplierVisible = true">
            <i class="el-icon-plus"></i>
            添加
          </el-button>
        </div>
        <el-table
                v-loading="loading"
                :data="suppliers"
                style="width: 100%">
          <el-table-column
                  label="#"
                  type="index"
                  fit>
          </el-table-column>

          <el-table-column
                  label="姓名"
                  fit>
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>姓名: {{ scope.row.supplierName }}</p>
                <p>住址: {{ scope.row.supplierAddress }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.supplierName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
                  label="Email"
                  fit>
            <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <span size="medium">{{ scope.row.supplierEmail }}</span>
                </div>
            </template>
          </el-table-column>

          <el-table-column
                  label="电话"
                  fit>
            <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <span size="medium">{{ scope.row.supplierPhone }}</span>
                </div>
            </template>
          </el-table-column>

          <el-table-column
                  label="传真"
                  fit>
            <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <span size="medium">{{ scope.row.supplierFax }}</span>
                </div>
            </template>
          </el-table-column>

          <el-table-column
                  label="紧急联系人"
                  fit>
            <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <span size="medium">{{ scope.row.urgentContactPersonName }}</span>
                </div>
            </template>
          </el-table-column>

          <el-table-column
            label="紧急联系电话"
            fit>
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <span size="medium">{{ scope.row.urgentPhone }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="备注"
            fit
            >
            <tmeplate slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <span size="medium">{{ scope.row.supplierDESC }}</span>
              </div>
            </tmeplate>
            </el-table-column>
        </el-table>
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
      <!-- 添加用户dialog -->
    <el-dialog class="dialog" 
            width="35%"
            title="添加供货商信息"
            :destroy-on-close="true"
            :close-on-click-modal="true"
            :visible.sync="addSupplierVisible">
        <el-form :model="formSupplier" :rules="formSupplierRule" ref="formSupplierRule">

          <el-form-item label="供货商姓名" :label-width="formLabelWidth" prop="supplierName">
            <el-input size="small" v-model="formSupplier.supplierName" placeholder="eg:张三"  clearable></el-input>
          </el-form-item>

          <el-form-item label="供货商电话" :label-width="formLabelWidth" prop="supplierPhone">
            <el-input size="small" maxlength="11" minlenth="11" v-model="formSupplier.supplierPhone" placeholder="请输入电话号码" clearable show-word-limit />
          </el-form-item>

          <el-form-item label="供货商传真" :label-width="formLabelWidth" prop="supplierFax">
            <el-input size="small" maxlength="8" minlenth="7" v-model="formSupplier.supplierFax" placeholder="请输入传真号码" clearable show-word-limit />
          </el-form-item>

          <el-form-item label="供货商地址" :label-width="formLabelWidth" prop="supplierAddress">

            <el-select
              v-model="province"
              filterable
              clearable
              placeholder="省"
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
              placeholder="市"
              size="small"
              @change="getCity()"
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
              placeholder="区县"
          >
            <el-option
              v-for="item in dataCountryList"
              :key="item.city_name"
              :label="item.city_name"
              :value="item.city_name"
            ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="  详细地址    " :label-width="formLabelWidth" prop="detailsAddress">
            <el-input size="small" v-model="detailsAddress" placeholder="精确到门牌号" clearable />
          </el-form-item>

          <el-form-item label="电子邮箱" :label-width="formLabelWidth" prop="supplierEmail">
            <el-input size="small" type="email" v-model="formSupplier.supplierEmail" placeholder="xxx@xxx.com" clearable />
          </el-form-item>

          <el-form-item label="紧急联系人" :label-width="formLabelWidth" prop="urgentPersonName">
            <el-input size="small" v-model="formSupplier.urgentPersonName" placeholder="请输入紧急联系人姓名" clearable show-word-limit />
          </el-form-item>

          <el-form-item label="紧急电话" :label-width="formLabelWidth" prop="urgentPhone">
            <el-input size="small" maxlength="11" minlenth="11" v-model="formSupplier.urgentPhone" placeholder="请输入紧急联系人电话" clearable show-word-limit />
          </el-form-item>

          <el-form-item label="备注" :label-width="formLabelWidth" prop="supplierDesc">
            <el-input :rows="3" type="textarea" v-model="formSupplier.supplierDesc" style="width: 50%;min-width:80px" placeholder="" />
          </el-form-item>

          <el-button @click.native="closeDialog()">取 消</el-button>
          <el-button type="primary" @click="addSupplier('formSupplierRule')">确 定</el-button>
        </el-form>
      </el-dialog>
  </div>
</template>

  <script>
    import {request} from "../../network/request"
    import {addSupplierInfo} from '../../network/home'
    import map from '../../assets/city'
    const BreadCrumb =() => import('../../components/BreadCrumb')

    export default {
      name: "SupplierInfo",
      components:{
        BreadCrumb
      },
      data() {
        let checkName = (rule,value,callback) => {
          if(!value){
            return callback(new Error('姓名不能为空'))
          }
          else{
            return callback()
          }
        }
        let checkPhone = (rule,value,callback) =>{
          if(!value){
            return callback(new Error('联系电话不能为空'))
          }
          else if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))){
            return callback(new Error('请输入正确的电话号码'))
          }
          else{
            return callback()
          }
        }
        let checkAddress = (rule,value,callback) =>{
          if(!value){
            return callback(new Error('地址不能空'))
          }else{
            return callback()
          }
        }
        let checkDetail = (rule,value,callback) =>{
          if(!value){
            return callback(new Error('详细住址不能为空'))
          }else{
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
        let checkUrgentName = (rule,value,callback) =>{
          if(!value){
            return callback(new Error('紧急联系人必填'))
          }else{
            return callback()
          }
        }
        let checkUrgentPhone = (rule,value,callback) =>{
          if(!value){
            return callback(new Error('紧急联系人电话必填'))
          }
          else if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))){
            return callback(new Error('请输入正确的电话号码'))
          }
          else{
            return callback()
          }
        }
        return {
          suppliers:[],
          search:'',
          addSupplierVisible:false,
          formLabelWidth:'100px',
          formSupplier:{
            supplierName:'',
            supplierPhone:'',
            supplierEmail:'',
            supplierFax:'',
            supplierAddress:'',
            urgentPersonName:'',
            urgentPhone:'',
            supplierDesc:''
          },
          formSupplierRule:{
            supplierName:[{validator:checkName,trigger:'blur'}],
            supplierPhone:[{validator:checkPhone,trigger:'blur'}],
            supplierEmail:[{validator:checkEmail,trigger:'blur'}],
            urgentPersonName:[{validator:checkUrgentName,trigger:'blur'}],
            urgentPhone:[{validator:checkPhone,trigger:'blur'}]
          },
          detailsAddress:[{validator:checkDetail,trigger:'blur'}],
           //记录省市县
          dataProvinceList: '',
          province:'',
          dataCityList: '',
          city:'',
          dataCountryList: '',
          country:'',
          detailsAddress:'',
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
        //关闭dialog
        closeDialog(){
          this.addSupplierVisible = false;
          this.formSupplier = {}
          this.province =''
          this.city = ''
          this.country = ''
          this.detailsAddress = ''
        },
        //添加供货商信息
        addSupplier(){
          this.$refs.formSupplierRule.validate( valid => {
            if(valid){
              this.formSupplier.supplierAddress = this.province+this.city+this.country+this.detailsAddress
              let data = new Object(this.formSupplier)
              addSupplierInfo(data).then( res => {
                this.addSupplierVisible = false
                if(res.code === 200){
                  this.$message({
                    type: 'success',
                    message: '添加成功'
                  });
                  this.getSupplierInfos()
                }
              }).catch(err => {
                  this.$message.error("添加失败")
                  console.log(err)
                })
            }
          })
        },
        //获取市级城市数据，
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
        //获取区县城市数据
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
        //获取省级城市数据
        getCityData(){
          this.dataProvinceList = []
          let provinceArr = []
          for(let item in map.data){
            provinceArr = map.data[item];
            this.dataProvinceList.push(provinceArr);
          }
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

        //获取供货商信息
        getSupplierInfos(){
          request({
            method:'get',
            url:`/api/suppliers/${this.currentPage}/${this.pageSize}`
          }).then(res => {
            let suppliers = JSON.parse(res.data.supplierInfos)
            this.suppliers = suppliers.list
            console.log(this.suppliers)
            this.total = suppliers.total
            this.loading = false
          }).catch(err => {
            console.log(err);
          })
          }
        },
      created(){
        this.getSupplierInfos()
        this.getCityData()
      }
    }
  </script>

  <style scoped>
    .dialog{
      min-width: 20%;
    }
    .el-table{
      margin-top: 30px;
    }
    .el-add {
      margin: 20px;
      display: flex;
    }
    .el-input{
      width: 50%;
      min-width: 80px;
    }
    .el-select{
      width: 17%;
      min-width: 80px;
    }
    .Pagination{
      display: flex;
      justify-content: flex-start;
      margin-top: 10px;
    }
  </style>
