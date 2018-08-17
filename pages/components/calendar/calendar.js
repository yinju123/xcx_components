var app = getApp();

Component({
	properties:{
		date:{
			type:'String',
			value:''
		}
	},
	
	data:{
		days:[],
		y:2018,
		m:0,
		activeIndex:0,
		week:['日','一','二','三','四','五','六'],
	},
	methods:{
		initData(date){
			
			var activeIndex = date.getDate();
			var y = date.getFullYear();
			var m = date.getMonth()+1;
			//t2时间为此月的最后一天。知道这个月的最后一天是几号，就知道这个月有多少天。
			//此做法的真正过程是。下个月1号的前一天是多少号
			var t2 = new Date(y,m,0);
			var d = t2.getDate();
			var days = [];
			
			
			//1号是星期几
			var t3 = new Date(y,m-1,1);
			var weekDay = t3.getDay();
			var emtyArr = [];
			for(var a=0;a<weekDay;a++){
				emtyArr.push('')
			}
			
			
			for(var i=0;i<d;i++){
				days.push(1+i)
			}
			this.setData({
				days:emtyArr.concat(days),
				y:y,
				m:m,
				activeIndex:activeIndex-1+emtyArr.length
			})
		},
		changeMonth(e){
			var m = this.data.m-1;
			var y = this.data.y;
			var index = e.currentTarget.dataset.index;
			if(index==1){
				m++;
				if(m>=12){
					m=0;
					y++;
				}
			}else{
				m--;
				if(m<0){
					m=11;
					y--
				}
			}
			var t = new Date(y,m);
			this.initData(t);
		},
		selectDay(e){
			var index = e.currentTarget.dataset.index;
			var days = this.data.days;
			
			if(days[index]){
				app.data.y = this.data.y;
				app.data.m = this.data.m;
				app.data.d = days[index];
				this.setData({
					activeIndex:index
				})
			}
			
		}
	},
	attached(){
		//如果传递时间，就一此时间为准，没有这以现在时间为准
		var t = this.data.date?new Date(this.data.date):new Date();
		this.initData(t);
	}
	
	
})