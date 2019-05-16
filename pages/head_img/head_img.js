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
		orderItemData: [],
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
	/* 	postData.paginate = {
			count: 0,
			currentPage:1,
			pagesize:6,
			is_page:true,
		}, */
		postData.token = wx.getStorageSync('token');
		postData.searchItem = {

			product_id: self.data.id,
			pay_status: 1
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
		console.log('111', self.data.mainData.product_no)
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.token = wx.getStorageSync('token');
		postData.searchItem = {
			product_no: self.data.product_no,
			user_type: 0
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
		var complete = api.checkArrayEqual(self.data.complete_api, ['getMainData', 'getOrderItemData']);
		if (complete) {
			wx.hideLoading();
		};
	},





	intoPathRedi(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},
	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

})
