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
		
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		
	},
	intoPath(e){
	  const self = this;
	  api.pathTo(api.getDataSet(e,'path'),'nav');
	},
	
	intoPathRedirect(e){
	  const self = this;
	  api.pathTo(api.getDataSet(e,'path'),'redi');
	}, 
	

})
