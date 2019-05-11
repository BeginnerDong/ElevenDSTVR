import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isShow: false,
		isShowTwo: false,
		messageData: [],
		orderItemData:[],
		submitData: {
			gender: '',
			class: '',
			score: '',
			content: '',
		},
		stars: [1, 2, 3, 4, 5],
		buttonCanClick: true,
		complete_api: [],
		submitDataTwo: {
			price: ''
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		const self = this;
		self.data.paginate = api.cloneForm(getApp().globalData.paginate);
		wx.showLoading();
		self.data.id = options.id;
		self.setData({
			web_stars: self.data.stars,
			isShow: self.data.isShow,
			isShowTwo: self.data.isShowTwo,
			web_buttonCanClick: self.data.buttonCanClick
		})
		self.getMainData()
	},

	getMainData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			id: self.data.id
		};
		postData.getAfter = {
			orderItem: {
				tableName: 'OrderItem',
				middleKey: 'id',
				key: 'product_id',
				searchItem: {
					status: 1,
					pay_status: 1
				},
				condition: '=',
			},
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0]
			}
			self.getOrderItemData()
			self.setData({
				web_mainData: self.data.mainData,
			});
			self.data.product_no = self.data.mainData.product_no;
			self.data.complete_api.push('getMainData')
			self.checkLoadComplete()
		};
		api.productGet(postData, callback);
	},

	getOrderItemData() {
		const self = this;
		const postData = {};
		postData.token = wx.getStorageSync('token');
		postData.searchItem = {
			
			product_id:self.data.id,
			pay_status:1
		};
		postData.getAfter = {
			user: {
				tableName: 'User',
				middleKey: 'user_no',
				key: 'user_no',
				searchItem: {
					status: 1,
				},
				condition: '=',
			},
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.orderItemData.push.apply(self.data.orderItemData, res.info.data)
			}
			self.getMessageData()
			self.setData({
				web_orderItemData: self.data.orderItemData,
			});
			self.data.complete_api.push('getOrderItemData')
			self.checkLoadComplete()
		};
		api.orderItemGet(postData, callback);
	},

	getMessageData(isNew) {
		const self = this;
		console.log('111',self.data.mainData.product_no)
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.token = wx.getStorageSync('token');
		postData.searchItem = {
			product_no:self.data.product_no,
			user_type:0	
		};
		postData.getAfter = {
			user: {
				tableName: 'user',
				middleKey: 'user_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '='
			}
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.messageData.push.apply(self.data.messageData, res.info.data)
				for (var i = 0; i < self.data.messageData.length; i++) {
					var average = parseInt((parseInt(self.data.messageData[i].class) + parseInt(self.data.messageData[i].score) +
						parseInt(self.data.messageData[i].gender)) / 3)
					self.data.messageData[i].average = average
				}
				console.log(self.data.messageData)
			};
			self.setData({
				web_messageData: self.data.messageData,
			});
			self.data.complete_api.push('getMessageData')
			self.checkLoadComplete()
		};
		api.messageGet(postData, callback);
	},

	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll) {
			self.data.paginate.currentPage++;
			self.getMessageData();
		};
	},

	checkLoadComplete() {
		const self = this;
		var complete = api.checkArrayEqual(self.data.complete_api, ['getMainData', 'getMessageData','getOrderItemData']);
		if (complete) {
			wx.hideLoading();
		};
	},

	changeBind(e) {
		const self = this;
		if (api.getDataSet(e, 'value')) {
			self.data.submitData[api.getDataSet(e, 'key')] = api.getDataSet(e, 'value');
		} else {
			api.fillChange(e, self, 'submitData');
		};
		self.setData({
			web_submitData: self.data.submitData,
		});
		console.log(self.data.submitData)
	},


	changeBindTwo(e) {
		const self = this;
		if (api.getDataSet(e, 'value')) {
			self.data.submitDataTwo[api.getDataSet(e, 'key')] = api.getDataSet(e, 'value');
		} else {
			api.fillChange(e, self, 'submitDataTwo');
		};
		self.setData({
			web_submitDataTwo: self.data.submitDataTwo,
		});
		console.log(self.data.submitDataTwo)
	},

	messageAdd() {
		const self = this;
		const postData = {
			data: api.cloneForm(self.data.submitData),
			token: wx.getStorageSync('token'),
		};
		postData.data.product_no = self.data.mainData.product_no;
		const callback = (res) => {
			if (res.solely_code == 100000) {

				api.showToast('评价成功', 'none', 800);
				self.showTwo();
				self.data.messageData = [];
				self.getMessageData(true)
			} else {

				api.showToast(res.msg, 'none', 1000);
			};
			self.data.buttonCanClick = true;
			self.setData({
				web_buttonCanClick: self.data.buttonCanClick
			});
		};
		api.messageAdd(postData, callback);
	},

	submitTwo() {
		const self = this;
		console.log(666)
		const pass = api.checkComplete(self.data.submitDataTwo);
		self.data.buttonCanClick = false;
		self.setData({
			web_buttonCanClick: self.data.buttonCanClick
		});
		console.log(777)
		if (pass) {
			const callback = (res) => {
				self.addOrder()
			};
			api.getAuthSetting(callback);
		} else {
			api.showToast('请输入打赏金额', 'none');
			self.data.buttonCanClick = true;
			self.setData({
				web_buttonCanClick: self.data.buttonCanClick
			});
		};
	},

	submit() {
		const self = this;
		console.log(666)
		const pass = api.checkComplete(self.data.submitData);
		self.data.buttonCanClick = false;
		self.setData({
			web_buttonCanClick: self.data.buttonCanClick
		});
		console.log(777)
		if (pass) {
			const callback = (res) => {
				self.messageAdd()
			};
			api.getAuthSetting(callback);
		} else {
			api.showToast('请补全评分哦', 'none');
			self.data.buttonCanClick = true;
			self.setData({
				web_buttonCanClick: self.data.buttonCanClick
			});
		};
	},

	addOrder() {
		const self = this;

		const postData = {
			token: wx.getStorageSync('token'),
			product: [{
				id: self.data.id,
				count: self.data.submitDataTwo.price
			}],
			pay: {
				wxPay: self.data.submitDataTwo.price
			},
			type: 5,
		};
		console.log(postData)
		const callback = (res) => {
			self.data.order_id = res.info.id;
			if (res && res.solely_code == 100000) {
				self.data.buttonCanClick = true;
				self.setData({
					web_buttonCanClick: self.data.buttonCanClick
				});
				self.pay()
			} else {
				api.showToast(res.msg, 'none')
			};
		};
		api.addOrder(postData, callback);
	},

	pay() {

		const self = this;
		var order_id = self.data.order_id;
		const postData = {
			wxPay: self.data.submitDataTwo.price,
			wxPayStatus: 0
		};
		postData.token = wx.getStorageSync('token');
		postData.searchItem = {
			id: order_id
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				if (res.info) {
					const payCallback = (payData) => {
						if (payData == 1) {
							api.showToast('打赏成功', 'none');
							self.show();
							self.data.orderItemData = [];
							self.getOrderItemData()
						};
					};
					api.realPay(res.info, payCallback);
				} else {
					api.showToast('打赏成功', 'none');

				};
			} else {
				api.showToast('支付失败', 'none')
			}
		};
		api.pay(postData, callback);
	},


	show() {
		const self = this;
		self.data.isShow = !self.data.isShow;
		self.setData({
			isShow: self.data.isShow
		})
	},


	showTwo() {
		const self = this;
		self.data.isShowTwo = !self.data.isShowTwo;
		self.setData({
			isShowTwo: self.data.isShowTwo
		})

	},


})
