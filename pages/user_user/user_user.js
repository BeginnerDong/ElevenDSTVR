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
		sForm: {
			name: '',
			phone: '',
			passage_array: '',
			gender: '',
			/*    level:'',
			    passage1:'',
			    idCard:'' */
		},
		isFirstLoadAllStandard: ['userInfoGet'],
	},


	onLoad: function() {
		const self = this;
		
		self.userInfoGet();
	},



	userInfoGet() {
		const self = this;
		const postData = {};
		postData.token = wx.getStorageSync('token');
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.sForm.name = res.info.data[0].info.name;
				self.data.sForm.phone = res.info.data[0].info.phone;
				self.data.sForm.gender = res.info.data[0].info.gender;
				self.data.sForm.passage_array = res.info.data[0].info.passage_array;
				/* self.data.sForm.level = res.info.data[0].info.level;
				self.data.sForm.passage1 = res.info.data[0].info.passage1;
				self.data.sForm.idCard = res.info.data[0].info.idCard */
			};
			self.data.mainData = res;

		
			self.setData({
				web_sForm: self.data.sForm,
			});

		};
		api.userGet(postData, callback);
	},


	bindDateChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value);
		self.data.sForm.passage_array = e.detail.value.split("-");
		console.log(self.data.sForm.passage_array)
		self.setData({
			web_sForm: self.data.sForm
		})
		new Date(self.data.sForm.passage_array.join("-")).getTime();
	},

	changeBind(e) {
		const self = this;
		if (api.getDataSet(e, 'value')) {
			self.data.sForm[api.getDataSet(e, 'key')] = api.getDataSet(e, 'value');
		} else {
			api.fillChange(e, self, 'sForm');
		};
		console.log(self.data.sForm);
		self.setData({
			web_sForm: self.data.sForm,
		});
	},

	userInfoUpdate() {
		const self = this;
		const postData = {};
		postData.token = wx.getStorageSync('token');
		postData.data = {};
		postData.data = api.cloneForm(self.data.sForm);
		const callback = (data) => {
			if (data.solely_code == 100000) {
				api.showToast('完善成功', 'none');

				setTimeout(function() {
					api.pathTo('/pages/user/user', 'rela')
				}, 1000);
			} else {
				api.showToast('网络故障', 'none')
			};
			
		};
		api.userInfoUpdate(postData, callback);
	},

	submit() {
		const self = this;
		;
		var phone = self.data.sForm.phone;
		const pass = api.checkComplete(self.data.sForm);
		if (pass) {
			if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
			
				api.showToast('手机格式不正确', 'none')

			} else {
				wx.showLoading();
				const callback = (user, res) => {
					self.userInfoUpdate();
				};
				api.getAuthSetting(callback);
			}
		} else {
			
			api.showToast('请补全信息', 'none');

		};
	},


})
