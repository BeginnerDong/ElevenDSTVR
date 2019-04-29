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
		labelData: [],
		mainData:[],
		complete_api:[],
		stars: [1, 2, 3, 4, 5],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		const self = this;
		self.data.paginate = api.cloneForm(getApp().globalData.paginate);
		wx.showLoading();
		self.getLabelData();
		self.getMainData();
		self.setData({
			web_stars:self.data.stars,
			img: app.globalData.img,
		})
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.searchItem = {
			type:5
		};
		postData.getAfter = {
			message:{
				tableName:'Message',
				middleKey:'product_no',
				key:'product_no',
				searchItem:{
					status:1
				},
				condition:'='
			}
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
				for (var i = 0; i < self.data.mainData.length; i++) {
					self.data.mainData[i].average =0;
					for (var j = 0; j < self.data.mainData[i].message.length; j++) {
						self.data.mainData[i].average = parseInt((parseInt(self.data.mainData[i].message[j].class) + parseInt(self.data.mainData[i].message[j].score) +
						parseInt(self.data.mainData[i].message[j].gender)) / 3*self.data.mainData[i].message.length)
					
					}
				}
			} 
			self.data.complete_api.push('getMainData')
			console.log(self.data.mainData)
			self.setData({
				web_mainData: self.data.mainData,
			});
			self.checkLoadComplete()
		};
		api.productGet(postData, callback);
	},

	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},

	checkLoadComplete() {
		const self = this;
		var complete = api.checkArrayEqual(self.data.complete_api, ['getMainData', 'getLabelData']);
		if (complete) {
			wx.hideLoading();
		};
	},

	getLabelData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			type: 3,
		};
		postData.getBefore = {
			caseData: {
				tableName: 'label',
				searchItem: {
					title: ['=', ['门店']],
				},
				middleKey: 'parentid',
				key: 'id',
				condition: 'in',
			},
		};
		postData.order = {
			create_time: 'normal'
		}
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.labelData.push.apply(self.data.labelData, res.info.data);
			} 
			self.data.complete_api.push('getLabelData')
			self.setData({
				web_labelData: self.data.labelData,
			});
			self.checkLoadComplete()
		};
		api.labelGet(postData, callback);
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
