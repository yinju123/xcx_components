

var QQMapWX = require('./qqmap-wx-jssdk.min.js');
var utils = {
	//获取设备可视区高度，并设置
	getSystemInfo:function(This){
		wx.getSystemInfo({
			success:function(system){
				This.data.height = system.windowHeight
			}
		})
	},
	getLocation:function(callBack){
		var address = '';
		var qqmapsdk = new QQMapWX({
			key: 'N4QBZ-6C7KX-KRS4B-ZG6JM-NJJS6-JLFWZ'//我的腾讯地图的key
		});
		wx.authorize({
			scope: 'scope.userLocation',
			success() {
				wx.getLocation({
					success(location) {
						qqmapsdk.reverseGeocoder({
							location: {
								latitude: location.latitude,
								longitude: location.longitude
							},
							success: function(res) {
								address =  res.result.address_component;
								callBack(address);
							},
						});
					}
				})
			}
		})
		
	},
	getTimer:function(time){
		if(!time){
			var timer = new Date()
		}else{
			timer = new Date(time)
		}
		var YY = timer.getFullYear(),
			MM = timer.getMonth(),
			DD = timer.getDate(),
			hh = timer.getHours(),
			mm = timer.getMinutes(),
			ss = timer.getSeconds(),
			dd = timer.getDay(),
			arr = ["天","一","二","三","四","五","六"],
			json = {};
		
		json.YY = YY;
		json.MM = getZero(MM+1);
		json.DD = getZero(DD);
		json.hh = getZero(hh);
		json.mm = getZero(mm);
		json.ss = getZero(ss);;
		json.dd = arr[dd];
		
		function getZero(i){
			return i<10? "0"+i : i;
		}
		
		json.all = YY+'-'+json.MM+'-'+json.DD+' '+json.hh+':'+json.mm+':'+json.ss;
		
		return json;
	},
	//获取cookie
	//key为要获取cookie的名称，函数会返回要要查询cookie的值，没有则返回空字符串
	getCookie : function(key){
		var arr = document.cookie.match(new RegExp("\\b"+key+"=([^;]*)(;|$)"));
		return arr?arr[1]:"";
	},
	
	//设置cookie
	//mJson为json，里面是要设置cookie的名称和值，time是cookie从函数运行日起，有效的日期
	setCookie :  function(mJson , time){
		var data = new Date( new Date().getTime() + time*24*60*60*1000 ).toGMTString();
		for (var key in mJson) document.cookie = key+"="+mJson[key]+"; expires="+data;
	},
	
	//清除cookie
	//arr是个数组，里面是要被移除的cookie名称
	removeCookie : function(arr){
		var json = {};
		for(var i=0; i<arr.length; i++){
			json[arr[i]] = "";
		}
		utils.setCookie(json,-1);
	},
	
	//倒计时
	//参数time表示要倒计时的最终时间
	//返回一个json,其中DD hh mm ss表示天 时 分 秒
	countDown : function(time){
		var nowTime = new Date(),
			dif = time - nowTime,
			DD = Math.floor(dif/1000/60/60/24),
			hh = Math.floor(dif/1000/60/60%24),
			mm = Math.floor(dif/1000/60%60),
			ss = Math.floor(dif/1000%60),
			json = {};
		
		json.DD = DD;
		json.hh = hh;
		json.mm = mm;
		json.ss = ss;
		return json;
	},
	
	
	//获取code和parm
	getUrlData:function (href){
		var json = {};
		var arr1 = href.split("?");
		if(arr1[1]){
			var arr2 = arr1[1].split("&");
			for(var i=0; i<arr2.length; i++){
				var arr3 = arr2[i].split("=");
				json[arr3[0]] = arr3[1];
			}
			return  json
		}
	},
	
	//dom是眼截图的标签，callback是回调函数，里面有两个参数，一个是canvas，一个是src，即将canvas转换成base64的结果
	//记得引入html2canvas
	screenshot:function (dom,callback){
		$(document).scrollTop(0);
		html2canvas(dom).then(function(canvas) {
			var src = canvas.toDataURL("image/png")
			callback(canvas,src)
		});
	},
	//适配 w是设计图的宽度
	fit(w){
		var html = document.getElementsByTagName('html')[0];
		var body = document.getElementsByTagName('body')[0];
		var screenW = screen.width;
		var scale = screenW/w;
		var fontSize = w/10*scale;
		
		html.style.fontSize = fontSize+'px';
		body.style.fontSize = '12px';
		body.style.margin = 0;
	},
	//将data中的px全部装换成rem
	getRem(data){
		for(var key in data){
			if(typeof(data[key]) == 'object'){
				this.initData(data[key])
			}else{
				if(typeof(data[key]) == 'string' && (data[key]).indexOf('px')>-1){
					var arr = data[key].split(' ');
					for(var i=0; i<arr.length;i++){
						var num = parseInt(arr[i]);
						arr[i] = num/remUnit+'rem';
					}
					vue.set(data,key,arr.join(' '))
				}
			}
		}
	},
	//str,要匹配的字符串
	//type 匹配的类型 1 手机号 2 身份证号，3 邮箱号
	match(str,type){
		var reg = '';
		switch (type){
			case 1:
				reg = /^1[3|4|5|7|8][0-9]{9}$/;
				break;
			case 2:
				reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				break;
			case 3:
				reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				break;
		}
		
		return reg.test(str);
	}
	
}


module.exports = utils



