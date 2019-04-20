Page({

  /**
   * 页面的初始数据
   */
  data: {
		isShow:false,
		isShowTwo:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
		self.setData({
			isShow:self.data.isShow,
			isShowTwo:self.data.isShowTwo
		})
  },
  
	show(){
		const self = this;
		self.data.isShow= !self.data.isShow;
		self.setData({
			isShow:self.data.isShow
		})
		
	},

	  
	showTwo(){
		const self = this;
		self.data.isShowTwo= !self.data.isShowTwo;
		self.setData({
			isShowTwo:self.data.isShowTwo
		})
		
	},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})