<template>
	<div class="myCustomer">
		<div class="breadcrumb">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>客户</el-breadcrumb-item>
				<el-breadcrumb-item>签约申请</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="filter">
			<div class="l">
				<el-select v-model="state" placeholder="审核状态" @change="stateChange">
					<el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<!--<el-select v-model="sortType" placeholder="排序方式" @change="sortTypeChange">
          <el-option v-for="item in sortArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>-->
				<!--<el-input placeholder="搜索关键词" icon="search" v-model="keywords" :on-icon-click="search"></el-input>-->
			</div>
			<div class="r">
				<el-button type="primary" icon="plus" @click="myCustomerAdd">新建签约</el-button>
			</div>
		</div>
		<div class="main">
			<el-table :data="tableData" v-loading.body="loading">
				<el-table-column prop="customerName" label="客户" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="productName" label="类型" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="typeName" label="二级类型"></el-table-column>
				<el-table-column prop="stock" label="股权" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="realMoney" label="实际收款" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="money" label="总金额"></el-table-column>
				<el-table-column prop="remarks" label="备注" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="flowStatus" label="签约状态" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="createDate" :formatter="dateFormat" label="申请时间" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="操作" min-width="130" v-if="state==1">
					<template scope="scope">
						<el-button type="text" @click="passYes(scope)">通过</el-button>
						<el-button type="text" @click="passNo(scope)">拒绝</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="pagination" v-show="pageCount>1">
			<el-pagination @current-change="pageIndexChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>

	</div>
</template>

