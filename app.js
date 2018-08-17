var utils = require('/utils/utils.js');



App({
	data:{
		//设备可视区高度
		height:'',
		//日历 年
		y:2018,
		//月
		m:7,
		//日
		d:18
		
	},
	onLaunch(){
		utils.getSystemInfo(this);
	}
})