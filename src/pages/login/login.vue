<template>
    <view class="content">
        <view  style="padding-bottom:50px;">
            <image mode="widthFix" class="bannerimg" :src="bannerimg"></image>
            <view v-if="isLogin" class="detail-page" >
                <image mode="widthFix" v-for="(item,index) in quanData" :key="index"  class="qimg" :src="item.img"></image>
                 <view class="account">
                     优惠券已经放入：151888888
                 </view>
                 <view >
                    <button class="getcode" disabled="true" type="primary"   @tap="bindLogin">立即领取</button>
                </view>
            </view>
            <view v-else class="login-page">
                <view class="input-group">
                <view class="input-row border">
                    <image class="icon" :src="phoneimg"></image>
                    <m-input class="m-input" type="number" clearable focus v-model="account" placeholder="请输入手机号"></m-input>
                </view>
                <view class="input-row">
                    <image class="icon" :src="codeimg"></image>
                    <m-input class="input2" type="password" displayable v-model="password" placeholder="请输入验证码"></m-input>
                     <button class="btncode" type="primary" disabled="true">获取验证码</button>
                </view>
                </view>
                <view class="btn-row">
                    <button  disabled="true" type="primary" class="primary loginbutton" @tap="bindLogin">立即领取</button>
                </view>
            </view>
            
            <view class="products">
                <view class="item">
                    <image mode="widthFix" class="pimg" :src="goodsimg"></image>
                </view>
                <view class="item">
                    <image :src="gonggao" mode="widthFix" class="pimg"></image>
                </view>
            </view>
        </view>
        
        <view class="footer">
              <image mode="widthFix" class="download" :src="downloadimg"></image>
        </view>
    </view>
</template>

<script>
    import service from '../../service.js';
  
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import mInput from '../../components/m-input.vue'
    import uniPopup from "../../../common/uni-popup/uni-popup.vue"
    export default {
        components: {
            mInput,
            uniPopup
        },
        mounted(){
             
        },
        data() {
            return {
                providerList: [],
                hasProvider: false,
                account: '',
                password: '',
                positionTop: 0,
                bannerimg:'../../static/img/bg.png',
                phoneimg:'../../static/img/h5/mobile.png',
                codeimg:'../../static/img/h5/inputcode.png',
                goodsimg:'../../static/img/h5/goods.png',
                downloadimg:'../../static/img/h5/downloads.png',
                quanData:[{
                    img:'../../static/img/h5/coupons@2x.png'
                },
                {
                    img:'../../static/img/h5/coupons@2x.png'
                },
                {
                    img:'../../static/img/h5/coupons@2x.png'
                }
                ],
                gonggao:'../../static/img/h5/gonggao.png',
                isLogin:false
            }
        },
        computed: mapState(['forcedLogin']),
        methods: {
            ...mapMutations(['login']),
            initProvider() {
                const filters = ['weixin', 'qq', 'sinaweibo'];
                uni.getProvider({
                    service: 'oauth',
                    success: (res) => {
                        if (res.provider && res.provider.length) {
                            for (let i = 0; i < res.provider.length; i++) {
                                if (~filters.indexOf(res.provider[i])) {
                                    this.providerList.push({
                                        value: res.provider[i],
                                        image: '../../static/img/' + res.provider[i] + '.png'
                                    });
                                }
                            }
                            this.hasProvider = true;
                        }
                    },
                    fail: (err) => {
                        console.error('获取服务供应商失败：' + JSON.stringify(err));
                    }
                });
            },
            initPosition() {
                /**
                 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
                 * 反向使用 top 进行定位，可以避免此问题。
                 */
                this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
            },
            bindLogin() {
                /**
                 * 客户端对账号信息进行一些必要的校验。
                 * 实际开发中，根据业务需要进行处理，这里仅做示例。
                 */
                this.$api.test({noncestr: Date.now()}).then((res)=>{
					this.loading = false;
					console.log('request success', res)
					uni.showToast({
						title: '请求成功',
						icon: 'success',
						mask: true
					});
					this.res = '请求结果 : ' + JSON.stringify(res);
				}).catch((err)=>{
					this.loading = false;
					console.log('request fail', err);
				})
                this.isLogin=true;
                if (this.account.length < 5) {
                    uni.showToast({
                        icon: 'none',
                        title: '账号最短为 5 个字符'
                    });
                    return;
                }
                if (this.password.length < 6) {
                    uni.showToast({
                        icon: 'none',
                        title: '密码最短为 6 个字符'
                    });
                    return;
                }
                /**
                 * 下面简单模拟下服务端的处理
                 * 检测用户账号密码是否在已注册的用户列表中
                 * 实际开发中，使用 uni.request 将账号信息发送至服务端，客户端在回调函数中获取结果信息。
                 */
                const data = {
                    account: this.account,
                    password: this.password
                };
                const validUser = service.getUsers().some(function (user) {
                    return data.account === user.account && data.password === user.password;
                });
                if (validUser) {
                    this.toMain(this.account);
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: '用户账号或密码不正确',
                    });
                }
            },
            oauth(value) {
                uni.login({
                    provider: value,
                    success: (res) => {
                        uni.getUserInfo({
                            provider: value,
                            success: (infoRes) => {
                                /**
                                 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
                                 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
                                 */
                                this.toMain(infoRes.userInfo.nickName);
                            }
                        });
                    },
                    fail: (err) => {
                        console.error('授权登录失败：' + JSON.stringify(err));
                    }
                });
            },
            toMain(userName) {
                this.login(userName);
                /**
                 * 强制登录时使用reLaunch方式跳转过来
                 * 返回首页也使用reLaunch方式
                 */
                if (this.forcedLogin) {
                    uni.reLaunch({
                        url: '../main/main',
                    });
                } else {
                    uni.navigateBack();
                }

            }
        },
        onLoad(){
            alert(1)
           
        },
        onReady() {
            this.initPosition();
            this.initProvider();
        }
    }
