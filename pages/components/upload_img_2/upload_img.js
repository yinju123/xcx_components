
// import imgs from '../../../assets/yinju/img/add/index';
//这是有多个按钮，每个按钮只能选择一个图片
Component({
	properties:{
		type:{
			type:'Number',
			value:0
		},
		list_data:{
			type:'Object',
			value:{
				//最外层标签的样式
				upload_img:{
					padding:'0 48rpx;',
					margin_right:-13,
				},
				//每一项的内容
				upload_img_item:{
					width:210,
					height:242,
					margin:'0 13rpx 13rpx 0'
				},
				//里面的图标
				icon_box:{
					width:66,
					height:66,
					src:''
				},
				//里面的文字
				text_box:{
					margin_top:26,
					font_size:24,
					color:'#A2A2A3',
					text:'上传'
				},
				//删除按钮
				delete:{
					width:33,
					src:'',
					top:-9,
					right:-8,
				},
			}
		},
		imgs:{
			type:'Array',
			value:[
				"","","","",
			]
		},
	},
	data:{
		class:''
	},
	attached(){
		this.initData();
	},
	methods:{
		initData(){
			this.setData({
				class:'type_'+this.data.type
			})
		},
		choose_img(e){
			var index = e.currentTarget.dataset.index;
			var imgs = this.data.imgs;
			wx.chooseImage({
				count:1,
				success:(res)=>{
					imgs[index] = res.tempFilePaths[0];
					this.setData({
						imgs,
					})
					this.triggerEvent('get_imgs',imgs)
				}
			})
		},
		delete(e){
			var index = e.currentTarget.dataset.index;
			var imgs = this.data.imgs;
			imgs[index] = '';
			this.setData({
				imgs,
			})
			this.triggerEvent('get_imgs',imgs)
		}
	},
	
	
	
})