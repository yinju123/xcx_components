Component({
	properties:{
		type:{
			type:'Number',
			value:0,
		},
		get_code_btn_text:{
			type:'String',
			value:'发送验证码'
		}
	},
	data:{
		class:'type_1'
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
		//获取验证码
		get_code(){
			if(this.data.get_code_btn_text != '发送验证码'){
				return;
			}
			var t = 6;
			var get_code_btn_text = t+'s';
			this.setData({
				get_code_btn_text,
			})
			
			var timer = setInterval(()=>{
				t--;
				if(t>0){
					get_code_btn_text = t+'s';
				}else{
					clearInterval(timer);
					get_code_btn_text = '发送验证码';
				}
				this.setData({
					get_code_btn_text,
				})
			},1000)
		},
	},
	
})