<script>
	import router from '../router'
	import moment from 'moment'
	import { appHost, token } from '../const'
	export default {
		name: 'myCustomer',
		data() {
			return {
				sortType: null,
				states: null,
				state: 1,
				tableData: null,
				keywords: '',
				loading: true,
				currentPage: 1,
				pageSize: 15,
				total: null,
				pageCount: 0,
				isModalOpen: false,
				closeOnClickModal: false,
				follow: {
					state: '1',
					content: '',
					id: null
				},
			}
		},
		computed: {},
		methods: {
			passYes(sco) {
				this.$confirm('通过?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					this.$http.post('/v2/aut/crm/sign/sure', {
						id: sco.row.id,
					}).then(res => {
						if(res.body.errMessage) {
							console.log(res.body.errMessage)
						}
						this.getTableData();
						this.$message({
							type: 'success',
							message: '处理成功!'
						});
					}).catch(res => {
						this.loading = false
						this.$message.error('服务器繁忙！')
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});

			},
			passNo(sco) {
				this.$confirm('拒绝?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					this.$http.post('/v2/aut/crm/sign/refuse', {
						id: sco.row.id,
					}).then(res => {
						this.getTableData();
						this.$message({
							type: 'success',
							message: '处理成功!'
						});
					}).catch(res => {
						this.loading = false
						this.$message.error('服务器繁忙！')
					})

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});

			},
			getStates() {
				this.states = [{
					label: '待审核',
					value: 1
				}, {
					label: '已审核',
					value: 2
				}]
				//        this.state = this.states[0].value
			},
			getTableData() {
				this.loading = false
				//        let testArr = '{"data":{"pageSize":20,"pageIndex":1,"rowCount":9,"data":[{"id":8,"customerName":"昆山招聘","cityCode":"320583","cityCodeName":"昆山市","mainPerson":"李彦臣","mainPhoneNumber":"18550118707","mainWeChat":"moxian118","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"","status":1,"signType":0,"remarks":"","createDate":1490249495000,"lastOperTime":1490249495000,"createUid":2,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":1504688189000,"remind":0,"tripType":2,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0},{"id":3613,"customerName":"固原大城小事","cityCode":"640401","cityCodeName":"市辖区","mainPerson":"韩总","mainPhoneNumber":"","mainWeChat":"xhanaimiaox","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"负责人","status":6,"signType":0,"remarks":"目前正在跟踪中","createDate":1490255782000,"lastOperTime":1490255782000,"createUid":1,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":null,"remind":0,"tripType":0,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0},{"id":3614,"customerName":"入围广宁网","cityCode":"441223","cityCodeName":"广宁县","mainPerson":"邓总","mainPhoneNumber":"13929803806","mainWeChat":"gm13929803806","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"负责人","status":6,"signType":0,"remarks":"目前正在跟踪中","createDate":1490255782000,"lastOperTime":1490255782000,"createUid":1,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":null,"remind":0,"tripType":0,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0},{"id":3615,"customerName":"五邑特搜","cityCode":"440701","cityCodeName":"市辖区","mainPerson":"Peter","mainPhoneNumber":"","mainWeChat":"QQ619325900","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"负责人","status":5,"signType":0,"remarks":"目前正在跟踪中","createDate":1490255782000,"lastOperTime":1490255782000,"createUid":1,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":null,"remind":0,"tripType":0,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0},{"id":3616,"customerName":"寻信饮食安全","cityCode":"140101","cityCodeName":"市辖区","mainPerson":"田老师","mainPhoneNumber":"","mainWeChat":"Tninggn","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"负责人","status":5,"signType":0,"remarks":"只想拿100张票，价格觉得贵了还","createDate":1490255782000,"lastOperTime":1490255782000,"createUid":1,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":null,"remind":0,"tripType":0,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0},{"id":3617,"customerName":"南宁微生活","cityCode":"450101","cityCodeName":"市辖区","mainPerson":"漫漫（财务）","mainPhoneNumber":"18577178467","mainWeChat":"zwhd701","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"财务","status":7,"signType":0,"remarks":"3月中旬拿了500张海南票做活动","createDate":1490255782000,"lastOperTime":1490255782000,"createUid":1,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":null,"remind":0,"tripType":0,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0},{"id":3543,"customerName":"博真微生活","cityCode":"510101","cityCodeName":"市辖区","mainPerson":"刘劲松","mainPhoneNumber":"13568281288","mainWeChat":"I627638","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"负责人","status":6,"signType":0,"remarks":"目前正在跟踪中，近期会来公司","createDate":1490255651000,"lastOperTime":1490255651000,"createUid":1,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":null,"remind":0,"tripType":0,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0},{"id":6362,"customerName":"佳雨传媒","cityCode":"330101","cityCodeName":"市辖区","mainPerson":"喻情","mainPhoneNumber":"15179765630","mainWeChat":"TM15179765630","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"","status":4,"signType":0,"remarks":"","createDate":1490259238000,"lastOperTime":1490259238000,"createUid":1,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":null,"remind":0,"tripType":0,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0},{"id":6368,"customerName":"玉屏那些事儿","cityCode":"522223","cityCodeName":"玉屏侗族自治县","mainPerson":"向运亮","mainPhoneNumber":"13638563285","mainWeChat":"XiangYunL123","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"负责人","status":1,"signType":0,"remarks":"在跟踪中","createDate":1490259380000,"lastOperTime":1490259380000,"createUid":1,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":null,"remind":0,"tripType":0,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0}],"pageCount":1}}'
				//        let xx = JSON.parse(testArr)
				//        console.log('获取我的客户列表', xx)
				//        this.tableData = xx.data.data
				//        this.total = xx.data.rowCount
				//        this.pageCount = xx.data.pageCount
				this.$http.get('/v2/aut/crm/sign/list', {
					params: {
						pageSize: this.pageSize,
						pageIndex: this.currentPage,
						search: this.keywords,
						type: this.state,
					}
				}).then(res => {
					console.log('获取我的客户列表', res)
					this.loading = false
					if(res.body.errMessage) {
						this.$message.error(res.body.errMessage)
					} else {
						this.tableData = res.body.data.data
						this.total = res.body.data.rowCount
						this.pageCount = res.body.data.pageCount
						this.tableData.forEach(function(item, index) {
							if(item.flowStatus == -2) {
								item.flowStatus = '总裁拒绝';
							} else if(item.flowStatus == -1) {
								item.flowStatus = "财务拒绝"
							} else if(item.flowStatus == 0) {
								item.flowStatus = '审核中'
							} else if(item.flowStatus == 1) {
								item.flowStatus = '财务已审核'
							} else if(item.flowStatus == 2) {
								item.flowStatus = '总裁已审核'
							} else {
								item.flowStatus = '未知'
							}
						})
					}
				}).catch(res => {
					console.log('获取我的客户列表异常', res)
					this.loading = false
					this.$message.error('服务器繁忙！')
				})
			},
			search() {
				this.currentPage = 1
				this.getTableData()
			},
			pageIndexChange(val) {
				this.currentPage = val
				this.getTableData()
			},
			reload() {
				this.getTableData()
			},
			myCustomerAdd() {
				router.push({
					name: 'myCustomerAdd'
				})
			},
			dateFormat(row) {
				if(row.createDate) {
					return moment(row.createDate).format('YYYY-MM-DD HH:mm:ss')
				} else {
					return ''
				}
			},
			stateChange() {
				this.currentPage = 1
				this.getTableData()
			},
			sortTypeChange() {
				this.currentPage = 1
				this.getTableData()
			}
		},
		created() {
			this.getStates()
			this.getTableData()
		}
	}
</script>

<style lang="scss" scoped>
	.myCustomer {
		.breadcrumb {
			padding: 20px;
			background: #fbfbfb;
		}
		.filter {
			margin-top: 15px;
			padding: 0 20px;
			.el-input {
				width: auto;
			}
			&:after {
				content: "";
				display: block;
				height: 0;
				width: 0;
				overflow: hidden;
				visibility: hidden;
				clear: both;
			}
			.l {
				float: left;
			}
			.r {
				float: right;
				a {
					color: inherit;
					text-decoration: none;
				}
				.uploader {
					display: inline-block;
					margin-left: 10px;
				}
			}
		}
		.main {
			padding: 0 20px;
			overflow: auto;
			margin-top: 15px;
		}
		.pagination {
			padding: 20px;
			text-align: right;
		}
	}
</style>