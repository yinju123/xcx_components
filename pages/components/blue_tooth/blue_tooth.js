var services = [
	'00002A29-0000-1000-8000-00805F9B34FB',
	'EDFEC62E-9910-0BAC-5241-D8BDA6932A2F'
]

function inArray(arr, key, val) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i][key] === val) {
			return i;
		}
	}
	return -1;
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
	return new Uint8Array(buffer);
	var hexArr = Array.prototype.map.call(
		new Uint8Array(buffer),
		function (bit) {
			return ('00' + bit.toString(16)).slice(-2)
		}
	)
	return hexArr.join('');
}

var requestUrl = require('/utils/js/requestUrl');


App({
	requestUrl,
	data:{
		y:2018,
		m:7,
		d:11,
		currentPag:'',
		devices: [],
		connected: false,
		//蓝牙发送过来的数据
		chs: [],
		services:services,
		i:0
	},
	onLaunch(){
	
	},
	currentPage(callBack){
		var currentPageArr = getCurrentPages();
		var currentPag = currentPageArr[currentPageArr.length-1];
		this.data.currentPag = currentPag;
		this.openBluetoothAdapter();
	},
	
	//初始化蓝牙
	openBluetoothAdapter() {
		wx.showLoading({
			title:'正在连接蓝牙'
		})
		wx.openBluetoothAdapter({
			success: (res) => {
				console.log('openBluetoothAdapter success', res)
				this.startBluetoothDevicesDiscovery()
			},
			fail: (res) => {
				if (res.errCode === 10001) {
					wx.onBluetoothAdapterStateChange(function (res) {
						console.log('onBluetoothAdapterStateChange', res)
						if (res.available) {
							this.startBluetoothDevicesDiscovery()
						}
					})
				}
			}
		})
	},
	//获取本机蓝牙适配器状态
	getBluetoothAdapterState() {
		wx.getBluetoothAdapterState({
			success: (res) => {
				console.log('getBluetoothAdapterState', res)
				if (res.discovering) {
					this.onBluetoothDeviceFound()
				} else if (res.available) {
					this.startBluetoothDevicesDiscovery()
				}
			}
		})
	},
	//开始搜寻附近的蓝牙外围设备
	startBluetoothDevicesDiscovery() {
		if (this._discoveryStarted) {
			return
		}
		this._discoveryStarted = true;
		wx.startBluetoothDevicesDiscovery({
			services:services,
			allowDuplicatesKey: true,
			success: (res) => {
				this.onBluetoothDeviceFound();
				// this.stopBluetoothDevicesDiscovery()
			},
		})
	},
	//停止搜寻附近的蓝牙外围设备
	stopBluetoothDevicesDiscovery() {
		wx.stopBluetoothDevicesDiscovery()
	},
	//监听寻找到新设备的事件
	onBluetoothDeviceFound() {
		wx.onBluetoothDeviceFound((res) => {
			res.devices.forEach(device => {
				
				if (!device.name && !device.localName) {
					return
				}
				const foundDevices = this.data.devices
				const idx = inArray(foundDevices, 'deviceId', device.deviceId);
				var e = {
					currentTarget:{
						dataset:{
							deviceId:device.deviceId,
							name:device.name
						}
					}
				}
				this.createBLEConnection(e);
				return;
				
				const data = {}
				if (idx === -1) {
					data[`devices[${foundDevices.length}]`] = device
				} else {
					data[`devices[${idx}]`] = device
				}
				this.setData(data);
			})
		})
	},
	//连接
	createBLEConnection(e) {
		const ds = e.currentTarget.dataset
		const deviceId = ds.deviceId
		const name = ds.name;
		
		wx.createBLEConnection({
			deviceId,
			success: (res) => {
				this.data.connected = true;
				this.data.name = name;
				this.data.deviceId = deviceId;
				
				
				// this.data.currentPag.setData({
				// 	connected: true,
				// 	name,
				// 	deviceId,
				// })
				this.getBLEDeviceServices(deviceId)
			}
		})
		this.stopBluetoothDevicesDiscovery()
	},
	//断开连接
	closeBLEConnection() {
		wx.closeBLEConnection({
			deviceId: this.data.deviceId
		})
		this.setData({
			connected: false,
			chs: [],
			canWrite: false,
		})
	},
	//获取蓝牙设备所有 service（服务）
	getBLEDeviceServices(deviceId) {
		wx.getBLEDeviceServices({
			deviceId,
			success: (res) => {
				this.deviceId = deviceId;
				this.serviceId = res.services[1].uuid
				this.getBLEDeviceCharacteristics(deviceId, res.services[1].uuid);
				wx.hideLoading();
				wx.showToast({
					title:'连接成功',
					icon:'none'
				})
				// console.log('//获取蓝牙设备所有 service（服务）',res)
				// for (let i = 0; i < res.services.length; i++) {
				// 	if (res.services[i].isPrimary) {
				// 		this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid);
				// 		// return
				// 	}
				// }
			}
		})
	},
	//获取蓝牙设备某个服务中的所有 characteristic（特征值）
	getBLEDeviceCharacteristics(deviceId, serviceId) {
		wx.getBLEDeviceCharacteristics({
			deviceId,
			serviceId,
			success: (res) => {
				for (let i = 0; i < res.characteristics.length; i++) {
					let item = res.characteristics[i];
					
					if (item.properties.notify) {
						this.notify_id = item.uuid;
						wx.notifyBLECharacteristicValueChange({
							deviceId,
							serviceId,
							characteristicId: item.uuid,
							state: true,
							success:(res) => {
								
								wx.onBLECharacteristicValueChange((characteristic) => {
									this.data.currentPag.setData({
										i:this.data.i+1
									})
									const idx = inArray(this.data.chs, 'uuid', characteristic.characteristicId);
									const data = {};
									if (idx === -1) {
										data[`chs[${this.data.chs.length}]`] = {
											uuid: characteristic.characteristicId,
											value: ab2hex(characteristic.value)
										}
									} else {
										data[`chs[${idx}]`] = {
											uuid: characteristic.characteristicId,
											value: ab2hex(characteristic.value)
										}
									}
									
									//从蓝牙中获取的数据
									var chs = data['chs[0]'].value;
									var T1 = (chs[2]+chs[3]*256)/100;
									var T2 = '';
									if(chs[1] == 50){
										T2 = (chs[4]+chs[5]*256)/100;
									}
									
									wx.request({
										url:requestUrl.http+requestUrl.sendMessage,
										method:'POST',
										data:{
											a:JSON.stringify(chs)
										},
										success:(res)=>{
											// console.log('发送数据',res)
										}
									})
									
									
									if(this.data.currentPag.route == 'pages/data/data'){
										var listData = this.data.currentPag.data.listData;
										listData[listData.length-1][1] = T1;
										listData[listData.length-1][2] = T2;
									}
									this.data.currentPag.setData({
										listData:listData
									});
								})
							}
						})
					}
					
					if (item.properties.read) {
						this.read_id = item.uuid;
						wx.readBLECharacteristicValue({
							deviceId,
							serviceId,
							characteristicId: item.uuid,
							success:(res) => {
								// console.log('readBLECharacteristicValue',res)
							}
						})
					}
					if (item.uuid.indexOf('00FFF1')>-1) {
						this.data.canWrite = true;
						this.write_id = item.uuid;
					}
					
					
					
				}
			},
			fail(res) {
				console.error('getBLEDeviceCharacteristics', res)
			}
		})
	},
	//写入信息
	writeBLECharacteristicValue() {
		// 向蓝牙设备发送一个0x00的16进制数据
		// let buffer = new ArrayBuffer(1);
		// let dataView = new DataView(buffer);
		// dataView.setUint8(0, Math.random() * 255 | 0);
		
		
		// var buffer = hexStringToArrayBuffer('3c53 5441 3e');
		var senddata = '<STA>';
		let buffer = new ArrayBuffer(senddata.length)
		let dataView = new DataView(buffer)
		for (var i = 0; i < senddata.length; i++) {
			dataView.setUint8(i, senddata.charAt(i).charCodeAt())
		}
		
		wx.writeBLECharacteristicValue({
			deviceId: this.deviceId,
			serviceId: this.serviceId,
			characteristicId: this.write_id,
			value: buffer,
		})
	},
	
	//关闭蓝牙模块，使其进入未初始化状态
	closeBluetoothAdapter() {
		wx.closeBluetoothAdapter()
		this._discoveryStarted = false
	},
})