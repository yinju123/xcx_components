Component({
	properties:{
		styleData:{
			type:'Object',
			value:{
				//轮播图高度
				swiperHeight:404,
				//默认的圆顶那有黑色背景
				bg:true,
				//点的父级的样式
				dots:{
					height:44,
					padding:'15rpx 0 19rpx'
				},
				//点的样式
				dot:{
					width:15,
					margin:'0 8rxp',
					backgroundColor:'#fff',
					actvieColor:'#FEB201'
				},
				
			}
		},
		listData:{
			type:'Array',
			value:[
				{
					imgSrc:'./img/1.png',
					url:'../index/index'
					
				},
				{
					imgSrc:'./img/1.png',
					url:'../index/index'
				},
				{
					imgSrc:'./img/1.png',
					url:'../index/index'
				},
			]
		}
	},
	data:{
		//当前活动项
		activeIndex:0,
	},
	methods:{
		toDots(e){
			var index = e.currentTarget.dataset.index;
			this.setData({
				activeIndex:index
			})
		},
		swiperChange(e){
			if(e.detail.source == "touch"){
				this.setData({
					activeIndex:e.detail.current
				})
			}
		}
	},
})