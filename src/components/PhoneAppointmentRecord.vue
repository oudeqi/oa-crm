<template>
  <div class="platform-appointment">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/appointment/phone' }">电话预约</el-breadcrumb-item>
        <el-breadcrumb-item>回访记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="filter">
      <div class="l">
        <el-input placeholder="搜索关键词" icon="search" v-model="keywords" :on-icon-click="search"></el-input>
      </div>
      <div class="r">
        <el-button type="primary" icon="plus" @click="isAddModalOpen = true">新增回访记录</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData">
        <el-table-column prop="id" label="#"></el-table-column>
        <el-table-column prop="info" label="描述" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" :formatter="dateFormat" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" min-width="130">
          <template scope="scope">
            <el-button type="text" @click="openDetailDialog(scope)">详情</el-button>
            <el-button type="text" @click="openEditDialog(scope)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" v-show="pageCount>1">
      <el-pagination @current-change="pageIndexChange" :current-page="currentPage" :page-size="pageSize"
                     layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog @close="reload" title="添加回访记录" v-model="isAddModalOpen" :close-on-click-modal="false">
      <el-form :model="recordAddObj">
        <el-form-item class="marb0">
          <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="recordAddObj.info"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddModalOpen = false">取 消</el-button>
        <el-button type="primary" @click="handleAddRecord">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看回访记录详情" v-model="isDetailModalOpen" :close-on-click-modal="false">
      <el-form :model="recordDetailObj">
        <el-form-item class="marb0">
          <el-input type="textarea" class="textarea-disabled" :disabled="true"
                    :rows="8" placeholder="请输入内容" v-model="recordDetailObj.info"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isDetailModalOpen = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog @close="reload" title="修改回访记录" v-model="isEditModalOpen" :close-on-click-modal="false">
      <el-form :model="recordEditObj">
        <el-form-item class="marb0">
          <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="recordEditObj.info"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isEditModalOpen = false">取 消</el-button>
        <el-button type="primary" @click="handleEditRecord">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'phoneAppointmentRecord',
    data () {
      return {
        recordAddObj: {
          reservationId: this.$route.params.id,
          info: null
        },
        recordDetailObj: {},
        recordEditObj: {},
        isAddModalOpen: false,
        isDetailModalOpen: false,
        isEditModalOpen: false,
        tableData: null,
        keywords: '',
        currentPage: 1,
        pageSize: 15,
        total: null,
        pageCount: 0
      }
    },
    computed: {},
    methods: {
      reload () {
        this.getTableData()
      },
      getTableData () {
        this.$http.get('/v2/aut/crm/reservation/visit/list', {
          params: {
            pageSize: this.pageSize,
            pageIndex: this.currentPage,
            search: this.keywords,
            reservationId: this.$route.params.id
          }
        }).then(res => {
          console.log('获取预约回访记录列表', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.tableData = res.body.data.data
            this.total = res.body.data.rowCount
            this.pageCount = res.body.data.pageCount
          }
        }).catch(res => {
          console.log('获取预约回访记录列表异常', res)
          this.$message.error('服务器繁忙！')
        })
      },
      search () {
        this.currentPage = 1
        this.getTableData()
      },
      pageIndexChange (val) {
        this.currentPage = val
        this.getTableData()
      },
      dateFormat (row) {
        if (row.createDate) {
          return moment(row.createDate).format('YYYY-MM-DD HH:mm:ss')
        } else {
          return '无'
        }
      },
      handleAddRecord () {
        if (!this.recordAddObj.info) {
          this.$message.error('请输入回访记录')
        } else {
          this.$http.post('/v2/aut/crm/reservation/visit/add', this.recordAddObj)
            .then((res) => {
              console.log('添加回访记录', res)
              if (res.body.errMessage) {
                this.$message.error(res.body.errMessage)
              } else {
                this.$message({
                  message: '恭喜你，添加回访记录成功',
                  type: 'success'
                })
              }
            })
            .catch((res) => {
              console.log('添加回访记录异常', res)
              this.$message.error('服务器繁忙')
            })
        }
      },
      openDetailDialog (scope) {
        console.log(scope)
        this.isDetailModalOpen = true
        this.recordDetailObj = scope.row
      },
      openEditDialog (scope) {
        console.log(scope)
        this.isEditModalOpen = true
        this.recordEditObj = scope.row
      },
      handleEditRecord () {
        console.log(this.recordEditObj)
        if (!this.recordEditObj.info) {
          this.$message.error('回访记录不能为空')
        } else {
          this.$http.post('/v2/aut/crm/reservation/visit/update', this.recordEditObj)
            .then((res) => {
              console.log('修改回访记录', res)
              if (res.body.errMessage) {
                this.$message.error(res.body.errMessage)
              } else {
                this.$message({
                  message: '恭喜你，修改回访记录成功',
                  type: 'success'
                })
              }
            })
            .catch((res) => {
              console.log('修改回访记录异常', res)
              this.$message.error('服务器繁忙')
            })
        }
      }
    },
    created () {
      this.getTableData()
    }
  }
</script>

<style lang="scss" scoped>

  .platform-appointment{}
  .marb0{
    margin: 0;
  }
  .breadcrumb{
    padding: 20px;
    background: #fbfbfb;
  }
  .filter{
    margin-top: 15px;
    padding: 0 20px;
    .el-input{
      width: auto;
    }
    &:after{
      content: "";
      display: block;
      height: 0;
      width: 0;
      overflow: hidden;
      visibility: hidden;
      clear: both;
    }
    .l{
      float: left;
    }
    .r{
      float: right;
      a{
        color: inherit;
        text-decoration: none;
      }
      .uploader{
        display: inline-block;
        margin-left: 10px;
      }
    }
  }
  .main{
    padding: 0 20px;
    overflow: auto;
    margin-top: 15px;
  }
  .pagination{
    padding:20px;
    text-align: right;
  }
</style>