</script>

<style>
    .icon{
        position: absolute;
        width:24px;
        height:24px;
        left: 20px;
        top: 15px;
    }
    .action-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .action-row navigator {
        color: #007aff;
        padding: 0 10px;
    }

    .oauth-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    .oauth-image {
        width: 50px;
        height: 50px;
        border: 1px solid #dddddd;
        border-radius: 50px;
        margin: 0 20px;
        background-color: #ffffff;
    }

    .oauth-image image {
        width: 30px;
        height: 30px;
        margin: 10px;
    }
    .account{
        text-align: center;
        padding-bottom: 20px;
    }
    button{
        color:#fff;
    }
    .detail-page{
        padding-left:10px;
        background: #ffe2de;
        padding-right:10px;
        margin-left:10px;
        margin-right:10px;
        padding-top:20px;
        padding-bottom:20px;
    }
    .detail-page .getcode,.loginbutton{
        background: #FB5847;
    }
    .qimg{
        width:100%;
        padding-bottom:20px;
    }
     .btncode[disabled]{
        background-color: #fc8988;
        position: absolute;
        right: 20px;
        top:9px;
        border-radius: 30px;
        padding: 0 10px;
        font-size:13px;
    }
    
    .loginbutton[disabled][type=primary]{
         background-color: #fc8988;
    }
    .products{
        padding: 40px 10px 10px;
    }
    .products .pimg{
        width:100%;
        height:581px;
    }
    .footer{
        position:fixed;
        bottom:0;
        z-index:99;
    }
    .footer .download{
        width: 100%;
        height: 76px;
        position: fixed;
        bottom: 0;
        z-index: 99;
    }
    .input2 {
         button{

         }
    }
    .content .bannerimg{
		width: 100%;
    	height: 440px;
	}
</style>
