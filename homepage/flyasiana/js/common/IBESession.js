/**
 * Amadeus Session, SSO Session Check And Extension
 * 
 * <script type="text/javascript" src="/js/common/jquery.countdown.js"></script>
 * <script type="text/javascript" src="/js/mobile/IBECommon.js" ></script>
 * <input type="hidden" id="hidJsessionId"/>
 * 
 * Amadeus Session check( checkAmadeusSessionExtension() )
 * - PC     : jquery.countdown.js, <input type="hidden" id="hidJsessionId"/>
 * - MOBILE : jquery.countdown.js, <input type="hidden" id="hidJsessionId"/>, IBECommon.js(fixedPadding() 호출)
 * 
 * SSO Session check( checkSSOSessionExtension() )
 * - PC     : jquery.countdown.js
 * - MOBILE : jquery.countdown.js, IBECommon.js(fixedPadding() 호출)
 */

var remainFlag = false;
var sessionBannerTimeOut;
var sessionLayerTimeOut;

var ssoRemainFlag = false;
var ssoSessionBannerTimeOut;
var ssoSessionLayerTimeOut;

var ssoLoginYn = checkSsoCookie();

var exTarget = null;

function checkSsoCookie(){
	var name = "ssoSessionId";
	var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return value? true : false;
}

// Amadeus Session 연장 여부 확인
function checkAmadeusSessionExtension(bizType, jsessionId, mobile){
	var REMAIN_TIME			= 0;
	
	if(jsessionId){
		if($('#hidJsessionId').length == 0){
			$('body').prepend('<input type="hidden" id="hidJsessionId"/>');
		}
		$('#hidJsessionId').val(jsessionId);
	}
	
	$.ajax({
		url : 'AmadeusSessionExtensionInfo.do',
		type : 'post',
		data : {
			JSESSION_OF_AMADEUS : $('#hidJsessionId').val()
		},
		dataType : 'json',
		async : false,
		success : function(jsonData) {
			
			if(jsonData.SESSION_CHECK_FLAG){
				REMAIN_TIME = jsonData.REMAIN_TIME;
				
				var remainTimeSec 	  = Number(REMAIN_TIME);
				var remainTimeMilSec  = remainTimeSec*1000;
				var shortlySec        = 240000-remainTimeMilSec;
				var shortlyLayer	  = shortlySec+180000;
				
				clearTimeout(sessionBannerTimeOut);
				clearTimeout(sessionLayerTimeOut);
				
				setSessionBanner(bizType, mobile);
				setSessionLayer(bizType, mobile);
				
				sessionBannerTimeOut = setTimeout( function() {showSessionBanner(mobile);}, shortlySec);		//4분 (240000)후  startCountdown 실행
				sessionLayerTimeOut = setTimeout( function() {showSessionLayer(mobile);}, shortlyLayer);	//7분 (420000)후  showSessionLayer 실행
			}else{
				clearTimeout(sessionBannerTimeOut);
				clearTimeout(sessionLayerTimeOut);
				$('#sessionBanner').remove();
				$('#sessionLayer').remove();
			}
		},
		error : function(e){
			remainFlag = false;
			//alert('오류가 발생하였습니다.');
		}
	});
}

// session 연장하기
function sessionContinue(bizType, mobile) {
	remainFlag = false;
	$.ajax({
		url : 'ExtensionAmadeusSession.do',
		type : 'post',
		data : {
			jsessionID : $('#hidJsessionId').val(),
			bizType : bizType
		},
		dataType : 'json',
		async : false,
		success : function(jsonData) {
			var ret = jsonData.SESSION_STATUS;
			if(ret) {
				remainFlag = true;
				$('#hidJsessionId').val(jsonData.JSESSION_ID);
//				alert('세션 연장에 성공하였습니다.');
				
				$('body').css('overflow-y','auto');
				
				clearTimeout(sessionBannerTimeOut);
				clearTimeout(sessionLayerTimeOut);
				
				setSessionBanner(bizType, mobile);
				setSessionLayer(bizType, mobile);
				
				sessionBannerTimeOut = setTimeout( function() {showSessionBanner(mobile);}, 240000); //4분 (240000)후  retryCountdown 실행
				sessionLayerTimeOut = setTimeout( function() {showSessionLayer(mobile);}, 420000); //7분 (420000)후  retryShowSessionLayer 실행
				
				if(exTarget != null){
					exTarget.focus();
				}
				
				if(typeof extendIUPSession == "function"){
					extendIUPSession();
				}
				
			} else {
				remainFlag = false;
				alert(jsJSON.J0239);//세션 연장에 실패하였습니다.
				if(typeof moveMainpage == "function"){
					moveMainpage();
				}
			}
		},
		error : function(e){
			remainFlag = false;
			alert(jsJSON.J0239);//세션 연장에 실패하였습니다.
			if(typeof moveMainpage == "function"){
				moveMainpage();
			}
		}
	});
}

