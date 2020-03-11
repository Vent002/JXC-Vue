<template>
  <div>
    <div class="main" v-title data-title="商品种类">
    </div>
    <div>
      <bread-crumb>
        <el-breadcrumb-item slot="first">库存管理</el-breadcrumb-item>
        <el-breadcrumb-item slot="second">商品类型</el-breadcrumb-item>
      </bread-crumb>
      <div class="el-table">
        <!-- -->
        <div class="el-add">
          <el-button slot="reference" type="primary" style="float: left" @click="addFormVisible = true">
            <i class="el-icon-plus"></i>
            添加
          </el-button>
        </div>
        <!--主要内容-->
        <template>
          <el-table
            v-loading="loading"
            :data="searchInfo"
            style="width: 100%"
            fit
          >
          <el-table-column type="expand">
            <template slot-scope="scope" v-if="scope.row.supplierInfo">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item label="供货商姓名" >
                  <span >{{ scope.row.supplierInfo.supplierName }}</span>
                </el-form-item>
                <el-form-item label="联系方式">
                  <span>{{ scope.row.supplierInfo.supplierPhone }}</span>
                </el-form-item>
                <el-form-item label="紧急联系人" >
                  <span >{{ scope.row.supplierInfo.urgentContactPersonName }}</span>
                </el-form-item>
                <el-form-item label="联系方式">
                  <span>{{ scope.row.supplierInfo.urgentPhone }}</span>
                </el-form-item>
              </el-form>
            </template>
            <template v-else>
              <el-form>
                <el-form-item>
                  <span> 无 </span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
            <el-table-column
              label="#"
              type="index"
              align="center"
              fit>
            </el-table-column>
            <el-table-column
              prop="num"
              label='种类编号'
              fit
              align="center">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.goodsTypeNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label='名称'
              fit
              align="center">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.goodsTypeName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="date"
              label='创建日期'
              fit
              align="center">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.createDate }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label='价格'
              fit
              align="center">
              <template slot-scope="scope">

                <span style="margin-left: 10px">{{ scope.row.goodsPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column
              fit
              align="center">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="search"
                  clearable
                  placeholder="输入关键字搜索"/>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index,scope.row)">编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index,scope.row.id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 修改商品种类对话框 -->
          <el-dialog class="dialog" title="修改商品信息" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form v-model="editGoods" label-width="80px" :rules.sync="editFormRules" ref="editGoods">
              <el-form-item label="商品种类" prop="goodsTypeNum">
                <el-input type="text" v-model="editGoods.goodsTypeNum" auto-complete="off" disabled></el-input>
              </el-form-item>
              <el-form-item label="商品名称" prop="goodsTypeName">
                <el-input type="text" v-model="editGoods.goodsTypeName" disabled></el-input>
              </el-form-item>
              <el-form-item label="日期" prop="createDate">
                <div class="block">
                  <el-date-picker
                    v-model="editGoods.createDate"
                    type="datetime"
                    class="input-class"
                    disabled
                    placeholder="选择日期时间">
                  </el-date-picker>
                </div>
              </el-form-item>
              <el-form-item label="商品价格" prop="goodsPrice">
                <el-input type="text" v-model="editGoods.goodsPrice" clearable></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="closeEditSubmit('editGoods')">取消</el-button>
              <el-button type="primary" @click="editSubmit(editGoods.id,editGoods.goodsPrice)">提交</el-button>
            </div>
          </el-dialog>
          <!-- 添加商品种类对话框 -->
          <el-dialog class="dialog" title="新增商品种类"
            :visible.sync="addFormVisible"
            :destroy-on-close="true"
            :close-on-click-modal="true"
               >
            <el-form v-model="formGoods" :rules="formGoodsRules" ref="formGoods">
              <el-form-item label="类型" :label-width="formLabelWidth" prop="goodsNum">
                <el-input v-model="formGoods.goodsNum" autocomplete="off" placeholder="eg:1001" clearable></el-input>
              </el-form-item>
              <el-form-item label="商品名称" :label-width="formLabelWidth" prop="goodsName">
                <el-input v-model="formGoods.goodsName" placeholder="eg:月明" clearable>
                </el-input>
              </el-form-item>
              <el-form-item label="日期" :label-width="formLabelWidth" prop="goodsCreateDate">
                <el-date-picker
                  v-model="formGoods.goodsCreateDate"
                  clearable
                  align="right"
                  type="datetime"
                  class="input-class"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="商品价格" :label-width="formLabelWidth" prop="price" clearable>
                <el-input type="text" v-model="formGoods.price" placeholder="eg:200">
                </el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="closeDialog(formGoods)">取 消</el-button>
              <el-button type="primary" @click.native="addGoodsInfo">确 定</el-button>
            </div>
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
      </template>
      </div>
    </div>
  </div>
</template>

<script>
  import {request} from "../../network/request";
  const BreadCrumb = () => import('../../components/BreadCrumb')
  import { updateGoodsTypeInfo, addGoodsTypeInfo, delGoodsTypeInfo} from "../../network/home"

  export default {
    name: "GoodsType",
    components: {
      BreadCrumb
    },
    data() {
      return {
        //商品种类数据
        goods: [],
        search: '',
        //添加商品种类对话框中的数据
        addFormVisible: false,
        formGoods: {
          goodsNum: '',
          goodsName: '',
          goodsCreateDate: '',
          price: ''
        },
        formGoodsRules: {
        },
        formLabelWidth: '100px',
        //修改商品种类对话框中的数据
        editFormVisible: false,
        editGoods: {
          id: 0,
          goodsTypeNum: '',
          goodsTypeName: '',
          createDate: '',
          goodsPrice: ''
        },
        editFormRules: {
        },
        //分页操作数据
        currentPage: 1,//当前页
        pageSizes: [5, 8, 10],
        total: 0,
        pageSize: 8,//每页数据
        layout: 'total, sizes, prev, pager, next, jumper',
        loading:true
      }
    },
    created() {
      this.getGoodsList()
    },
    methods: {
      //获取商品种类列表
      getGoodsList(){
        request({
          method:'get',
          url:`/api/goods/${this.currentPage}/${this.pageSize}`
        }).then( res => {
          console.log(res)
          let pageInfo = JSON.parse(res.data.goodsTypeInfos)

          this.goods = pageInfo.list
          this.total = pageInfo.total
          this.loading = false
        }).catch( err => {
          console.log(err);
        })
      },

      //打开修改商品种类信息对话框
      handleEdit: function (index, goods) {
        this.editFormVisible = true
        this.editGoods = Object.assign({}, goods)
      },
      //关闭修改信息弹出框
      closeEditSubmit(editGoods) {
        this.editFormVisible = false
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      },
      //修改商品信息提交
      editSubmit(id,editGoodsPrice) {
        updateGoodsTypeInfo(id,editGoodsPrice).then(res => {
          if(res.code === 200){
            this.editFormVisible = false;
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            this.getGoodsList()
          }
        }).catch(err => {
          this.$message.error("修改失败")
        })
      },
      //删除操作
      handleDelete(index, id) {
        this.$confirm('此操作将永久删除该商品信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delGoodsTypeInfo(id).then(res => {
            if (res.code === 200) {
              this.goods.splice(index, 1)
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.getGoodsList()
            }
          }).catch(err => {
            this.$message({
              type: 'info',
              message: '删除失败'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },

      //关闭新增商品信息弹框，并清除验证信息
      closeDialog: function (formGoods) {
        this.addFormVisible = false
        this.$message({
          type: 'info',
          message: '已取消添加'
        });
        //清空对话框
        this.formGoods = {}
      },
      //新增商品信息
      addGoodsInfo() {
            let goodsInfo = this.$qs.stringify({
              goodsNum:this.formGoods.goodsNum,
              goodsName:this.formGoods.goodsName,
              createDate:this.formGoods.goodsCreateDate,
              goodsPrice:this.formGoods.price
            })
            this.addFormVisible =false;
            addGoodsTypeInfo(goodsInfo).then(res => {
              if(res.code === 200){
                //1. 提示添加成功
                this.$message({
                  type: 'success',
                  message: '添加成功'
                });
                //2.关闭对话框
                this.addFormVisible =false;
                //3. 更新视图
                this.getGoodsList();
                //4. 清空文本框
                // this.formGoods = {}
                for(const key in this.formGoods){
                  if(this.formGoods.hasOwnProperty(key)){
                    this.formGoods[key] = ""
                  }
                }
              }
            }).catch(err => {
              this.$message.error('添加失败');
            })
          },

      handleSizeChange(size) {
        this.currentPage = 1; //第一页
        this.pageSize = size; //每页先显示多少数据
        this.getGoodsList()
      },
      handleCurrentChange(page) {
        this.currentPage=page
        this.getGoodsList()
      },
  },
  computed:{
    searchInfo()
    {
      const search = this.search
      if (search) {
        return this.goods.filter(data => {
          return Object.keys(data).some(key => {
            return String(data[key]).toLowerCase().indexOf(search) > -1
          })
        })
      }
      return this.goods
    }
  }
  }
</script>

<style scoped>
  .dialog {
    margin: 0 auto;
    width: 55%;
  }

  .input-class {
    width: 100%;
  }

  .el-add {
    margin: 20px;
  }

  .el-table {
    margin-top: 30px;
  }

  .Pagination {
    display: flex;
    justify-content: flex-start;
    margin-top: 10px;
  }
   .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
