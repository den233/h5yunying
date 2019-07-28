<template>
	<view v-if="showPopup" class="uni-popup">
		<view :class="[ani, animation ? 'ani' : '', !custom ? 'uni-custom' : '']" class="uni-popup__mask" @click="close(true)"  />
		<view :class="[type, ani, animation ? 'ani' : '', !custom ? 'uni-custom' : '']" class="uni-popup__wrapper"  >
			<view @click="close(true)" >
				<i class="iconfont icon-close"></i>
				<!-- <slot /> -->
			</view>
			
			<view>
				<input v-model="checkcodes" class="uni-input" focus placeholder="输入验证码" />
				<view @click="changeCode">
					<text :style="{color:code.color}" v-for="(code,index) in codeArray" :key="index">
						{{code.name}}
					</text>
				</view>
				<view class="clear"></view>
				 <button @click="submitCode" class="submitBtn primary" type="primary" :loading="loading" :disabled="disabled">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	function color() {
		var color = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() *
			255) + ")";
		return color;
	}
	export default {
		name: 'UniPopup',
		props: {
			// 开启动画
			animation: {
				type: Boolean,
				default: true
			},
			// 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层
			type: {
				type: String,
				default: 'center'
			},
			// 是否开启自定义
			custom: {
				type: Boolean,
				default: false
			},
			// maskClick
			maskClick: {
				type: Boolean,
				default: true
			},
			show: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				ani: '',
				showPopup: false,
				codeArray:[],
				code1:'',
				checkcodes:'',
				disabled:true,
				loading:false
			}
		},
		watch: {
			show(newValue) {
				if (newValue) {
					this.open()
				} else {
					this.close()
				}
			},
			checkcodes: {
　　　　handler(newValue, oldValue) {
　　　　　　newValue.length==4?this.disabled=false:this.disabled=true;
　　　　},
　　　　deep: true
　　		}
		},
		created() {
			this.getcode()
		},
		methods: {
			//切换验证码
			changeCode(){
				this.getcode()
			},
			getcode() {
				this.codeArray=[];
				this.code1='';
				var shu = ('1234567890qwertyuioplkjhgfdsazxcvbnmQAZWSXEDCRFVTGBYHNUJMIKOLP');
				//获取span
				var span = document.getElementsByTagName("span");
				//定义一个函数为yanzhengma()
				 
					var yzm = " ";
					//想要几个循环几个数值
					for (let i = 0; i < 4; i++) {
						//随机Math.random()出的值乘以数组的长度，取出的值为数组的下标
						var num = parseInt(Math.random() * shu.length);
						//取出shu中的值,利用上面取出的下标num,此时取出的是数组中的值
						yzm = shu[num];
						this.codeArray.push({
							name:yzm,
							color:color()
						})
						this.code1+=yzm
						//把随机取到的值通过innerHTML在页面上
						//this.codeArray[i].name=yzm
						//把随机出的值通过style.color赋予颜色 ，Color()是自己封装的一个随机颜色函数 
						//this.codeArray[i].color=color()
				}
				//console.log(this.codeArray)
			},
			clear() {},
			submitCode(){
				   if(this.checkcodes.toLowerCase()!=this.code1.toLowerCase()){
						 uni.showToast({
						 		icon: 'none',
						 		title: '请输入正确的验证码'
						 })
						 return false;
					 }
					 this.loading=true
					 this.disabled=true
					 this.$api.test({noncestr: Date.now()}).then((res)=>{
					 	this.loading = false;
						this.checkcodes=""
					 	console.log('request success', res)
					 	uni.showToast({
					 		title: '请求成功',
					 		icon: 'success',
					 		mask: true
					 	});
						this.getcode()
						this.showPopup=false;
						this.$emit('closePopup', {
							show: false
						})
					 	//this.res = '请求结果 : ' + JSON.stringify(res);
					 }).catch((err)=>{
					 	this.loading = false;
						this.checkcodes=""
						uni.showToast({
							title: err,
							icon: 'fail',
							mask: true
						});
					 	//console.log('request fail', err);
					 })
			},
			open() {
				this.$emit('change', {
					show: true
				})
				this.showPopup = true
				this.$nextTick(() => {
					setTimeout(() => {
						this.ani = 'uni-' + this.type
					}, 30)
				})
			},
			close(type) {
				if (!this.maskClick && type) return
				this.$emit('change', {
					show: false
				})
				this.ani = ''
				this.$nextTick(() => {
					setTimeout(() => {
						this.showPopup = false
					}, 300)
				})
			}
		}
	}
</script>
<style lang="scss">
	.clear{
		clear:both;
	}
	.icon-close{
		position: absolute;
		right:10px;
		top: 10px;
	}
	.submitBtn{
		margin-top:15px;
	}			
	 		
	.uni-popup {
		position: fixed;
		/*  #ifdef  H5  */
		top: 0px;
		// top: 50px;
		/*  #endif  */
		/*  #ifndef  H5  */
		top: 0px;
		/*  #endif  */
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 99999;
		overflow: hidden;
		background: rgba(0,0,0,0.5);
		
		.uni-popup__wrapper.ani{
			margin:30px 20px;
			padding-top:30px;
			border-radius:10px;
			box-shadow: 1px 1px 1px #eee;
		}
				.uni-input{
						float: left;
						width:calc(100% - 80px);
						}
						.uni-text{
							float: left;
		
						}
		&__mask {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 998;
			background: rgba(255, 255, 255, 1);
			opacity: 0;

			&.ani {
				transition: all 0.3s;
			}

			&.uni-top,
			&.uni-bottom,
			&.uni-center {
				opacity: 1;
			}
		}

		&__wrapper {
			position: absolute;
			z-index: 999;
			box-sizing: border-box;

			&.ani {
				transition: all 0.3s;
				background: #fff;
				left: 0;
				right: 0;
				margin: 20px;
				padding:20px;
			}

			&.top {
				top: 0;
				left: 0;
				width: 100%;
				transform: translateY(-100%);
			}

			&.bottom {
				bottom: 0;
				left: 0;
				width: 100%;
				transform: translateY(100%);
			}

			&.center {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				transform: scale(1.2);
				opacity: 0;
			}

			&-box {
				position: relative;
				box-sizing: border-box;
			}

// 			&.uni-custom {
// 				& .uni-popup__wrapper-box {
// 					padding: 30upx;
// 					background: #fff;
// 				}
// 
// 				&.center {
// 					& .uni-popup__wrapper-box {
// 						position: relative;
// 						max-width: 80%;
// 						max-height: 80%;
// 						overflow-y: scroll;
// 					}
// 				}
// 
// 				&.top,
// 				&.bottom {
// 					& .uni-popup__wrapper-box {
// 						width: 100%;
// 						max-height: 500px;
// 						overflow-y: scroll;
// 					}
// 				}
// 			}
			
				
			&.uni-top,
			&.uni-bottom {
				transform: translateY(0);
			}

			&.uni-center {
				transform: scale(1);
				opacity: 1;
			}
		}
	}
</style>
