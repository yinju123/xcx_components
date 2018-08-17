var app = getApp();


Page({
	data:{
		height:'',
		topNavActiveIndex:1,
	},
	onLoad(){
		this.setData({
			height:app.data.height,
		})
	}
})