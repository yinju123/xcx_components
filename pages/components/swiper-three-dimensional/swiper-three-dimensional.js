Component({
	data:{
		swiperClass:[],
		//手触碰屏幕，开始滑动的位置
		start:'',
		page:-1,
		//数据是否加载完毕
		end:false,
		//中间卡片的index
		currentIndex:1,
		//0为请求数据类型，1，为不请求数据类型，无缝循环加载
		type:0,
		listData:['','','','',''],
		//当数量过多时，渲染就会有很大的问题，所以只能在currentIndex+can_show与currentIndex-can_show之间的才显示
		can_show:2,
		// listData:[],
	},
	
	attached(){
		var currentIndex = this.data.currentIndex;
		//根据其实数据的有无，判断type 的类型
		if(!this.data.listData.length){
			this.setData({
				currentIndex:0,
				swiperClass:[],
				type:0
			})
			this.inItData();
		}else{
			var swiperClass = [];
			for(var a=0;a<this.data.listData.length;a++){
				swiperClass.push('')
			}
			swiperClass[currentIndex] = 'swiper-current';
			swiperClass[currentIndex-1] = 'swiper-prev';
			swiperClass[currentIndex+1] = 'swiper-next';
			this.setData({
				swiperClass:swiperClass,
			})
		}
		
	},
	methods:{
		touchstart(e){
			this.setData({
				start:e.changedTouches[0].pageX
			})
		},
		touchend(e){
			var type = this.data.type;
			var end = e.changedTouches[0].pageX;
			//防止只是点击
			if(end-this.data.start>-50 && end-this.data.start<50){
				return
			}
			var currentIndex = this.data.currentIndex;
			//还原
			var swiperClass = [];
			for(var a=0;a<this.data.listData.length;a++){
				swiperClass.push('')
			}
			
			if(end-this.data.start>50){
				currentIndex--;
				if(currentIndex != 0 && currentIndex != -1){
					swiperClass[currentIndex-1] = 'swiper-prev';
					swiperClass[currentIndex+1] = 'swiper-next';
				}else if(currentIndex == 0){
					
					if(type){
						swiperClass[swiperClass.length-1] = 'swiper-prev';
					}
					swiperClass[currentIndex+1] = 'swiper-next';
				}else{
					if(!type){
						return
					}
					currentIndex = swiperClass.length-1;
					swiperClass[currentIndex-1] = 'swiper-prev';
					swiperClass[0] = 'swiper-next';
				}
			}else if(end-this.data.start<-50){
				currentIndex++;
				if(currentIndex != swiperClass.length-1 && currentIndex != swiperClass.length){
					swiperClass[currentIndex-1] = 'swiper-prev';
					swiperClass[currentIndex+1] = 'swiper-next';
				}else if(currentIndex == swiperClass.length-1){
					swiperClass[currentIndex-1] = 'swiper-prev';
					if(type){
						swiperClass[0] = 'swiper-next';
					}
					
				}else{
					if(!type){
						return
					}
					swiperClass[swiperClass.length-1] = 'swiper-prev';
					currentIndex=0;
					swiperClass[currentIndex+1] = 'swiper-next';
				}
			}
			swiperClass[currentIndex] = 'swiper-current';
			this.setData({
				swiperClass:swiperClass,
				currentIndex:currentIndex,
			})
			if(currentIndex == swiperClass.length-2 && !type){
				this.inItData();
			}
		},
		inItData(){
			if(this.data.end){
				return;
			}
			var This = this;
			var swiperClass = this.data.swiperClass;
			var listData = this.data.listData;
			var page = this.data.page+1;
			this.setData({
				page:this.data.page+1
			})
			wx.request({
				url:'https://www.aiaichuzu.com/program/api.php/index/index',
				method:'POST',
				data:{
					page:page
				},
				header: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				success:function(list){
					var list = list.data.woman;
					if(!list.length){
						This.setData({
							end:true
						})
						return;
					}
					//这里是我自己测试的，当所有数据请求完成的记过
					if(page>0){
						This.setData({
							end:true
						})
						list = list.slice(0,3);
					}
					for(var a=0;a<list.length;a++){
						swiperClass.push('');
					}
					
					//第一次请求
					if(!page){
						swiperClass[0] = 'swiper-current';
						swiperClass[1] = 'swiper-next';
						
					}
					
					This.setData({
						page:page,
						listData:listData.concat(list),
						swiperClass:swiperClass
					})
					
				},
				fail:function(err){
					console.log('err',err);
				}
			})
		}
	},
	
	
	
	
})