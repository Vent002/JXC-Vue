<template>
<div>
  <div class="main" v-title data-title="账号管理"></div>
  <bread-crumb>
      <el-breadcrumb-item slot="first">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item slot="second">账号信息</el-breadcrumb-item>
  </bread-crumb>
  <div class="el-table">
    
    <div>
    </div>
    <el-table
        v-loading="loading"
            :data="accounts"
            style="width: 100%">
      <el-table-column
              label="#"
              type="index"
              align="center"
              fit>
      </el-table-column>
      <el-table-column
              label="用户名"
              align="center"
              fit>
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span size="medium">{{ scope.row.accountName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
              label="账号"
              align="center"
              fit>
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span size="medium">{{ scope.row.employeeAccount}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
              label="邮箱"
              align="center"
              fit>
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span size="medium">{{ scope.row.email }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="电话"
        align="center"
        fit>
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span size="medium">{{ scope.row.phone }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="用户状态"
        align="center"
        fit>
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-switch
              @change="changeAccountStatus(scope.row)"
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column fit>
        <template slot="header" slot-scope="scope">
          <el-input
                  v-model="search"
                  placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-row>
            <el-button
              @click="handleEdit(scope.$index, scope.row)"
              type="primary"
              size="mini"
              plain
              icon="el-icon-edit" circle>
            </el-button>
            <el-button
              @click="handleDelete(scope.$index,scope.row)"
              type="danger"
              size="mini"
              plain
              icon="el-icon-delete" circle>
            </el-button>
            <el-button
              type="success"
              size="mini"
              plain
              icon="el-icon-check" circle>
            </el-button>
          </el-row>
        </template>
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
</div>
</template>

<script>
  const BreadCrumb =() => import('../../components/BreadCrumb')
  import {request} from "../../network/request";
  export default {
    name: "CustomerInfo",
    components: {
      BreadCrumb
    },
    data() {
      return {
        accounts:[],
        search:'',
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
      //改变用户状态
      changeAccountStatus(account){
        let id = account.id
        let status = account.status
        request({
          method: 'put',
          url:`/api/accounts/${id}`,
          params:{
            status:status
          }
        }).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        }).catch( err => {
          this.$message.error("修改失败")
        })
      },
      //获取用户列表
      getAccountList(){
        request({
          method:'get',
          url:`/api/accounts/${this.currentPage}/${this.pageSize}`
        }).then( res => {
          let pageInfo = JSON.parse(res.data.accountInfos)
          this.accounts = pageInfo.list
          this.total = pageInfo.total
          this.loading = false
        }).catch( err => {
          console.log(err)
        })
      },
      handleEdit(){},
      handleDelete(){},

      handleSizeChange(size){
        this.currentPage = 1; //第一页
        this.pageSize = size; //每页先显示多少数据
        this.getAccountList();
      },
      handleCurrentChange(page){
        this.currentPage=page
        this.getAccountList()
      },

    },
    created() {
      this.getAccountList()
    }
  }
</script>

<style scoped>
  .el-table{
    margin-top: 30px;
  }
  .Pagination{
    display: flex;
    justify-content: flex-start;
    margin-top: 10px;
  }
</style>