// Session Banner
function showSessionBanner(mobile) {
	
	exTarget = document.activeElement;
	
	// SSO Banner가 존재하는 경우 없애준 후 Amadeus Banner를 보여준다.
	if($('#ssoSessionBanner:visible').length > 0){
		ssoRemainFlag = true;
		clearTimeout(ssoSessionBannerTimeOut);
		$('#ssoSessionBanner').remove();
	}
	
	var shortly = new Date();
    shortly.setSeconds(shortly.getSeconds() + 300.5);
    
    if(mobile){
    	$('#sessionBanner').css('display', 'flex');
    	fixedPadding();
    }else{
    	$('#sessionBanner').show();
    	//#34521 [UPSELL] 해상도에 따른 세션 연장 DISABLE 상황
    	//포커스 이동 전 레이어 팝업 닫기
    	$(".dim_close").trigger("click");	
    }
    
    $('#sessionBanner').focus();
    
	$('#topCountTime').countdown({until: shortly, onExpiry: liftOff, onTick: topCountdown });
}

// Session Layer
function showSessionLayer(mobile){
	
	exTarget = document.activeElement;
	
	// SSO Layer가 존재하는 경우 없애준 후 Amadeus Layer를 보여준다.
	if($('#ssoSessionLayer:visible').length > 0){
		ssoRemainFlag = true;
		clearTimeout(ssoSessionLayerTimeOut);
		$('#ssoSessionLayer').remove();
	}
	
	remainFlag = false;
	var shortly = new Date();
    shortly.setSeconds(shortly.getSeconds() + 120.5);
    
    if(mobile){
    	$('#sessionLayer').css('display', 'flex');
    	$('#sessionLayer').focus();
    }else{
    	$('#sessionLayer').show();
    	sessionLayerCenter('sessionLayer');
    	$('body').css('overflow-y','hidden');
    	$('#sessionLayer > .layer_pop > .pop_cont').focus();
    }
    
    $('#startCountTime').countdown({until: shortly, onExpiry: liftOff, onTick: watchCountdown});
}

