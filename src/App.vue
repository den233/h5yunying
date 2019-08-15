<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
		},
		onShow: function() {
			console.log(process.env);
		},
		onHide: function() {
			console.log('App Hide');
		}
	}
</script>
<style>
	  @import 'https://at.alicdn.com/t/font_1071536_eyb9yhkwgbd.css';
</style>
<style lang="scss">
	/* 头条小程序需要把 iconfont 样式放到组件外 */
	/* @import "components/m-icon/m-icon.css"; */
@import "static/scss/common.scss";
	/*每个页面公共css */
	page {
		min-height: 100%;
		display: flex;
		font-size: 16px;
	}

	/* #ifdef MP-BAIDU */
	page {
		width: 100%;
		height: 100%;
		display: block;
	}

	swan-template {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* 原生组件模式下需要注意组件外部样式 */
	custom-component {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* #endif */

	/* #ifdef MP-ALIPAY */
	page {
		min-height: 100vh;
	}

	/* #endif */

	/* 原生组件模式下需要注意组件外部样式 */
	m-input {
		width: 100%;
		/* min-height: 100%; */
		display: flex;
		flex: 1;
	}

	.content {
		display: flex;
		flex: 1;
		flex-direction: column;
		
		
	}
	
	.input-group {
		position: relative;
	}


	.input-row {
		display: flex;
		flex-direction: row;
		position: relative;
		font-size: 18px;
		line-height: 40px;
	}

	.input-row .title {
		width: 72px;
		padding-left: 15px;
	}

	/* .input-row.border::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 8px;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	} */

	.btn-row {
		padding: 0 45px;
	}

	button.primary {
		background-color: $btnColr;
		color: #fff;
	}
	button.primary[disabled] {
		background-color: $disableColor;
		color:$disablefont;
	}
	uni-button:after{
		border:none;
	}
</style>
