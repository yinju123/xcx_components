
// import imgs from '../../../assets/yinju/img/add/index';
//这是一个选择按钮，有几个图片就显示几个几个。
Component({
	properties:{
		//通过type来改变class
		type:{
			type:'Number',
			value:0
		},
		list_data:{
			type:'Object',
			value:{
				//最外层标签
				upload_img:{
					padding:'0 48rpx;',
					//每个item的间隔的负数
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
				text_box:{
					margin_top:26,
					font_size:24,
					color:'#A2A2A3',
					text:'上传'
				},
				delete:{
					width:33,
					src:'',
					top:-9,
					right:-8,
				},
				//可上传的最大数
				count:9
			}
		},
		imgs:{
			type:'Array',
			value:[
				"",
				"",
				"",
				"",
				"",
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
			//设置class。不同类型的个别差异，通过class来设置
			this.setData({
				class:'type_'+this.data.type
			})
		},
		choose_img(e){
			var imgs = this.data.imgs;
			var count = this.data.list_data.count;
			
			if(count-imgs.length<=0){
				wx.showToast({
					title:'最多选择'+count+'张',
					icon:"none"
				})
				return
			}
			wx.chooseImage({
				count:count-imgs.length,
				success:(res)=>{
					imgs = imgs.concat(res.tempFilePaths)
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
			imgs.splice(index,1);
			this.setData({
				imgs,
			})
			this.triggerEvent('get_imgs',imgs)
		}
	},
	
	
	
})