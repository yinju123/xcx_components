// import icon_texts_img from "../../../assets/yinju/img/detail/index";
// console.log('icon_texts_img',icon_texts_img)
Component({
	properties:{
		style_data:{
			type:'Object',
			value:{
				icon_texts:{
					height:36,
					padding:'16rpx 0'
				},
				text_box:{
					color:'#55585A',
					font_size:28,
					margin_left:18,
				},
			}
		},
		list_data:{
			type:'Array',
			value:[
				{
					width:35,
					height:35,
					src:'',
					text:'报修',
				},
				{
					width:37,
					height:37,
					src:'',
					text:'收藏',
					//该项的宽度，因为当文字数量变化时，如果不设置宽度，整个布局就会变化
					item_width:140
				},
				{
					width:36,
					height:36,
					// src:icon_texts_img.share,
					src:'',
					text:'分享',
				},
			]
		}
	},
	methods:{
		change(){
			var list_data = this.data.list_data;
			list_data[1].text = '已收藏';
			this.setData({
				list_data,
			})
		}
	}
})