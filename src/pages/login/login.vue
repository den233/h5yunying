<template>
    <view class="content" >
         
        <view  style="padding-bottom:50px">
           <view style="position:relative">
                <image v-if="isLogin" onclick="return false" mode="widthFix" class="bannerimg image-no" :src="bannerimg1"></image>
              <image v-else onclick="return false" mode="widthFix" class="bannerimg image-no" :src="bannerimg"></image>
            <view v-if="isLogin" class="detail-page" >
                <!-- <view style="position:relative;" v-for="(item,index) in rewardList" :key="index">
                     <image mode="widthFix" onclick="return false"  class="qimg image-no" :src="item.img"></image>
                    <view class="discounts">
                        <text>{{item.name}}</text>
                         <text class="big">{{item.over}}</text>
                         <text>减</text>
                           <text class="big">{{item.discount}}</text>
                    </view>
                </view> -->
               
                 <view class="account">
                    券已放入账号：{{mobileNo}}
                 </view>
                 <view >
                    <button class="getcode primary" :disabled="rewardList.length==0" type="primary"   @click="usetickets"></button>
                </view>
            </view>
            <view v-else class="login-page">
                <view class="input-group">
                <view class="input-row border">
                    <image class="icon image-no" :src="phoneimg"></image>
                    <m-input class="m-input" type="number" maxlength="11" clearable focus v-model="account" placeholder="请输入手机号"></m-input>
                </view>
                <view class="input-row">
                    <image  class="icon image-no" :src="codeimg"></image>
                    <m-input style="margin-bottom:5px;" maxlength="4" class="input2" type="password" displayable v-model="password" placeholder="请输入验证码"></m-input>
                     <button @click="openPopup" class="btncode primary" type="primary" :disabled="!authCodeAllowed">{{codeMsg}}</button>
                </view>
                </view>
                <view class="btn-row">
                    <button  :disabled="!validate||(password.length!=4)" type="primary" class="primary loginbutton" @click="bindLogin"></button>
                </view>
            </view>
           </view>
            
             
            <view class="products">
                <view class="item">
                    <image mode="widthFix" onclick="return false" class="pimg image-no" :src="goodsimg"></image>
                </view>
                <view class="item guize">
                       <image mode="widthFix" onclick="return false" class="pimg image-no" :src="gonggao"></image>
                </view>
            </view>
        </view>
         
        <view class="footer" @click="usetickets">
              <image  mode="widthFix" id="the-id"   class="download" :src="downloadimg"></image>
        </view>
				<uni-popup :account="account" ref="popup" @closePopup="closePopup" type="middle">底部弹出 Popup</uni-popup>
    </view>
</template>

