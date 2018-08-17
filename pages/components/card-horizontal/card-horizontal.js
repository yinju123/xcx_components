
Component({
	properties:{
		styleData:{
			type:'Object',
			value:{
				item:{
					padding:'20rpx 10rpx',
					marginBottom:'30rpx',
					borderRadius:'10rpx',
					boxShadow:'0 4rpx 10rpx #000'
				},
				img:{
					width:271,
					height:184,
					borderRadius:'6rpx',
					marginRight:30
				}
			}
		},
		listData:{
			type:'Array',
			value:[
				{
					imgSrc:'/utils/img/card-horizontal/1.jpg',
					name:'yinju',
					nativePlace:'江西景德镇'
				},
				{
					imgSrc:'/utils/img/card-horizontal/1.jpg',
					name:'yinju',
					nativePlace:'江西景德镇'
				},
			]
		}
		
	},
	data:{
		a:100
	},
	options:{
		multipleSlots:true,
	}
})