// Session Banner CountDown
function topCountdown(periods) {
    $('#topCountTime').text(jsJSON.J0240.replace(/#0/, periods[5]).replace(/#1/, periods[6]));//#0분 #1초
}

// Session Layer CountDown
function watchCountdown(periods) {
    $('#startCountTime').text(jsJSON.J0240.replace(/#0/, periods[5]).replace(/#1/, periods[6]));
}

// Session 종료
function liftOff() {
	if(remainFlag == false) {
		if(getWebviewYn()){
			closeWebview();
		}else{
			location.href = '/';
		}
	}
}

// Session Layer 닫기
function closeSessionLayer(){
	$('#sessionLayer').hide();
	
	if(exTarget != null){
		exTarget.focus();
	}
}

// Session Banner Contents
function setSessionBanner(bizType, mobile){
	var html = '';
	
	$('#sessionBanner').remove();
	
	if(mobile){
		html += '<div id="sessionBanner" class="session_area" style="display: none;" tabindex="90">'
			  + '	<p class="title_matters black fsz_12">'+jsJSON.J0241+'</p>'//자동초기화 <em id="topCountTime" class="fo_bol"></em> 남았습니다.
			  + '	<button type="button" class="btn_text fsz_13" onclick="sessionContinue(\''+ bizType +'\', '+ mobile +');" tabindex="91">'+jsJSON.J0242+'</button>'//세션 연장하기
			  + '</div>';
		
		
		if($('.btn_top_area').length == 0){
			html = '<div class="btn_top_area">'
				 + html
				 + '</div>';
			
			$('.container').prepend(html);
		}else{
			$('.btn_top_area').prepend(html);
		}
		
		fixedPadding();
	}else{
		html += '<div id="sessionBanner" class="session_area" style="display: none;" tabindex="90">'
			  + '	<div class="session_cont">'
			  + '		<span>'+jsJSON.J0241+'</span>'//자동초기화 <em id="topCountTime" class="fo_bol"></em> 남았습니다.
			  + '		<a href="javascript:sessionContinue(\''+ bizType +'\', '+ mobile +');" class="btn_arrow" id="sc" tabindex="91">'+jsJSON.J0242+'</a>'
			  + '	</div>'
			  + '</div>';
		
		if($('.header_booking_wrap').length > 0){
			$('.header_booking_wrap').after(html);
		}else if($('.location_bar').length > 0){
			$('.location_bar').after(html);
		}
		
		$('#sc').focus();
	}
	
}

// Session Layer Contents
function setSessionLayer(bizType, mobile){
	var html = '';
	var closeDesc = '';
	
	$('#sessionLayer').remove();
	
	if(mobile){
		closeDesc = jsJSON.J0020;
		html += '<div id="sessionLayer" class="layer_wrap" style="display: none;" tabindex="92">'
			  + '	<div class="dim_bg"></div>'
			  + '	<div class="layer_container">'
			  + '		<div class="layer_content layer_basic">'
			  + '			<div class="title_wrap">'
			  + '				<h4 class="tit_h4">'+jsJSON.J0243+'</h4>'
			  + '			</div>'
			  + '			<div class="cont_wrap min_layer">'
			  + '				<p>'+jsJSON.J0244+'</p>'
			  + '				<div class="gray_box mar_to20">'
			  + '					<p class="txt_top taC">'+jsJSON.J0245+'</p>'
			  + '				</div>'
			  + '			</div>'
			  + '			<div class="btn_area col2">'
			  + '				<button type="button" class="btn_L" onclick="liftOff();" tabindex="93">'+jsJSON.J0246+'</button>'
			  + '				<button type="button" class="btn_L red" onclick="sessionContinue(\''+ bizType +'\', '+ mobile +');" tabindex="94">'+jsJSON.J0247+'</button>'
			  + '			</div>'
			  + '			<a href="javascript:closeSessionLayer();" class="layer_close"><span class="hidden" tabindex="95">'+closeDesc+'</span></a>'
			  + '		</div>'
			  + '	</div>'
			  + '</div>';
		
		$('.container').prepend(html);
	}else{
		closeDesc = jsJSON.J0087;
		html += '<div id="sessionLayer" class="layer_wrap" style="display: none;" tabindex="92">'
			  + '	<div class="dim_layer"></div>'
			  + '	<div class="layer_pop" style="width:600px;">'
			  + '		<div class="pop_cont" tabindex="0">'
			  + '			<p class="pop_tit st1">'+jsJSON.J0243+'</p>'
			  + '			<p class="pop_tit st3">'+jsJSON.J0244+'</p>'
			  + '			<div class="gray_box alC">'
			  + '				<p class="txt_top taC">'+jsJSON.J0245+'</p>'
			  + '			</div>'
			  + '		</div>'
			  + '		<div class="btn_wrap_ceType2">'
			  + '			<button type="button" class="btn_M white" onclick="liftOff();" tabindex="93">'+jsJSON.J0246+'</button>'
			  + '			<button type="button" class="btn_M red" onclick="sessionContinue(\''+ bizType +'\', '+ mobile +');" tabindex="94">'+jsJSON.J0247+'</button>'
			  + '		</div>'
			  + '		<a href="javascript:closeSessionLayer();" class="dim_close" tabindex="95"><span class="hidden">'+closeDesc+'</span></a>'
			  + '	</div>'
			  + '</div>';
		
		$('.container').prepend(html);
		
	}
}

function checkSSOSessionExtension(mobile){
	var REMAIN_TIME = 0;
	
	if(ssoLoginYn){
		$.ajax({
			url : '/I/'+countryCode+'/'+languageCode+'/SSOSessionExtensionInfo.do',
			type : 'post',
			data : {},
			dataType : 'json',
			async : false,
			success : function(jsonData) {
				
				if(jsonData.SESSION_CHECK_FLAG){
					REMAIN_TIME = jsonData.REMAIN_TIME;
					
					var remainTimeMilSec  = Number(REMAIN_TIME);
					var shortlySec        = 840000-remainTimeMilSec;
					var shortlyLayer	  = shortlySec+180000;
					var countBanner		  = 840000-remainTimeMilSec;
					var countLayer		  = countBanner+180000;
					
					if(shortlySec < 0){
						shortlySec = 0;
					}
					if(shortlyLayer < 0){
						shortlyLayer = 0;
					}
					
					clearTimeout(ssoSessionBannerTimeOut);
					clearTimeout(ssoSessionLayerTimeOut);
					
					setSSOSessionBanner(mobile);
					setSSOSessionLayer(mobile);
					
					ssoSessionBannerTimeOut = setTimeout( function() {showSSOSessionBanner(countBanner, mobile);}, shortlySec);	//14분 (840000)후  startCountdown 실행
					ssoSessionLayerTimeOut = setTimeout( function() {showSSOSessionLayer(countLayer, mobile);}, shortlyLayer);	//17분 (1020000)후  showSessionLayer 실행
				}else{
					clearTimeout(ssoSessionBannerTimeOut);
					clearTimeout(ssoSessionLayerTimeOut);
					$('#ssoSessionBanner').remove();
					$('#ssoSessionLayer').remove();
				}
			},
			error : function(e){
				ssoRemainFlag = false;
				//alert('오류가 발생하였습니다.');
			}
		});
	}
}

function SSOSessionContinue(mobile) {
	ssoRemainFlag = false;
	$.ajax({
		url : 'ExtensionSSOSession.do',
		type : 'post',
		data : {},
		dataType : 'json',
		async : false,
		success : function(jsonData) {
			var ret = jsonData.SESSION_STATUS;
			if(ret) {
				ssoRemainFlag = true;
//				alert('세션 연장에 성공하였습니다.');
				
				$('body').css('overflow-y','auto');
				
				clearTimeout(ssoSessionBannerTimeOut);
				clearTimeout(ssoSessionLayerTimeOut);
				
				setSSOSessionBanner(mobile);
				setSSOSessionLayer(mobile);
				
				ssoSessionBannerTimeOut = setTimeout( function() {showSSOSessionBanner(0, mobile);}, 840000); //14분 (840000)후  retryCountdown 실행
				ssoSessionLayerTimeOut = setTimeout( function() {showSSOSessionLayer(0, mobile);}, 1020000); //17분 (1020000)후  retryShowSessionLayer 실행
				
				if(exTarget != null){
					exTarget.focus();
				}
				
				if(typeof extendIUPSession == "function"){
					extendIUPSession();
				}
			} else {
				ssoRemainFlag = false;
				alert(jsJSON.J0239);
				if(typeof moveMainpage == "function"){
					moveMainpage();
				}
			}
		},
		error : function(e){
			ssoRemainFlag = false;
			alert(jsJSON.J0239);
			if(typeof moveMainpage == "function"){
				moveMainpage();
			}
		}
	});
}

function showSSOSessionBanner(count, mobile) {
	
	// Amadeus Banner가 존재하는 경우에는 SSO Banner를 없애고 노출하지 않는다.
	if($('#sessionBanner:visible').length > 0){
		ssoRemainFlag = true;
		clearTimeout(ssoSessionBannerTimeOut);
		$('#ssoSessionBanner').remove();
	}else{
		
		exTarget = document.activeElement;
		
		var shortly = new Date();
		var countBanner = 300.5;
		
		if(count < 0){
			countBanner = 300.5 + (count / 1000);
		}
		
		if(countBanner < 0){
			countBanner = 0;
		}
		
		shortly.setSeconds(shortly.getSeconds() + countBanner);
		
		if(mobile){
			$('#ssoSessionBanner').css('display', 'flex');
			fixedPadding();
		}else{
			$('#ssoSessionBanner').show();
		}
		
		$('#ssoSessionBanner').focus();
		
		$('#ssoTopCountTime').countdown({until: shortly, onExpiry: SSOLiftOff, onTick: ssoTopCountdown });
	}
}

function showSSOSessionLayer(count, mobile){
	
	// Amadeus Layer가 존재하는 경우에는 SSO Layer를 없애고 노출하지 않는다.
	if($('#sessionLayer:visible').length > 0){
		ssoRemainFlag = true;
		clearTimeout(ssoSessionLayerTimeOut);
		$('#ssoSessionLayer').remove();
	}else{
		
		exTarget = document.activeElement;
		
		ssoRemainFlag = false;
		var shortly = new Date();
		var countLayer = 120.5;
		
		if(count < 0){
			countLayer = 120.5 + (count / 1000);
		}
		
		if(countLayer < 0){
			countLayer = 0;
		}
		
		shortly.setSeconds(shortly.getSeconds() + countLayer);
		
		if(mobile){
			$('#ssoSessionLayer').css('display', 'flex');
			$('#ssoSessionLayer').focus();
		}else{
			$('#ssoSessionLayer').show();
			sessionLayerCenter('ssoSessionLayer');
	    	$('body').css('overflow-y','hidden');
	    	$('#ssoSessionLayer > .layer_pop > .pop_cont').focus();
		}
		
		$('#ssoStartCountTime').countdown({until: shortly, onExpiry: SSOLiftOff, onTick: ssoWatchCountdown});
	}
}

function ssoTopCountdown(periods) {
	$('#ssoTopCountTime').text(jsJSON.J0240.replace(/#0/, periods[5]).replace(/#1/, periods[6]));
}

function ssoWatchCountdown(periods) {
	$('#ssoStartCountTime').text(jsJSON.J0240.replace(/#0/, periods[5]).replace(/#1/, periods[6]));
}

function SSOLiftOff() {
	if(ssoRemainFlag == false) {
		if(getWebviewYn()){
			closeWebview();
		}else{
			location.href = './Logout.do?callType=IBE';
		}
	}
}

function closeSSOSessionLayer(){
	$('#ssoSessionLayer').hide();
	
	if(exTarget != null){
		exTarget.focus();
	}
}

//Session Banner Contents
function setSSOSessionBanner(mobile){
	var html = '';
	
	$('#ssoSessionBanner').remove();
	
	if(mobile){
		html += '<div id="ssoSessionBanner" class="session_area" style="display: none;" tabindex="90">'
			  + '	<p class="title_matters black fsz_12">'+jsJSON.J0248+'</p>'
			  + '	<button type="button" class="btn_text fsz_13" onclick="SSOSessionContinue('+ mobile +');" tabindex="91">'+jsJSON.J0242+'</button>'
			  + '</div>';
		
		
		if($('.btn_top_area').length == 0){
			html = '<div class="btn_top_area">'
				 + html
				 + '</div>';
			
			$('.container').prepend(html);
		}else{
			$('.btn_top_area').prepend(html);
		}
		
		fixedPadding();
	}else{
		html += '<div id="ssoSessionBanner" class="session_area" style="display: none;" tabindex="90">'
			  + '	<div class="session_cont">'
			  + '		<span>'+jsJSON.J0248+'</span>'
			  + '		<a href="javascript:SSOSessionContinue('+ mobile +');" class="btn_arrow" id="sc" tabindex="91">'+jsJSON.J0242+'</a>'
			  + '	</div>'
			  + '</div>';
		
		if($('.header_booking_wrap').length > 0){
			$('.header_booking_wrap').after(html);
		}else if($('.location_bar').length > 0){
			$('.location_bar').after(html);
		}
		
		$('#sc').focus();
	}
	
}

// Session Layer Contents
function setSSOSessionLayer(mobile){
	var html = '';
	var closeDesc = '';
	
	$('#ssoSessionLayer').remove();
	
	if(mobile){
		closeDesc = jsJSON.J0020;
		html += '<div id="ssoSessionLayer" class="layer_wrap" style="display: none;" tabindex="92">'
			  + '	<div class="dim_bg"></div>'
			  + '	<div class="layer_container">'
			  + '		<div class="layer_content layer_basic">'
			  + '			<div class="title_wrap">'
			  + '				<h4 class="tit_h4">'+jsJSON.J0243+'</h4>'
			  + '			</div>'
			  + '			<div class="cont_wrap min_layer">'
			  + '				<p>'+jsJSON.J0244+'</p>'
			  + '				<div class="gray_box mar_to20">'
			  + '					<p class="txt_top taC">'+jsJSON.J0249+'</p>'
			  + '				</div>'
			  + '			</div>'
			  + '			<div class="btn_area col2">'
			  + '				<button type="button" class="btn_L" onclick="SSOLiftOff();" tabindex="93">'+jsJSON.J0246+'</button>'
			  + '				<button type="button" class="btn_L red" onclick="SSOSessionContinue('+ mobile +');" tabindex="94">'+jsJSON.J0247+'</button>'
			  + '			</div>'
			  + '			<a href="javascript:closeSSOSessionLayer();" class="layer_close" tabindex="95"><span class="hidden">'+closeDesc+'</span></a>'
			  + '		</div>'
			  + '	</div>'
			  + '</div>';
		
		$('.container').prepend(html);
	}else{
		closeDesc = jsJSON.J0087;
		html += '<div id="ssoSessionLayer" class="layer_wrap" style="display: none;" tabindex="92">'
			  + '	<div class="dim_layer"></div>'
			  + '	<div class="layer_pop" style="width:600px;">'
			  + '		<div class="pop_cont">'
			  + '			<p class="pop_tit st1">'+jsJSON.J0243+'</p>'
			  + '			<p class="pop_tit st3">'+jsJSON.J0244+'</p>'
			  + '			<div class="gray_box alC">'
			  + '				<p class="txt_top taC">'+jsJSON.J0249+'</p>'
			  + '			</div>'
			  + '		</div>'
			  + '		<div class="btn_wrap_ceType2">'
			  + '			<button type="button" class="btn_M white" onclick="SSOLiftOff();" tabindex="93">'+jsJSON.J0246+'</button>'
			  + '			<button type="button" class="btn_M red" onclick="SSOSessionContinue('+ mobile +');" tabindex="94">'+jsJSON.J0247+'</button>'
			  + '		</div>'
			  + '		<a href="javascript:closeSSOSessionLayer();" class="dim_close" tabindex="95"><span class="hidden">'+closeDesc+'</span></a>'
			  + '	</div>'
			  + '</div>';
		
		$('.container').prepend(html);
	}
}

function sessionLayerCenter(id){
	var popYpos = Math.max(0, (($(window).height() - $('#'+id).find('.layer_pop').outerHeight())/2) + $(window).scrollTop());
	$('#'+id).find('.layer_pop').css('top', popYpos + "px");
}

//cookie를 가져온다
//존재하는 경우에 value값을 리턴
//존재하지 않는 경우에 undefined를 리턴
function getCookie(cName){
	var cookies = document.cookie;
	var splitCookies = cookies.split(';');
	for(var i=0;i<splitCookies.length;i++){
		if(splitCookies[i].indexOf(cName) > -1){
			var value = splitCookies[i].split('=')[1];
			return value;
		}
	}
}

// webview 여부
function getWebviewYn(){
	var appOsCd = getCookie('APP_OS_CD');
	if(appOsCd == 'I' || appOsCd == 'A'){
		return true;
	}else{
		return false;
	}
}

function closeWebview(){
	window.location	= 'ozmobile://closeWebview';
}