<script>
    //import service from '../../service.js';
    import wx from "weixin-js-sdk";
    import store from '../../store'
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import mInput from '../../components/m-input.vue'
    import uniPopup from "../../../common/uni-popup/uni-popup.vue"
    import {validatePhone} from '../../static/js/validate.js'

    import{
        isLogin,
        loginbycode,
        sendCode,
        isNewphone,
        coupon
        }from '../../../common/vmeitime-http/'
    import axios from "axios";  
    function getUrlParams(name) { // 不传name返回所有值，否则返回对应值
    var url = window.location.search;
    if (url.indexOf('?') == 1) { return false; }
    url = url.substr(1);
    url = url.split('&');
    var name = name || '';
    var nameres;
    // 获取全部参数及其值
    for(var i=0;i<url.length;i++) {
        var info = url[i].split('=');
        var obj = {};
        obj[info[0]] = decodeURI(info[1]);
        url[i] = obj;
    }
    // 如果传入一个参数名称，就匹配其值
    if (name) {
        for(var i=0;i<url.length;i++) {
            for (const key in url[i]) {
                if (key == name) {
                    nameres = url[i][key];
                }
            }
        }
    } else {
        nameres = url;
    }
    // 返回结果
    return nameres;
}  
    export default {
        components: {
            mInput,
            uniPopup
        },
        mounted(){
            //this.$refs.popup.open()
            console.log(getUrlParams('campaign'))
             //alert(getUrlParams('campaign'))
             this.stemp()
             //alert(this.adid)
        },
        data() {
            return {
                appid: 'wx6b275740f9c67725',
                appsecret: '5cec4a0ea7e2e4e4ad229f5615b0473d',
                campaignid:getUrlParams('campaign'),
                adid:getUrlParams('adid')==undefined?'default':getUrlParams('adid'),
                providerList: [],
                hasProvider: false,
                account: '',
                password: '',
				validate:false,
                positionTop: 0,
                bannerimg:'../../static/img/v1/unit1@3x.jpg',
                bannerimg1:'../../static/img/v1/unit1_coupons@3x.jpg',
                phoneimg:'../../static/img/v1/phone@3x.png',
                codeimg:'../../static/img/v1/mail@3x.png',
                goodsimg:'../../static/img/v1/unit2@3x.jpg',
                downloadimg:'../../static/img/v1/bottom@3x.jpg',
                "mobileNo": "",
                "rewardList": [ ],
                 
                gonggao:'../../static/img/v1/unit3@3x.png',
                ticketimg:"../../static/img/h5/coupons@2x.png",
                isLogin:false,
                background:"#fda594",
                authCodeAllowed:false,
                codeMsg:'获取验证码',
                tick:0,
                internal:null,
                cuponsList:[],
               memberinfo:{
                   campaign:'',
                   accountId:''
               }
            }
        },
				watch:{
					account(value){
						let _this=this;
						 
						if(!validatePhone(value)){
							console.log(value)
                            _this.authCodeAllowed=false
                            _this.validate=false
						}else{
                if(this.tick==0){
                      _this.authCodeAllowed=true
                }
                      _this.validate=true
						}
						// validatePhone(value)?"this.validta==true":"this.validta==false"
					}
				},
        computed: mapState(['forcedLogin']),
        methods: {
            ...mapMutations(['login']),
             
            initPosition() {
                /**
                 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
                 * 反向使用 top 进行定位，可以避免此问题。
                 */
                this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
            },
            closePopup(){
                this.authCodeAllowed = false;
                this.tick = 60;
                this.codeMsg=`${this.tick}秒后获取`
                this.internal = setInterval(() => {
                    this.tick = this.tick - 1;
                    this.codeMsg=`${this.tick}秒后获取`
                    if (this.tick == 0) {
                        this.authCodeAllowed = true;
                        this.codeMsg="获取验证码"
                        clearInterval(this.internal);
                    }
                }, 1000);
            },
                openPopup(){
                 
                    if (!validatePhone(this.account)) {
                            uni.showToast({
                                    icon: 'none',
                                    title: '请输入正确的手机号码'
                            })
                        return false
                    }
                    this.isNewphone()
                    
            },
               
           async bindLogin() {
					console.log('password',this.password.length)	
                /**
                 * 客户端对账号信息进行一些必要的校验。
                 * 实际开发中，根据业务需要进行处理，这里仅做示例。
                 */
                 
                 const value1=await this.isNewphone(2) 
                 if(value1==2) {
                     let _this=this;
                 
               await this.$api.loginbycode({
                    "mobileNumber": this.account,
                    "validationCode": this.password,
                    "channel": "CEO_APP",
                    "platform" : "WEB",
                    "campaign" : "WP_NEW",
                    "adid" : _this.adid
                }).then((res)=>{
                        this.loading = false;
                        if(res.code=="10001"){
                        uni.showToast({
                            title: '登录成功',
                            icon: 'success',
                            mask: true
                        });
                        this.isLogin=true;
                        this.memberinfo.accountId=res.data.member.accountId;
                          setTimeout(function(){
                              _this.getcupon()  
                          },200) 
                        }else{
                            uni.showToast({
                            title: res.sub_msg,
                            icon: 'none',
                            mask: true
                        });
                        }
                        //this.res = '请求结果 : ' + JSON.stringify(res);
                    }).catch((err)=>{
                        this.loading = false;
                        uni.showToast({
                            title: err,
                            icon: 'none',
                            mask: true
                        });
                    })
                 }   
            },
            
            isLoginhandle(){
                 //this.getcupon()
                 this.$api.isLogin({}).then((res)=>{
                     if(res.code=='40000'){
                         this.isLogin=false
                     }
                     if(res.code=='10001'){
                        this.memberinfo.accountId=res.data.member.accountId;
                         this.isLogin=true;
                         
                         this.getcupon()
                        }
                    }).catch((err)=>{	
                    })
            },
            isNewphone(type){
                uni.showLoading({
                    title: '加载中'
                });
               return this.$api.isNewphone({
                    mobileNumber:this.account,
                     "type": 2
                }).then((res)=>{
                       uni.hideLoading();
                        console.log(res.data)
                       if(!res.data.result){
                           uni.showToast({
					 		title: '该手机已注册',
					 		icon: 'none',
					 		mask: true
                         })
                         return 1
                       }else{
                           if(type!=2){
                            this.$refs.popup.open()
                           } 
                          return 2
                       }
                    }).catch((err)=>{
                        uni.showToast({
					 		title: err,
					 		icon: 'success',
					 		mask: true
					 	});
                        uni.hideLoading();	
                    })
            },
            getcupon(){
                 uni.showLoading({
                    title: '加载中'
                });
                
                this.$api.getcoupon({
                    "accountId":this.memberinfo.accountId,
	                "campaignKey":this.memberinfo.campaign
                }).then((res)=>{
                    console.log('uo',res)
                       uni.hideLoading();
                        if(res.code=="10001"){
                             uni.showToast({
                                title: '领取成功',
                                icon: 'fail',
                                mask: true
                            })
                            this.mobileNo=res.data.mobileNo;
                            this.rewardList= res.data['rewardList'].map(v=>{
                               return Object.assign({img:this.ticketimg},v)
                            })
                        }else{
                            uni.showToast({
                                title:res.sub_msg,
                                icon: 'none',
                                mask: true
                            })
                        }
                       
                    }).catch((err)=>{
                        uni.showToast({
					 		title: err,
					 		icon: 'none',
					 		mask: true
					 	});
                        uni.hideLoading();	
                    })
            },
            usetickets(){
                window.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.want.hotkidclub.ceo&ckey=CK1434550643682"
            },
            stempzhengshi(){

            },
            stemp() {
                // alert('开始签名')
                // var baseUrl1=process.env.node_env=="production"?"http://ceodemo.hotkidclub.com:8290":"http://10.128.231.74:8000";
             
            //    axios.post(baseUrl1+"/ceo/b/goldencalf/config",{
            //         url: window.location.href,
            //         //url:baseUrl1+"/ceo/b/goldencalf/config"
            //         })
                if(store.state.env=="production"||store.state.env=="development"){
                        this.$api.getwxconfig({url: window.location.href})
                    .then((res) => {
                        console.log('333',res)
                        console.log(res.data.object.appId)
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.object.appId, // 必填，公众号的唯一标识
                        timestamp: res.data.object.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.data.object.noncestr, // 必填，生成签名的随机串
                        signature: res.data.object.signature, // 必填，签名
                        jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline"] // 必填，需要使用的JS接口列表
                    });
                    this.config();
                    }).catch(err=>{
                        console.log('config',err)
                    })
                }
                  if(store.state.env=="zhengshi"){
                        this.$api.getwxconfig({pageUrl: window.location.href,"type" : "WZWPC"})
                    .then((res) => {
                        console.log('333',res)
                        console.log(res.data.object.appId)
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.appId, // 必填，公众号的唯一标识
                        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                        signature: res.data.signature, // 必填，签名
                        jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline"] // 必填，需要使用的JS接口列表
                    });
                    this.config();
                    }).catch(err=>{
                        console.log('config',err)
                    })
                }
               
                },
                config() {
                // alert('开始配置')
                wx.ready(() => {
                    let shareData = {
                    title: "99元新人礼包免费送",
                    desc:"来旺旺官方商城，领新人福利！",
                    link: window.location.href,
                    imgUrl:"http://"+window.location.host+"/ceo/campaign/static/img/shareImg.jpg",
                    type: "",
                    dataUrl: "",
                    success: function() {},
                    cancel: function() {},
                    fail: function() {
                        alert("分享失败");
                    }
                    };
                    //var nativeShare = new NativeShare()
                    //nativeShare.setShareData(shareData)
                    wx.onMenuShareAppMessage(shareData);
                    wx.onMenuShareTimeline(shareData);
                });
                }
        },
        onLoad(){
           
            console.log(this.$route)
            //alert(this.positionTop)
             this.memberinfo.campaign=getUrlParams('campaign');
              
           this.isLoginhandle();
        },
        onReady() {
            
            // this.initPosition();
            // this.initProvider();
        }
    }
