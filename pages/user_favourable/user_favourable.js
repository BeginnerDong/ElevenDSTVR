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
	data: {
		labelData:[],
		specialData: []

	},
	//事件处理函数


	onLoad() {
		const self = this;
		wx.showLoading();
		self.getLabelData();
		self.checkSpecial();
		self.setData({
			standard: parseInt(wx.getStorageSync('info').thirdApp.custom_rule.standard),
			period: parseInt(wx.getStorageSync('info').thirdApp.custom_rule.period),
			discount_num: parseInt(wx.getStorageSync('info').thirdApp.custom_rule.discount_num),
			img: app.globalData.img
		})
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
			console.log(self.data.labelData)
			wx.hideLoading();
			self.setData({
				web_labelData: self.data.labelData,
			});
		};
		api.labelGet(postData, callback);
	},



	checkSpecial() {
		const self = this;
		const postData = {};
		postData.token = wx.getStorageSync('token');
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.specialData = res
			}

			self.setData({
				web_specialData: self.data.specialData
			});
			console.log(self.data.specialData)
			wx.hideLoading();
		};
		api.checkSpecial(postData, callback);
	},

	test() {
		const self = this;
		const postData = {
			token: wx.getStorageSync('token'),
			data: {
				user_no: wx.getStorageSync('info').user_no,
				type: 6,
				thirdapp_id: 2,
				user_type: 0,
				count: -1000
			}

		};
		const callback = (res) => {

		};
		api.flowLogAdd(postData, callback);
	},

	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'rela');
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */

})
