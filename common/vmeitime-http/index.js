import http from './interface'
 
import store from '../../src/store'
import { basePort } from '_portfinder@1.0.21@portfinder';
//var baseUrl=process.env.node_env=="production"?"http://qa.hotkidclub.com/api":"http://localhost:8000/api";
/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */
console.log(process.env)
// 单独导出(测试接口) import {test} from '@/common/vmeitime-http/'
export const test = (data) => {
	/* http.config.baseUrl = "http://localhost:8080/api/"
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		config.header = {
			"token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
		}
	} */
	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
		console.log('个性化response....')
		//判断返回状态 执行相应操作
		return response;
	}
    return http.request({
		baseUrl: '',
        url: 'ajax/echo/text?name=uni-app',
		dataType: 'text',
        data,
    })
}

// 检测是否有登录
export const isLogin = (data) => {
    return http.request({
        url: '/member/info.ctrl',
        method: 'GET', 
        data,
		// handle:true
    })
}
// 短信验证码登录
let loginPort='';
if(store.state.env=="development"){
	loginPort="http://localhost:8000/api"
	
}
if(store.state.env=="production"){
	loginPort="http://ceodemo.hotkidclub.com/ceo/mi-api"
}
if(store.state.env=="zhengshi"){
	loginPort="http://www.hotkidclub.com/api"
}
let loginurl=(store.state.env=="development"||store.state.env=="zhengshi")?'/member/registerOrLogin.ctrl':'/user/registerOrLogin.ctrl'
export const loginbycode = (data) => {
	
    return http.request({
		baseUrl:loginPort,
        url: loginurl,
        method: 'POST', 
        data,
		// handle:true
    })
}
// 寄送短信验证码
export const sendCode = (data) => {
    return http.request({
        url: '/member/sms/v2/code.ctrl',
        method: 'POST', 
        data,
		// handle:true
    })
}
//是否新手机
export const isNewphone = (data) => {
    return http.request({
        url: '/member/check/mobile.ctrl',
        method: 'POST', 
        data,
		// handle:true
    })
}
//优惠券发放查询
export const getcoupon = (data) => {
    return http.request({
        url: '/coupon_centre/activity/web/newly/give.ctrl',
        method: 'POST', 
        data,
		// handle:true
    })
}
//优惠券发放查询
export const getwxconfig = (data) => {
	/* http.config.baseUrl = "http://localhost:8080/api/"
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		config.header = {
			"token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
		}
	} */
    //设置请求结束后拦截器
	var baseUrl1= "";
	var basePort="";
	//发布测试
if(store.state.env=="production"){
	basePort="http://ceodemo.hotkidclub.com/ceo/mi-api"
	baseUrl1="/ceo/b/goldencalf/config"
}
//正式发布
if(store.state.env=="zhengshi"){
	basePort="http://ceodemo.hotkidclub.com"
	baseUrl1="/ceo/api/ceo/c/user"
}
//开发环境
if(store.state.env=="development"){
	basePort="http://localhost:8000"
	baseUrl1="/ceo/b/goldencalf/config"
}
	// http.interceptor.response = (response) => {
	// 	console.log(response)
	// 	//判断返回状态 执行相应操作
	// 	return response;
	// }
	//alert(basePort)
    return http.request({
		baseUrl: basePort,
		//url: '/member/wx/jsapi/ticket.ctrl',
		url:baseUrl1,
		header: {
			'Content-Type':'application/json;charset=UTF-8'
			//'Content-Type':'application/x-www-form-urlencoded'
		},  
		data,
		dataType: 'json',
		method: "POST",
    })
}
// export const getwxconfig = (data) => {
//     return http.request({
//         url: 'http://ceodemo.hotkidclub.com:8290/ceo/b/goldencalf/config',
//         method: 'POST', 
//         data,
// 		// handle:true
//     })
// }
// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	isLogin,
	loginbycode,
	sendCode,
	isNewphone,
    getcoupon,
    getwxconfig
}