</script>

<style lang="scss">
 
.image-no{ pointer-events: none; }
.clear{
    clear:both;
}
    .login-page{
        position: absolute;
        bottom:-35px;
        left: 0;
        right: 0;
        z-index: 30;
    }
     
    
    .discounts{
        color:#FB5847;
        position:absolute;
        left:30%;
        top:50%;
        margin-top:-35px;
        font-size: 18px;
        font-weight: 500;
        .big{
            font-size: 30px;
        }
    }
    .icon{
        position: absolute;
        width:24px;
        height:24px;
        left: 36px;
        top: 11px;
    }
    .action-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

 
    .account{
        text-align: center;
        padding-bottom: 10px;
        color:#E7D7CA;
    }
    
    .detail-page{
        position: absolute;
        bottom: -50px;
        z-index: 24;
        left: 0;
        right: 0;
    }
    .detail-page .getcode[disabled],.login-page .loginbutton[disabled]{
        background:url('../../static/img/v1/button_un@3x.png') no-repeat;
        
    }
    .detail-page .getcode,.login-page  .loginbutton{
        width: 100%;
        margin: 0 auto;
        max-width: 280px;
        height: 65px;
        background-size: cover!important;
        
    }
    .detail-page .getcode{
         background:url('../../static/img/v1/botton@3x.png') no-repeat;
    }
    .login-page .loginbutton{
         background:url('../../static/img/v1/botton_get@3x.png') no-repeat;
        
    }
    .qimg{
        width:100%;
        padding-bottom:20px;
        height: 80px;
    }
     .btncode{
        position: absolute;
        right: 33px;
        top:6px;
        border-radius: 23px;
        padding: 0 10px;
        font-size:13px;
    }
    
     
    .products .pimg{
        width:100%;
        height:581px;
        vertical-align: top;
        margin-top:-3px;
    }
    .products {
        .guize{
            background: #ffe2de;
            
            color:#625150;
            
            .content{
                font-size: 14px;
            }
        }
        .item{
            .title{
                width: 100%;
                margin:10px auto;
                .border{
                     border-top:1px solid #625150;
                     display: inline-block;
                     width: calc(50% - 45px);
                     margin-top:0px;
                     height: 5px;
                     
                }
                text{
                    
                    font-size:18px;
                     text-align:center;
                    color:#625150;
                    display: inline-block;
                    width: 90px;

                }
            }
             
        }
    }
    .footer{
        position:fixed;
        bottom:0;
        z-index:99;
        height:70px;
    }
    .footer .download{
        width: 100%;
      height:70px;
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
        vertical-align: top;
	}
</style>
