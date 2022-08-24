/**
 *
 */
var RequestUrl	  = $(location).attr('pathname');
var RequestUrlArr	= RequestUrl.split('/');
var countryCode		= RequestUrlArr[2].toUpperCase();
var languageCode	= RequestUrlArr[3].toUpperCase();

function fixIcon() {
  var scrollPos = $(window).scrollTop();
  var scrollBottom = $(document).height() - $(window).height() - scrollPos;

  if (scrollBottom <= 440) {
    $('.fix_corp').addClass('pos');
  } else {
    $('.fix_corp').removeClass('pos');
  }
}

$(window).load(function () {
  fixIcon();
  fixViewPort();
});

$(window).scroll(function () {
	fixIcon();
});
	
/* Loading Area */
//메인 페이지 로딩바 오픈
var loadingOpen = function loadingOpen(_type, _option , _testType) {
	var _scope, _scopeParents;
	if( _type == "area" ){
		_scope = $(_option);
		if( _scope.parents('.loading_wrap').length > 0 ){
			_scopeParents = _scope.parents('.loading_wrap');
		}else{
			_scope.wrap('<div class="loading_wrap" style="display:block;"></div>');
			_scopeParents = _scope.parents('.loading_wrap');
		};

		if( _testType == 'type1' ){
			_scopeParents.append('<section><span class="hidden">Loading</span><div class="loading_img"><img src="/C/pc/image/common/loading_1.gif"></div><div class="loader_ment">'+jsJSON.J9997+'</div></section>');//고객님을 위한<br>최저가 항공권을 찾고 있습니다.
		}else if( _testType == 'type2' ){
			_scopeParents.append('<section><span class="hidden">Loading</span><div class="loading_img"><img src="/C/pc/image/common/loading_1.gif"></div><div class="loader_ment">'+jsJSON.J9998+'</div></section>');//항공편을 열심히 찾고 있습니다.
		}else{
			_scopeParents.append('<section><span class="hidden">Loading</span><div class="loading_img"><img src="/C/pc/image/common/loading_1.gif"></div></section>');
		};

		var scopeParentsWid = _scopeParents.width();
		if( scopeParentsWid == 0 || scopeParentsWid == 1180 ){
			_scopeParents.css({'display':'block'});
		};

	}else if(  _type == "entire" ){
		_scope = $('#wrap');
		if( _option == "booking" ){
			_scope.prepend('<div class="loading_wrap type_full"><section><span class="hidden">Loading</span><div class="loading_img"><img src="/C/pc/image/common/loading_1.gif"></div><div class="loader_ment">'+jsJSON.J9999+'</div></section></div>');// J9999 : <p class="tit">처리 중입니다.</p>페이지를 새로 고치지 마시고,<br>잠시만 기다려주세요.
		}else{
			_scope.prepend('<div class="loading_wrap type_full"><section><span class="hidden">Loading</span><div class="loading_img"><img src="/C/pc/image/common/loading_1.gif"></div></section></div>');
		};
	};

	$('header, .summary_wrap, .util_wrap').addClass('load_type');	// loading dimm보다 zIndex값 상단으로
};

var loadingClose = function loadingClose(_type, _option) {
	if( _type == "area" ){
		_scope = $(_option);
		var _scopeParents = _scope.parents('.loading_wrap');
		if( _scopeParents.length > 0 ){
			_scopeParents.find('section').remove();
			_scope.unwrap();
		};
		//slide될 내용 불러온뒤 슬라이드 활성화
		//specialSlider();
	}else if( _type == "entire" ){
		_scope = $('#wrap');
		_scope.find('.loading_wrap').remove();
	};

	$('header, .summary_wrap, .util_wrap').removeClass('load_type');	// loading dimm보다 zIndex값 상단으로
};
/*//Loading Area */



////////////////마케팅 수신동의 START //////////////////


//마케팅 수신 동의 레이어 팝업
var marketingAgreementLayer = function marketingAgreementLayer(){
	
	//일주일간 팝업 보지 않기 쿠키가 발급되어 있음.
	if(!(typeof getCookie("marketringAgreement") == "undefined")){
		return;
	}
	
	//쿠키 체크
	
	//레이어팝업
	$.ajax({
		url: '/I/'+countryCode+'/'+languageCode+'/MarketingAgreementLayer.do',
		async: true,
		type : "post",
		dataType	: 'HTML',
		success: function(data) {
			
			//JSON 또는 HTML 형태로 값이 반환되므로 예외처리.
			try {
				//HTML일 경우
				data = $.parseJSON(data);
			}catch(e){
				//JSON일 경우
			}	
			if(data.result == "loginError"){
				var callType = 'IBE';
				var loc = location.href.split("/");
				var movePage = loc[loc.length-1];
				location.href = './viewLogin.do?callType=' + callType + '&movePage=' + movePage;
			}else if(data.result == "checked"){
				//둘 다 동의한 회원이므로 체크 안함.
			}else{
				$(".container").append(data);
				openLayerPopup('marketing_agree');
			}
		},
		error: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
		},
		complete: function() {
			checkSSOSessionExtension(true);
		}
	});
	
}

//마케팅 수신동의 레이어 팝업 일주일간 안보기
var setMarketingCookie = function setMarketingCookie(){
	if($('#todayClose').is(":checked")){
		setCookie("marketringAgreement", new Date(), 7);
	}
	$('#marketing_agree').find('.dim_close').trigger("click");
	//팝업 닫기
}

//마케팅 수신 동의 전송
var sendMarketingInfo = function sendMarketingInfo(Sms , Email){
	
	var sendInfo = {
			emailType : "",
			smsType : ""
	};

	if($("#marketing_email_agree").is(":visible")){
		sendInfo.emailType = ($("#marketing_email_agree").is(":checked"))? "0" : "9";
	}else{
		sendInfo.emailType = Email;
	}
	
	if($("#marketing_sms_agree").is(":visible")){
		sendInfo.smsType = ($("#marketing_sms_agree").is(":checked"))? "Y" : "N";
	}else{
		sendInfo.smsType = Sms;
	}
	$(".dim_close").trigger("click");	
	$.ajax({
		url: '/I/'+countryCode+'/'+languageCode+'/UpdateMarketringInfo.do',
		async: true,
		data : sendInfo,
		type : "post",
		dataType	: 'JSON',
		success: function(data) {
			try {
				//HTML일 경우
				data = $.parseJSON(data);
			}catch(e){
				//JSON일 경우
			}	
			if(data.result == "loginError"){
				var callType = 'IBE';
				var loc = location.href.split("/");
				var movePage = loc[loc.length-1];
				location.href = './viewLogin.do?callType=' + callType + '&movePage=' + movePage;
			}else{
				
			}
			
			// [AAM 온라인 할인쿠폰 개편 프로젝트] 마케팅 수신 동의 시 자동화 쿠폰 발송
			if(data.aamCouponFlagMarketing) {
				if(!getLsLayer("marketingCouponBanner")) {
					$("#marketingCouponBanner").css("display", "block");
				}
			}			
			if(data.aamCouponFlag) {
				if(!getLsLayer("favoriteRouteCouponBanner")) {
					$("#favoriteRouteCouponBanner").css("display", "block");
				}
			}
		},
		error: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
		},
		complete: function() {
			checkSSOSessionExtension(true);
		}
	});
}


//////////////// 마케팅 수신동의 END //////////////////

//Google Analysis 호출
var googleAnalysisAjax = function googleAnalysisAjax(flowName, jsonData){
	// 특정 flow에 대해서는 bookConditionData을 담아 던진다
	if("AVAI|FDCT".indexOf(flowName) >= 0){
		$.ajax({
			url		:'./googleAnalysisAjax.do',
			type	:'POST',
			dataType	: 'json',
			async   : true ,
			data	: {		
				flowName : flowName,
				bookConditionData : JSON.stringify(jsonData)
			},
			success	: function(digital){
				digitalData= JSON.parse(digital.digitalData);
			
				$.getScript("https://digital-analytics.amadeus.com/fastTrack/acc/GA_OZ_CBGDCBGD.js", function() {			    
			    });	
			}
		});
	} else if(typeof jsonData != 'undefined' && jsonData != null) {
		$.ajax({
			url		:'./googleAnalysisAjax.do',
			type	:'POST',
			dataType	: 'json',
			async   : true ,
			data	: {		
				flowName : flowName,
				PNRData : JSON.stringify(jsonData)
			},
			success	: function(digital){
				digitalData= JSON.parse(digital.digitalData);
			
				$.getScript("https://digital-analytics.amadeus.com/fastTrack/acc/GA_OZ_CBGDCBGD.js", function() {			    
			    });	
			}
		});
	}
}

//XSS 필터링 alert 작성
//notifyXSSMessage({pwd:"+1234aaa"})
var notifyXSSMessage = function notifyXSSMessage (params) {
	
	 // 기본값 설정
	  var options = {
		  email : "",
		  id :  "",
		  pwd : "",
		  firstName : "",
		  lastName : ""
	  };
	  
	  $.extend(options, params);

	
	var individualFilterList = [];
	individualFilterList.push("\'");
	individualFilterList.push("\"");
	individualFilterList.push(",");
	individualFilterList.push("<meta>");
	individualFilterList.push("<!--");
	individualFilterList.push("-->");
	individualFilterList.push("&");
	individualFilterList.push("%");
	individualFilterList.push("/*");
	individualFilterList.push("*/");
	individualFilterList.push("(");
	individualFilterList.push(")");
	individualFilterList.push("+");
	individualFilterList.push("<");
	individualFilterList.push(">");
	individualFilterList.push("%00");
	individualFilterList.push("script");
	individualFilterList.push("alert");
	individualFilterList.push("iframe");
	individualFilterList.push("eval");
	individualFilterList.push("expression");
	individualFilterList.push("vbscript");
	individualFilterList.push("onload");
	individualFilterList.push(".location");
	individualFilterList.push("Function");
	individualFilterList.push("Iframe");

	
	var commonFilterList = [];
	
	commonFilterList.push(";"); //ISMS 권고에 의한 ; 필터링
	commonFilterList.push("\'");
	commonFilterList.push("\"");
	commonFilterList.push(",");
	commonFilterList.push("<meta>");
	commonFilterList.push("<!--");
	commonFilterList.push("-->");
	commonFilterList.push("&");
	commonFilterList.push("%");
	commonFilterList.push("/*");
	commonFilterList.push("*/");
	commonFilterList.push("(");
	commonFilterList.push(")");
	commonFilterList.push("+");
	commonFilterList.push("<");
	commonFilterList.push(">");
	commonFilterList.push("%00");
	commonFilterList.push("window");
	commonFilterList.push(".location");
	commonFilterList.push("Function");
	commonFilterList.push("innerHTML");
	commonFilterList.push("javascript");
	commonFilterList.push("expression");
	commonFilterList.push("applet");
	commonFilterList.push("meta");
	commonFilterList.push("xml");
	commonFilterList.push("blink");
	commonFilterList.push("link");
	commonFilterList.push("style");
	commonFilterList.push("script");
	commonFilterList.push("embed");
	commonFilterList.push("object");
	commonFilterList.push("iframe");
	commonFilterList.push("frameset");
	commonFilterList.push("ilayer");
	commonFilterList.push("layer");
	commonFilterList.push("bgsound");
	commonFilterList.push("<title");
	commonFilterList.push("onbefore");
	commonFilterList.push("onmouseup");
	commonFilterList.push("onrowenter");
	commonFilterList.push("oncontextmenu");
	commonFilterList.push("eval");
	commonFilterList.push("charset");
	commonFilterList.push("string");
	commonFilterList.push("append");
	commonFilterList.push("binding");
	commonFilterList.push("alert");
	commonFilterList.push("msgbox");
	commonFilterList.push("refresh");
	commonFilterList.push("void");
	commonFilterList.push("cookie");
	commonFilterList.push("href");
	commonFilterList.push("onpaste");
	commonFilterList.push("onresize");
	commonFilterList.push("onselect");
	commonFilterList.push("onblur");
	commonFilterList.push("onstart");
	commonFilterList.push("onfocusin");
	commonFilterList.push("onhelp");
	commonFilterList.push("onmousewheel");
	commonFilterList.push("ondataava");
	commonFilterList.push("onafteripudate");
	commonFilterList.push("onmousedown");
	commonFilterList.push("onbeforeactivate");
	commonFilterList.push("onbeforecopy");
	commonFilterList.push("onbeforedeactivate");
	commonFilterList.push("ondatasetchaged");
	commonFilterList.push("cnbeforeprint");
	commonFilterList.push("cnbeforepaste");
	commonFilterList.push("onbeforeeditfocus");
	commonFilterList.push("onbeforeuload");
	commonFilterList.push("onbeforeupdate");
	commonFilterList.push("onpropertychange");
	commonFilterList.push("ondatasetcomplete");
	commonFilterList.push("oncellchange");
	commonFilterList.push("onlayoutcomplete");
	commonFilterList.push("onselectionchange");
	commonFilterList.push("onrowsinserted");
	commonFilterList.push("oncontrolselected");
	commonFilterList.push("onreadystatechange");
	commonFilterList.push("onactive");
	commonFilterList.push("oncut");
	commonFilterList.push("onclick");
	commonFilterList.push("onchange");
	commonFilterList.push("onbeforecut");
	commonFilterList.push("ondbclick");
	commonFilterList.push("ondeactivate");
	commonFilterList.push("ondrag");
	commonFilterList.push("ondragend");
	commonFilterList.push("ondragenter");
	commonFilterList.push("ondragleave");
	commonFilterList.push("ondragover");
	commonFilterList.push("ondragstart");
	commonFilterList.push("ondrop");
	commonFilterList.push("onerror");
	commonFilterList.push("onfinish");
	commonFilterList.push("onfocus");
	commonFilterList.push("vbscript");
	commonFilterList.push("onkeydown");
	commonFilterList.push("onrowsdelete");
	commonFilterList.push("onmouseleave");
	commonFilterList.push("onfocusout");
	commonFilterList.push("onkeyup");
	commonFilterList.push("onkeypress");
	commonFilterList.push("onload");
	commonFilterList.push("onbounce");
	commonFilterList.push("onmouseenter");
	commonFilterList.push("onmouseout");
	commonFilterList.push("onmouseover");
	commonFilterList.push("onsubmit");
	commonFilterList.push("onmouseend");
	commonFilterList.push("onresizestart");
	commonFilterList.push("onuload");
	commonFilterList.push("onselectstart");
	commonFilterList.push("onreset");
	commonFilterList.push("onmove");
	commonFilterList.push("onstop");
	commonFilterList.push("onrowexit");
	commonFilterList.push("onerrorupdate");
	commonFilterList.push("onfilterchage");
	commonFilterList.push("onlosecapture");
	commonFilterList.push("onmousemove");

	// ID
	for(var i=0; i<individualFilterList.length; i++){
		if(options.id.toLocaleLowerCase().indexOf(individualFilterList[i]) > -1){
			return false;
		}
	}

	for(var i=0; i<commonFilterList.length; i++){
		if(options.pwd.toLocaleLowerCase().indexOf(commonFilterList[i]) > -1){
			return false;
		}
	}

	//공통 이메일
	for(var i=0; i<individualFilterList.length; i++){
		if(options.email.toLocaleLowerCase().indexOf(individualFilterList[i]) > -1){
			return false;
		}
	}
	
	//공통 영문명
	for(var i=0; i<individualFilterList.length; i++){
		if(options.firstName.toLocaleLowerCase().indexOf(individualFilterList[i]) > -1 || 
				options.lastName.toLocaleLowerCase().indexOf(individualFilterList[i]) > -1){
			return false;
		}
	}
	
	return true;
};

var generateUUID = function generateUUID() {
	var d = new Date().getTime(),
		uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x7|0x8)).toString(16);
		});

	document.getElementById('sessionUniqueKey').value = uuid;
};


//SkyScanner 실적 Tracking 방식 변경 요청
var setCookie = function setCookie(name, value, expiredays) {
	var todayDate = new Date();
	todayDate.setDate(todayDate.getDate() + expiredays);
	document.cookie = name + "=" + value + "; path=/; expires=" + todayDate.toGMTString() + ";";
}

var getCookie = function getCookie(Name) {
	var search = Name + "=";
	if (document.cookie.length > 0) {
		offset = document.cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			end = document.cookie.indexOf(";", offset);
			if (end == -1) {
				end = document.cookie.length;
			}
			return unescape(document.cookie.substring(offset, end));
		}
	}
}

/**
 * kayakTracking : 세션쿠키, 카약 클릭 ID를 파라메터로 함께 관리하며 결제, 예약취소시 사용
 * deeplinkTracking : 플레이윙즈, SkyScanner 등 관리.
 * 요건 추가에 따라 데이터 형태가 상이하여 쿠키 분리하였음. 
 */
var deepLinkchk = function deepLinkchk(deeplink_id, kayak_Id){
	
	var isSalesTypeCk = false; //salesType이 쿠키의 값으로 셋팅된 경우 true
	
	//쿠키가 있을 경우 값 비교해서 bookConditionJSON 세팅
	if(typeof getCookie("deeplinkTracking") != "undefined"){
		var cooKieData = JSON.parse(getCookie("deeplinkTracking"));
		
		//다른 deeplink로 진입시 쿠키 삭제
		if(deeplink_id != "" && deeplink_id != cooKieData.deeplink_Id){
			setCookie("kayakTracking", "",-1);
			setCookie("deeplinkTracking", '', -1);
		}else{
			//딥링크 유입시 선택한 노선과 동일 노선으로 재방문하여 발권하는 경우만 실적(SkyScnner)
			var isMatch = true;
			
			if(cooKieData.deeplink_Id == "SkyScanner" || cooKieData.deeplink_Id == "skyscanner_ad" || cooKieData.deeplink_Id == "Playwings"){
				if(cooKieData.tripData){
					if(bookConditionJSON.segmentConditionDatas.length == cooKieData.tripData.length){
						for(var i=0; i<cooKieData.tripData.length; i++){
							
							//출도착지 체크
							if(bookConditionJSON.segmentConditionDatas[i].arrivalAirport != cooKieData.tripData[i].ARR){
								isMatch = false;
								break;
							}
							if(bookConditionJSON.segmentConditionDatas[i].departureAirport != cooKieData.tripData[i].DEP){
								isMatch = false;
								break;
							}
						}
					}
				}
			}else if(cooKieData.deeplink_Id == "playwingsDream" ||cooKieData.deeplink_Id == "playwingsSuper" || cooKieData.deeplink_Id == "playwingsTarget"){
				//노선비교 X
				isMatch = true;
			}else{
				isMatch = false;
			}
		}
		
		if(isMatch){
			bookConditionJSON.salesType = "deepLink";
			bookConditionJSON.bigEventSeqNo = 	cooKieData.deeplink_Id;
			bookConditionJSON.deepLinkDate = cooKieData.deepLinkDate;
			isSalesTypeCk = true;
		}
		
		//만약 쿠키가 이미 있는데 같은 deeplink에서 다른 노선으로 유입된 경우 쿠키 재발급
		if(deeplink_id == cooKieData.deeplink_Id && isMatch == false){
			setDeeplinkCookie(deeplink_id);
		}
	}	

	//쿠키 없는 경우 세팅
	//쿠키 없을 경우 쿠키 발급.
	if(typeof getCookie("deeplinkTracking") == "undefined" && typeof getCookie("kayakTracking") == "undefined" ){
		setDeeplinkCookie(deeplink_id);
	}
	
	//카약이 아닐 경우 카약 쿠키 삭제.
	if(typeof getCookie("kayakTracking") != "undefined"){
		if(deeplink_id != "" && deeplink_id != "Kayak"){
			setCookie("kayakTracking",'', -1);
		}
	}
	//카약 발급시 deeplinkTracking삭제
	 if(deeplink_id == "Kayak"){
		setCookie("deeplinkTracking",'', -1);
		setCookie("kayakTracking", kayak_Id);
	}
	
	return isSalesTypeCk;
}

var setDeeplinkCookie = function setDeeplinkCookie(deeplink_id) {
	
	
		//쿠키 발급 날자 기록하기
		var date = new Date();
		var year = date.getFullYear(); 
		var month = new String(date.getMonth()+1); 
		var day = new String(date.getDate()); 

		// 한자리수일 경우 0을 채워준다. 
		if(month.length == 1){ 
		  month = "0" + month; 
		} 
		if(day.length == 1){ 
		  day = "0" + day; 
		}
		
		if(deeplink_id == "Playwings" ||
				bookConditionJSON.bigEventSeqNo == "playwingsDream" ||
				bookConditionJSON.bigEventSeqNo == "playwingsSuper" || 
				bookConditionJSON.bigEventSeqNo == "playwingsTarget"){
			//Playwings 2차 deeplink 는 파라메터 형태로 전달되지 않아서  ${param.deeplink_id} 로 접근 불가. 별도세팅
			deeplink_id = bookConditionJSON.bigEventSeqNo;
		}

		var ckVal = {
				"deeplink_Id" : deeplink_id,
				"tripType" : bookConditionJSON.tripType,
				"domIntType" : bookConditionJSON.domIntType,
				"deepLinkDate" : year+""+month+""+day,
				"tripData" : []
		}
			
		for(var i=0; i<bookConditionJSON.segmentConditionDatas.length;i++){
			ckVal.tripData.push({
				"DEP" : bookConditionJSON.segmentConditionDatas[i].departureAirport,
				"ARR" : bookConditionJSON.segmentConditionDatas[i].arrivalAirport,
				"DEPTIME" : bookConditionJSON.segmentConditionDatas[i].departureDateTime
			});
		}
		bookConditionJSON.deepLinkDate = year+""+month+""+day;
		
		if(deeplink_id == "SkyScanner" || deeplink_id == "skyscanner_ad" ){
			setCookie("kayakTracking", "",-1);
			setCookie("deeplinkTracking",JSON.stringify(ckVal), 30);
		}else if(deeplink_id == "Playwings" || deeplink_id == "playwingsDream" || deeplink_id== "playwingsSuper" || deeplink_id == "playwingsTarget"){
			setCookie("kayakTracking", "",-1);
			setCookie("deeplinkTracking",JSON.stringify(ckVal), 2);
		}
}
//SkyScanner 실적 Tracking 방식 변경 요청  end  

/*
 * FareRuleIcons
 * seg별로 '/'로 구분하여 fareRuleCode, bookingClass, segData로 전달
 * ex) segData : GMP-CJU/CJU-GMP bookingClass : I/N fareRuleCode : KRJP1KS/KRJP1KS
 * */
var showFareRuleIcons = function showFareRuleIcons(fareRuleCode, bizType , bookingClass , domInt , segData , officeID, carrierCode) {

	$.ajax({
		url: 'FareRuleIcons.do',
		async: false,
		type : "post",
		data : {
			ruleCode : fareRuleCode,
			bizType : bizType,
			bookingClass : bookingClass,
			domInt : domInt,
			segData : segData,
			carrierCode : carrierCode,
			officeID : officeID
		},
		dataType	: 'JSON',
		success: function(data) {
			if(data != null && data.errorMessage) {
				alert(data.errorMessage);
				return;
			}
			
			setFareRuleIcons(data , segData);
		},
		error: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
		},
		complete: function() {
			checkSSOSessionExtension();
		}
	});
};

/*
 * FareRuleContents
 * seg별로 '/'로 구분하여 fareRuleCode, bookingClass, segData를 전달
 * ex) segData : GMP-CJU/CJU-GMP bookingClass : I/N fareRuleCode : KRJP1KS/KRJP1KS
 * seg별로 ','로 구분하여 segAirportName 전달 (REV, 국내선인 경우)
 * ex) segAirportName : 김포-제주,제주-김포
 * dynamicEl 국내선 seg별 운임규정 표출 구분 값 (segIndex 전달)
 * ex) dynamicEl = true인 경우 .rule_box 영역만 표출 / undefined인 경우 seg영역 표출
 * #fareRuleREV h4에 주어줘야할 id값
 * ex) <h4 id="fareRuleREV">운임조건 및 요금규정</h4>
 * */
var showFareRuleContents = function showFareRuleContents(fareRuleCode, bizType , bookingClass , domInt , segData , segAirportName, officeID, carrierCode , dynamicEl , promoCode) {

	$.ajax({
		url: 'FareRuleContent.do',
		async: false,
		type : "post",
		data : {
			ruleCode : fareRuleCode,
			promoCode : promoCode ,
			bizType : bizType,
			bookingClass : bookingClass,
			domInt : domInt,
			segData : segData,
			carrierCode : carrierCode,
			segAirportName : segAirportName,
			officeID : officeID,
			dynamicEl : dynamicEl
		},
		success: function(data) {
			var data = data.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&#40;/gi, '(').replace(/&#41;/gi, ')');
			if($("#fareRuleREV").length != 0 && typeof(dynamicEl) == 'undefined') {
				if ($('.emptyFareRule').length != 0 ) {
					$('.emptyFareRule').remove();
				}
				if ($('.Ruleexistence').length != 0) {
					$('.Ruleexistence').remove();
				}
				$("#fareRuleREV").after(data);
			} else if (data.indexOf('multiFareRule') > -1) {
				//다구간
				if ($('#multiFareRule').length == 0) {
					data = '<br>'+data;
					$('#multiFareRuleTitle').find('h4').after(data);
				}
			} else {
				if (typeof(dynamicEl) != 'undefined') {
					$(".rule_box:eq(" + dynamicEl + ")").html(data);
				} else {
					$(".rule_box").html(data);
				}
			}
			if ($("#fareRule").length == 0 && $('.emptyFareRule').length != 0) {
				$('.emptyFareRule').addClass('border3');
			}
		},
		error: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
		},
		complete: function() {
			checkSSOSessionExtension();
		}
	});
};

var showMultiFareRuleContents = function showMultiFareRuleContents(fareRuleCode, bizType , bookingClass , domInt , segData , carrierCode ,  depAirport , arrAirport , officeID , boardDate , cabinClass , fltno , acno) {
	$.ajax({
		url: 'FareRuleContent.do',
		async: false,
		type : "post",
		data : {
			ruleCode : fareRuleCode,
			bizType : bizType,
			bookingClass : bookingClass,
			domInt : domInt,
			segData : segData,
			depAirport : depAirport,
			arrAirport : arrAirport,
			officeID : officeID,
			boardDate : boardDate,
			cabinClass : cabinClass,
			fltno : fltno,
			carrierCode : carrierCode,
			acno : acno
		},
		success: function(data) {
			var data = data.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&#40;/gi, '(').replace(/&#41;/gi, ')');
			if($("#fareRuleREV").length != 0 && typeof(dynamicEl) == 'undefined') {
				if ($('.emptyFareRule').length != 0 ) {
					$('.emptyFareRule').remove();
				}
				if ($('.Ruleexistence').length != 0) {
					$('.Ruleexistence').remove();
				}
				$("#fareRuleREV").after(data);
			} else if (data.indexOf('multiFareRule') > -1) {
				//다구간
				if ($('#multiFareRule').length == 0) {
					$('#multiFareRuleTitle').after(data);
				}
			} else {
				if (typeof(dynamicEl) != 'undefined') {
					$(".rule_box:eq(" + dynamicEl + ")").html(data);
				} else {
					$(".rule_box").html(data);
				}
			}
			if ($("#fareRule").length == 0 && $('.emptyFareRule').length != 0) {
				$('.emptyFareRule').addClass('border3');
			}
		},
		error: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
		},
		complete: function() {
			checkSSOSessionExtension();
		}
	});
};

var showFareDetail = function showFareDetail(sessionUniqueKey, jsessionID) {
	if($('#fareDetail').length == 0) {
		$.ajax({
			url: 'FareDetail.do',
			async: true,
			type : "post",
			data : {
				sessionUniqueKey : sessionUniqueKey,
				jsessionID : jsessionID
			},
			beforeSend : function() {
				loadingOpen('entire', 'booking');
 			},
			success: function(data) {
				loadingClose('entire');
				if (data.indexOf("fareDetail") < 0) {
					alert(jsJSON.J0054);//온라인 운임규정 조회가 어렵습니다. 예약센터 혹은 지점으로 문의하여 주시기바랍니다.
				} else {
					$(".container").append(data);
					openLayerPopup('fareDetail');
				}
			},
			error: function(data) {
				loadingClose('entire');
				alert(JSON.parse(data.responseText).exceptionInfo.message);
			},
			complete: function() {
				checkSSOSessionExtension();
			}
		});
	}else{
		openLayerPopup('fareDetail');
	}
};

//eticket레이어
var sendEticketMail = function sendEticketMail(ticketNo, paxName, bizType, domInt, sessionUniqueKey) {

	if(!document.getElementById('travelEmail')){
		$.ajax({
			url: 'OpenEticketLayer.do',
			async: true,
			type : "post",
			data : {
				ticketNo : ticketNo,
				paxName : paxName,
				bizType : bizType,
				domInt : domInt,
				sessionUniqueKey : sessionUniqueKey
			},
			dataType	: 'html',
			success: function(data) {
				$(".container").append(data);
				openLayerPopup('travelEmail','btn_travelEmail_'+ticketNo);
			},
			error: function(data) {
				alert(JSON.parse(data.responseText).exceptionInfo.message);
			},
			complete: function() {
				checkSSOSessionExtension();
			}
		});
	} else {
		openLayerPopup('travelEmail','btn_travelEmail_'+ticketNo);
		$("#eticketName").text(paxName)
						 .attr("name", paxName);
		$("#eticketTKNo").text(ticketNo)
						 .attr("number", ticketNo);
	}

};

function isEmailFormat(address){
	var format = /^[0-9a-zA-Z]([0-9a-zA-Z-_\.])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i; 
	var val = address;

	// 위의 조건을 만족하려면 최소 6자 이상이어야 함.
	if(val.length < 6 || !format.test(val)) {
		alert(jsJSON.J0200);// 메일형식이 맞지 않습니다. 다시 입력해주세요.
		$("#eticketEmail").focus();
		return false;
	}

	return true;
}

// eticket 발송
var sendEticket = function sendEticket(bizType, sessionUniqueKey) {
	var ticektNo	= $("#eticketTKNo").attr("number");
	var paxName		= $("#eticketName").attr("name");
	var address		= $("#eticketEmail").val();
	var eLanguage	= $("#eticketlanguage").val();

	if(!isEmailFormat(address)){
		return false;
	}
	if(eLanguage == ""){
		alert(jsJSON.J0201);// 언어를 선택해주세요.
		$("#eticketlanguage").focus();
		return false;
	}

	//false 일 경우 return
	if(!notifyXSSMessage({
		uri : "DataEncryption.do",
		email : address
		})){
		alert(jsJSON.J3001);
		return false;
	};
	
	$.ajax({
		async	: false,
		url		: "DataEncryption.do",
		type	: "post",
		dataType: "json",
		data	: {
			ticketNo : ticektNo,
			paxName : paxName,
			address : address,
			languageCode : eLanguage
		},
		beforeSend	: function() {
			loadingOpen('entire', 'booking');
		},
		success		: function(data) {
			loadingClose('entire');
			var infoData = data.DATAENCRYPT;

			$.ajax({
				url		: 'SendEmail.do',
				async	: true,
				type 	: "post",
				dataType: 'JSON',
				data	: {
					infoData : infoData,
					bizType : bizType,
					sessionUniqueKey : sessionUniqueKey
				},
				beforeSend	: function() {
					loadingOpen('entire', 'booking');
				},
				success		: function(data) {
					loadingClose('entire');
					if (data.RESULT == "S") {
						alert(jsJSON.J5000);//이메일이 발송 되었습니다.
					} else {
						alert(jsJSON.J0058);//실패
					}
					$("#travelEmail").find('.dim_close').trigger('click');
				},
				error		: function(data) {
					loadingClose('entire');
					alert(jsJSON.J0426);// 오류가 발생하였습니다.
				}
			});

		},
		error: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
			return false;
		},
		complete: function() {
			checkSSOSessionExtension();
		}
	});
};

//Kakao Emoticon 쿠폰 발급 관련 연락처 입력 Layer 오픈
var openKKOCouponLayer = function openKKOCouponLayer(eventId, epnrNo, npnrNo, bizType, domInt, acno, sessionUniqueKey) {

	if(!document.getElementById('KKOCouponLayer')){
		$.ajax({
			url: 'OpenKKOCouponLayer.do',
			async: true,
			type : "post",
			data : {
				eventId : eventId,
				epnrNo : epnrNo,
				npnrNo : npnrNo,
				bizType : bizType,
				domInt : domInt,
				acno : acno,
				sessionUniqueKey : sessionUniqueKey
			},
			dataType	: 'html',
			success: function(data) {
				$(".container").append(data);
				openLayerPopup('KKOCouponLayer');
			},
			error: function(data) {
				alert(JSON.parse(data.responseText).exceptionInfo.message);
			},
			complete: function() {
				checkSSOSessionExtension();
			}
		});
	} else {
		openLayerPopup('KKOCouponLayer');
	}

}

function isContactFormat(contactNo){
	var format  = /^[0-9]*$/;
	var val = contactNo;

	// 위의 조건을 만족하려면 최소 10자 이상이어야 함.
	if(val.length >= 10 && val.length <= 13 && format.test(val)) {
		return true;
	} else {
		alert(jsJSON.J0620);// 핸드폰 번호 형식이 맞지 않습니다. 다시 입력해주세요.
		$("#contactNo").focus();
		return false;
	}
}

var sendKKOCouponInfo = function sendKKOCouponInfo(sessionUniqueKey) {
	var eventId		= $("#eventInfo").attr("eventId");
	var epnrNo		= $("#eventInfo").attr("epnrNo");
	var npnrNo		= $("#eventInfo").attr("npnrNo");
	var bizType		= $("#eventInfo").attr("bizType");
	var domIntType	= $("#eventInfo").attr("domIntType");
	var acno		= $("#eventInfo").attr("acno");
	var langType	= $("#eventInfo").attr("langType");
	var contactNo	= $("#contactNo").val();

	if(!isContactFormat(contactNo)){
		return false;
	}
	if(acno == "") {
		acno = "-";
	}
	/*
	//false 일 경우 return
	if(!notifyXSSMessage({
		uri : "SMSDataEncryption.do",
		email : address
		})){
		alert(jsJSON.J3001);
		return false;
	};
*/
	$.ajax({
		async	: false,
		url		: "SMSDataEncryption.do",
		type	: "post",
		dataType: "json",
		data	: {
			eventId 	: eventId,
			epnrNo 		: epnrNo,
			npnrNo 		: npnrNo,
			bizType 	: bizType,
			domIntType 	: domIntType,
			acno	 	: acno,
			contactNo 	: contactNo,
			langType 	: langType
		},
		beforeSend	: function() {
			loadingOpen('entire', 'booking');
		},
		success		: function(data) {
			loadingClose('entire');
			var infoData = data.DATAENCRYPT;

			$.ajax({
				url		: 'SendKakaoCoupon.do',
				async	: true,
				type 	: "post",
				dataType: 'JSON',
				data	: {
					infoData : infoData,
					sessionUniqueKey : sessionUniqueKey
				},
				beforeSend	: function() {
					loadingOpen('entire', 'booking');
				},
				success		: function(data) {
					loadingClose('entire');
					if (data.RESULT == "S") {
						alert(jsJSON.J0618);/* J0618 : 쿠폰이 발송되었습니다.  */
					} else {
						alert(jsJSON.J0619);/* J0619 : 쿠폰 발송시 오류로 전송이 실패하였습니다.  */
					}
					$("#KKOCouponLayer").find('.dim_close').trigger('click');
				},
				error		: function(data) {
					loadingClose('entire');
					alert(JSON.parse(data.responseText).exceptionInfo.message);
				}
			});

		},
		error: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
			return false;
		},
		complete: function() {
			checkSSOSessionExtension(true);
		}
	});
};

// 카카오 이모티콘 발송 버튼
$(document).on('click', '[id^=btn_KKOCouponBtn_]', function(){
	var eventId = $(this).attr("eventId"); 
	var epnrNo = $(this).attr("epnrNo");
	var npnrNo = $(this).attr("npnrNo");
	var bizType = $(this).attr("bizType");
	var domIntType = $(this).attr("domIntType");
	var acno = $(this).attr("acno");
	var sessionUniqueKey = $(this).attr("sessionUniqueKey");
	
	openKKOCouponLayer(eventId, epnrNo, npnrNo, bizType , domIntType, acno, sessionUniqueKey);
});

var checkTurnAround = function checkTurnAround(pnrDataJSON) {
	if(typeof pnrDataJSON == 'undefined' ||typeof pnrDataJSON.segmentDatas == 'undefined' || pnrDataJSON.domIntType !='I' || pnrDataJSON.bizType != 'REV') {
		return false;
	}
	var segmentJSON = pnrDataJSON.segmentDatas; 
	// GMP-NGS 국지비행의 경우, 특정 팝업 출력
	for(var i=0; i<segmentJSON.length; i++) {
		var flightInfos = segmentJSON[i].flightInfoDatas;
		for(var j=0; j<flightInfos.length; j++) {
			var flightNo = flightInfos[j].flightNo;

			if("1564".indexOf(flightNo)>=0) {
				return true;
			}
		}
	}
	return false;
}

var upgradeStanbyPopup = function upgradeStanbyPopup(pnrDataJSON) {
	var isUPSP = false;
//	var currentTime = getCurrentTime();
//	
//	if(typeof pnrDataJSON == 'undefined' ||typeof pnrDataJSON.segmentDatas == 'undefined' || pnrDataJSON.domIntType !='I' || pnrDataJSON.bizType != 'REV') {
//		return false;
//	}
//	
//	var segmentJSON = pnrDataJSON.segmentDatas; 
//	
//	// 국지비행의 경우, 해당 팝업을 띄우지 않는다. 
//	for(var i=0; i<segmentJSON.length; i++) {
//		var flightInfos = segmentJSON[i].flightInfoDatas;
//		for(var j=0; j<flightInfos.length; j++) {
//			var flightNo = flightInfos[j].flightNo;
//			
//			if("1588|1581|1664|1564".indexOf(flightNo)>=0) {
//				return false;
//			}
//		}
//	}
//	
//	for(var i=0; i<segmentJSON.length; i++) {
//		var flightInfos = segmentJSON[i].flightInfoDatas;
//		for(var j=0; j<flightInfos.length; j++) {
//        	var arrAirport 	= flightInfos[j].arrivalAirport;
//        	var depAirport 	= flightInfos[j].departureAirport;
//        	var arrCountry 	= flightInfos[j].arrivalCountry;
//        	var depCountry 	= flightInfos[j].departureCountry;
//        	var depDateTime = flightInfos[j].departureDate;
//        	/* 36324 업그레이드 스텐바이 전 노선 허용
//        	 * if(arrAirport.match(/^FUK|SDJ|KMI|OKA|CTS|TPE|HKG|MNL|HKT|CEB|CRK|ROR|SYD$/) || depAirport.match(/^FUK|SDJ|KMI|OKA|CTS|TPE|HKG|MNL|HKT|CEB|CRK|ROR|SYD$/)
//        	|| arrCountry.match(/^CN$/) || depCountry.match(/^CN$/) ){*/
//        		
//        		var diffTime = getDifferentTime(currentTime, depDateTime, 'HOUR')
//    			if(diffTime >= 24 && diffTime < 92) {
//    				isUPSP = true;
//    				return isUPSP;
//    			}
//        	/*}*/
//		}	
//	}
	
	return isUPSP;
};

//출/도착지 object
var autocompleteObject = function autocompleteObject() {
	area		= '';
	areaName	= '';
	country		= '';
	countryName	= '';
	airport		= '';
	airportName	= '';
	cityName	= '';
	label		= '';
};

/*
* 출/도착지 정보 조회(default 설정 및 autocomplete event 구성)
* 00. airportACData		: autocomplete set object
* 01. seg				: dep1, arr1, dep2, arr2, ... 구분
* 02. bizType			: REV / RED 구분
* 03. depArrType		: 출도착지 구분
* 04. depAirport		: 출발지 선택했을 경우 set, default = ''
* 05. depArea			: 출발지역
* 06. tripType			: 여정 구분 (RT || OW || MT)
* 07. prevSegDepArea	: 다구간일 경우 이전 여정 출발지역
* 08. prevSegArrArea	: 다구간일 경우 이전 여정 도착지역
* 09. directNLength		: 다구간일 경우 미취항지 도착지 개수
* 10. areaLength		: 다구간일 경우 대노선 개수
* 11. uniqueAreas		: 다구간일 경우 특정 대노선
* 12. exceptAreas		: 다구간일 경우 제외되는 특정 대노선
* 13. uniqueAirport		: 다구간일 경우 특정 공항
* 14. onlyArea			: 여정변경 시 기선택된 도시가 포함된 동일 대노선만 선택 가능
* 15. allYn				: 모든 노선 (Y) 사용여부와 상관없이 가져올때 사용
* */
var loadAirportInfo = function loadAirportInfo(airportACData, seg, bizType, depArrType, depAirport, depArea, tripType, prevSegDepArea, prevSegArrArea, directNLength, areaLength, uniqueAreas, exceptAreas, uniqueAirport, onlyArea, allYn) {

	var cityAirportDatas = [],
		uniqueCityAirportDatas = [];

	var domIntType = "";
	if(RequestUrlArr[4].indexOf('Change.do') > 0 ){
		domIntType = jsonOldPnrData.domIntType;
	}

	$.ajax({
		async: true,
		url: 'AreaAirportInfo.do',
		type: "post",
		data: {
			seg				: seg,
			bizType			: bizType,
			depArrType		: depArrType,
			depAirport		: depAirport,
			depArea			: depArea,
			tripType		: tripType,
			prevSegDepArea	: prevSegDepArea,
			prevSegArrArea	: prevSegArrArea,
			directNLength	: directNLength,
			areaLength		: areaLength,
			uniqueAreas		: uniqueAreas == '' ? '' : JSON.stringify(uniqueAreas),
			exceptAreas		: exceptAreas == '' ? '' : JSON.stringify(exceptAreas),
			uniqueAirport	: uniqueAirport == '' ? '' : JSON.stringify(uniqueAirport),
			onlyArea		: onlyArea,
			domIntType		: domIntType,
			allYn			: allYn
		},
		dataType: 'json',
		success: function(data) {

			var idx = 0,
				i = 0,
				rLength = data.RouteCityAirportData.length;

			while(i<rLength) {
				var routeCityAirportData = data.RouteCityAirportData[i],
					j = 0,
					cLength = routeCityAirportData.cityAirportDatas.length;

				while(j<cLength) {
					var cityAirportData = routeCityAirportData.cityAirportDatas[j];

					var obj = new autocompleteObject();
					obj.area		= routeCityAirportData.area;
					obj.areaName	= routeCityAirportData.areaName;
					obj.mgtArea		= cityAirportData.mgtArea;
					obj.airport		= cityAirportData.airport;
					obj.airportName	= cityAirportData.airportName;
					obj.city		= cityAirportData.city;
					obj.cityName	= cityAirportData.cityName;
					obj.countryName = cityAirportData.countryName;
					obj.state		= cityAirportData.state;
					obj.direct		= cityAirportData.direct;
					obj.label		= cityAirportData.label.replace(/[\/ ]/gi, '').replace(/_/gi, ' ');

					cityAirportDatas[idx] = obj;

					j++;
					idx++;
				};

				i++;
			};

			var tempAirport = [];
			for(var i = 0; i < cityAirportDatas.length; i++) {
				var item = cityAirportDatas[i];

				if($.inArray(item.airport, tempAirport) == -1) {
					uniqueCityAirportDatas.push(item);
					tempAirport.push(item['airport']);
				}else {
					continue;
				}
			}

			$(document).data(seg + 'AreaAirportData', JSON.stringify(data.RouteCityAirportData));
			if('RevenueRegistTravel.do' == RequestUrlArr[4] || 'RedemptionRegistTravel.do' == RequestUrlArr[4] || 'DefaultFlightDepartureSearch.do' == RequestUrlArr[4] || 'RetrieveFlightSchedule.do' == RequestUrlArr[4] || 'LowerPriceSearchList.do' == RequestUrlArr[4]) {
				if(switching) {
					$(document).data('switchingAirportData', JSON.stringify(data.RouteCityAirportData));
					switchingValidation();
				}
			}
		},
		error: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
		},
		complete: function() {
			checkSSOSessionExtension();
		}
	}).done(function() {
		if(typeof airportACData != 'undefined') {
			autoCompleteAirport(airportACData, uniqueCityAirportDatas);
		}
		if(typeof callBackFunctionE != 'undefined' && typeof depArrType != 'undefined' && depArrType != '' && depArrType.toUpperCase() == 'DEP') {
			callBackFunctionE();
		}
	});

};

/*
* 출도착 조회 전용(default 설정 및 autocomplete event 구성)
* 00. airportACData		: autocomplete set object
* 01. seg				: dep1, arr1, dep2, arr2, ... 구분
* 02. depArrType		: 출도착지 구분
* 03. depAirport		: 출발지 선택했을 경우 set, default = ''
* */
var loadFlightArrivalDepartureInfo = function loadFlightArrivalDepartureInfo(airportACData, seg, depArrType, depAirport) {
	var cityAirportDatas = [],
		uniqueCityAirportDatas = [];
	
	$.ajax({
		async: true,
		url: 'flightArrivalDepartureInfo.do',
		type: "post",
		data: {
			seg				: seg,
			depArrType		: depArrType,
			depAirport		: depAirport
		},
		dataType: 'json',
		success: function(data) {
	
			var idx = 0,
				i = 0,
				rLength = data.RouteCityAirportData.length;
	
			while(i<rLength) {
				var routeCityAirportData = data.RouteCityAirportData[i],
					j = 0,
					cLength = routeCityAirportData.cityAirportDatas.length;
	
				while(j<cLength) {
					var cityAirportData = routeCityAirportData.cityAirportDatas[j];
	
					var obj = new autocompleteObject();
					obj.area		= routeCityAirportData.area;
					obj.areaName	= routeCityAirportData.areaName;
					obj.mgtArea		= cityAirportData.mgtArea;
					obj.airport		= cityAirportData.airport;
					obj.airportName	= cityAirportData.airportName;
					obj.city		= cityAirportData.city;
					obj.cityName	= cityAirportData.cityName;
					obj.countryName = cityAirportData.countryName;
					obj.state		= cityAirportData.state;
					obj.direct		= cityAirportData.direct;
					obj.label		= cityAirportData.label.replace(/[\/ ]/gi, '').replace(/_/gi, ' ');
	
					cityAirportDatas[idx] = obj;
	
					j++;
					idx++;
				};
	
				i++;
			};
	
			var tempAirport = [];
			for(var i = 0; i < cityAirportDatas.length; i++) {
				var item = cityAirportDatas[i];
	
				if($.inArray(item.airport, tempAirport) == -1) {
					uniqueCityAirportDatas.push(item);
					tempAirport.push(item['airport']);
				}else {
					continue;
				}
			}
	
			$(document).data(seg + 'AreaAirportData', JSON.stringify(data.RouteCityAirportData));
			if(switching) {
				$(document).data('switchingAirportData', JSON.stringify(data.RouteCityAirportData));
				switchingValidation();
			}
		},
		error: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
		},
		complete: function() {
			checkSSOSessionExtension();
		}
	}).done(function() {
		if(typeof airportACData != 'undefined') {
			autoCompleteAirport(airportACData, uniqueCityAirportDatas);
		}
	});
};

/*
* 출/도착지 자동완성
* 00. airportACData : 자동 완성 data attr
*							{txtAirportId		: 자동 완성 target txt,
*							 divAirportACId		: 자동 완성 목록 노출 div,
*							 hidAirportId		: 자동 완성 결과 클릭 시 저장될 hidden txt airport id,
*							 hidAirportNameId	: 자동 완성 결과 클릭 시 저장될 hidden txt airportName id,
*							 hidAreaId			: 자동 완성 결과 클릭 시 저장될 hidden txt area id,
*							 hidCityId			: 자동 완성 결과 클릭 시 저장될 hidden txt city id,
*							 hidCityNameId		: 자동 완성 결과 클릭 시 저장될 hidden txt cityName id,
*							 hidDirectId		: 자동 완성 결과 클릭 시 저장될 hidden txt direct id,
*							 targetLabel		: 자동 완성 결과 클릭 시 노출될 label id
*							 targetInput		: 자동 완성 결과 클릭 시 포커스될 input id}
* 01. sourceDatas : 자동 완성 source
* */
var autoCompleteAirport = function autoCompleteAirport(airportACData, sourceDatas) {

	var select = false;
	$('#'+airportACData.txtAirportId).autocomplete({
		appendTo : '#' + airportACData.divAirportACId,
		autoFocus: false,
		delay: 0,
		minLength: 1,
		source: sourceDatas,
		close: function() {
			$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
			$(this).autocomplete('widget').find('li').remove();
			$('.search_auto').find('.empty_box').show();

			if(select) {
				layerAllClose();
				if(typeof airportACData.targetInput != 'undefined'){
					if(document.getElementById(airportACData.targetLabel)){ // 여정선택화면
						$('#'+airportACData.targetInput).focus();
					}else {
						$('#'+airportACData.txtAirportId).blur();
						setTimeout(function() {
							$('#'+airportACData.targetInput).focus();
						}, 1);
					}
				}else{
					$('#'+airportACData.txtAirportId).blur();
				}
			}
			select = false;
		},
		open: function(event, ui) {
			$('ul[id^=ui-id]').css("width", "");
			$('ul[id^=ui-id]').css("top", "");
			$('ul[id^=ui-id]').css("left", "");
			$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
		},
		select: function(event, ui) {

			// 출/도착지 자동 완성 결과 클릭시 값 저장
			if(ui.item) {
				var airport = ui.item.airport,
				airportName = ui.item.airportName;

				if(document.getElementById(airportACData.targetLabel)){ // 여정선택화면
					if(airportACData.targetLabel.indexOf('_lower') > -1){
						$('#'+airportACData.targetLabel).html('<span class="hidden">'+airport+' '+airportName+'</span>');
						$('#'+airportACData.txtAirportId).attr("placeholder",airport+' '+airportName);
						$('#'+airportACData.airportNameId).val(airportName);
					}else if(airportACData.targetLabel.indexOf('_favorite') > -1){
						$('#'+airportACData.targetLabel).html('<span class="hidden">'+airport+' '+airportName+'</span>');
						$('#'+airportACData.txtAirportId).attr("placeholder",airport+' '+airportName);
						$('#'+airportACData.airportNameId).val(airportName);
					}else {
						if(airportACData.targetLabel.indexOf('Dep') > -1) {
							$('#'+airportACData.targetLabel).html('<span class="hidden">'+jsJSON.J0005+'</span><p>'+airport+'</p><span>'+airportName+'</span>');
						}else {
							$('#'+airportACData.targetLabel).html('<span class="hidden">'+jsJSON.J0006+'</span><p>'+airport+'</p><span>'+airportName+'</span>');
						}
					}
				}else{
					$('#'+airportACData.txtAirportId).attr('placeholder', airport + ' ' + airportName);
				}

				$('#'+airportACData.hidAreaId).val(ui.item.mgtArea);
				$('#'+airportACData.hidAirportId).val(ui.item.airport);
				$('#'+airportACData.hidAirportNameId).val(ui.item.airportName);
				$('#'+airportACData.hidCityId).val(ui.item.city);
				$('#'+airportACData.hidCityNameId).val(ui.item.cityName);
				$('#'+airportACData.hidDirectId).val(ui.item.direct);
				$('#'+airportACData.hidAirportId).trigger('textchange');

				select = true;

			}
			
		},
		focus: function(event, ui) {
			return false;
		}
	}).focusout(function(event, ui) {
		$(this).val('');
		$(this).prev().css('opacity', '1');
		//$(this).next().next().next().find('div[name=search_auto] > ul').children().remove();
	}).keypress(function(event, ui) {
		var key = event.which || event.keyCode;
		if(key == 27) { // ESC Key
			$(this).val('');
		}else if(key == 13) { // ENTER Key
			if($(this).autocomplete('widget').find('li').length == 1) {
				event.preventDefault();
				$(this).autocomplete('widget').find('li').click();
				return false;
			}
		}
	}).autocomplete('instance')._renderItem = function(ul, item) {
		$('span[aria-live="assertive"]').remove();
		$('div[name=search_auto]').find('div[name=empty_box]').hide();

    	if(navigator.userAgent.indexOf('Firefox') > -1) {
	        var targetId = ul.parent().attr('target'),
	        	target = $('#'+targetId);

	    	if(isKoreanChar(target.val())) {
	    		var $inner = ul.closest('.inner');
	    		$inner.find('div[name=search_lately]').hide();
	    		$inner.find('div[name=search_auto]').show();
	    	}
        }

    	var label,
			airportNames,
			airportName;

		if(item.airportName != null) {
			airportNames = item.airportName.replace(/ /gi, "").split('/');
			airportName = airportNames[0] + airportNames[1];
		}

		if(item.label.indexOf(airportName) > -1 && item.mgtArea != 'US') {
			label = item.label.replace(airportName, airportNames[0]+'-'+airportNames[1]);
		}else if(item.mgtArea == 'US') {
			label = item.label.replace(item.state, '-'+item.state);
		}else {
			label = item.label.replace(item.cityName, item.cityName);
		}
		
		label = label.replace(item.airport, '-'+item.airport);
		
		// airport code 이후의 내용은 영문 공항명으로 화면에는 표출시키지 않음.
		label = label.substr(0, label.indexOf(item.airport) + item.airport.length);

		var lowerLabel = label.toLowerCase();
		var length = lowerLabel.match(/-/g).length;
		var tempTerm = this.term;
		
		if(tempTerm.indexOf('[') > -1) {
			tempTerm = tempTerm.replace(/\[/, '\\[');
		}
		
		var insertFIndex = lowerLabel.search(tempTerm.toLowerCase());
		
		if(insertFIndex > -1) {
			var insertLIndex = insertFIndex + this.term.length;
			
			label = label.substr(0, insertLIndex) + '</span>' + label.substr(insertLIndex);
			label = label.substr(0, insertFIndex) + '<span class="search_text">' + label.substr(insertFIndex);
			
			if(length == 3) {
				label = label.replace(/-/, '#').replace(/-/, '<span class="airport">').replace(/-/, '</span><var>').replace(/#/, '-');
			}else if(length == 2) {
				label = label.replace(/-/, '<span class="airport">').replace(/-/, '</span><var>');
			}else if(length == 1) {
				label = label.replace(/-/, '<var>');
			}
			
			label = label + '</var>';
		}else {
			if(length == 3) {
				label = label.replace(/-/, '#').replace(/-/, '<span class="airport">').replace(/-/, '</span><var>').replace(/#/, '-');
			}else if(length == 2) {
				label = label.replace(/-/, '<span class="airport">').replace(/-/, '</span><var>');
			}else if(length == 1) {
				label = label.replace(/-/, '<var>');
			}
			
			label = label + '</var>';
		}

    	var $li	= $('<li/>').appendTo(ul);

        $('<a/>').attr('href', '#none').html(label).appendTo($li);

        return $li;
	};

};

var isKoreanChar = function isKoreanChar(ch) {
	var c = ch.charCodeAt(0);
	if(0x1100 <= c && c <= 0x11FF) {
		return true;
	}
	if(0x3130 <= c && c <= 0x318F) {
		return true;
	}
	if(0xAC00 <= c && c <= 0xD7A3) {
		return true;
	}
	return false;
};

/*
* 최근 검색 list 그리기
* 00. target : focusin 된 input target
* */
var setMgtArea = false;
var drawSearchLately = function drawSearchLately(target){

	var $this = target;
	var tripType = $('#tripType').val();
	var depArrType = $this.attr('depArrType');
	var $searchLately = $this.next().next().next().find('div[name=search_lately]'),
	$children = $searchLately.children(),
	html = [];

	if(RequestUrlArr[4].indexOf('FlightsSelect.do') > -1) {
		tripType = bookConditionJSON.tripType;
		$searchLately = $this.parent().next().find('.search_lately');
		$children = $searchLately.children();
	}

	for(var i=1; i<$children.length+1; i++){
		$children.eq(i).replaceWith('');
	}

	// 최근검색은 최대 10개저장, 가장 최근 데이터로 3개만 노출시킨다. 레드마인 #5839
	function draw(lsKey) {

		var currentDate = getCurrentDate(),
			searchLatelyDatas = JSON.parse(localStorage.getItem(lsKey)),
			tempSearchLatelyDatas = [],
			sLength = searchLatelyDatas.length,
			hIdx = 0,
			cLength = 0,
			arrowCls;
		
		if(!setMgtArea) {
			if('dep' == depArrType && sLength > 0) {
				$.ajax({
					async: false,
					url: './getSearchLatelyMgtArea.do',
					type: 'post',
					data: {
						bizType				: $('#bizType').val() == '' ? 'REV' : $('#bizType').val(),
								searchLatelyDatas	: JSON.stringify(searchLatelyDatas)
					},
					dataType: 'json',
					success: function(data) {
						if(data != null && data.errorMessage) {
							alert(data.errorMessage);
							loadingClose('entire');
							return;
						}
						
						setMgtArea = true;
						searchLatelyDatas = data.result;
						localStorage.setItem(lsKey, JSON.stringify(searchLatelyDatas));
					},
					error: function(data) {
						alert(JSON.parse(data.responseText).exceptionInfo.message);
					},
					complete: function() {
						checkSSOSessionExtension();
					}
				});
			}
		}

		for(var i=sLength-1; i>=0; i--) {
			var searchLatelyData = searchLatelyDatas[i];

			if(Number(searchLatelyData.departureDateTime.substring(0, 8)) >= Number(currentDate)) {

				tempSearchLatelyDatas.push(searchLatelyData);

				// 오는편일 경우 가는편의 공항과 일치하는 경우만
				if(depArrType == 'arr'){
					var $thisDepAirport = $('#departureAirport1');

					if(RequestUrlArr[4].indexOf('FlightsSelect.do') > -1) {
						$thisDepAirport = $this.parent().prev().prev().children().eq(1);
					}
					if($thisDepAirport.val() != searchLatelyData.departureAirport){
						if(i == (sLength-1)){
							html[hIdx] = '<ul>';
						}else if(i == 0){
							html[hIdx] = '</ul>';
						}else{
							html[hIdx] = '';
						}
						hIdx++;
						continue;
					}
				}

				arrowCls = '';
				if('RT' == tripType) {
					arrowCls = 'return';
				}

				html[hIdx] =	'<li class="'+arrowCls+'" val="'+searchLatelyData.departureArea+','+searchLatelyData.departureAirportName+','+
								searchLatelyData.departureAirport+','+searchLatelyData.departureCity+','+searchLatelyData.departureCityName+
								'-'+searchLatelyData.arrivalArea+','+searchLatelyData.arrivalAirportName+','+
								searchLatelyData.arrivalAirport+','+searchLatelyData.arrivalCity+','+searchLatelyData.arrivalCityName+','+searchLatelyData.direct+
									'-'+searchLatelyData.departureDateTime+','+searchLatelyData.arrivalDateTime+','+searchLatelyData.adultCnt+','+searchLatelyData.childCnt+','+searchLatelyData.infantCnt+'" data-itinerary="'+searchLatelyData.itinerary+'">' +
								'<a href="#none">' +
									'<span>'+searchLatelyData.departureAirportName+'<var>'+searchLatelyData.departureAirport+'</var></span>' +
									'<span>'+searchLatelyData.arrivalAirportName+'<var>'+searchLatelyData.arrivalAirport+'</var></span>' +
								'</a>' +
									'<button type="button" class="btn_detlete" name="btn_delete" onclick="javascript:deleteSearchLatelyData(this, \''+lsKey+'\', \''+searchLatelyData.itinerary+'\', \''+depArrType+'\');"><span class="hidden">'+jsJSON.J0101+'</span></button>' +//삭제
								'</li>';

				cLength++;

				// start idx
				if(i == (sLength-1)) {
					var temlHtml = html[hIdx];
					html[hIdx] = '<ul>' + temlHtml;

					// end idx
				}else if(i == 0) {
					html[hIdx] += '</ul>';
				}
			}
			
			if(cLength == 3) {
				break;
			}
			
			hIdx++;
		}

		/*if(tempSearchLatelyDatas.length > 0) {
			localStorage.setItem(lsKey, JSON.stringify(tempSearchLatelyDatas));
		}else {
			localStorage.removeItem(lsKey);
		}*/

	};

	var lsKey;
	if('RT' == tripType) {
		lsKey = 'searchLatelyDatasRT_'+countryCode+languageCode;
	}else if('OW' == tripType) {
		lsKey = 'searchLatelyDatasOW_'+countryCode+languageCode;
	}
	if(localStorage.getItem(lsKey) != null) {
		draw(lsKey);
	}else{
		html[0] = '<div class="empty_box" name="empty_box">'+jsJSON.J0023+'</div>';//최근 검색한 노선이 없습니다.
	}

	if(html.join('').indexOf('class') < 0) {
		html = [];
		html[0] = '<div class="empty_box" name="empty_box">'+jsJSON.J0023+'</div>';//최근 검색한 노선이 없습니다.
	}

	var checkHtml = html;
	var tempHtml = [];
    if(checkHtml.length > 0){
    	for(var x=0; x<checkHtml.length; x++){
    		if(checkHtml[x] != undefined){
    			tempHtml.push(checkHtml[x]);
    		}
    	}
    	
    	if(tempHtml[0].split('<ul>').length < 2){
    		tempHtml[0] = '<ul>'+tempHtml[0];
    	}
    	
    	if(tempHtml[tempHtml.length-1].split('</ul>').length < 2){
    		tempHtml[tempHtml.length-1] = tempHtml[tempHtml.length-1] + '</ul>';
    	}
    }
    
	$searchLately.append(tempHtml.join(''));
};

//최근검색 항목 삭제
var deleteSearchLatelyData = function deleteSearchLatelyData(object, lsKey, itinerary, depArrType) {
	
	var $searchLatelyDiv = $(object).closest('.search_lately');
	$(object).parent().remove();
	
	
	var tempSearchLatelyDatas = JSON.parse(localStorage.getItem(lsKey)),
		tripType = $('#tripType').val();
	
	var i = 0,
		sLength = tempSearchLatelyDatas.length,
		searchLatelyData,
		spliceIndex;
	
	while(i<sLength) {
		searchLatelyData = tempSearchLatelyDatas[i];

		if(searchLatelyData.itinerary == itinerary) {
			spliceIndex = i;
			break;
		}
		
		i++;
	}
	
	tempSearchLatelyDatas.splice(spliceIndex, 1);

	if(tempSearchLatelyDatas.length > 0) {
		if(tempSearchLatelyDatas.length > 2) {
			var lastItinerary = $searchLatelyDiv.find('ul').children().last().data('itinerary');
			
			var i = 0,
				sLength = tempSearchLatelyDatas.length,
				searchLatelyData,
				appendSearchLatelyData;
			
			while(i<sLength) {
				searchLatelyData = tempSearchLatelyDatas[i];
				
				if(searchLatelyData.itinerary == lastItinerary) {
					if(depArrType == 'dep') {
						appendSearchLatelyData = tempSearchLatelyDatas[i-1];
					}else {
						
						var j = i-1;
						
						while(j>=0) {
							if($('#departureAirport1').val() == tempSearchLatelyDatas[j].departureAirport) {
								appendSearchLatelyData = tempSearchLatelyDatas[j];
								break;
							}
							
							j--;
						}
						
					}
					break;
				}
				
				i++;
			}
			
			if(typeof appendSearchLatelyData != 'undefined') {
				if('dep' == depArrType || ('arr' == depArrType && $('#departureAirport1').val() == appendSearchLatelyData.departureAirport)) {
					
					var html = '',
						arrowCls = '';
					
					if('RT' == tripType) {
						arrowCls = 'return';
					}
					
					html =	'<li class="'+arrowCls+'" val="'+appendSearchLatelyData.departureArea+','+appendSearchLatelyData.departureAirportName+','+
								appendSearchLatelyData.departureAirport+','+appendSearchLatelyData.departureCity+','+appendSearchLatelyData.departureCityName+
								'-'+appendSearchLatelyData.arrivalArea+','+appendSearchLatelyData.arrivalAirportName+','+
								appendSearchLatelyData.arrivalAirport+','+searchLatelyData.arrivalCity+','+appendSearchLatelyData.arrivalCityName+','+appendSearchLatelyData.direct+
								'-'+appendSearchLatelyData.departureDateTime+','+appendSearchLatelyData.arrivalDateTime+','+appendSearchLatelyData.adultCnt+','+appendSearchLatelyData.childCnt+','+appendSearchLatelyData.infantCnt+'" data-itinerary="'+appendSearchLatelyData.itinerary+'">' +
								'<a href="#none">' +
									'<span>'+appendSearchLatelyData.departureAirportName+'<var>'+appendSearchLatelyData.departureAirport+'</var></span>' +
									'<span>'+appendSearchLatelyData.arrivalAirportName+'<var>'+appendSearchLatelyData.arrivalAirport+'</var></span>' +
								'</a>' +
								'<button type="button" class="btn_detlete" name="btn_delete" onclick="javascript:deleteSearchLatelyData(this, \''+lsKey+'\', \''+appendSearchLatelyData.itinerary+'\', \''+depArrType+'\');"><span class="hidden">'+jsJSON.J0101+'</span></button>' +//삭제
							'</li>';
					
					$searchLatelyDiv.find('ul').append(html);
					
				}
			}
			
		}
		
		localStorage.setItem(lsKey, JSON.stringify(tempSearchLatelyDatas));
	}else {
		localStorage.removeItem(lsKey);
	}
	
	
	if($searchLatelyDiv.find('ul').children().length == 0) {
		$searchLatelyDiv.find('ul').remove();
		$searchLatelyDiv.append('<div class="empty_box" name="empty_box">'+jsJSON.J0023+'</div>');//최근 검색한 노선이 없습니다
	}
};

// 전체도시보기 클릭
var showAirportLayer = function showAirportLayer(object) {

	$('.shadow_layer').hide();

	var $this			= $(object),
		seg				= $this.attr('seg'),
		segtype			= $this.attr('segtype'),
		idx				= seg.substring(3, 4),
		$hidden			= $this.prev(),
		defaultArea		= $hidden.attr('area'),
		defaultAirport	= $hidden.attr('airport'),
		hidType,
		labelType,
		targetId,
		targetText,
		targetAirportName,
		targetInputId;

	if(typeof segtype == 'undefined'){
		segtype = '';
	}

	if(segtype.indexOf('modifyFavorite') > -1) {
		if(!prevModifyAirportValidation($this.attr('id'))) {
			return false;
		}
	}else {
		if(!prevAirportValidation($this.attr('id'))) {
			return false;
		}
	}

	if(seg.indexOf('dep') > -1) {
		hidType = 'departure';
		labelType = 'labelDepartureAirport';
		targetId = 'depAllAirport'+idx;
		targetText = 'txtDepartureAirport'+idx;
		targetAirportName = 'departureAirportName'+idx;
		targetInputId = 'btn_depAllAirport'+idx;
		if(segtype.indexOf('lower') > -1) {
			labelType = 'labelDepartureAirport_lower';
			targetInputId = 'btn_depAllAirport1';
		}
		if(segtype.indexOf('favorite') > -1) {
			labelType = 'labelDepartureAirport_favorite';
			targetInputId = 'btn_depAllAirport1';
		}
		if(segtype.indexOf('modifyFavorite') > -1) {
			idx				= seg.substring(9, 10);
			hidType = 'modifyDeparture';
			labelType = 'labelModifyDepartureAirport_favorite';
			targetText = 'txtModifyDepartureAirport'+idx;
			targetAirportName = 'modifyDepartureAirportName'+idx;
			targetInputId = 'btn_modDepAllAirport'+idx;
		}
	}else{
		hidType = 'arrival';
		labelType = 'labelArrivalAirport';
		targetId = 'arrAllAirport'+idx;
		targetText = 'txtArrivalAirport'+idx;
		targetAirportName = 'arrivalAirportName'+idx;
		targetInputId = 'btn_arrAllAirport'+idx;
		if(segtype.indexOf('lower') > -1) {
			labelType = 'labelArrivalAirport_lower';
			targetInputId = 'btn_arrAllAirport1';
		}
		if(segtype.indexOf('favorite') > -1) {
			labelType = 'labelArrivalAirport_favorite';
			targetInputId = 'btn_arrAllAirport1';
		}
		if(segtype.indexOf('modifyFavorite') > -1) {
			idx				= seg.substring(9, 10);
			hidType = 'modifyArrival';
			labelType = 'labelModifyArrivalAirport_favorite';
			targetText = 'txtModifyArrivalAirport'+idx;
			targetAirportName = 'modifyArrivalAirportName'+idx;
			targetInputId = 'btn_modArrAllAirport'+idx;
		}
	}

	var registObject = {
		seg					: seg,
		defaultArea			: defaultArea,
		defaultAirport		: defaultAirport,
		hidAreaId			: hidType + 'Area' + idx,
		hidCountryId		: hidType + 'Country' + idx,
		hidAirportId		: hidType + 'Airport' + idx,
		hidAirportNameId	: hidType + 'AirportName' + idx,
		hidCityId			: hidType + 'City' + idx,
		hidCityNameId		: hidType + 'CityName' + idx,
		hidDirectId			: hidType + 'Direct' + idx,
		targetLabel			: labelType + idx,
		targetText			: targetText,
		targetAirportName	: targetAirportName,
		targetInput			: targetInputId
	};

	var targetLayer = $('div[name="allAirport"]');
	targetLayer.attr('id', targetId);

	if($("#bizType").val() == "RED" && typeof isStarAlliance != 'undefined' && isStarAlliance) {
		var areaAirportDatas = $(document).data('starAreaAirportData');
		setStarAreaAirportLayer(JSON.parse(areaAirportDatas), registObject);
	}else {
		var areaAirportDatas = $(document).data(registObject.seg+'AreaAirportData');
		setAreaAirportLayer(JSON.parse(areaAirportDatas), registObject);
	}

	openLayerPopup(targetId);

};

/*
* targetAreaId			: 선택시 저장 될 hidden txt area id 를 세팅한다.
* targetAirportId		: 선택시 저장 될 hidden txt airport id 를 세팅한다.
* targetCityId			: 선택시 저장 될 hidden txt city id 를 세팅한다.
* targetCityNameId		: 선택시 저장 될 hidden txt cityName id 를 세팅한다.
* targetDirectId		: 선택시 저장 될 hidden txt direct id 를 세팅한다.
* targetLabel			: 선택시 노출될 label id 를 세팅한다.
* targetText			: 선택시 노출될 summary text id 를 세팅한다.
* targetAirportName		: 선택시 노출될 summary targetAirportName id 를 세팅한다.
* targetInput			: 선택시 포커스될 input id 를 세팅한다.
* */
var targetAreaId,
	targetCountryId,
	targetAirportId,
	targetCityId,
	targetCityNameId,
	targetDirectId,
	targetLabel,
	targetText,
	targetAirportName,
	targetInput;

/*
* 출/도착지 선택 레이어 그리기
* 00. areaAirportDatas : 출/도착지 정보 data
* 01. registObject : 출/도착지 선택 레이어에서 이루어지는 액션에 필요한 요소
* 						{seg			: seg 구분 값 (dep1, arr1, dep2, arr2, ...)
* 						 defaultArea	: default area
* 						 defaultAirport	: default airport
* 						 hidAreaId		: 선택시 저장 될 hidden txt area id,
* 						 hidAirportId	: 선택시 저장 될 hidden txt airport id,
* 						 targetLabel	: 선택시 노출될 label id,
* 						 targetInput	: 선택시 포커스될 input id}
* */
var setAreaAirportLayer = function setAreaAirportLayer(areaAirportDatas, registObject) {

	var $domDiv = $('.domestic'),
		$intDiv	= $('.national'),
		domHtml = [],
		intNationHtml = [],
		intAirportHtml = [],
		dIdx = 0,
		iIdx = 0,
		krLength = 0,
		divCls = '',
		liCls = '',
		aTitle = '',
		onCls = '';

	var i = 0,
		rLength = areaAirportDatas.length;
	while(i<rLength){
		var areaAirportData = areaAirportDatas[i],
			j = 0,
			cLength = areaAirportData.cityAirportDatas.length;

		if(areaAirportData.routeType == 'D') {
			krLength = areaAirportData.cityAirportDatas.length;
		}

		if($("#bizType").val() == 'RED') {
			if(registObject.defaultArea == 'CE' || registObject.defaultArea == 'JP' ) {
				if(areaAirportData.area == 'CE') {
					liCls = 'class="active"';
					divCls = 'active';
					aTitle = jsJSON.J0022;// 선택됨
				}
			}else{
				if(areaAirportData.area == registObject.defaultArea) {
					liCls = 'class="active"';
					divCls = 'active';
					aTitle = jsJSON.J0022;// 선택됨
				}
			}

		}else {
			if(registObject.defaultArea == 'JP' || registObject.defaultArea == 'CN' || registObject.defaultArea == 'TW') {
				if(areaAirportData.area == 'EC') {
					liCls = 'class="active"';
					divCls = 'active';
					aTitle = jsJSON.J0022;// 선택됨
				}
			}else {
				if(areaAirportData.area == registObject.defaultArea) {
					liCls = 'class="active"';
					divCls = 'active';
					aTitle = jsJSON.J0022;// 선택됨
				}
			}
		}

		// 국제선 대노선 list html draw
		if(i == 0) {
			intNationHtml[i]		=	'<div class="list_nation" name="list_nation">' +
											'<ul>';

			if(areaAirportData.routeType == 'I') {
				intNationHtml[i]	+=		'<li '+liCls+'><a href="#none" title="'+aTitle+'" onclick="javascript:clickArea(this);">'+areaAirportData.areaName+'</a></li>';
			}

		}else {

			intNationHtml[i]		=			'<li '+liCls+'><a href="#none" title="'+aTitle+'" onclick="javascript:clickArea(this);">'+areaAirportData.areaName+'</a></li>';

			// end idx
			if(i == (rLength-1)) {
				intNationHtml[i]	=			'<li '+liCls+'><a href="#none" title="'+aTitle+'" onclick="javascript:clickArea(this);">'+areaAirportData.areaName+'</a></li>' +
											'</ul>' +
										'<div>';
			}
		}

		while(j<cLength) {
			// 국내선 list html draw
			if(RequestUrlArr[4].indexOf('InternationalChange.do') < 0) {
				if(areaAirportData.routeType == 'D') {
					var cityAirportData = areaAirportData.cityAirportDatas[j];
					if(registObject.defaultAirport == cityAirportData.airport){
						liCls = 'class="on"';
					}

					var airportDesc = cityAirportData.airportName;

					if(RequestUrlArr[4].indexOf('DefaultFlightDepartureSearch.do') > -1 && registObject.seg.indexOf('arr') > -1) {
						if(cityAirportData.direct == 'Y') {
							domHtml[dIdx] = '<li '+liCls+' area="'+areaAirportData.area+'" mgtArea="'+cityAirportData.mgtArea+'" city="'+cityAirportData.city+'" cityName="'+cityAirportData.cityName+'" direct="'+cityAirportData.direct+'" airportName="'+airportDesc+'" airport="'+cityAirportData.airport+'">' +
							'<a href="#none" onclick="javascript:setAirportData(this);">' +
							'<span class="cname">'+airportDesc+'</span>' +
							'<span class="abbr">'+cityAirportData.airport+'</span>' +
							'</a>' +
							'</li>';
						}else {
							domHtml[dIdx] = '';
						}
					}else {
						domHtml[dIdx] = '<li '+liCls+' area="'+areaAirportData.area+'" mgtArea="'+cityAirportData.mgtArea+'" city="'+cityAirportData.city+'" cityName="'+cityAirportData.cityName+'" direct="'+cityAirportData.direct+'" airportName="'+airportDesc+'" airport="'+cityAirportData.airport+'">' +
						'<a href="#none" onclick="javascript:setAirportData(this);">' +
						'<span class="cname">'+airportDesc+'</span>' +
						'<span class="abbr">'+cityAirportData.airport+'</span>' +
						'</a>' +
						'</li>';
					}

					// start idx
					if(j == 0) {
						var tempDomHtml = domHtml[dIdx];
						domHtml[dIdx] = '<ul class="city_list">' + tempDomHtml;
					}else if(j == (krLength-1)) {
						domHtml[dIdx] += '</ul>';
					}

					liCls = '';
					dIdx++;

				}

				if(RequestUrlArr[4].indexOf('DomesticChange.do') > -1) {
					j++;
					iIdx++;
				}
			}

			if(RequestUrlArr[4].indexOf('DomesticChange.do') < 0) {

				if(areaAirportData.routeType == 'D') {
					divCls	= '';
					onCls	= '';
					j++;
					iIdx++;
					continue;
				}

				// 국제선 공항 list html draw
				var cityAirportData = areaAirportData.cityAirportDatas[j];
				if(registObject.defaultAirport == '') {
					if(i == 0) {
						onCls	= 'class="active"';
					}
				}

				if(registObject.defaultAirport == cityAirportData.airport) {
					onCls	= 'class="active"';
				}

				var airportDesc;
				if($("#bizType").val() == 'RED') {
					if(cityAirportData.mgtArea == 'US') {
						airportDesc = cityAirportData.airportName + ', <em>' + cityAirportData.state + '</em>';
					}else if(cityAirportData.mgtArea == 'KR' || cityAirportData.mgtArea == 'JP' || cityAirportData.mgtArea == 'CN' || cityAirportData.mgtArea == 'TW' || cityAirportData.mgtArea == 'CE' || cityAirportData.mgtArea == 'EA'){
						airportDesc = cityAirportData.airportName;
					}else {
						airportDesc = cityAirportData.airportName + ', <em>' + cityAirportData.countryName + '</em>';
					}
				}else {
					if(cityAirportData.mgtArea == 'US') {
						airportDesc = cityAirportData.airportName + ', <em>' + cityAirportData.state + '</em>';
					}else {
						airportDesc = cityAirportData.airportName;
					}
				}

				if(RequestUrlArr[4].indexOf('DefaultFlightDepartureSearch.do') > -1 && registObject.seg.indexOf('arr') > -1) {
					if(cityAirportData.direct == 'Y') {
						var tempIntAirportHtml	=	'<li '+onCls+' area="'+areaAirportData.area+'" mgtArea="'+cityAirportData.mgtArea+'" city="'+cityAirportData.city+'" cityName="'+cityAirportData.cityName+'" direct="'+cityAirportData.direct+'" airportName="'+cityAirportData.airportName+'" airport="'+cityAirportData.airport+'">' +
						'<a href="#none" onclick="javascript:setAirportData(this);">' +
						'<span class="cname">'+airportDesc+'</span>' +
						'<span class="abbr">'+cityAirportData.airport+'</span>' +
						'</a>' +
						'</li>';
					}else {
						var tempIntAirportHtml = '';
					}
				}else {
					var tempIntAirportHtml	=	'<li '+onCls+' area="'+areaAirportData.area+'" mgtArea="'+cityAirportData.mgtArea+'" city="'+cityAirportData.city+'" cityName="'+cityAirportData.cityName+'" direct="'+cityAirportData.direct+'" airportName="'+cityAirportData.airportName+'" airport="'+cityAirportData.airport+'">' +
					'<a href="#none" onclick="javascript:setAirportData(this);">' +
					'<span class="cname">'+airportDesc+'</span>' +
					'<span class="abbr">'+cityAirportData.airport+'</span>' +
					'</a>' +
					'</li>';
				}


				if(j == 0) {
					if(i == 0 || typeof intAirportHtml[iIdx-1] == 'undefined') {
						intAirportHtml[iIdx]	=	'<div class="list_airport">';
					}else{
						intAirportHtml[iIdx]	=	'';
					}

					intAirportHtml[iIdx]		+=		'<div class="national_listbox '+divCls+'" name="national_listbox">';
					//if(registObject.seg.indexOf("arr") > -1) {
					if(RequestUrlArr[4].indexOf('DefaultFlightDepartureSearch.do') > -1) {
						if(cityAirportData.direct != null && cityAirportData.direct != '') {
							if(cityAirportData.direct == 'Y') {
								intAirportHtml[iIdx] +=		'<h6>'+jsJSON.J0045+'</h6>';//취항지
							}
						}
					}else {
						if(cityAirportData.direct != null && cityAirportData.direct != '') {
							if(cityAirportData.direct == 'Y') {
								intAirportHtml[iIdx] +=		'<h6>'+jsJSON.J0045+'</h6>';//취항지
							}else {
								intAirportHtml[iIdx] +=		'<h6>'+jsJSON.J0046+'</h6>';//그외
							}
						}
					}
					//}
					intAirportHtml[iIdx]		+=			'<ul class="city_list" area="'+areaAirportData.area+'" mgtArea="'+cityAirportData.mgtArea+'">' +
																tempIntAirportHtml;
					if(cLength == 1) {
						intAirportHtml[iIdx]	+= 			'</ul>' +
														'</div>';
					}
					if(cLength == 1 && rLength == 1) {
						intAirportHtml[iIdx]	+=	'</div>';
					}
				}else {

					intAirportHtml[iIdx]		= '';

					if(areaAirportData.cityAirportDatas[j-1].direct != cityAirportData.direct) {
						//if(registObject.seg.indexOf("arr") > -1) {
						if(RequestUrlArr[4].indexOf('DefaultFlightDepartureSearch.do') > -1) {
							if(cityAirportData.direct != null && cityAirportData.direct != '') {
								if(cityAirportData.direct == 'Y') {
									intAirportHtml[iIdx] +=	'</ul>' +
									'<h6>'+jsJSON.J0045+'</h6>';//취항지
								}
							}
						}else {
							if(cityAirportData.direct != null && cityAirportData.direct != '') {
								if(cityAirportData.direct == 'Y') {
									intAirportHtml[iIdx] +=	'</ul>' +
									'<h6>'+jsJSON.J0045+'</h6>';//취항지
								}else {
									intAirportHtml[iIdx] +=	'</ul>' +
									'<h6>'+jsJSON.J0046+'</h6>' +
									'<ul class="city_list">';//그외
								}
							}
						}
						//}
					}

					intAirportHtml[iIdx]		+=				tempIntAirportHtml;

					// end idx
					if(j == (cLength-1)) {
						intAirportHtml[iIdx]	+=			'</ul>' +
														'</div>';
						if(i == (rLength-1)) {
							intAirportHtml[iIdx] +=	'</div>';
						}
					}
				}

				divCls	= '';
				onCls	= '';
				j++;
				iIdx++;
			}
		};
		liCls	= '';
		i++;
	};

	targetAreaId		= registObject.hidAreaId;
	targetAirportId		= registObject.hidAirportId;
	targetAirportName	= registObject.targetAirportName;
	targetCityId		= registObject.hidCityId;
	targetCityNameId	= registObject.hidCityNameId;
	targetDirectId		= registObject.hidDirectId;
	targetLabel			= registObject.targetLabel;
	targetText			= registObject.targetText;
	targetInput			= registObject.targetInput;
	if($("#salesType").val() != "ACT") {
		$domDiv.html(domHtml.join(''));
	}
	$intDiv.html('');
	$intDiv.append(intNationHtml.join(''));
	$intDiv.append(intAirportHtml.join(''));

	if(registObject.defaultArea == '') {
		$('div[name=list_nation]').find('li').eq(0).addClass('active');
		$('div[name=list_nation]').find('li').eq(0).find("a").attr('title',jsJSON.J0022);// 선택됨
		$('div[name=national_listbox]').eq(0).addClass('active');
	}

	if(domHtml.length == 0 || $("#salesType").val() == "ACT") {
		$domDiv.prev().hide();
		$domDiv.hide();
	}else {
		$domDiv.prev().show();
		$domDiv.show();
	}

	if(intAirportHtml.length == 0) {
		$intDiv.prev().hide();
		$intDiv.hide();
	}else {
		$intDiv.prev().show();
		$intDiv.show();
	}

};

/*
* STARALLIANCE 출/도착지 선택 레이어 그리기
* 00. areaAirportDatas : 출/도착지 정보 data
* 01. registObject : 출/도착지 선택 레이어에서 이루어지는 액션에 필요한 요소
* 						{seg			: seg 구분 값 (dep1, arr1, dep2, arr2, ...)
* 						 defaultArea	: default area
* 						 defaultAirport	: default airport
* 						 hidAreaId		: 선택시 저장 될 hidden txt area id,
* 						 hidAirportId	: 선택시 저장 될 hidden txt airport id,
* 						 targetLabel	: 선택시 노출될 label id,
* 						 targetInput	: 선택시 포커스될 input id}
* */
var setStarAreaAirportLayer = function setStarAreaAirportLayer(areaAirportDatas, registObject) {

	var $intDiv	= $('[name=national]'),
		intAreaHtml = [],
		intAirportHtml = [],
		iIdx = 1,
		hCls = '',
		liCls = '',
		aTitle = '',
		onCss = '';

	var i = 0,
		rLength = areaAirportDatas.length;

	intAreaHtml[0] =
		'<div class="list_nation">'+
		'	<ul>' +
		'		<li class="" onclick="javascript:selectNation(this);">' +
		'			<a href="#none">'+jsJSON.J0059+'</a>'+//전체
		'		</li>';

	intAirportHtml[0] =
		'<div class="list_airport">'+
		'	<div class="national_listbox">' +
		'		<ul class="city_list col02" id="areaSearchStarAirport">' +
		'		</ul>' +
		'	</div>';

	while(i<rLength) {
		var areaAirportData = areaAirportDatas[i],
			j = 0,
			countryLength = areaAirportData.countryDatas.length;

		if(registObject.defaultArea == '') {
			if(areaAirportData.area == 'KR') {
				hCls	= ' active';
				aTitle = jsJSON.J0022;// 선택됨
			}
		}

		if(registObject.defaultArea == areaAirportData.area){
			hCls	= ' active';
			aTitle = jsJSON.J0022;// 선택됨
		}

		var areaName = areaAirportData.areaName;
		if(areaName == null){
			areaName = areaAirportData.area;
		}

		intAreaHtml[iIdx] =
			'<li class="'+hCls+'" area="'+areaAirportData.area+'" mgtArea="'+areaAirportData.area+'" onclick="javascript:selectNation(this);">' +
			'	<a href="#none" title="'+aTitle+'">'+areaName+'</a>'+
			'</li>';

		intAirportHtml[iIdx] =
			'<div class="national_listbox '+hCls+'">' +
			'	<ul class="city_list col02" >';

		while(j<countryLength) {
			var countryData = areaAirportData.countryDatas[j],
			k=0,
			cityLength = countryData.cityAirportDatas.length;


			while(k<cityLength) {
				var cityAirportData = countryData.cityAirportDatas[k];

				if(registObject.defaultAirport == cityAirportData.airport) {
					liCls	= ' on';
				}

				var aiportHtml = "";

				/* 2018.06.11 [온라인 개편] 대노선 변경 CR 관련 (6/4~6/8)_REV 국가표기 최종
				 STAR - 동북아시아, 동남아시아만 국가표기 삭제 */
				var contryList = "NE,SA".split(",");
				if(contryList.indexOf(areaAirportData.area) >= 0){
					intAirportHtml[iIdx] +=
						'<li area="'+areaAirportData.area+'" mgtArea="'+cityAirportData.country+'" country="'+countryData.country+'" city="'+cityAirportData.city+'" cityname="'+cityAirportData.cityName+'" airportname="'+cityAirportData.airportName+'" airport="'+cityAirportData.airport+'">'+
						'	<a href="#none" onclick="javascript:setAirportData(this);">'+
						'		<p class="full_name">'+cityAirportData.airportName+'</p>'+
						'		<span class="abbr">'+cityAirportData.airport+'</span>'+
						'	</a>'+
						'</li>';
				}else{
					intAirportHtml[iIdx] +=
						'<li area="'+areaAirportData.area+'" mgtArea="'+areaAirportData.area+'" country="'+countryData.country+'" city="'+cityAirportData.city+'" cityname="'+cityAirportData.cityName+'" airportname="'+cityAirportData.airportName+'" airport="'+cityAirportData.airport+'">'+
						'	<a href="#none" onclick="javascript:setAirportData(this);">'+
						'		<p class="full_name">'+cityAirportData.airportName+'<span class="cname">'+countryData.countryName+'</span></p>'+
						'		<span class="abbr">'+cityAirportData.airport+'</span>'+
						'	</a>'+
						'</li>';
				}

				hCls	= '';
				liCls	= '';
				onCss	= '';
				k++;

			};

			j++;
		};

		intAirportHtml[iIdx] +=
			'	</ul>' +
			'</div>';

		iIdx++;
		i++;
	};

	intAreaHtml[iIdx] =
		'	</ul>'+
		'</div>';

	intAirportHtml[iIdx] = '</div>';

	targetAreaId		= registObject.hidAreaId;
	targetCountryId		= registObject.hidCountryId;
	targetAirportId		= registObject.hidAirportId;
	targetAirportName	= registObject.targetAirportName;
	targetCityId		= registObject.hidCityId;
	targetCityNameId	= registObject.hidCityNameId;
	targetDirectId		= registObject.hidDirectId;
	targetLabel			= registObject.targetLabel;
	targetText			= registObject.targetText;
	targetInput			= registObject.targetInput;

	$intDiv.html('');
	$intDiv.append(intAreaHtml.join(''));
	$intDiv.append(intAirportHtml.join(''));

	if($('.flights_list .list_nation li.active').size() == 0 ){
		$('.flights_list .list_nation li').eq(1).addClass('active');
		$('.flights_list .list_nation li').eq(1).find("a").attr('title',jsJSON.J0022);// 선택됨
		$('div.national_listbox').eq(1).addClass('active');
	}
};


// 출/도착지 layer 공항 click event start
var setAirportData = function setAirportData(object) {
	var $this = $(object),
		$a = $('.city_list > li > a');
	if(!$this.parent('li').parent('ul').hasClass('no_flight')) {
		$a.parent('li').removeClass('on');
		$this.parent('li').addClass('on');
	}

	var area,
		mgtArea,
		country,
		airportName,
		airport,
		city,
		cityName,
		direct;
	$('.city_list > li').each(function() {
		var $this = $(this),
			$thisSpan = $this.find('span');
		if($this.hasClass('on')){
			area		= $this.attr('area');
			mgtArea		= $this.attr('mgtArea');
			country		= $this.attr('country');
			airportName	= $this.attr('airportName');
			airport		= $this.attr('airport');
			city		= $this.attr('city');
			cityName	= $this.attr('cityName');
			direct		= $this.attr('direct');
		}
	});

	if(typeof airport == 'undefined') {
		alert(jsJSON.J0060);//공항을 선택해 주십시오.
		return false;
	}

	$('#'+targetAreaId).val(mgtArea);
	$('#'+targetAirportId).val(airport);
	$('#'+targetCityId).val(city);
	$('#'+targetCityNameId).val(cityName);
	$('#'+targetDirectId).val(direct);
	if(document.getElementById(targetLabel)){ // 여정선택화면
		if(targetLabel.indexOf('_lower') > -1){
			$('#'+targetLabel).html('<span class="hidden">'+airport+' '+airportName+'</span>');
			$('#'+targetText).attr("placeholder",airport+' '+airportName);
			if(targetAreaId.indexOf('dep') > -1){
				$('#departureAirportName1').val(airportName);
			}else {
				$('#arrivalAirportName1').val(airportName);
			}
		}else if(targetLabel.indexOf('_favorite') > -1){
			$('#'+targetText).attr("placeholder",airport+' '+airportName);
			if(targetAreaId.indexOf('dep') > -1){
				$('#departureAirportName1').val(airportName);
			}else {
				$('#arrivalAirportName1').val(airportName);
			}
		}else {
			if(targetLabel.indexOf('Dep') > -1) {
				$('#'+targetLabel).html('<span class="hidden">'+jsJSON.J0005+'</span><p>'+airport+'</p><span>'+airportName+'</span>');
			}else {
				$('#'+targetLabel).html('<span class="hidden">'+jsJSON.J0006+'</span><p>'+airport+'</p><span>'+airportName+'</span>');
			}
		}
	}else{ // 항공편선택화면(Summary 부분)
		$('#'+targetAirportName).val(airportName);
		$('#'+targetText).attr("placeholder",airport+' '+airportName);
	}
	$('#'+targetAirportId).trigger('textchange');

	if(typeof isStarAlliance != "undefined" && isStarAlliance){
		$('#'+targetCountryId).val(country);
	}

	$('div[name="allAirport"]').hide();
	$('.shadow_layer').hide();
	$('body').css('overflow-y','auto');
	_thisBtn.focus();

	if(typeof targetInput != 'undefined'){
		$('#'+targetInput).focus();
		$('#'+targetInput).focusin();
		targetInput = undefined;
	}
};

//출/도착지 layer 대노선 click event start
var clickArea = function clickArea(object) {
	var $this = $(object),
		$li = $('div[name=list_nation]').find('li');
	$li.removeClass('active');
	$li.find("a").attr('title','');
	$this.parent().addClass('active');
	$this.attr('title',jsJSON.J0022);// 선택됨

	var natIdx =$this.parent().index();
	$('.national_listbox').removeClass('active');
	$('.national_listbox').eq(natIdx).addClass('active');
};

// 예약/발권 로그인 레이어
var viewBookingLogin = function viewBookingLogin(callType) {
	$.ajax({
		url			: "ViewBookingLoginLayer.do",
		async		: false,
		type 		: "post",
		data		: {
			callType : callType
		},
		beforeSend	: function() {
			loadingOpen('entire', 'booking');
		},
		success		: function(data) {
			if(data.indexOf('isAlreadyLogin') > -1){
				var isAlreadyLogin = JSON.parse(data).isAlreadyLogin;
				if(isAlreadyLogin) {
					var userData = JSON.parse(data).userData;
					userEnglishName = userData.englishName;
					userKoreanName = userData.koreanLastName+"/"+ userData.koreanFirstName;
					userTotalRestMileage = userData.totalRestMileage;
					userAcno = userData.acno;
					userMemberGrade = userData.memberGrade;
					userBirthDate = userData.birthDate;

					alert(jsJSON.J0061);//이미 로그인 상태 입니다.

					callBackFunction(userData);
				}
			}else{
				if($(".bookingLoginLayerArea").length > 0){
					$(".bookingLoginLayerArea").remove();
				}
				$(".container").append(data);
				openLayerPopup('bookingLogin');
			}

		},
		error: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
		},
		complete: function() {
			loadingClose('entire');
			checkSSOSessionExtension();
		}
	});
};

//예약/발권 로그인 레이어
var viewBookingNoLogin = function viewBookingNoLogin(callType) {
	$.ajax({
		url			: "ViewBookingNoLoginLayer.do",
		async		: true,
		type 		: "post",
		data		: {
			callType : callType
		},
		dataType	: 'html',
		success		: function(data) {
			if(data.indexOf('isAlreadyLogin') > -1){
				var isAlreadyLogin = JSON.parse(data).isAlreadyLogin;
				if(isAlreadyLogin) {
					var userData = JSON.parse(data).userData;
					userEnglishName = userData.englishName;
					userKoreanName = userData.koreanName;
					userTotalRestMileage = userData.totalRestMileage;
					userAcno = userData.acno;
					userMemberGrade = userData.memberGrade;

					alert(jsJSON.J0061);//이미 로그인 상태 입니다.

					callBackFunction(userData);
				}
			}else{
				$(".container").append(data);
				openLayerPopup('bookingNoLogin');
			}
		},
		error: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
		},
		complete: function() {
			checkSSOSessionExtension();
		}
	});
};


/* 환율계산기 팝업
* 00. defaultCurrency : 예상운임의 currency
* 01. defaultPrice : 에상운임
* */
var viewCurrencyCalcurate = function viewCurrencyCalcurate(defaultCurrency, defaultPrice, bizType) {
	if(typeof defaultPrice != "undefined" && defaultPrice != ""){
		defaultPrice = Math.abs(Number(String(defaultPrice).replace(/[^0-9.]/g,'')));
	}else{
		defaultPrice = 0;
	}

	if(!document.getElementById('excRate')){
		$.ajax({
			url: "ViewConvertCurrency.do",
			async: false,
			type : "post",
			data : {
				defaultCurrency : defaultCurrency,
				defaultPrice : defaultPrice,
				bizType : bizType
			},
			dataType	: 'html',
			success: function(html) {
				$(".container").append(html);
				openLayerPopup('excRate');
			},
			error: function(data) {
				alert(JSON.parse(data.responseText).exceptionInfo.message);
			},
			complete: function() {
				checkSSOSessionExtension();
			}
		});
	}else{
		openLayerPopup('excRate');
		$("#defaultConvertCurrencyPrice").val(defaultPrice);
		$("#selConvertCurrencyToCurrency option").show();
		$("#txtCurrencyCalResult").html('');
	}

	if($("#selConvertCurrencyFromCurrency option[value="+defaultCurrency+"]").size() == 0){
		$("#selConvertCurrencyFromCurrency").append('<option value="'+defaultCurrency+'" selected>'+defaultCurrency+' ('+defaultCurrency+')</option>');
	}
	$("#selConvertCurrencyFromCurrency").val(defaultCurrency);
	$("#selConvertCurrencyToCurrency option[value="+defaultCurrency+"]").hide();
	$("#selConvertCurrencyToCurrency option[value!="+defaultCurrency+"]").eq(0).prop("selected",true);
};

//나이계산기 layer append func
function appendAgeCalculator() {
	// layer html 작업
	if($('#ageCalc').length == 0){
		var layerHTML = '';
		layerHTML += '<div class="layer_wrap" id="ageCalc">'
					+ '<div class="dim_layer"></div>'
					+ '<div class="layer_pop" style="width:600px;">'
					+ '<div class="pop_cont">'
					+ '<h4>'+jsJSON.J0440+'</h4>'//나이계산기
					+ '<p class="pop_tit st3">'+jsJSON.J0062+'</p>'//계산하고자 하는 어린이의 생년월일을 선택하시면, 유아&#47;소아 유무를 확인하실 수  <br> 있습니다.
					+ '<div class="form_area2">'
					+ '<input type="text" id="txtBirthDate" placeholder="'+jsJSON.J0063+'" title="'+jsJSON.J0064+'" style="width:290px;" maxlength="8" onkeypress="if(event.keyCode==13) {calculateAge(); return false;}">'//생년월일 8자리 입력 (예시:19700101), 생년월일 8자리
					+ '<button type="button" class="btn_minwidth red" onclick="calculateAge();">'+jsJSON.J0444+'</button>'//계산하기
					+ '</div>'
					+ '<p class="col_red" id="txtAgeCalcResult"></p>'
					+ '</div>'
					+ '<a href="#none" class="dim_close"><span class="hidden">'+jsJSON.J0087+'</span></a>'//닫기
					+ '</div>'
					+ '</div>';
		$('.container').append(layerHTML);
		keyupOnlyNum($("#txtBirthDate"));
	}else{
		$('#txtBirthDate').val('');
		$('#txtAgeCalcResult').html('');
	}

	// layerPopup
	openLayerPopup('ageCalc');
}

//나이계산기 나이계산
var calculateAge = function calculateAge() {
	var ageCalResult ="";
	var birthDate = $("#txtBirthDate").val().replace(/[^A-Z0-9-]/g , "");
	var depDate = $("#departureDate1").val();
	var ageCalculateTripType = $("#tripType").val();
	var ageCalculateDomIntType = setAgeCalculateDomIntType();

	if(birthDate.length != 8){
		alert(jsJSON.J0065);//생년월일을 입력해 주세요.
		return;
	}

	if(depDate == ""){
		depDate = currentDate;
	}

	var age = getAge(birthDate, depDate);

	depDate = depDate.replace(/-/g,"");
	depDate = depDate.substring(0,4)+"."+depDate.substring(4,6)+"."+depDate.substring(6,8);
	$("#txtAgeCalcResult").html("");

	var _desc = '';
	//국내선
	if(ageCalculateDomIntType == "D"){
		if (age < 2) {
			// 유아인 경우
			_desc = jsJSON.J0066;
			ageCalResult = _desc.replace(/#0/gi, depDate);//국내선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>유아</strong> 입니다.
		} else if (age >= 2 && age < 13) {
			// 소아인 경우
			_desc = jsJSON.J0067;
			ageCalResult = _desc.replace(/#0/gi, depDate);//국내선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>소아</strong> 입니다.
		} else {
			// 성인인 경우
			_desc = jsJSON.J0068;
			ageCalResult = _desc.replace(/#0/gi, depDate);//국내선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>성인</strong> 입니다.
		}

		if(ageCalculateTripType == "RT"){
			depDate = $("#arrivalDate1").val();
			if(depDate == ""){
				depDate = currentDate;
			}
			age = getAge(birthDate, depDate);

			depDate = depDate.replace(/-/g,"");
			depDate = depDate.substring(0,4)+"."+depDate.substring(4,6)+"."+depDate.substring(6,8);

			if (age < 2) {
				// 유아인 경우
				_desc = jsJSON.J0066;
				ageCalResult += "<br/>"+_desc.replace(/#0/gi, depDate);//국내선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>유아</strong> 입니다.
			} else if (age >= 2 && age < 13) {
				// 소아인 경우
				_desc = jsJSON.J0067;
				ageCalResult += "<br/>"+_desc.replace(/#0/gi, depDate);//국내선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>소아</strong> 입니다.
			} else {
				// 성인인 경우
				_desc = jsJSON.J0068;
				ageCalResult += "<br/>"+_desc.replace(/#0/gi, depDate);//국내선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>성인</strong> 입니다.
			}
		}else if (ageCalculateTripType != "OW") {
			$('[id^=departureDate]').each(function(i){
				if($(this).attr("id") != "departureDate1"){
					depDate = $(this).val();
					age = getAge(birthDate, depDate);

					depDate = depDate.substring(0,4)+"."+depDate.substring(4,6)+"."+depDate.substring(6,8);
					if (age < 2) {
						// 유아인 경우
						_desc = jsJSON.J0066;
						ageCalResult += "<br/>"+_desc.replace(/#0/gi, depDate);//국내선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>유아</strong> 입니다.
					} else if (age >= 2 && age < 13) {
						// 소아인 경우
						_desc = jsJSON.J0067;
						ageCalResult += "<br/>"+_desc.replace(/#0/gi, depDate);//국내선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>소아</strong> 입니다.
					} else {
						// 성인인 경우
						_desc = jsJSON.J0068;
						ageCalResult += "<br/>"+_desc.replace(/#0/gi, depDate);//국내선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>성인</strong> 입니다.
					}
				}
			});
		}
	}else{ // 국제선
		if (age < 2) {
			// 유아인 경우
			_desc = jsJSON.J0450;
			ageCalResult = _desc.replace(/#0/gi, depDate);//국제선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>유아</strong> 입니다.

			if(ageCalculateTripType == "RT"){
				depDate = $("#arrivalDate1").val();
				if(depDate == ""){
					depDate = currentDate;
				}
				age = getAge(birthDate, depDate);

				depDate = depDate.replace(/-/g,"");
				depDate = depDate.substring(0,4)+"."+depDate.substring(4,6)+"."+depDate.substring(6,8);
				if (age < 2) {
					// 유아인 경우
					_desc = jsJSON.J0450;
					ageCalResult += "<br/>"+_desc.replace(/#0/gi, depDate);//국제선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>유아</strong> 입니다.
				} else if (age >= 2 && age < 12) {
					// 소아인 경우
					_desc = jsJSON.J0451;
					ageCalResult += "<br/>"+_desc.replace(/#0/gi, depDate);//국제선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>소아</strong> 입니다.
				} else {
					// 성인인 경우
					_desc = jsJSON.J0452;
					ageCalResult += "<br/>"+_desc.replace(/#0/gi, depDate);//국제선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>성인</strong> 입니다.
				}
			}else if (ageCalculateTripType != "OW") {
				$('[id^=departureDate]').each(function(i){
					if($(this).attr("id") != "departureDate1"){
						depDate = $(this).val();
						if(depDate == ""){
							depDate = currentDate;
						}
						age = getAge(birthDate, depDate);

						depDate = depDate.replace(/-/g,"");
						depDate = depDate.substring(0,4)+"."+depDate.substring(4,6)+"."+depDate.substring(6,8);
						if (age < 2) {
							// 유아인 경우
							_desc = jsJSON.J0450;
							ageCalResult += "<br/>"+_desc.replace(/#0/gi, depDate);//국제선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>유아</strong> 입니다.
						} else if (age >= 2 && age < 12) {
							// 소아인 경우
							_desc = jsJSON.J0451;
							ageCalResult += "<br/>"+_desc.replace(/#0/gi, depDate);//국제선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>소아</strong> 입니다.
						} else {
							// 성인인 경우
							_desc = jsJSON.J0452;
							ageCalResult += "<br/>"+_desc.replace(/#0/gi, depDate);//국제선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>성인</strong> 입니다.
						}
					}
				});
			}
		} else if (age >= 2 && age < 12) {
			// 소아인 경우
			_desc = jsJSON.J0451;
			ageCalResult = _desc.replace(/#0/gi, depDate);//국제선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>소아</strong> 입니다.
		} else {
			// 성인인 경우
			_desc = jsJSON.J0452;
			ageCalResult = _desc.replace(/#0/gi, depDate);//국제선 탑승일 (#0) 기준으로 입력한 생년월일은 <strong>성인</strong> 입니다.
		}
	}

	$("#txtAgeCalcResult").html(ageCalResult);
};

//선택 여정의 domIntType 체크 후 세팅 func
function setAgeCalculateDomIntType() {
	var ageCalculateTripType = $("#tripType").val();
	var segLength	= $('div[name=itinerary]').length;

	if(typeof bookConditionJSON != "undefined" ){
		segLength = bookConditionJSON.segmentConditionDatas.length;
	}

	var ageCalculateDomIntType = 'I';
	var depArea1 = $('#departureArea1').val().toUpperCase();
	var arrArea1 = $('#arrivalArea1').val().toUpperCase();
	if(ageCalculateTripType == 'OW' || ageCalculateTripType == 'RT') {
		if(depArea1 === 'KR' && arrArea1 === 'KR') {
			ageCalculateDomIntType = 'D';
		}
	} else{
		if(segLength == 2) {
			var depArea2	= $('#departureArea2').val(),
				arrArea2	= $('#arrivalArea2').val();

			if(depArea1 == 'KR' && arrArea1 == 'KR' && depArea2 == 'KR' && arrArea2 == 'KR') {
				ageCalculateDomIntType = 'D';
			}else{
				ageCalculateDomIntType = 'I';
			}
		}else{
			ageCalculateDomIntType = 'I';
		}
	}

	return ageCalculateDomIntType;
}

//환율계산기 계산 버튼 클릭
var calculateCurrency = function calculateCurrency() {
	$.ajax({
		url: "ConvertCurrency.do",
		async: true,
		type : "post",
		data : {
			fromCurrency : $("#selConvertCurrencyFromCurrency").val(),
			toCurrency : $("#selConvertCurrencyToCurrency").val(),
			price : $("#defaultConvertCurrencyPrice").val(),
			bizType :  $("#defaultConvertCurrencyBizType").val()
		},
		dataType	: 'JSON',
		success: function(data) {
			var result = data.convertCurrencyData;
			var _desc = jsJSON.J0202; // #0가 <strong>#1</strong>로 환산됩니다.
			var originCurrecyCipher = data.currencyCipher; //  <%-- 2018.12.12 [UGIU] currencyCipher 변수 정의되지 않아서 에러 data.currencyCipher 대체  적용라인 : 2158 (by han.yong.woo)--%>

			_desc = _desc.replace(/#0/, result.originCurrency.currency+" " +  result.originCurrency.price.setComma());
			currencyCipher = data.currencyCipher;
			_desc = _desc.replace(/#1/, result.changeCurrency.currency + " " + result.changeCurrency.price.setComma());
			currencyCipher = originCurrecyCipher;
			document.getElementById("txtCurrencyCalResult").innerHTML = _desc;
		},
		error: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
		},
		complete: function() {
			checkSSOSessionExtension();
		}
	});
};

//생년월일에서 (만)나이를 구한다.
var getAge = function getAge(birth_yyyymmdd, departure_yyyymmdd) {

	var birth = birth_yyyymmdd.replace(/-/g,"");	// 생년월일
	var departure = departure_yyyymmdd.replace(/-/g,"");  // 탑승일

	var departureYear = departure.substring(0, 4);
	var departureMonth = parseInt(departure.substring(4, 6), 10);
	var departureDay = parseInt(departure.substring(6, 8), 10);

	var birthYear = birth.substring(0, 4);
	var birthMonth = parseInt(birth.substring(4, 6), 10);
	var birthDay = parseInt(birth.substring(6, 8), 10);

	var iAge = 0;

	if (departureMonth >= birthMonth) {
		if (departureMonth > birthMonth) {
			// 생일이 지난경우
			iAge = parseInt(departureYear) - parseInt(birthYear);
		}
		if (departureMonth == birthMonth) {
			if (departureDay < birthDay) {	// 생일 전날까지만 소아,유아 적용
				// 생일이 아직 안 지난경우
				iAge = parseInt(departureYear) - parseInt(birthYear) - 1;
			} else {
				// 생일이 지난경우
				iAge = parseInt(departureYear) - parseInt(birthYear);
			}
		}

	} else {
		iAge = parseInt(departureYear) - parseInt(birthYear) - 1;
	}

	return iAge;
};


/*
 * getFamilyMemberCount
 * acno 회원번호로 가족회원 수 조회
 * */
var getFamilyMemberCount = function getFamilyMemberCount(acno) {
	var familyMemberCount = 0;
	$.ajax({
		url: 'FamilyMemberCount.do',
		async: false,
		type : "post",
		data : {
			acno : acno
		},
		dataType	: 'JSON',
		success: function(data) {
			familyMemberCount = data.familyMemberCount;
		},
		error: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
		},
		complete: function() {
			checkSSOSessionExtension();
		}
	});

	return familyMemberCount;
};

//로컬스토리지 가져오기
var getLsLayer = function getLsLayer(name) {
	var ls = false;
	if(localStorage.getItem(name)) {
		var saveDate = localStorage.getItem(name),
			todayDate = new Date();

		if(parseInt(todayDate.getTime()) > parseInt(saveDate)) {
			localStorage.removeItem(name);
			ls = false;
		}else{
			ls = true;
		}
	}else{
		ls = false;
	}
	return ls;
};

// 오늘 하루 이 창을 열지 않기 [닫기], 00:00:00 까지 로컬스토리지 설정
var setLsAt00 = function setLsAt00(name, expiredays) {
	var todayDate = new Date();
	todayDate = new Date(parseInt(todayDate.getTime() / 86400000) * 86400000 + 54000000);
	if(todayDate > new Date()) {
		expiredays = expiredays - 1;
	}
	todayDate.setDate(todayDate.getDate() + expiredays);
	localStorage.setItem(name, parseInt(todayDate.getTime()));
};


var tabWrapH = function tabWrapH(_this){
	$(window).load(function(){
		if( _this.is(':visible') ){
			var _heiCont = _this.find('ul > li > a');
			var tabHeight;

			for(var i=0; i < _heiCont.length; i++){
				if( i == 0 ){
					tabHeight = $(_heiCont[i]).outerHeight();
				}else{
					if( tabHeight < $(_heiCont[i]).outerHeight() ){
						tabHeight = $(_heiCont[i]).outerHeight();
					};
				};
			};

			_heiCont.css({'height':tabHeight+'px'});
			tabHeight = 0;
		};
	});
};

var tabWrap3H = function tabWrap3H(_this){
	if( _this.is(':visible') ){
		var _heiCont = _this.find('.tab_head > li > a');
		var tabHeight;

		for(var i=0; i < _heiCont.length; i++){
			if( i == 0 ){
				tabHeight = $(_heiCont[i]).outerHeight();
			}else{
				if( tabHeight < $(_heiCont[i]).outerHeight() ){
					tabHeight = $(_heiCont[i]).outerHeight();
				};
			};
		};

		_heiCont.css({'height':tabHeight+'px'});
		tabHeight = 0;
	}
};

var tabWrap5H = function tabWrap5H(_this){
	if( _this.is(':visible') ){
		var _heiCont = _this.find('.tab_head > ul > li > a');
		var tabHeight;

		for(var i=0; i < _heiCont.length; i++){
			if( i == 0 ){
				tabHeight = $(_heiCont[i]).outerHeight();
			}else{
				if( tabHeight < $(_heiCont[i]).outerHeight() ){
					tabHeight = $(_heiCont[i]).outerHeight();
				};
			};
		};

		_heiCont.removeAttr('style');
		_heiCont.css({'height':tabHeight+'px'});
		tabHeight = 0;
	};
};

//레이어팝업 센터
var popCenter = function popCenter(){
	var _thisLayer = $('.layer_wrap').find('.layer_pop');
	var popYpos = Math.max(0,(($(window).height() - _thisLayer.outerHeight())/2) + $(window).scrollTop());
	_thisLayer.css('top', popYpos + "px");
};
$(window).resize(function(){
	popCenter();
});

// 레이어팝업(딤) 오픈
var isOpenLayer = false;
var _thisBtn;
var openLayerPopup = function openLayerPopup(layerId, focusEl, target, resizeMap, forcedShow) {

	if(!getLsLayer(layerId) || (typeof forcedShow != "undefined" && forcedShow == true)) {

		isOpenLayer = true;
		var _body			= $('body');
		var _thisLayerWrap	= $('#' + layerId + '');
		if(typeof target != 'undefined' && target != '') {
			_thisBtn		= target;
		}else {
			_thisBtn		= $('#btn_' + layerId + '');
		}
		var _thisLayer		= _thisLayerWrap.find('.layer_pop');

		// 같은 레이어 호출시 레이어 닫은 후 포커스 가야할 버튼 다시 지정
		if(typeof(focusEl) != 'undefined' && focusEl != '') {
			_thisBtn = $('#' + focusEl);
		}

		_body.css('overflow-y','hidden');
		_thisLayerWrap.show().find('.layer_pop').attr('tabindex',0);
		
		// window창보다 레이어가 클때 body overflow해제
	    if( $(window).height() < _thisLayerWrap.find('.layer_pop').height() ){
	        _body.css('overflow-y','auto');
	    };

		function popCenter(resizeMap){
			if(typeof resizeMap != 'undefined'){
				if(resizeMap.scrollTop != undefined && resizeMap.scrollTop != '' && resizeMap.scrollTop != null){
					$(window).scrollTop("0");
				}
			}
			
			var popYpos = Math.max(0,( ($(window).height() - _thisLayer.outerHeight())/2) + $(window).scrollTop() );
			_thisLayer.css('top', popYpos + "px");
		}

		popCenter(resizeMap);

		if (_thisLayerWrap.hasClass('layer_magic_affiliation')){
			_thisLayerWrap.find('.pop_magicboading_wrap').focus()
		} else {
			_thisLayerWrap.find('.layer_pop').focus();
		}

		$(window).resize(function() {
			popCenter(resizeMap);
		});

		_thisLayerWrap.find('.tab_wrap, .journey_tab, .tab_wrap6').each(function(){
			tabWrapH($(this));
		});

		_thisLayerWrap.find('.tab_wrap3').each(function(){
			tabWrap3H($(this));
		});

		_thisLayerWrap.find('.tab_wrap5').each(function(){
			tabWrap5H($(this));
		});

		//레이어팝업(딤) 닫기 / 닫은 후 스크롤락 해제
		$('.dim_close').each(function(){
			$(this).on('click', function(){
				var thisLayerPop = $(this).closest('.layer_wrap');
				thisLayerPop.hide();
				if( $('.layer_wrap:visible').length == 0 ){
					$('body').css('overflow-y','auto');
				};
				if(typeof _thisBtn != 'undefined') {
					_thisBtn.focus();
				}
			});
		});
	}

};

/* 레이어 팝업 포커스 & 루프 */
;(function(global, $) {
	$('.layer_wrap, .layer_tooltip').each(function(){

		var _focusable = [];
		var _el_firstFocus = '';
		var _el_lastFocus = '';
		var _this = $(this);
		var _thisId = _this.attr('id');

		_this.find('*').each(function(i, val) {
			if(val.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON/) && parseInt(val.getAttribute("tabIndex")) !== -1) {
				_focusable.push(val);
			}
			if((val.getAttribute("tabIndex") !== undefined) && (parseInt(val.getAttribute("tabIndex")) >= 0)) {
				_focusable.push(val);
			}
		});

		_el_firstFocus = _focusable[0];
		_el_lastFocus = _focusable[_focusable.length-1];

		$(_el_firstFocus).on({
			'keydown' : function(e){
				if (e.target == this){
					var keyCode = e.keyCode;
					if (keyCode == 9){
						if (e.shiftKey){
							$(_el_lastFocus).focus();
							e.preventDefault();
						}
					}
				}
			}
		});
		$(_el_lastFocus).on({
			'keydown' : function(e){
				var keyCode = e.keyCode;
				if (keyCode == 9){
					if (!e.shiftKey){
						$(_el_firstFocus).focus();
						e.preventDefault();
					}
				}
			}
		});

	});

	//딤레이어팝업 포커스회기
	$('button,a').not('.dim_close').one('click', function(){
		if(isOpenLayer){
			var focusElem = $(this);
			$('.dim_close').one('click', function(){
				isOpenLayer = false;
				focusElem.focus();
			});
		}
	});

	//딤레이어팝업 포커스회기 동적바인딩
	$(document).ready(function() {
		$(document).on('click','.partner_box > a, .magic_list_box > a, .company_box > a, #faqList a', function(){
			var focusElem = $(this);
			$('.dim_close').one('click', function(){
				isOpenLayer = false;
				focusElem.focus();
			});
		});
	});

})(window, window.jQuery);

/*
 * 일자 체크
 *
 * 00. thisObject : 체크 대상 object
 *
 * 입력하여 8자리 입력 모두 끝났을때에만 체크한다.
 * ex) 19700101
 *
 * */
var checkValidDate = function checkValidDate($thisObject) {
	var strTemp = "";
	strTemp = $thisObject.val();
	strTemp = replaceChars(strTemp, "-", "");
	strTemp = replaceChars(strTemp, "/", "");

	if(strTemp.length == 8) {
		var dateCheck = new Date();

		var thisYY = parseInt(strTemp.substr(0, 4) - 0);
		var thisMM = parseInt(strTemp.substr(4, 2) - 0);
		var thisDD = parseInt(strTemp.substr(6, 2) - 0);

		if (thisYY < 1000) {
			alert(jsJSON.J0072);//입력년도가 유효하지 않습니다.
			$thisObject.val("")
						.focus();

			return;
		}

		if (thisMM > 12 || thisMM < 1) {
			alert(jsJSON.J0073);//입력월이 유효하지 않습니다.
			$thisObject.val("")
						.focus();

			return;
		}

		var numdays = new Date(thisYY, thisMM, 0).getDate();

		if (thisDD > numdays || thisDD < 1) {
			alert(jsJSON.J0074);//입력일이 유효하지 않습니다.
			$thisObject.val("")
						.focus();

			return;
		}

		$thisObject.val(strTemp.substr(0, 4) + strTemp.substr(4, 2) + strTemp.substr(6, 2));
	}
};

/*
 * 이메일 체크
 *
 * 00. $thisObject : 체크 대상 object
 *
 * */
var checkEmailFormat = function checkEmailFormat($thisObject) {
	var strEmail	= $thisObject.val();
	var check1		= /(@.*@)|(\.\.)|(@\.)|(\.@)|(^\.)/;
	var check2		= /^[a-zA-Z0-9\-\.\_\+]+\@[a-zA-Z0-9\-\.\+]+\.([a-zA-Z]{2,4})$/;

	if (!check1.test(strEmail) && check2.test(strEmail)) {
		return true;
	} else {
		alert(jsJSON.J0075);//올바른 이메일 양식을 입력해주세요.
		$thisObject.val("")
					.focus();

		return false;
	}
};

/*
 * 회원번호 입력 레이어
 *
 * 00. passengerNo		: 회원의 passengerNo
 * 01. sessionUniqueKey : sessionUniqueKey
 *
 * */
var showInputFFPNo = function showInputFFPNo(callType, passengerNo, selectObj, sessionUniqueKey) {
	var btnId = selectObj.attr("id");

	$.ajax({
		url		: "ShowInputFFPNo.do",
		async	: true,
		type	: "post",
		data	: {
			callType : callType,
			passengerNo : passengerNo,
			sessionUniqueKey : sessionUniqueKey
		},
		dataType: 'html',
		success	: function(html) {
			$(".container").append(html);

			openLayerPopup("layer_inputFFPNo", btnId);
		},
		error	: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
		},
		complete: function() {
			checkSSOSessionExtension();
		}
	});
}



/*
 * 회원번호 입력
 *
 * */
var addFFPNo = function addFFPNo() {
	var carrierCode = $("#select_carrierCode").val();
	var ffpNo = $("#input_ffpNo").val();

	if(carrierCode == ""){
		alert(jsJSON.J0077);//항공사를 선택해 주세요
		return;
	}
	if(ffpNo == ""){
		alert(jsJSON.J0078);//회원 번호를 입력해 주세요
		return;
	}

	$.ajax({
		async	: false,
		url		: "AddFFPNo.do",
		type	: "post",
		dataType: "json",
		data	: {
			carrierCode			: carrierCode,
			ffpNo				: ffpNo,
			callType			: $("#btn_addFFPNoConfirm").attr("callType"),
			passengerNo			: $("#btn_addFFPNoConfirm").attr("passengerNo"),
			sessionUniqueKey	: $("#btn_addFFPNoConfirm").attr("sessionUniqueKey")
		},
		beforeSend : function() {
			loadingOpen('area', '#layer_inputFFPNo');
		},
		success		: function(data){
			loadingClose('area', '#layer_inputFFPNo');
			if(data.inputFFPNoResult == "UNMATCH FFPNO") {
				alert(jsJSON.J0079);//회원 번호가 올바르지 않습니다.
				return;
			}
			if(data.inputFFPNoResult == "MISSING FFPNO") {
				alert(jsJSON.J0203);//회원 번호 입력에 실패하였습니다.
				return;
			}
			if(data.inputFFPNoResult == "SUCCESS FFPNO") {
				alert(jsJSON.J0080);//회원 번호 입력에 성공하였습니다.
				$("#layer_inputFFPNo").find('.dim_close').trigger('click');

				var $form_addFFPNo_id = $("#form_addFFPNo");
				if(data.userData != null && data.userData.acno != ""){
					$form_addFFPNo_id.find("input[name=pnrAlpha]").val(data.pnrData.pnrAlpha);
					$form_addFFPNo_id.find("input[name=pnrNumeric]").val(data.pnrData.pnrNumeric);
					$form_addFFPNo_id.find("input[name=officeId]").val(data.pnrData.officeId);
					$form_addFFPNo_id.find("input[name=bizType]").val(data.pnrData.bizType);
					$form_addFFPNo_id.find("input[name=lastName]").val(data.userData.lastName);
					$form_addFFPNo_id.find("input[name=depAirport]").val(data.pnrData.segmentDatas[0].flightInfoDatas[0].departureAirpot);

					$form_addFFPNo_id.attr({
						"action": "ViewReservationDetail.do",
						"method": "post",
						"target": "_self"
					}).submit();
				}else{
					$form_addFFPNo_id.attr({
						"action": "ReservationDetailbyNoLogin.do",
						"method": "post",
						"target": "_self"
					}).submit();
				}
				loadingOpen('entire', 'booking');
			}
		},
		error: function(data) {
			loadingClose('area', '#layer_inputFFPNo');
			alert(JSON.parse(data.responseText).exceptionInfo.message);
		},
		complete: function() {
			checkSSOSessionExtension();
		}
	});
}



/*
 * 국번 선택 레이어 조회
 *
 * 00. $btnId		: 국번 선택 버튼 Selector ID
 * 01. $inpTxtId	: 선택한 국번을 입력할 TextBox Selector ID
 *
 * */
var searchCountryNumber = function searchCountryNumber($btnId, $inpTxtId) {
	// 국번 선택 버튼 Click 이벤트
	$btnId.off("click").on('click', function(event){
		event.stopPropagation();

		if($("#stationNum")) {
			var jsCountryNumHtml	= '	<div id="stationNum" class="layer_wrap">\
											<div class="dim_layer"></div>\
											<div class="layer_pop" style="width:500px;">\
												<div class="pop_cont">\
													<h4>'+jsJSON.J0081+'</h4>\
													<ul class="list_type3">\
														<li>'+jsJSON.J0082+'</li>\
														<li>'+jsJSON.J0083+'</li>\
													</ul>\
													<div class="form_area">\
														<select id="selArea" title="'+jsJSON.J0084+'" style="width:200px;">\
														</select>\
														<select id="selCountry" title="'+jsJSON.J0085+'" style="width:200px;">\
															<option value="" selected>'+jsJSON.J0085+'</option>\
														</select>\
													</div>\
												</div>\
												<div class="btn_wrap_ceType2">\
													<button type="button" id="btnCountryNoConfirm" class="btn_M red">'+jsJSON.J0086+'</button>\
												</div>\
												<a href="#none" class="dim_close"><span class="hidden">'+jsJSON.J0087+'</span></a>\
											</div>\
										</div>';
			$(".container").append(jsCountryNumHtml);
		}


		// 지역 목록 불러오기
		var jsSelAreaDefaultHtml	= '<option value="" selected>'+jsJSON.J0084+'</option>';//지역선택

		$.ajax({
			url			: "searchArea.do",
			async		: false,
			type		: 'POST',
			data		: {},
			dataType	: 'json',
			success		: function(data) {
				var jsAreaList		= data.JSONObject.areaList;
				var $selArea_id		= $("#selArea");
				var $selCountry_id	= $("#selCountry");

				$selArea_id.empty()
						   .html(jsSelAreaDefaultHtml);

				var jsSelCountryDefaultHtml	= '<option value="" selected>'+jsJSON.J0085+'</option>';//나라선택
				$selCountry_id.empty()
							  .html(jsSelCountryDefaultHtml);

				$.each(jsAreaList, function(idx, val) {
					var CONTINENT	= val.CONTINENT;
					var CONTINENT_DESC = val.CONTINENT_DESC;
					$selArea_id.append('<option value="' + CONTINENT + '">' + CONTINENT_DESC + '</option>');
				});
			},
			error: function(data) {
				alert(JSON.parse(data.responseText).exceptionInfo.message);
			},
			complete: function() {
				checkSSOSessionExtension();
			}
		});

		// 국번 선택 팝업 Open
		// 2021-03-23 [1OPT2011003_온라인 결제 인증(3DS2.0) 업그레이드] APS 결제페이지에서 국번버튼 포커싱 문제관련 수정
		openLayerPopup("stationNum", $btnId.prop('id'));
	});



	// 국번 선택 - 지역선택 Select Box Change 이벤트
	$(document).off("change", "#selArea").on("change", "#selArea", function(event) {
		event.stopPropagation();

		var $selArea_id				= $(this);
		var $selCountry_id			= $("#selCountry");

		var jsSelCountryDefaultHtml	= '<option value="" selected>'+jsJSON.J0085+'</option>';//나라선택
		$selCountry_id.empty()
					  .html(jsSelCountryDefaultHtml);

		if($selArea_id.val()) {
			// 지역 선택 시 나라 목록 불러오기
			$.ajax({
				url			: "searchCountry.do",
				async		: false,
				type		: 'POST',
				data		: {
					areaCode	: $selArea_id.val()
				},
				dataType	: 'json',
				success		: function(data) {
					var countryList = data.countryList;
					var languageCode = data.languageCode.toUpperCase();
					
					$.each(countryList, function(idx, val) {
						var country = "";
						var code = val.ISO2LETTER;

						if(languageCode == "KO"){
							country = val.KOREAN;
						}else{
							country = val.ENGLISH;
						}

						if(countryCode == "CN"){
							if(code == "TW"){								
								if(languageCode == "KO"){
									country = "대만,중국";
								}else{
									country = "TAIWAN,CHINA";
								}
							}
						}

						$selCountry_id.append('<option value="' + val.CALLING_CODE + '" continent="' + val.CONTINENT + '" isocode="' + val.ISO2LETTER + '">' + country + '</option>');
					});
				},
				error: function(data) {
					alert(JSON.parse(data.responseText).exceptionInfo.message);
				},
				complete: function() {
					checkSSOSessionExtension();
				}
			});
		}
	});



	// 국번 선택 레이어 확인 버튼 Click 이벤트
	$(document).off("click", "#btnCountryNoConfirm").on('click', "#btnCountryNoConfirm", function(event){
		event.stopPropagation();

		var $selArea_id			= $("#selArea");
		var $selCountry_id		= $("#selCountry");
		var jsSelCountry_val	= $selCountry_id.val();

		if(!$selArea_id.val()) {
			alert(jsJSON.J0088);//지역을 선택해 주시기 바랍니다.

			return false;
		}
		if(!jsSelCountry_val) {
			alert(jsJSON.J0089);//나라를 선택해 주시기 바랍니다.

			return false;
		}

		$inpTxtId.attr("countryNo", jsSelCountry_val)
				 .val($selCountry_id.find(":selected").text() + "(+" + jsSelCountry_val + ")");

		$(this).closest('.layer_wrap').find(".dim_close").click();
	});
}

//이전  공항 data empty check
var prevAirportValidation = function prevAirportValidation($thisId) {
	var validation = true,
		idx = $thisId.replace(/[^0-9]/g,''),
		tempId = $thisId;

	if(tempId.toUpperCase().indexOf('DEP') > -1){
		idx--;
	}

	for(var i = 1; i <= idx; i++){
		var depAirportId = 'departureAirport'+i;
		var arrAirportId = 'arrivalAirport'+i;
		if($('#'+depAirportId).val() == ''){
			tempId = depAirportId.replace(/departure/gi, 'txtDeparture');
			idx = i;
			break;
		}else if($('#'+arrAirportId).val() == '' && (idx != i || tempId.toUpperCase().indexOf('ARR') == -1)){
			tempId = arrAirportId.replace(/arrival/gi, 'txtArrival');
			idx = i;
			break;
		}
	}
	if(tempId != $thisId){
		if(tempId.toUpperCase().indexOf('DEP') > -1) {
			if($('#tripType').val() == 'OW' || $('#tripType').val() == 'RT') {
				alert(jsJSON.J0254);//출발 공항을 선택하여 주십시오.
			}else {
				alert(jsJSON.J0052.replace(/#0/, idx));//#0번 여정의 출발 공항을 선택하여 주십시오.
			}
		}else{
			alert(jsJSON.J0053.replace(/#0/, idx));//#0번 여정의 도착 공항을 선택하여 주십시오.
		}
		$('#'+$thisId).blur();
		$('#'+tempId).parent().find('.btn_airport').focus();
		validation = false;
	}

	return validation;
};

//소아 단독 발권 layer
var viewChildTicketing = function viewChildTicketing() {

	if($('#noAdult').length == 0) {
		$.ajax({
			async: false,
			url: 'ViewChildTicketing.do',
			type: 'post',
			dataType: 'html',
			success : function(data) {
				$('.container').append(data);
				openLayerPopup('noAdult');
			},
			error: function(data) {
				alert(JSON.parse(data.responseText).exceptionInfo.message);
			},
			complete: function() {
				checkSSOSessionExtension();
			}
		});
	}else {
		openLayerPopup('noAdult');
	}

};

// 소아 단독 발권
var childTicketing = function childTicketing() {
	var $inputPnr	= $('#chdBookingPnr'),
		$inputEName	= $('#chdBookingEName'),
		pnr			= $inputPnr.val().replace(/-/gi, ''),
		eName		= $inputEName.val(),
		segLength	= $('div[name=itinerary]').length,
		segDatas	= [],
		segData,
		pBizType;

	if(typeof bookConditionJSON != 'undefined' && typeof $('#bizType').val() == 'undefined'){
		pBizType = bookConditionJSON.bizType;
		segLength = bookConditionJSON.segmentConditionDatas.length;
	}else {
		pBizType = $('#bizType').val();
	}

	if(pnr == '') {
		alert(jsJSON.J0029);//예약번호를 입력해 주십시오.
		$inputPnr.focus();
		return false;
	}
	if(eName == '') {
		alert(jsJSON.J0090);//성(영문)을 입력해 주십시오.
		$inputEName.focus();
		return false;
	}

	for(var i=0; i<segLength; i++) {
		var segData = {};
		segData.departureAirport	= $('#departureAirport'+(i+1)).val();
		segData.arrivalAirport		= $('#arrivalAirport'+(i+1)).val();
		segData.departureDate		= $('#departureDate'+(i+1)).val();
		segData.departureArea		= $('#departureArea'+(i+1)).val();
		segData.departureCity		= $('#departureCity'+(i+1)).val();
		segDatas[i] = segData;
	}

	if('RT' == $('#tripType').val()) {
		segData = {};
		segData.departureAirport	= $('#arrivalAirport1').val();
		segData.arrivalAirport		= $('#departureAirport1').val();
		segData.departureDate		= $('#arrivalDate1').val();
		segDatas[1] = segData;
	}

	$.ajax({
		async: true,
		url: 'ChildTicketing.do',
		type: 'post',
		dataType: 'json',
		data: {
			bizType		: pBizType,
			segDatas	: JSON.stringify(segDatas),
			pnr			: pnr,
			lastName	: eName
		},
		beforeSend : function() {
			loadingOpen('entire', 'booking');
		},
		success: function(data) {
			loadingClose('entire');
			callBackFunction(data);
		},
		error: function(data) {
			loadingClose('entire');
			alert(JSON.parse(data.responseText).exceptionInfo.message);
		},
		complete: function() {
			checkSSOSessionExtension();
		}
	});
};

var popupForItineraryInfo = function popupForItineraryInfo(ticketNo, pnrAlpha, domIntType, bizType, sessionUniqueKey, callType, atcFlag, officeId, lastName) {

	if(atcFlag == "undefined") {
		atcFlag = "";
	}
	if(officeId == "undefined") {
		officeId = "";
	}
	if(lastName == "undefined") {
		lastName = "";
	}

	if(callType =='PDF'){
		action_logging({pagecode:"03_ETK_02"});
	}else{
		action_logging({pagecode:"03_ETK_01"});
	}

	$.ajax({
		async : false,
		url : "DataEncryption.do",
		type : "post",
		dataType : "json",
		data : {
			ticketNo : ticketNo,
			pnrAlpha : pnrAlpha,
			domIntType : domIntType,
			callType : callType,
			officeId : officeId,
			lastName : lastName,
			atcFlag : atcFlag
		},
		success : function(data) {
			var infoData = data.DATAENCRYPT;

			var inputTag = '<input type="hidden" name="infoData" value="'+infoData+'">';
			inputTag += '<input type="hidden" name="bizType" value="'+bizType+'">';
			inputTag += '<input type="hidden" name="sessionUniqueKey" value="'+sessionUniqueKey+'">';
			inputTag += '<input type="hidden" name="atcFlag" value="'+atcFlag+'">';
			inputTag += '<input type="hidden" name="officeId" value="'+officeId+'">';
			inputTag += '<input type="hidden" name="lastName" value="'+lastName+'">';
			jQuery('<form action="ViewItineraryReceipt.do" method="post" target="_blank">'+inputTag+'</form>').appendTo('body').submit().remove();

		},
		error: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
			return false;
		},
		complete: function() {
			checkSSOSessionExtension();
		}
	});
};

// 쿠폰 레이어 닫힘 event
var checkCouponLayerNoToday = function checkCouponLayerNoToday(target) {
	var thisLayerPop = $(target).closest('.layer_wrap'),
		_thisTargetBtnId = thisLayerPop.attr('id');

	if(thisLayerPop.find('input[name=noToday]').is(':checked')) {
		setLsAt00(_thisTargetBtnId, 1);
	}
};

//항공편 좌석 상세정보 조회
var viewFlightDetail = function(selectObj, jsessionID, pnrAlpha, pnrNumeric) {

	var fltno   = $(selectObj).attr('fltno');
	var crrCd   = $(selectObj).attr('fltcrrcd');
	var depAirport = $(selectObj).attr('fltDepAirport');
	var depDate = $(selectObj).attr('fltdate');
	var strcraftType = $(selectObj).attr('strcraftTp');

	if(crrCd.toUpperCase() !== "OZ"){
		alert(jsJSON.J0091);//좌석배치도를 지원하지 않는 항공편입니다.
		return;
	}
	
	action_logging({pagecode:"02_TTL_02"});

	$.ajax({
		url: 'getFlightDetailInfo.do',
		dataType: 'json',
		data: {
			depAirport : depAirport,
			depDate    : depDate,
			fltno      : fltno,
			crrCd      : crrCd,
			jsessionID : jsessionID,
			pnrAlpha   : pnrAlpha,
			pnrNumeric : pnrNumeric
		},
		async: false,
		success: function(data) {
			var ret        = data.FLT_INFO_DATA;
			var crrCd      = ret.carrierCode;
			var flightNo   = ret.flightNo;
			var flightInfo = ret.flightSeatInfo;
			var totalSeats = ret.totalSeatCount;
			var seatMapUrl = '';

			//단일 기번일 경우
			if(flightNo === 'A380' || flightNo === 'A350' || flightNo === 'B747' || flightNo === 'A320') {
				if(flightNo === 'A380'){
					seatMapUrl = '/C/' + countryCode + '/' + languageCode + '/cms/contents/menu/CM201802220000728377?menuId=CM201802220000728377';
				}else if(flightNo === 'A350'){
					seatMapUrl = '/C/' + countryCode + '/' + languageCode + '/cms/contents/menu/CM201802220000728378?menuId=CM201802220000728378';
				}else if(flightNo === 'B747'){
					seatMapUrl = '/C/' + countryCode + '/' + languageCode + '/cms/contents/menu/CM201802220000728379?menuId=CM201802220000728379';
				}else if(flightNo === 'A320'){
					seatMapUrl = '/C/' + countryCode + '/' + languageCode + '/cms/contents/menu/CM201802220000728384?menuId=CM201802220000728384';
				}
			}else{
				if(totalSeats != ""){
					if(flightNo === 'B777'){
						if(totalSeats === '300'){
							seatMapUrl = '/C/' + countryCode + '/' + languageCode + '/cms/contents/menu/CM201802220000728380?tabId=tab_01';
						}else if(totalSeats === '301'){
							seatMapUrl = '/C/' + countryCode + '/' + languageCode + '/cms/contents/menu/CM201802220000728380?tabId=tab_02';
						}else if(totalSeats === '302'){
							//현재 302석 Ⅰ형, Ⅱ형 구분 가능한지 파악 중 파악 후 처리 임시로 Ⅰ형으로 처리
							seatMapUrl = '/C/' + countryCode + '/' + languageCode + '/cms/contents/menu/CM201802220000728380?tabId=tab_03';
//							3)302석-Ⅰ형 : /C/' + countryCode + '/' + languageCode + '/cms/contents/menu/CM201802220000728380?tabId=tab_03
//							4)302석-Ⅱ형 : /C/' + countryCode + '/' + languageCode + '/cms/contents/menu/CM201802220000728380?tabId=tab_04
						}
					}else if(flightNo === 'B767'){
						if(totalSeats === '250'){
							seatMapUrl = '/C/' + countryCode + '/' + languageCode + '/cms/contents/menu/CM201802220000728381?tabId=tab_01';						
						}else if(totalSeats === '290'){
							seatMapUrl = '/C/' + countryCode + '/' + languageCode + '/cms/contents/menu/CM201802220000728381?tabId=tab_03';
						}
					}else if(flightNo === 'A330'){
						if(totalSeats === '290'){
							seatMapUrl = '/C/' + countryCode + '/' + languageCode + '/cms/contents/menu/CM201802220000728382?tabId=tab_01';
						}else if(totalSeats === '298'){
							seatMapUrl = '/C/' + countryCode + '/' + languageCode + '/cms/contents/menu/CM201802220000728382?tabId=tab_02';
						}
					}else if(flightNo === 'A321'){
						if(totalSeats === '174'){
							seatMapUrl = '/C/' + countryCode + '/' + languageCode + '/cms/contents/menu/CM201802220000728383?tabId=tab_02';
						}else if(totalSeats === '195'){
							seatMapUrl = '/C/' + countryCode + '/' + languageCode + '/cms/contents/menu/CM201802220000728383?tabId=tab_03';
						}
					}else if(flightNo === 'A32Q'){
						if(totalSeats === '180'){
							seatMapUrl = '/C/' + countryCode + '/' + languageCode + '/cms/contents/menu/CM201906120001140983?tabId=tab_01';
						}else if(totalSeats === '188'){
							seatMapUrl = '/C/' + countryCode + '/' + languageCode + '/cms/contents/menu/CM201906120001140983?tabId=tab_02';
						}
					}
				}
			}

			// 좌석 배치 팝업 호출
			if(seatMapUrl !== ''){
				window.open(seatMapUrl, '_blank');
			}else{
				alert(jsJSON.J0091);//좌석배치도를 지원하지 않는 항공편입니다.
				return;
			}
		}, error: function(data) {
			// joyj 모바일웹 좌석배치표 연계 불가 관련 확인 by 김소진
			//viewFlightDetail(selectObj, '', pnrAlpha, pnrNumeric);
			alert(jsJSON.J0091);//좌석배치도를 지원하지 않는 항공편입니다.
			return;
		},
		complete: function() {
			checkSSOSessionExtension();
		}
	});
};

var makeAdditionalInfoData = function makeAdditionalInfoData(pCallerType){
	var apisDatas = [];
	var contactInfos = [];
	$('.toggle_box').each(function(idx) {
		var $this = $(this),
			idx = idx+1;

		var apisData = {};

		if($('#check0'+idx).prop('checked') == false) { //체크되지 않은 passenger는 제출하지않음
			apisDatas.push(apisData);
    		return true;
    	}

		apisData.passengerType		= 	$this.attr('passengerType');
		apisData.firstName			= 	$this.attr('firstName');
		apisData.lastName			= 	$this.attr('lastName');
		apisData.nationality		=	$('#nation'+idx).val();

		if($('#email'+idx).is(':checked')) {
			var contact = {
				index : idx,
				type : 'E',
				value : $('#inputTxtEmail'+idx).val(),
				airlineCode : '',
				languageCode : ''
			}
			contactInfos.push(contact);
		}
		if($('#phone'+idx).is(':checked')) {

			var phoneNo = $('#inputTxtPhone'+idx).val();
			if(phoneNo.length > 0) {
				phoneNo = phoneNo.substring(1);
			}
			var contact = {
					index : idx,
					type : 'M',
					value : phoneNo,
					airlineCode : '',
					languageCode : ''
				}
				contactInfos.push(contact);
		}

		if($('#male'+idx).is(':checked')) {
			apisData.gender				= 'M';
		}
		if($('#female'+idx).is(':checked')) {
			apisData.gender				= 'F';
		}

		apisData.dateOfBirth		=	$('#birth_year'+idx).val() + $('#birth_month'+idx).val() + $('#birth_date'+idx).val();
		apisData.issueingCountry	=	$('#issuing_country'+idx).val();
		apisData.documentNumber		=	$('#passport_num'+idx).val();
		apisData.expiryDate			=	$('#expiry_year'+idx).val() + $('#expiry_month'+idx).val() + $('#expiry_date'+idx).val();
		apisData.passengerNo		=	$this.attr('paxNo');
		apisData.knownTravelerNum   =   $('#knownTraveler_num'+idx).val();
		
		if(usAreaSeg && apisData.passengerType != 'INF') {
			apisData.liveCountry		= 	$('#live_country'+idx).val();
			
			if($('#live_country'+idx).val() == 'US') {
				apisData.residenceInfo			=	true;
				apisData.residenceCountry		=	$('#residen_nation'+idx).val();
				apisData.residenceNumber		=	$('#residen_num'+idx).val();
				apisData.residenceIssueCountry	=	$('#residen_curren'+idx).val();
				apisData.residenceExpiryDate	=	$('#residenEnd_year'+idx).val() + $('#residenEnd_month'+idx).val() + $('#residenEnd_date'+idx).val();
			}else {
				if($('#destination'+idx).css('display') != 'none') {
					var destinationCountry = $('#desti_nation'+idx).val();
					if( !$('#no_end'+idx).is(':checked') && destinationCountry != undefined) {
						apisData.destinationInfo		=	true;
						apisData.destinationCountry		=	destinationCountry;
						apisData.destinationAddress		=	$('#nation_address'+idx).val();
						apisData.destinationZipCode		=	$('#nation_zipcode'+idx).val();
						apisData.destinationCity		=	$('#nation_city'+idx).val();
						apisData.destinationState		=	$('#nation_state'+idx).val();
					}
				}
			}
			
		}
		
		apisDatas.push(apisData);
		
	});

	var jsonPassengerDatas = jsonPnrData.passengerDatas,
		pLength = jsonPassengerDatas.length,
		aLength	= apisDatas.length,
		jsonTempPassengerDatas = [];

	for(var i=0; i<pLength; i++) {
		var passengerData = jsonPassengerDatas[i];

		for(var j=0; j<aLength; j++) {
			var apisData = apisDatas[j];
			if(passengerData.passengerType == apisData.passengerType && passengerData.passengerNo == apisData.passengerNo) {
				if(passengerData.apisData != null) {
					apisData.updateApis			= passengerData.apisData.updateApis;
					apisData.updateDestination	= passengerData.apisData.updateDestination;
					apisData.updateResidence	= passengerData.apisData.updateResidence;
				}
				
				passengerData.apisData = apisData;
				jsonTempPassengerDatas.push(passengerData);
				
				if(typeof apisPassengers != 'undefined') {
					if(apisPassengers.length == 0) {
						apisPassengers.push(passengerData.passengerType+passengerData.passengerNo);
					}else {
						for(var k=0; k<apisPassengers.length; k++) {
							if(apisPassengers[k] != (passengerData.passengerType+passengerData.passengerNo)) {
								apisPassengers.push(passengerData.passengerType+passengerData.passengerNo);
							}else {
								break;
							}
						}
					}
				}
				
				break;
			}
		}
	}

	if(pCallerType == 'AUTO_CHECKIN')
	{
		var jsonPnrDataStr = JSON.stringify(jsonPnrData);
		var jsonPnrDataTmp = JSON.parse(jsonPnrDataStr);
		jsonPnrDataTmp.passengerDatas = jsonTempPassengerDatas;
		var result = [jsonPnrDataTmp, contactInfos];
		return result;
	} else if(pCallerType == "INPUT_APIS_RESERVATION_DETAIL") {
		var additionalInfoInputData = {};
		additionalInfoInputData.callerType			= pCallerType;
		additionalInfoInputData.officeId			= jsonPnrData.officeId;
		additionalInfoInputData.bizType				= jsonPnrData.bizType;
		additionalInfoInputData.domIntType			= jsonPnrData.domIntType;
		additionalInfoInputData.pnrAlpha			= jsonPnrData.pnrAlpha;
		additionalInfoInputData.pnrNumeric			= jsonPnrData.pnrNumeric;
		additionalInfoInputData.pageTicket			= jsonPnrData.pageTicket;
		additionalInfoInputData.jsessionId			= jsonPnrData.jsessionId;
		additionalInfoInputData.passengerDataList	= jsonTempPassengerDatas;
		return additionalInfoInputData;
	} else {
		var additionalInfoInputData = {};
		additionalInfoInputData.callerType			= pCallerType;
		additionalInfoInputData.officeId			= jsonPnrData.officeId;
		additionalInfoInputData.bizType				= jsonPnrData.bizType;
		additionalInfoInputData.domIntType			= jsonPnrData.domIntType;
		additionalInfoInputData.pnrAlpha			= jsonPnrData.pnrAlpha;
		additionalInfoInputData.pnrNumeric			= jsonPnrData.pnrNumeric;
		additionalInfoInputData.pageTicket			= jsonPnrData.pageTicket;
		additionalInfoInputData.jsessionId			= jsonPnrData.jsessionId;
		additionalInfoInputData.passengerDataList	= jsonTempPassengerDatas;
		additionalInfoInputData.contactDataList		= jsonPnrData.reservationContacts;
		return additionalInfoInputData;
	}


};

// 대노선 및 미취항지 set
var setAreaAndDirectLength = function setAreaAndDirectLength() {

	directNLength	= 0;
	areaLength		= 0;
	areas			= [];
	uniqueAreas		= [];

	var $length = $('div[name=itinerary]').length;

	$('input[id^=departureArea], input[id^=arrivalArea]').each(function(idx) {
		var $this = $(this),
			$thisVal = $this.val();

		if($thisVal != '') {
			if($this.attr('id') != 'arrivalArea'+$length) {
				areas.push($thisVal);
			}
		}
	});

	$.each(areas, function(i, el) {
		if($.inArray(el, uniqueAreas) === -1) {
			uniqueAreas.push(el);
		}
	});

	areaLength = uniqueAreas.length;

	$('input[id^=arrivalDirect]').each(function() {
		var $this	= $(this),
			$idx	= $this.attr('id').replace(/[^0-9]/g, '');

		if($('#departureArea'+$idx).val() != 'KR' || $('#departureAirport'+$idx).val() == 'ICN') {
			if($(this).val() == 'N'){
				directNLength++;
			}
		}
	});

	if($('#departureArea'+$length).val() == 'KR' && $('#departureAirport'+$length).val() != 'ICN') {
		directNLength = 0;
	}

};

// 개인할인 안내 메시지
var fncPersonalPtcMsg = function fncPersonalPtcMsg(depSelector, arrSelector) {
	if(checkCntPtcObj("OB|ZZ|CH", depSelector) > 0 || checkCntPtcObj("OB|ZZ|CH", arrSelector) > 0 // 경로우대/청소년/소아
			|| checkCntPtcObj("PR|CD", depSelector) > 0 || checkCntPtcObj("PR|CD", arrSelector) > 0 // 장애인
			|| checkCntPtcObj("CJ|CR", depSelector) > 0 || checkCntPtcObj("CJ|CR", arrSelector) > 0 // 제주도민/재외제주도민
			|| checkCntPtcObj("ME", depSelector) > 0 || checkCntPtcObj("ME", arrSelector) > 0 // 군인
			|| checkCntPtcObj("NP|NI|NQ|NG", depSelector) > 0 || checkCntPtcObj("NP|NI|NQ|NG", arrSelector) > 0 // 독립유공자/국가유공자/유족 등등
			|| checkCntPtcObj("NMQ", depSelector) > 0 || checkCntPtcObj("NMQ", arrSelector) > 0 // 국가유공자	공항세
			|| checkCntPtcObj("NA", depSelector) > 0 || checkCntPtcObj("NA", arrSelector) > 0 // 고엽제
			|| checkCntPtcObj("DIS|CD", depSelector) > 0 || checkCntPtcObj("DIS|CD", arrSelector) > 0 // 장애인 공항세
			|| checkCntPtcObj("PFA|TEA", depSelector) > 0 || checkCntPtcObj("PFA|TEA", arrSelector) > 0) { // 기초생활수급자, 기술기능분야 우수자

		alert(jsJSON.J0204);//탑승 당일 할인 증빙 서류를 제시하여 주시기 바랍니다. 미 소지 시 공항에서 정상 운임으로 항공권을 구매하신 후 탑승하실 수 있습니다.
	}
};

// RED 개인할인 안내 메시지
var fncPersonalPtcMsgRED = function fncPersonalPtcMsgRED(selector) {
	if(checkCntPtcObj("DIS|ICA|NMA|NME|NMQ|PFA|TEA|DAJ", selector) > 0) {

		alert(jsJSON.J0204);//탑승 당일 할인 증빙 서류를 제시하여 주시기 바랍니다. 미 소지 시 공항에서 정상 운임으로 항공권을 구매하신 후 탑승하실 수 있습니다.
	}
};

// RED ptc validation
var ptcValidationRED = function ptcValidationRED(selector) {
	var isValidation = true;
	
	if(checkCntPtcObj('ICA', selector) > 0) {
		if(checkCntPtcCodeMulti('DIS', 'ICA', selector) == '0000') { // 할인대상자, 동반자 인원이 동일한 경우
			if(checkCntPtcObj('ICA', selector) > 0) {
				alert(jsJSON.J0224);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용되며 탑승 당일 할인 증빙 서류를 제시하여 주시기 바랍니다. 미 소지 시 공항에서 정상 운임으로 항공권을 구매하신 후 탑승하실 수 있습니다.
			}
		} else { // 할인대상자, 동반자 인원이 틀린 경우
			if(childCnt > 0 || infantCnt > 0) {
				
				var cnt = checkCntPtcObj("ICA", selector);
				
				if(cnt != childCnt & cnt != infantCnt && cnt != (childCnt + infantCnt)) {
					if(checkPtcCodeBase(selector, 'DIS', 'ICA') != '0000'){
						alert(jsJSON.J0205+'\n'+jsJSON.J0206.replace(/#0/, $('option[ptccode=ICA]').eq(0).text()));
						isValidation = false;
						return;
					}
				}
			}else {
				if(checkCntPtcObj('DIS', selector) > 0) {
					alert(jsJSON.J0226);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인을 초과하여 선택하실 수 없습니다. 할인 대상자를 확인해주시기 바랍니다.
				}else {
					alert(jsJSON.J0227);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용됩니다. 할인 증빙을 소지한 승객과 분리하여 항공권을 구매하신 경우에는 인터넷으로 동반 보호자 1인 항공권만 단독으로 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
				}
				isValidation = false;
				return;
			}
		}
	}
	
	if(checkCntPtcObj('DAJ', selector) > 0) {
		if(checkCntPtcCodeMulti('DIS', 'DAJ', selector) == '0000') { // 할인대상자, 동반자 인원이 동일한 경우
			if(checkCntPtcObj('DAJ', selector) > 0) {
				alert(jsJSON.J0224);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용되며 탑승 당일 할인 증빙 서류를 제시하여 주시기 바랍니다. 미 소지 시 공항에서 정상 운임으로 항공권을 구매하신 후 탑승하실 수 있습니다.
			}
		} else { // 할인대상자, 동반자 인원이 틀린 경우
			if(childCnt > 0 || infantCnt > 0) {

				var cnt = checkCntPtcObj("DAJ", selector);

				if(cnt != childCnt & cnt != infantCnt && cnt != (childCnt + infantCnt)) {
					if(checkPtcCodeBase(selector, 'DIS', 'DAJ') != '0000'){
						alert(jsJSON.J0205+'\n'+jsJSON.J0206.replace(/#0/, $('option[ptccode=DAJ]').eq(0).text()));
						isValidation = false;
						return;
					}
				}
			}else {
				if(checkCntPtcObj('DIS', selector) > 0) {
					alert(jsJSON.J0226);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인을 초과하여 선택하실 수 없습니다. 할인 대상자를 확인해주시기 바랍니다.
				}else {
					alert(jsJSON.J0227);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용됩니다. 할인 증빙을 소지한 승객과 분리하여 항공권을 구매하신 경우에는 인터넷으로 동반 보호자 1인 항공권만 단독으로 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
				}
				isValidation = false;
				return;
			}
		}
	}

	if(checkCntPtcObj('NME', selector) > 0) {
		if(checkCntPtcCodeMulti('NMQ', 'NME', selector) == '0000') { // 할인대상자, 동반자 인원이 동일한 경우
			if(checkCntPtcObj('NME', selector) > 0) {
				alert(jsJSON.J0224);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용되며 탑승 당일 할인 증빙 서류를 제시하여 주시기 바랍니다. 미 소지 시 공항에서 정상 운임으로 항공권을 구매하신 후 탑승하실 수 있습니다.
			}
		} else { // 할인대상자, 동반자 인원이 틀린 경우
			if(checkCntPtcObj('NMQ', selector) > 0) {
				alert(jsJSON.J0226);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인을 초과하여 선택하실 수 없습니다. 할인 대상자를 확인해주시기 바랍니다.
			}else {
				alert(jsJSON.J0227);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용됩니다. 할인 증빙을 소지한 승객과 분리하여 항공권을 구매하신 경우에는 인터넷으로 동반 보호자 1인 항공권만 단독으로 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
			}
			isValidation = false;
			return;
		}
	}
	
	return isValidation;
};

// ptc validation
var ptcValidation = function ptcValidation(depSelector, arrSelector) {
	var isValidation = true;

	// 장애인 동반자 할인 체크 로직 변경 및 추가 - 20140611 KKD req 차소희
	if(checkCntPtcObj('PR|CD',depSelector) > 0 || checkCntPtcObj('PC',depSelector) > 0) { // 할인대상자 또는 동반자가 선택된 경우
		if(checkCntPtcCodeMulti('PR|CD','PC',depSelector) == '0000') { // 할인대상자, 동반자 인원이 동일한 경우
			if(checkCntPtcObj('PC',depSelector) > 0) {
				alert(jsJSON.J0216);//가는여정 동반 보호자 1인 할인은 할인 증빙을 소지한 승객 1인과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용되며 탑승 당일 할인 증빙 서류를 제시하여 주시기 바랍니다. 미 소지 시 공항에서 정상 운임으로 항공권을 구매하신 후 탑승하실 수 있습니다.
			}
		}else { // 할인대상자, 동반자 인원이 틀린 경우
			if(infantCnt > 0) {
				alert(jsJSON.J0217);//가는 여정 유아 장애인과 함께 탑승하시는 동반 보호자 1인은 인터넷으로 항공권 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
			}else {
				if(checkCntPtcObj('PR|CD',depSelector) > 0) {
					alert(jsJSON.J0218);//가는여정 동반 보호자 1인 할인은 할인 증빙을 소지한 승객 1인을 초과하여 선택하실 수 없습니다. 할인 대상자를 확인해주시기 바랍니다.
				}else {
					alert(jsJSON.J0219);//가는여정 동반 보호자 1인 할인은 할인 증빙을 소지한 승객과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용됩니다. 할인 증빙을 소지한 승객과 분리하여 항공권을 구매하신 경우에는 인터넷으로 동반 보호자 1인 항공권만 단독으로 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
				}
			}
			isValidation = false;
			return;
		}
	}

	if(checkCntPtcObj('PR|CD',arrSelector) > 0 || checkCntPtcObj('PC',arrSelector) > 0) { // 할인대상자 또는 동반자가 선택된 경우
		if(checkCntPtcCodeMulti('PR|CD','PC',arrSelector) == '0000') { // 할인대상자, 동반자 인원이 동일한 경우
			if(checkCntPtcObj('PC',arrSelector) > 0) {
				alert(jsJSON.J0220);//오는여정 동반 보호자 1인 할인은 할인 증빙을 소지한 승객 1인과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용되며 탑승 당일 할인 증빙 서류를 제시하여 주시기 바랍니다. 미 소지 시 공항에서 정상 운임으로 항공권을 구매하신 후 탑승하실 수 있습니다.
			}
		}else { // 할인대상자, 동반자 인원이 틀린 경우
			if(infantCnt > 0) {
				alert(jsJSON.J0221);//오는 여정 유아 장애인과 함께 탑승하시는 동반 보호자 1인은 인터넷으로 항공권 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
			}else {
				if(checkCntPtcObj('PR|CD',arrSelector) > 0) {
					alert(jsJSON.J0222);//오는여정 동반 보호자 1인 할인은 할인 증빙을 소지한 승객 1인을 초과하여 선택하실 수 없습니다. 할인 대상자를 확인해주시기 바랍니다.
				}else {
					alert(jsJSON.J0223);//오는여정 동반 보호자 1인 할인은 할인 증빙을 소지한 승객과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용됩니다. 할인 증빙을 소지한 승객과 분리하여 항공권을 구매하신 경우에는 인터넷으로 동반 보호자 1인 항공권만 단독으로 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
				}
			}
			isValidation = false;
			return;
		}
	}

	// 장애인 공항세 할인
	if(checkCntPtcObj('CD|DIS',depSelector) > 0 || checkCntPtcObj('ICA',depSelector) > 0) { // 할인대상자 또는 동반자가 선택된 경우
		if(checkCntPtcCodeMulti('CD|DIS','ICA',depSelector) == '0000') { // 할인대상자, 동반자 인원이 동일한 경우
			if(checkCntPtcObj('ICA',depSelector) > 0) {
				alert(jsJSON.J0224);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용되며 탑승 당일 할인 증빙 서류를 제시하여 주시기 바랍니다. 미 소지 시 공항에서 정상 운임으로 항공권을 구매하신 후 탑승하실 수 있습니다.
			}
		} else { // 할인대상자, 동반자 인원이 틀린 경우
			if(infantCnt > 0) {
				alert(jsJSON.J0225);//가는 여정 유아 장애인과 함께 탑승하시는 동반 보호자 1인 공항세 할인은 인터넷으로 항공권 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
			}else {
				if(checkCntPtcObj('CD|DIS',depSelector) > 0) {
					alert(jsJSON.J0226);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인을 초과하여 선택하실 수 없습니다. 할인 대상자를 확인해주시기 바랍니다.
				}else {
					alert(jsJSON.J0227);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용됩니다. 할인 증빙을 소지한 승객과 분리하여 항공권을 구매하신 경우에는 인터넷으로 동반 보호자 1인 항공권만 단독으로 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
				}
			}
			isValidation = false;
			return;
		}
	}
	if(checkCntPtcObj('CD|DIS',arrSelector) > 0 || checkCntPtcObj('ICA',arrSelector) > 0) { // 할인대상자 또는 동반자가 선택된 경우
		if(checkCntPtcCodeMulti('CD|DIS','ICA',arrSelector) == '0000') { // 할인대상자, 동반자 인원이 동일한 경우
			if(checkCntPtcObj('ICA',arrSelector) > 0) {
				alert(jsJSON.J0228);//오는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용되며 탑승 당일 할인 증빙 서류를 제시하여 주시기 바랍니다. 미 소지 시 공항에서 정상 운임으로 항공권을 구매하신 후 탑승하실 수 있습니다.
			}
		}else { // 할인대상자, 동반자 인원이 틀린 경우
			if(infantCnt > 0) {
				alert(jsJSON.J0229);//오는 여정 유아 장애인과 함께 탑승하시는 동반 보호자 1인 공항세 할인은 인터넷으로 항공권 구매가 인터넷으로 항공권 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
			}else {
				if(checkCntPtcObj('CD|DIS',arrSelector) > 0) {
					alert(jsJSON.J0230);//오는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인을 초과하여 선택하실 수 없습니다. 할인 대상자를 확인해주시기 바랍니다.
				}else {
					alert(jsJSON.J0231);//오는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용됩니다. 할인 증빙을 소지한 승객과 분리하여 항공권을 구매하신 경우에는 인터넷으로 동반 보호자 1인 항공권만 단독으로 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
				}
			}
			isValidation = false;
			return;
		}
	}
	
	// 장애인 공항세 할인
	if(checkCntPtcObj('CD|DIS',depSelector) > 0 || checkCntPtcObj('DAJ',depSelector) > 0) { // 할인대상자 또는 동반자가 선택된 경우
		if(checkCntPtcCodeMulti('CD|DIS','DAJ',depSelector) == '0000') { // 할인대상자, 동반자 인원이 동일한 경우
			if(checkCntPtcObj('DAJ',depSelector) > 0) {
				alert(jsJSON.J0224);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용되며 탑승 당일 할인 증빙 서류를 제시하여 주시기 바랍니다. 미 소지 시 공항에서 정상 운임으로 항공권을 구매하신 후 탑승하실 수 있습니다.
			}
		} else { // 할인대상자, 동반자 인원이 틀린 경우
			if(infantCnt > 0) {
				alert(jsJSON.J0225);//가는 여정 유아 장애인과 함께 탑승하시는 동반 보호자 1인 공항세 할인은 인터넷으로 항공권 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
			}else {
				if(checkCntPtcObj('CD|DIS',depSelector) > 0) {
					alert(jsJSON.J0226);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인을 초과하여 선택하실 수 없습니다. 할인 대상자를 확인해주시기 바랍니다.
				}else {
					alert(jsJSON.J0227);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용됩니다. 할인 증빙을 소지한 승객과 분리하여 항공권을 구매하신 경우에는 인터넷으로 동반 보호자 1인 항공권만 단독으로 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
				}
			}
			isValidation = false;
			return;
		}
	}
	if(checkCntPtcObj('CD|DIS',arrSelector) > 0 || checkCntPtcObj('DAJ',arrSelector) > 0) { // 할인대상자 또는 동반자가 선택된 경우
		if(checkCntPtcCodeMulti('CD|DIS','DAJ',arrSelector) == '0000') { // 할인대상자, 동반자 인원이 동일한 경우
			if(checkCntPtcObj('DAJ',arrSelector) > 0) {
				alert(jsJSON.J0228);//오는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용되며 탑승 당일 할인 증빙 서류를 제시하여 주시기 바랍니다. 미 소지 시 공항에서 정상 운임으로 항공권을 구매하신 후 탑승하실 수 있습니다.
			}
		}else { // 할인대상자, 동반자 인원이 틀린 경우
			if(infantCnt > 0) {
				alert(jsJSON.J0229);//오는 여정 유아 장애인과 함께 탑승하시는 동반 보호자 1인 공항세 할인은 인터넷으로 항공권 구매가 인터넷으로 항공권 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
			}else {
				if(checkCntPtcObj('CD|DIS',arrSelector) > 0) {
					alert(jsJSON.J0230);//오는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인을 초과하여 선택하실 수 없습니다. 할인 대상자를 확인해주시기 바랍니다.
				}else {
					alert(jsJSON.J0231);//오는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용됩니다. 할인 증빙을 소지한 승객과 분리하여 항공권을 구매하신 경우에는 인터넷으로 동반 보호자 1인 항공권만 단독으로 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
				}
			}
			isValidation = false;
			return;
		}
	}

	// CH50(성인2, 소아1 일 경우, 성인1 PTC 적용, 성인2 PTC 동반자 적용, 소아1 PTC 동반자 적용시 필터링 안됨.)
	if(checkCntPtcObj('CH50',depSelector) > 0) { // 할인대상자 또는 동반자가 선택된 경우
		if(checkCntPtcCodeMulti('NQ|NI','NG|ND|NE|NC|CH50',depSelector) != '0000') { // 할인대상자, 동반자 인원이 동일하지 않은 경우
			if(checkCntPtcObj('NQ|NI',depSelector) > 0) {
				alert(jsJSON.J0226);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인을 초과하여 선택하실 수 없습니다. 할인 대상자를 확인해주시기 바랍니다.
			}else {
				alert(jsJSON.J0227);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용됩니다. 할인 증빙을 소지한 승객과 분리하여 항공권을 구매하신 경우에는 인터넷으로 동반 보호자 1인 항공권만 단독으로 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
			}
			isValidation = false;
			return;
		}
	}
	if(checkCntPtcObj('CH50',arrSelector) > 0) { // 할인대상자 또는 동반자가 선택된 경우
		if(checkCntPtcCodeMulti('NQ|NI','NG|ND|NE|NC|CH50',arrSelector) != '0000') { // 할인대상자, 동반자 인원이 동일하지 않은 경우
			// 할인대상자, 동반자 인원이 틀린 경우
			if(checkCntPtcObj('NQ|NI',arrSelector) > 0) {
				alert(jsJSON.J0230);//오는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인을 초과하여 선택하실 수 없습니다. 할인 대상자를 확인해주시기 바랍니다.
			}else {
				alert(jsJSON.J0231);//오는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용됩니다. 할인 증빙을 소지한 승객과 분리하여 항공권을 구매하신 경우에는 인터넷으로 동반 보호자 1인 항공권만 단독으로 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
			}
			isValidation = false;
			return;
		}
	}
	
	if(checkCntPtcObj('NQ',depSelector) > 0 || checkCntPtcObj('ND|NE|NC',depSelector) > 0) { // 할인대상자 또는 동반자가 선택된 경우
		if(checkCntPtcCodeMulti('NQ','ND|NE|NC',depSelector) == '0000') { // 할인대상자, 동반자 인원이 동일한 경우
			if(checkCntPtcObj('ND|NE|NC',depSelector) > 0) {
				alert(jsJSON.J0224);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용되며 탑승 당일 할인 증빙 서류를 제시하여 주시기 바랍니다. 미 소지 시 공항에서 정상 운임으로 항공권을 구매하신 후 탑승하실 수 있습니다.
			}
		} else { // 할인대상자, 동반자 인원이 틀린 경우
			if(checkCntPtcObj('NQ',depSelector) > 0) {
				alert(jsJSON.J0226);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인을 초과하여 선택하실 수 없습니다. 할인 대상자를 확인해주시기 바랍니다.
			}else {
				alert(jsJSON.J0227);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용됩니다. 할인 증빙을 소지한 승객과 분리하여 항공권을 구매하신 경우에는 인터넷으로 동반 보호자 1인 항공권만 단독으로 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
			}
			isValidation = false;
			return;
		}
	}
	if(checkCntPtcObj('NQ',arrSelector) > 0 || checkCntPtcObj('ND|NE|NC',arrSelector) > 0) { // 할인대상자 또는 동반자가 선택된 경우
		if(checkCntPtcCodeMulti('NQ','ND|NE|NC',arrSelector) == '0000') { // 할인대상자, 동반자 인원이 동일한 경우
			if(checkCntPtcObj('ND|NE|NC',arrSelector) > 0) {
				alert(jsJSON.J0228);//오는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용되며 탑승 당일 할인 증빙 서류를 제시하여 주시기 바랍니다. 미 소지 시 공항에서 정상 운임으로 항공권을 구매하신 후 탑승하실 수 있습니다.
			}
		}else { // 할인대상자, 동반자 인원이 틀린 경우
			if(checkCntPtcObj('NQ',arrSelector) > 0) {
				alert(jsJSON.J0230);//오는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인을 초과하여 선택하실 수 없습니다. 할인 대상자를 확인해주시기 바랍니다.
			}else {
				alert(jsJSON.J0231);//오는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용됩니다. 할인 증빙을 소지한 승객과 분리하여 항공권을 구매하신 경우에는 인터넷으로 동반 보호자 1인 항공권만 단독으로 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
			}
			isValidation = false;
			return;
		}
	}
	
	if(checkCntPtcObj('NI',depSelector) > 0 || checkCntPtcObj('NG',depSelector) > 0) { // 할인대상자 또는 동반자가 선택된 경우
		if(checkCntPtcCodeMulti('NI','NG',depSelector) == '0000') { // 할인대상자, 동반자 인원이 동일한 경우
			if(checkCntPtcObj('NG',depSelector) > 0) {
				alert(jsJSON.J0224);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용되며 탑승 당일 할인 증빙 서류를 제시하여 주시기 바랍니다. 미 소지 시 공항에서 정상 운임으로 항공권을 구매하신 후 탑승하실 수 있습니다.
			}
		} else { // 할인대상자, 동반자 인원이 틀린 경우
			if(checkCntPtcObj('NI',depSelector) > 0) {
				alert(jsJSON.J0226);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인을 초과하여 선택하실 수 없습니다. 할인 대상자를 확인해주시기 바랍니다.
			}else {
				alert(jsJSON.J0227);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용됩니다. 할인 증빙을 소지한 승객과 분리하여 항공권을 구매하신 경우에는 인터넷으로 동반 보호자 1인 항공권만 단독으로 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
			}
			isValidation = false;
			return;
		}
	}
	if(checkCntPtcObj('NI',arrSelector) > 0 || checkCntPtcObj('NG',arrSelector) > 0) { // 할인대상자 또는 동반자가 선택된 경우
		if(checkCntPtcCodeMulti('NI','NG',arrSelector) == '0000') { // 할인대상자, 동반자 인원이 동일한 경우
			if(checkCntPtcObj('NG',arrSelector) > 0) {
				alert(jsJSON.J0228);//오는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용되며 탑승 당일 할인 증빙 서류를 제시하여 주시기 바랍니다. 미 소지 시 공항에서 정상 운임으로 항공권을 구매하신 후 탑승하실 수 있습니다.
			}
		}else { // 할인대상자, 동반자 인원이 틀린 경우
			if(checkCntPtcObj('NI',arrSelector) > 0) {
				alert(jsJSON.J0230);//오는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인을 초과하여 선택하실 수 없습니다. 할인 대상자를 확인해주시기 바랍니다.
			}else {
				alert(jsJSON.J0231);//오는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용됩니다. 할인 증빙을 소지한 승객과 분리하여 항공권을 구매하신 경우에는 인터넷으로 동반 보호자 1인 항공권만 단독으로 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
			}
			isValidation = false;
			return;
		}
	}
	
	// 국가유공상이자
	if(checkCntPtcObj('NMQ',depSelector) > 0 || checkCntPtcObj('NME',depSelector) > 0) { // 할인대상자 또는 동반자가 선택된 경우
		if(checkCntPtcCodeMulti('NMQ','NME',depSelector) == '0000') { // 할인대상자, 동반자 인원이 동일한 경우
			if(checkCntPtcObj('NME',depSelector) > 0) {
				alert(jsJSON.J0224);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용되며 탑승 당일 할인 증빙 서류를 제시하여 주시기 바랍니다. 미 소지 시 공항에서 정상 운임으로 항공권을 구매하신 후 탑승하실 수 있습니다.
			}
		} else { // 할인대상자, 동반자 인원이 틀린 경우
			if(checkCntPtcObj('NMQ',depSelector) > 0) {
				alert(jsJSON.J0226);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인을 초과하여 선택하실 수 없습니다. 할인 대상자를 확인해주시기 바랍니다.
			}else {
				alert(jsJSON.J0227);//가는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용됩니다. 할인 증빙을 소지한 승객과 분리하여 항공권을 구매하신 경우에는 인터넷으로 동반 보호자 1인 항공권만 단독으로 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
			}
			isValidation = false;
			return;
		}
	}
	if(checkCntPtcObj('NMQ',arrSelector) > 0 || checkCntPtcObj('NME',arrSelector) > 0) { // 할인대상자 또는 동반자가 선택된 경우
		if(checkCntPtcCodeMulti('NMQ','NME',arrSelector) == '0000') { // 할인대상자, 동반자 인원이 동일한 경우
			if(checkCntPtcObj('NME',arrSelector) > 0) {
				alert(jsJSON.J0228);//오는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용되며 탑승 당일 할인 증빙 서류를 제시하여 주시기 바랍니다. 미 소지 시 공항에서 정상 운임으로 항공권을 구매하신 후 탑승하실 수 있습니다.
			}
		}else { // 할인대상자, 동반자 인원이 틀린 경우
			if(checkCntPtcObj('NMQ',arrSelector) > 0) {
				alert(jsJSON.J0230);//오는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객 1인을 초과하여 선택하실 수 없습니다. 할인 대상자를 확인해주시기 바랍니다.
			}else {
				alert(jsJSON.J0231);//오는여정 동반 보호자 1인 공항세 할인은 할인 증빙을 소지한 승객과 동일한 일정으로 동시에 항공권 구매 후 동반하여 탑승하실 경우에만 적용됩니다. 할인 증빙을 소지한 승객과 분리하여 항공권을 구매하신 경우에는 인터넷으로 동반 보호자 1인 항공권만 단독으로 구매가 불가하오니 예약센터(1588-8000)를 통해 구매하시기 바랍니다.
			}
			isValidation = false;
			return;
		}
	}

	return isValidation;
};

// 국내선 PTC 할인 코드 갯수
var checkCntPtcObj = function checkCntPtcObj(PtcCode, ObjID) {
	var cnt = 0,
		PtcCodeArr = PtcCode.split('|'),
		pLength = PtcCodeArr.length;

	$('[id^='+ObjID+']').each(function(){

		var $thisVal = $(this).val();
		var $thisId = $(this).attr('id');
		
		var $ptcRate = '';
		if($thisVal == 'CH') {
			var rate = $('#'+$(this).attr('id')+' option:selected').attr('ptcRate');
			if(rate == '50') {
				$thisVal = $thisVal+rate;
			}
		}
		
		if ($thisVal != 'CB') {
			for(var codeIdx = 0; codeIdx<pLength; codeIdx++) {
				if($thisVal.indexOf(PtcCodeArr[codeIdx]) >= 0) {
					cnt++;
				}
			}
		}

	});

	return cnt;
};

// 국내선 PTC 할인 코드와 맵핑 되는 종속 코드에 대한 유효성 검사 실시
var checkPtcCodeBase = function checkPtcCodeBase(ObjID, baseCode, dependCode) {
	var retCode = "0000";

	$('[id^='+ObjID+']').each(function(){

		var $this = $(this),
			$thisVal = $this.val();

		if($thisVal.indexOf(dependCode) > -1) {
			$('[id^='+ObjID+']').each(function(){
			 	var $thisTmp = $(this),
			 		$thisTmpVal = $thisTmp.val();

			 	if($thisTmpVal != baseCode) {
					retCode = "9999";
					$thisTmp.focus();
				} else {
					retCode = "0000";
					return false;
				}
			});
		}

	});

	return retCode;
};

// 국내선 PTC 할인 코드 갯수에 대한 유효성 검사
var checkCntPtcCode = function checkCntPtcCode(OriginPtcCode, PartyPtcCode, ObjID) {
	var retCode = '9999',
		originCnt = 0,
		partyCnt = 0,
		focusTarget;

	$('[id^='+ObjID+']').each(function(){
		var $thisVal = $(this).val();

		if($thisVal.indexOf(OriginPtcCode) > -1) {
			originCnt++;
		}

		if($thisVal.indexOf(PartyPtcCode) > -1) {
			partyCnt++;
			focusTarget = $(this);
		}
	});

	if(originCnt >= partyCnt) {
		retCode = '0000';
	}else {
		focusTarget.focus();
	}

	return retCode;
};

// 국내선 PTC 할인 코드 갯수에 대한 유효성 검사
var checkCntPtcCodeMulti = function checkCntPtcCodeMulti(OriginPtcCode, PartyPtcCode, ObjID) {
	var retCode = '9999',
		originCnt = checkCntPtcObj(OriginPtcCode, ObjID),
		partyCnt  = checkCntPtcObj(PartyPtcCode, ObjID);

	if(originCnt >= partyCnt) {
		retCode = '0000';
	}

	return retCode;
};

/*
* 명절 예매 제어
* */
var holidayRestriction = function holidayRestriction(depDateDatas, arrDate) {
	var isValidation = true;
	
	if($('#domIntType').val() == 'D') {
		if($('#bizType').val() == 'REV') {
			
			var currentTime = Number(getCurrentTime());
			
			// 추석 임시편 오픈 관련하여 소아 포함 총 6인 경우에만 다음 단계가 되어야함
			// 노선 별 출발일 기준으로 제어(국내선 다구간때 각 여정별로 출발일 기준으로 제어해야 하므로 departureAirport1, departureAirport2... 로 구분함)
			if(currentTime >= 20200107140000 && currentTime <= 20200107143000) { // 매년 날짜변경 필요함
				
				var adultCnt = $('#adultCount').length > 0 ? $('#adultCount').val() : pnrAdultCnt,
						childCnt = $('#childCount').length > 0 ? $('#childCount').val() : pnrChildCnt,
						adtChdCnt = Number(adultCnt) + Number(childCnt);
						
					var checkPaxCnt = function checkPaxCnt() {
						if(adtChdCnt > 6) {
							alert(jsJSON.J0136.replace(/#0/, getCurrentDate().substring(0, 4)));//#0년 추석 임시편 예약으로 인하여 국내선 전 편 최대 6명까지만 예약 가능합니다.\n탑승인원을 다시 한번 선택하여 주시기 바랍니다.
							isValidation = false;
						}
					};
					
					if(($('#departureAirport1').val() == 'GMP' && $('#arrivalAirport1').val() == 'CJU') ||
							($('#departureAirport1').val() == 'CJU' && $('#arrivalAirport1').val() == 'GMP') ||
								($('#departureAirport1').val() == 'GMP' && $('#arrivalAirport1').val() == 'KWJ') ||
									($('#departureAirport1').val() == 'KWJ' && $('#arrivalAirport1').val() == 'GMP') ) {
						
						var departureDate1	= '',
						arrivalDate1	= '';
						
						if(typeof depDateDatas != 'undefined') {
							departureDate1 = depDateDatas[0];
						}else {
							departureDate1 = Number($('#departureDate1').val());
						}
						
						if(typeof arrDate != 'undefined' && arrDate != '') {
							arrivalDate1 = arrDate;
						}else {
							arrivalDate1 = Number($('#arrivalDate1').val());
						}
						
						if($('#tripType').val() == 'RT' ) {
							if((departureDate1 >= 20200123 && departureDate1 <= 20200128) ||
									(arrivalDate1 >= 20200123 && arrivalDate1 <= 20200128)) { // 매년 날짜변경 필요함
								checkPaxCnt();
							}
						}else {
							if((departureDate1 >= 20200123 && departureDate1 <= 20200128)) { // 매년 날짜변경 필요함
								checkPaxCnt();
							}
						}
						
					}
					
					if($('#departureAirport2').length > 0) {
						if(($('#departureAirport2').val() == 'GMP' && $('#arrivalAirport2').val() == 'CJU') ||
								($('#departureAirport2').val() == 'CJU' && $('#arrivalAirport2').val() == 'GMP') ||
									($('#departureAirport2').val() == 'GMP' && $('#arrivalAirport2').val() == 'KWJ') ||
										($('#departureAirport2').val() == 'KWJ' && $('#arrivalAirport2').val() == 'GMP') ) {
							
							var departureDate2	= '';
							
							if(typeof depDateDatas != 'undefined') {
								departureDate2 = depDateDatas[1];
							}else {
								departureDate2 = Number($('#departureDate2').val());
							}
							
							if((departureDate2 >= 20200123 && departureDate2 <= 20200128)) { // 매년 날짜변경 필요함
								checkPaxCnt();
							}
							
						}
					}
				}
				
				// 설날 임시편, to do 유지보수때 처리
				
			}
		}
		
		return isValidation
	};

/**
 * 접근 제한 관리
 */
var userAccessControl = function userAccessControl(params){
	
	var options = {//전달할 데이터
		BLOCK_TYPE : "",
		PHONE : "",
		EMAIL : "",
		FIRST_NM : "",
		LAST_NM : "",
		PAX_DOB : "",
		CARD_NO : ""
	}
	
	$.extend(options, params);
	var isBlocked = false;
	
	$.ajax({
		url: "UserAccessInfo.do",
		async: false,
		data : {
			BLOCK_TYPE : options.BLOCK_TYPE,
			PHONE : options.PHONE,
			EMAIL : options.EMAIL,
			FIRST_NM : options.FIRST_NM,
			LAST_NM : options.LAST_NM,
			PAX_DOB : options.PAX_DOB,
			CARD_NO : options.CARD_NO
		},
		dataType : "json",
		 type: "post",
		success : function(data) {
			if(data.isBlocked == true){
				if(data.accessMsg != ""){
					alert(data.accessMsg);
				}	
				isBlocked =  true;
			}else{
				isBlocked =  false;
			}
		}
	});
	return isBlocked;
}


/*
* 예매 메뉴 제한 관리
* */
var bookingMenuRestriction = function bookingMenuRestriction(contScope) {
	var isValidation = true;
	var act	= '';
	if(contScope.indexOf('ACT')>-1){
		contScope = contScope.split("/")[0];	
		act = 'A';
	}
	$.ajax({
		async: false,
		url: 'BookingMenuRestriction.do',
		type: 'post',
		dataType: 'json',
		data: {
			controlScope	: contScope , 
			act : act
		},
		success : function(data) {
			var result = data.result,
				rLength = result.length,
				restrictionData;

		if(rLength > 0) {
			var noti = true,
				notiMsg = '';
				blockMsg = '';

			for(var i=0; i<rLength; i++) {
				restrictionData = result[i];

				if(restrictionData.CONT_FLG == '02') { // 공지 후 종료
					noti = false;
					blockMsg = restrictionData.CONTENTS;
					break;
				}else { // CONT_FLG == '01', 공지 후 진행
					notiMsg = restrictionData.CONTENTS;
					break;
				}
			}

			if(noti) { // 알림
				alert(notiMsg);
			}else { // 예매 불가
				alert(blockMsg);
				isValidation = false;
			}

		}
		},
		error: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
			isValidation = false;
		},
		complete: function() {
			checkSSOSessionExtension();
		}
	});

	return isValidation;
};

/*
* 판매구간 확장 제어
* */
var bookingRestriction = function bookingRestriction(depDateDatas, arrDate) {
	var isValidation = true;

	var $itinerary		= $('div[name=itinerary]').length > 0 ? $('div[name=itinerary]') : $('div[name=input_wrap]'),
		segLength		= $itinerary.length,
		_tripType		= $('#tripType').val(),
		_bizType		= $('#bizType').val(),
		segDatas		= [],
		segData			= {};

	if(_tripType == 'RT' || _tripType == 'OW') {
		var depArea		= $('#departureArea1').val(),
			depAirport	= $('#departureAirport1').val(),
			arrArea		= $('#arrivalArea1').val(),
			arrAirport	= $('#arrivalAirport1').val(),
			depDate;
			
		if(typeof depDateDatas != 'undefined') {
			depDate		= depDateDatas[0];
		}else {
			depDate		= $('#departureDate1').val().replace(/[^0-9]/g, "");
		}

		segData = {};
		segData.depArea		= depArea;
		segData.depAirport	= depAirport;
		segData.arrArea		= arrArea;
		segData.arrAirport	= arrAirport;
		segData.depDate		= depDate;

		segDatas[0] = segData;
	}else {
		var i = 0;
		$itinerary.each(function(idx) {
			var depArea		= $('#departureArea'+(idx+1)).val(),
				depAirport	= $('#departureAirport'+(idx+1)).val(),
				depDate;
			
			if(typeof depDateDatas != 'undefined') {
				depDate		= depDateDatas[idx];
			}else {
				depDate		= $('#departureDate'+(idx+1)).val().replace(/[^0-9]/g, "");
			}

			$itinerary.each(function(jdx) {
				if(jdx >= idx) {

					var arrArea		= $('#arrivalArea'+(jdx+1)).val(),
						arrAirport	= $('#arrivalAirport'+(jdx+1)).val();

					if(depAirport != arrAirport) {
						segData = {};
						segData.depArea		= depArea;
						segData.depAirport	= depAirport;
						segData.arrArea		= arrArea;
						segData.arrAirport	= arrAirport;
						segData.depDate		= depDate;

						segDatas[i] = segData;
						i++;
					}

				}
			});
		});
	}

	if(_bizType == 'REV') {
		if(_tripType == "OJ"){
			_tripType = "MT";
		}
	}
	
	var cabinDatas = [];
	
	if($('#domIntType').val() == 'I') {
		if($('[name=selectSeg1CabinClass]').length > 0) {
			$('[name=selectSeg1CabinClass] li').each(function() {
				var _this = $(this);
				var _thisTab = $(this).children("a");
				if(_this.hasClass('on')){
					if(_thisTab.attr('cabinClass') == "A"){
						/*joyj RED 전체 클래스 선택 시 판매구간 확장제어 퍼스트 클래스 막아놨을 경우 진행 불가 수정 요청 by 배병준*/
						if(typeof isStarAlliance != "undefined" && isStarAlliance){
							cabinDatas = ['E', 'B', 'F'];
						}else{
							cabinDatas = ['E', 'B'];//1OPT2106001
						}
						return false;
					}else {
						cabinDatas.push(_thisTab.attr('cabinClass'));
					}
				}
			});
			
			if($('input[id="check1"]').is(":checked")) {
				$('[name=selectSeg2CabinClass] li').each(function() {
					var _this = $(this);
					if(_this.hasClass('on')){
						cabinDatas.push(_this.children("a").attr('cabinClass'));
					}
				});
			}
		}else {
			if(typeof bookConditionJSON != 'undefined') {
				
				var segLength = bookConditionJSON.segmentConditionDatas.length;
				
				for(var i=0; i<segLength; i++) {
					
					var segData = bookConditionJSON.segmentConditionDatas[i],
					cabinLength = segData.cabinClassList.length;
					
					for(var j=0; j<cabinLength; j++) {
						cabinDatas.push(segData.cabinClassList[j]);
					}
				}
			}else {
				/*joyj RED 전체 클래스 선택 시 판매구간 확장제어 퍼스트 클래스 막아놨을 경우 진행 불가 수정 요청 by 배병준*/
				if(typeof isStarAlliance != "undefined" && isStarAlliance){
					cabinDatas = ['R', 'E', 'B', 'F'];
				}else{
					cabinDatas = ['R', 'E', 'B'];
				}
			}
		}
	}else {
		if(typeof bookConditionJSON != 'undefined') {
			if(bookConditionJSON.segmentConditionDatas.length > 0 && bookConditionJSON.segmentConditionDatas[0].cabinClassList.length > 0) {
				cabinDatas = bookConditionJSON.segmentConditionDatas[0].cabinClassList;	
			}
		}
		if(cabinDatas.length < 1){
			_bizType === 'REV' ? cabinDatas.push('E','B') : cabinDatas.push('R','E','B');   
		}
	}
	
	var data = {
			segDatas	: JSON.stringify(segDatas),
			tripType	: _tripType,
			bizType		: _bizType,
			cabinDatas	: JSON.stringify(cabinDatas),
			domIntType  : $('#domIntType').val()
	}
	/* #34787, ACP의 경우  act = 'A' 파라미터 추가 */
	if((typeof bookConditionJSON != 'undefined' && bookConditionJSON.salesType === 'ACT') || (typeof bookConditionJSON == 'undefined' && jsonOldPnrData.actSales)) {
		data.act = 'A';
	}
	

	$.ajax({
		async: false,
		url: 'BookingRestriction.do',
		type: 'post',
		dataType: 'json',
		data: data,
		success : function(data) {
			if(data != null && data.errorMessage) {
				alert(data.errorMessage);
				loadingClose('entire');
				return;
			}
			
			var result = data.result,
				rLength = result.length,
				restrictionData;

			if(rLength > 0) {
				
				/*
					* 최희정 과장님 요청
					예시 ) REV 다구간 
					1. HNL - ICN
					2. ICN - HKG
					3. HKG - HNL
					
					위와 같은 경우는 제어에 해당되지 않음. 발권 가능 케이스임!
					
					ADMIN 판매구간 확장제어에 HNL - 미주, 미주 - HNL 노선이 등록되어있는데, HNL 이 미주에 포함되어 있어 예외처리를 해야함
					단, ADMIN 판매구간 확장제어에 다구간으로 체크한 후 HNL - 미주, 미주 - HNL 처럼 쌍으로 등록되있어야 함
					(현재 ADMIN 판매구간 확장제어 구조 상 어쩔 수 없음. 최희정 과장님과 협의 완료, 현업이 잘못올렸을 경우 어쩔 수 없음. ADMIN에서 데이터 수정해야 함)
					(아래와 같은 로직을 제거하려면 ADMIN 판매구간 확장제어 메뉴를 수정해야 함)
				*/
				/*if(_bizType == 'REV' && _tripType == 'MT') {
					if(rLength == 2) {
						for(var i=0, sLength = segDatas.length; i<sLength; i++) {
							if(segDatas[i].depAirport == segDatas[i].arrAirport) {
								if(result[0].DEPARTURE_AIRPORT == result[1].ARRIVAL_AIRPORT) {
									if(result[0].TRIP_TYPE.indexOf('MT') > -1 && result[1].TRIP_TYPE.indexOf('MT') > -1) {
										return isValidation;
									}
								}
							}
						}
					}
				}*/
				//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				
				var noti = true,
					notiMsg = '';
					blockMsg = '';

				for(var i=0; i<rLength; i++) {
					restrictionData = result[i];

					if(restrictionData.CONTROL_TYPE == 'N') {
						noti = false;
						blockMsg = restrictionData.CHRCTR_NM;
						break;
					}else {
						notiMsg = restrictionData.CHRCTR_NM;
						break;
					}
				}

				if(noti) { // 알림
					alert(notiMsg);
				}else { // 예매 불가
					alert(blockMsg);
					isValidation = false;
				}

			}
		},
		error: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
			isValidation = false;
		},
		complete: function() {
			checkSSOSessionExtension();
		}
	});

	return isValidation;
};

/*
* 예매 결제 제어 관리
* */
var bookingPaymentRestriction = function(ctrlGroup, bizType, routeType, payment, cardClass, officeId) {
	var isValidation = true;
	
	$.ajax({
		async: false,
		url: 'confirmPaymentCtrl.do',
		type: 'post',
		dataType: 'json',
		data: {
			ctrlGroup	: ctrlGroup,
			bizType 	: bizType,
			routeType	: routeType,
			payment 	: payment,
			creditCard  : cardClass,
			officeId	: officeId
		},
		success : function(data) {
			var result = data;
			if(!result.ctrlPass){
				var alertList = result.ctrlMsg;
				for(var i in alertList) {
					alert(alertList[i]);
				}
				isValidation = result.ctrlType == '2' ? false : true; // '2':block
			}
		},
		error: function(data) {
			alert(JSON.parse(data.responseText).exceptionInfo.message);
			isValidation = false;
		}
	});

	return isValidation;
};

var goFirstPage = function goFirstPage() {

	// 예약 중도 취소를 호출한 후 첫 페이지로 이동한다.
	var callbackUrl = "";
	if (bookConditionJSON.bizType == 'REV') {
		if(bookConditionJSON.salesType == 'targetSales') {
			callbackUrl = "RevenueRegistTravel.do";
		}else if(bookConditionJSON.salesType == 'dreamFare') {
			callbackUrl = "DreamFareDetail.do";
		}else if(bookConditionJSON.salesType == 'superSale') {
			callbackUrl = "SuperSaleDetail.do";
		}else if(bookConditionJSON.salesType == 'lowerPrice') {
			callbackUrl = "LowerPriceSearchList.do";
		}else if(bookConditionJSON.salesType == 'ACT') {
			callbackUrl = "ACTRegistTravel.do";
		}else {
			callbackUrl = "RevenueRegistTravel.do";
		}
	} else if (bookConditionJSON.bizType == 'RED') {
		if(bookConditionJSON.starAlliance) {
			callbackUrl = "RedemptionStarAllianceRegistTravel.do";
		}else {
			callbackUrl = "RedemptionRegistTravel.do";
		}
	}

	ignoreReservation(function() {
		$('#ignorePNRForm').attr({'onsubmit' : 'return true',
			'action' : './'+callbackUrl+''}).submit();
	});
}

// 예약 중도 취소 API(ignoreTripInput) 를 호출한다.
function ignoreReservation(callBackFunction) {
	var result = true;

	if (typeof callBackFunction != "undefined") {
		$.ajax({
			url : "./ignoreReservation.do",
			type : "post",
			dataType : "json",
			data : $("#ignorePNRForm").serialize(),
			beforeSend : function() {
				loadingOpen('entire', 'booking');
			},
			success : function (resultData) {
				if (typeof callBackFunction == 'function') {
					callBackFunction();
				}
			},
			error : function() {
				if (typeof callBackFunction == 'function') {
					callBackFunction();
				}
			},
			complete: function() {
				checkSSOSessionExtension();
			}
		});
	}
	
	return result;
}

//데이터테이블 장차법 caption구현
function tableCaption(scope){
	//var scope = $(".table_list");

	if(
		($(scope).find('>caption').length>0) &&
		($(scope).find('>caption p').length==0 || $.trim($(scope).find('>caption p').text())=='')

	){
		var msg='';

		$(scope).find(">thead > tr >  th").each(function(a){
			var amsg=String($(this).clone().children('.tooltip_wrap').remove().end().text() || '');
			amsg=$.trim(amsg);

			if($.trim(amsg)!=''){
				msg+=((msg=='')?'':',')+amsg;
			}
		});

		$(scope).find('>tbody > tr > th').each(function(a){
			var amsg=String($(this).clone().children('.tooltip_wrap').remove().end().text() || '');
			amsg=$.trim(amsg);

			if($.trim(amsg)!=''){
				msg+=((msg=='')?'':',')+amsg;
			}
		});

		if(msg!=''){
			msg = jsJSON.J0253.replace("#1",msg);/* J0253 : #1 로 구성된 표입니다.*/
		};

		$(scope).find('>caption p').remove();
		$(document.createElement('p')).html(msg.replace(/[\t\n\r\u00a0]/gi,"")).appendTo($(scope).find('>caption'));
	};
};

//장차법 caption 순차 적용
var captionindex = 0;
function setTableCaption() {
	$('table').each(function(index, el){
		if(!$(this).is('[captionindex]')) {
			$(this).attr('captionindex', 'table_'+captionindex);
			tableCaption('table[captionindex=table_' + captionindex + ']');
			captionindex++;
		}
	});
}

/*
 * 원하는 날짜로 캘린더 세팅
 *
 * 00. $target		: 대상 Date Picker의 Input Text
 * 01. depDateValue	: 오는 날			ex) 20180101
 * 02. arrDateValue	: 가는 날			ex) 20180101
 *
 * */
var setDatepickerDate = function setDatepickerDate($target, depDateValue, arrDateValue, minDate, maxDate, isMobile) {
	var $target_itinerary_class	= $target.parents(".itinerary"),
		$target_itinerary_name	= $target.parents("[name=itinerary]"),
		$target_calendar,
		calendarType;

	if($target_itinerary_class.length > 0) {
		$target_calendar		= $target_itinerary_class.find(".compareCalendar");							// 세팅할 캘린더
		calendarType = 1;
	} else {
		$target_calendar		= $target_itinerary_name.find(".compareCalendar");
		calendarType = 2;
	}

	// 가는날 세팅
	var depYear		= Number(depDateValue.substr(0, 4)),
		depMonth	= Number(depDateValue.substr(4, 2)),
		depDay		= Number(depDateValue.substr(6, 2));

	var _cal_wrap = $target.parents('.calendar_wrap'),
		_txt_wrap,
		_txt_wrap_findSpan,
		_date,
		startDate;

	if(depMonth < 10) {
		if(depDay < 10) {
			_date = String(depYear)+'0'+String(depMonth)+'0'+String(depDay);
			startDate = String(depYear).substr(2, 2)+'.0'+depMonth+'.0'+depDay+' ('+getDayByLang(_date, languageCode)+')';
		}else {
			_date = String(depYear)+'0'+String(depMonth)+String(depDay);
			startDate = String(depYear).substr(2, 2)+'.0'+depMonth+'.'+depDay+' ('+getDayByLang(_date, languageCode)+')';
		}
	}else {
		if(depDay < 10) {
			_date = String(depYear)+String(depMonth)+'0'+String(depDay);
			startDate = String(depYear).substr(2, 2)+'.'+depMonth+'.0'+depDay+' ('+getDayByLang(_date, languageCode)+')';
		}else {
			_date = String(depYear)+String(depMonth)+String(depDay);
			startDate = String(depYear).substr(2, 2)+'.'+depMonth+'.'+depDay+' ('+getDayByLang(_date, languageCode)+')';
		}
	}

	if($target.data('type') == 'single') {
		$target.val(startDate);
	}else {
		if(calendarType == 1) {
			_txt_wrap			= _cal_wrap.find('.txt_round_trip');
			_txt_wrap_findSpan	= _txt_wrap.find('span');
			_txt_wrap_findSpan.eq(0).text(startDate.split(" ")[0]);
			_txt_wrap_findSpan.eq(1).text(startDate.split(" ")[1]);
		}else {
			$target.val(startDate);
		}
	}

	_cal_wrap.find('[id^=departureDate]').val(_date);

	if(typeof arrDateValue != 'undefined'){
		// 오는날 세팅
		var arrYear		= Number(arrDateValue.substr(0, 4)),
			arrMonth	= Number(arrDateValue.substr(4, 2)),
			arrDay		= Number(arrDateValue.substr(6, 2)),
			_edate,
			endDate;

		if(arrMonth < 10) {
			if(arrDay < 10) {
				_edate = String(arrYear)+'0'+String(arrMonth)+'0'+String(arrDay);
				endDate = String(arrYear).substr(2, 2)+'.0'+arrMonth+'.0'+arrDay+' ('+getDayByLang(_edate, languageCode)+')';
			}else {
				_edate = String(arrYear)+'0'+String(arrMonth)+String(arrDay);
				endDate = String(arrYear).substr(2, 2)+'.0'+arrMonth+'.'+arrDay+' ('+getDayByLang(_edate, languageCode)+')';
			}
		}else {
			if(arrDay < 10) {
				_edate = String(arrYear)+String(arrMonth)+'0'+String(arrDay);
				endDate = String(arrYear).substr(2, 2)+'.'+arrMonth+'.0'+arrDay+' ('+getDayByLang(_edate, languageCode)+')';
			}else {
				_edate = String(arrYear)+String(arrMonth)+String(arrDay);
				endDate = String(arrYear).substr(2, 2)+'.'+arrMonth+'.'+arrDay+' ('+getDayByLang(_edate, languageCode)+')';
			}
		}

		if(calendarType == 1) {
			_txt_wrap_findSpan.eq(2).text(" -  " + endDate.split(" ")[0]);
			_txt_wrap_findSpan.eq(3).text(endDate.split(" ")[1]);
			_cal_wrap.find('[id^=arrivalDate]').val(_edate);
		}else {
			$target.val($target.val()+' - '+endDate);
			_cal_wrap.find('[id^=arrivalDate]').val(_edate);
		}

	}

	$('label[name=calDesc]').hide();

	if(typeof minDate != 'undefined') {
		// Min / Max Date 세팅
		var minDate_Year	= Number(minDate.substr(0, 4)),
		minDate_Month	= Number(minDate.substr(4, 2)),
		minDate_Day		= Number(minDate.substr(6, 2)),
		dateMinDate		= new Date(minDate_Year + "/" + minDate_Month + "/" + minDate_Day);

		var maxDate_Year	= Number(maxDate.substr(0, 4)),
		maxDate_Month	= Number(maxDate.substr(4, 2)),
		maxDate_Day		= Number(maxDate.substr(6, 2)),
		dateMaxDate		= new Date(maxDate_Year + "/" + maxDate_Month + "/" + maxDate_Day);

		$target_calendar.datepicker("option", {
			"minDate"	: dateMinDate,
			"maxDate"	: dateMaxDate
		});
		$target_calendar.attr("minDate",minDate);
		$target_calendar.attr("maxDate",maxDate);
	}

};

/*
	페이지 진입 시 로그인 pax의 booking 유효성 체크
	1. bookConditionData 있을 때 userData가 있는 경우만 체크
	2. bookConditionData 없을 때 entryUserBirthDate, entryDomIntType 변수가 있어야 나이 체크
*/
var checkBookingAge = function checkBookingAge() {
	var _userAge,
		_domIntType,
		_childMaxAge,
		_infantMaxAge = 2;

	if(typeof bookConditionJSON !== 'undefined' && bookConditionJSON.userData && bookConditionJSON.userData.birthDate) {
		_userAge = getAgeToday(bookConditionJSON.userData.birthDate);
		_domIntType = bookConditionJSON.domIntType;
	} else if(typeof entryUserBirthDate !== 'undefined' && typeof entryDomIntType !== 'undefined' && entryUserBirthDate) {
		_userAge = getAgeToday(entryUserBirthDate);
		_domIntType = entryDomIntType;
	} else {
		return;
	}

	if(_domIntType.toUpperCase() === 'D') {
		_childMaxAge = 13;
	} else {
		_childMaxAge = 12;
	}

	if(_userAge < _infantMaxAge) {
		alert(jsJSON.J0251);//로그인하신 회원이 유아 일 경우에는 예약 진행이 불가합니다.\n예약센터로 문의하시기 바랍니다.
	} else if(_userAge < _childMaxAge) {
		alert(jsJSON.J0250);//로그인하신 회원이 소아 일 경우에는 예약 진행이 불가합니다.\n예약센터로 문의하시기 바랍니다.
	} else {
		return;
	}

	$('.container').append('<form id="redirectMain" />');
	$('#redirectMain')
		.attr('action', '/')
		.attr('method', 'post')
		.attr('target', '_self')
		.submit().remove();
};

// RED 일 경우 userData - 생년월일, 이메일, 모바일 번호 유효성 체크
var validUserData = function validUserData(birthDate, email, mobile) {
	
	var isValidation = true;
	
	//로그인한 회원 생년월일 체크
	if(/[^0-9]/gi.test(birthDate) || birthDate.length != 8){
		alert(jsJSON.J0260);//회원님의 개인정보를 확인하신 후 예매를 진행하여 주십시오.
		isValidation = false;
		return isValidation; 
	}
	
	if(email == '' || mobile == '') {
		alert(jsJSON.J0260);//회원님의 개인정보를 확인하신 후 예매를 진행하여 주십시오.
		isValidation = false;
		return isValidation;
	}
	
	return isValidation;
};

//REV, RED 국내선일 경우 항공편 스케쥴 변경 체크
var checkChangedFlightSchedule = function checkChangedFlightSchedule(jsonPnrData){
	var segDatas = jsonPnrData.segmentDatas,
		sLength = segDatas.length,
		segData,
		desc;
	
	for(var i=0; i<sLength; i++) {
		segData = segDatas[i];
		var flightInfoDatas = segData.flightInfoDatas,
			fLength = flightInfoDatas.length,
			flightInfoData;
		
		for(var j=0; j<fLength; j++) {
			flightInfoData = flightInfoDatas[j];
			
			if(flightInfoData.changedFlightSchedule) {
				if(typeof desc == 'undefined') {
					desc = jsJSON.J0135;
					desc = desc.replace(/#0/, flightInfoData.departureAirportDesc+' - '+flightInfoData.arrivalAirportDesc);
					if(languageCode == 'KO') {
						desc = desc.replace(/#1/, flightInfoData.departureDateOfSchedule.substring(8, 10)+'시 '+flightInfoData.departureDateOfSchedule.substring(10, 12)+'분');
					}else {
						desc = desc.replace(/#1/, flightInfoData.departureDateOfSchedule.substring(8, 10)+':'+flightInfoData.departureDateOfSchedule.substring(10, 12));
					}
				}else {
					desc = desc + '\n' + jsJSON.J0135.replace(/#0/, flightInfoData.departureAirportDesc+' - '+flightInfoData.arrivalAirportDesc);
					if(languageCode == 'KO') {
						desc = desc.replace(/#1/, flightInfoData.departureDateOfSchedule.substring(8, 10)+'시 '+flightInfoData.departureDateOfSchedule.substring(10, 12)+'분');
					}else {
						desc = desc.replace(/#1/, flightInfoData.departureDateOfSchedule.substring(8, 10)+':'+flightInfoData.departureDateOfSchedule.substring(10, 12));
					}
				}
			}
		}
	}
	
	if(typeof desc != 'undefined') {
		alert(desc);
	}
};

// 2depth 클릭 시
var innerTabMenu = function innerTabMenu() {
	$('.t_head > li').on('click', function() {
		if ($(this).parents('.tab_2depth').attr('data-tabtype') == 'link') {
			return
		} else {
			var innerTabCont = $('.tab_cont.on .t_content > .t_cont');
			var innerIndex = $(this).index();
			$(this).parent().find('li').removeClass('on');
			$('.t_head > li > a').attr('title', '');
			$(this).addClass('on').find('a').attr('title', jsJSON.J0022); // 선택됨
			innerTabCont.removeClass('on');
			innerTabCont.eq(innerIndex).addClass('on');
		};
	});
};

/*
* 제외 요일/기간 문구 가공 후 목록 return
*/
var getExclusiveTextList = function(langCode, daysText, periodText) {
	var _list = [];
	
	if(daysText) {
		var _daysArray = [];
		daysText.split('/').forEach(function(dayNumber) {
			var _tempDate = moment().day(dayNumber).format('YYYYMMDD');
			_daysArray.push(getDayByLang(_tempDate, langCode)); 
		});
		
		_list.push(jsJSON.J0624 + _daysArray.join(', ')); /* [J0624] 제외 요일 : */
	}
	
	if(periodText) {
		var _periodArray = [];
		periodText.split('/').forEach(function(period) {
			_periodArray.push(period.replace(/(\d{4})(\d{2})(\d{2})~(\d{4})(\d{2})(\d{2})/, '$1.$2.$3~$4.$5.$6'));
		});
		_list.push(jsJSON.J0623 + _periodArray.join(', ')); /* [J0623] 제외 기간 : */
	}
	
	return _list;
};

/*
* 출발 제외 기간 validation 체크
* 00.departureDate	: 출발날짜 (ex: 20201210)
* 01.daysTotalVal	: 제외요일 (일~토, ex: 0/1/2/3/4/5/6)
* 02.periodTotalVal	: 제외기간 (ex: 20201212~20201213/20201214~20201215)
* 03.langCode		: 언어코드
*/
var checkExclusiveDeparture = function(departureDate, daysTotalVal, periodTotalVal, langCode) {
	var isValid = true;
	var DATE_FORMAT = 'YYYYMMDD';
	var isIncludedDay = false;
	var isIncludedPeriod = false;
	
	isIncludedDay = Boolean(daysTotalVal.indexOf(moment(departureDate, DATE_FORMAT).day().toString()) > -1);
	
	var periodList = periodTotalVal.split('/');
	for(var i in periodList) {
		var _period = periodList[i].split('~');
		
		if(_period != '' && _period != null){  	
			isIncludedPeriod = isIncludedPeriod || moment(departureDate).isBetween(_period[0], _period[1], undefined, '[]');
		}
	}
	
	if(isIncludedDay || isIncludedPeriod) {
		/* [J0621] 출발 제외 기간입니다. */
		/* [J0622] 제외 기간 확인 후 재선택해 주시기 바랍니다. */
		var _textList = getExclusiveTextList(langCode, daysTotalVal, periodTotalVal);
		alert(jsJSON.J0621 + '\n' + jsJSON.J0622 + '\n\n' + _textList.join('\n')); 
		isValid = false;
	}
	
	return isValid;
};

/* 기본 탭 공통 */
;(function(global, $){
	'use strict';
	var _scope = $('.tab_area');
	var _this, _item, _parents, _content, _showCont, _positionTab, _heiCont;
	var innerEq, totalLen, thisIdx, thisLeft, thisRight, tabHeight;
	var tab = {};

	tab.destory = function( ){
		_parents.find('> .tab_indicator li').removeClass('on').find('a').attr('title','');
		_content.find('> .tab_cate').removeClass('on');
	};
	tab.create = function(){
		_showCont = _content.find('> .tab_cate').eq(_this.parent().index());
		_this.parent().addClass('on').find('a').attr('title',mfui._uiLangs.UI0001);
		_showCont.addClass('on');
	};
	tab.innerTabCheck = function(){
		innerEq = _this.parent().index();

		if( _content.find('> .tab_cate').eq(innerEq).find('> .pc_type03 > .position').length > 0 ){
			totalLen = _this.parent().parent().find('li').length;
			thisIdx = _this.parent().index();
			_positionTab = _content.find('> .tab_cate').eq(innerEq).find('> .pc_type03 > .position');
			if( totalLen/2 > thisIdx ){
				thisLeft = ( _this.outerWidth() * thisIdx ) + ( thisIdx * 1 );
				_positionTab.find('ul').css({'right':'initial','left':thisLeft+10+'px'});
			}else{
				thisRight = _this.parents('.tab_indicator').width() - ( (_this.outerWidth() + 1) * (thisIdx + 1) );
				_positionTab.find('ul').css({'left':'initial','right':thisRight+10+'px'});
			}
		};
	};
	tab.evtHandler = function(){
		_item.on('click', function(){
			_this = $(this);
			if( _this.parents('.tab_area').attr('data-tabtype') == 'link' ){
				return
			}else{
				if ( !_this.parent().hasClass('on') ){
					_parents = $(_this.parents('.tab_area')["0"]);
					_content = $(_parents.find('.tab_container')["0"]);
					tab.destory();
					tab.create();
	
					if( _this.parents('.tab_container').length == 0 ){
						tab.innerTabCheck();
					};
				};
				if($('.visual_slider').length){
					infoSlider();
				};
	
	
				//탭초기화
				var resetTarget =_this.parents('.tab_area').eq(0).find('.tab_container:visible').eq(0);
	
				resetTarget.find('.tab_indicator:visible ul,.tab_container:visible').each(function(){
					$(this).find('li').eq(0).addClass('on').siblings().removeClass('on');
					$(this).find('.tab_cate').eq(0).addClass('on').siblings().removeClass('on');
				})
	
				tab.destroyHeight();
				tab.autoHeight();
	
				mfui.paginationTab.reset();		// 내부 페이지네이션 초기화
				mfui.paginationTab.Reinit();
			};
		});

		if( _scope.find('.tab_indicator.position:visible').length > 0 ){
			_this = _scope.find('.position:visible').parents('.pc_type01').find('>.tab_indicator li.on a');
			_parents = $(_this.parents('.tab_area')["0"]);
			_content = $(_parents.find('.tab_container')["0"]);
			tab.innerTabCheck();
		};
	};
	tab.destroyHeight = function(){
		$('.tab_area:visible').find('> .tab_indicator > ul > li > a').attr('style','');
	};
	tab.autoHeight = function(){
		$('.tab_area:visible').each(function(){
			_heiCont = $(this).find('> .tab_indicator > ul > li > a');
			tabHeight = 0;

			for(var i=0; i < _heiCont.length; i++){
				if( i == 0 ){
					tabHeight = $(_heiCont[i]).outerHeight();
				}else{
					if( tabHeight < $(_heiCont[i]).outerHeight() ){
						tabHeight = $(_heiCont[i]).outerHeight();
					};
				};
			};

			_heiCont.css({'height':tabHeight+'px'});
		});

	};
	tab.init = function(){
		_item = _scope.find('.tab_indicator li a');
		tab.evtHandler();
		$(window).load(function(){
			tab.autoHeight();
		});
		$('.tab_indicator li.on a').attr('title',mfui._uiLangs.UI0001);
	};

	tab.init();

})(window, window.jQuery);

// 페이지네이션 탭
;(function($){
	'use strict';
	var _scope = $('.tab_page_wrap');
	var _cont, _btnPage, _this, _target, _thisBtnPage, _thisCont, _nextBtn, _prevBtn, _thisBtn;
	var pageInt, pageIdx;
	var pageTab = {};

	pageTab.init = function(){
		pageTab.evtHandler();
	};
	pageTab.evtHandler = function(){
		_cont = _scope.find('.page_cont');
		_btnPage = _scope.find('.paging a');
		_nextBtn = _scope.find('.btn_next');
		_prevBtn = _scope.find('.btn_prev');

		_btnPage.on('click', function(){
			_this = $(this);
			_target = _this.parents('.tab_page_wrap');
			_thisBtnPage = _target.find('.paging a');
			_thisCont = _target.find('.page_cont');
			pageTab.tab();
		});

		_nextBtn.on('click', function(){
			_thisBtn = $(this);
			pageIdx = _thisBtn.parent().find('a.on').index();

			if( _thisBtn.parent('.paging').find('a').length > pageIdx ){
				pageTab.reset();
				_thisBtn.parents('.tab_page_wrap').find('.page_cont').eq(pageIdx).addClass('on').find('a:eq(0)').focus();
				_thisBtn.parent('.paging').find('a span').remove();
				_thisBtn.parent('.paging').find('a').eq(pageIdx).addClass('on').append('<span class="hidden">'+mfui._uiLangs.UI0001+'</span>');
			}
		});

		_prevBtn.on('click', function(){
			_thisBtn = $(this);
			pageIdx = _thisBtn.parent().find('a.on').index() - 2;

			if( pageIdx >= 0 ){
				pageTab.reset();
				_thisBtn.parents('.tab_page_wrap').find('.page_cont').eq(pageIdx).addClass('on').find('a:eq(0)').focus();
				_thisBtn.parent('.paging').find('a span').remove();
				_thisBtn.parent('.paging').find('a').eq(pageIdx).addClass('on').append('<span class="hidden">'+mfui._uiLangs.UI0001+'</span>');
			}
		});
	};
	pageTab.tab = function(){
		// 탭기능 활성화
		pageInt = _this.index() - 1;
		_thisBtnPage.removeClass('on').find('span').remove();
		_this.addClass('on').append('<span class="hidden">'+mfui._uiLangs.UI0001+'</span>');
		_thisCont.removeClass('on');
		_thisCont.eq(pageInt).addClass('on');
		_thisCont.eq(pageInt).find('a:eq(0)').focus();

		// 탭 내부 토글 초기화
		_thisCont.eq(pageInt).find('.faq_wrap').removeClass('on');
		_thisCont.eq(pageInt).find('.acco_cont').hide();
	};
	pageTab.reset = function(){
		if( $('.tab_page_wrap:visible').length > 0 ){
			var _scope = $('.tab_page_wrap:visible');
			_scope.find('.faq_wrap').removeClass('on').find('.acco_cont').hide();
			_scope.find('.page_cont').removeClass('on');
			_scope.find('.paging a').removeClass('on');
		};
	};
	pageTab.Reinit = function(){
		var _scope = $('.tab_page_wrap:visible');
		_scope.find('.page_cont').eq(0).addClass('on');
		_scope.find('.paging a').eq(0).addClass('on');
	};

	pageTab.init();
	mfui.paginationTab = pageTab;
})(window.jQuery);

/*
* @author 		: sy.lee
* @description	: 공통 전체선택/해제
*/
var ALLCHECKED = function(param1, param2){
	'use strict';

	var ui = {};
	var _parent_item, _children_item, _hidden_txt, _allHidden_txt;
	var status, idx, children_len;

	ui.init = function(){
		status = false;										// 현재 상태값 default false
		idx = 0;											// idx 초기값 0
		_parent_item = $(param1);							// 전체선택 input
		_children_item = $(param2);							// 각각 선택 input
		children_len = _children_item.length;
		_allHidden_txt = _parent_item.prev('span');		// hidden txt ON/OFF
		_hidden_txt = _children_item.prev('span');		// hidden txt ON/OFF
		ui.evt();
	};
	ui.evt = function(){
		_children_item.on('change', function(){
			if($(this).is(':checked')){
				$(this).prop('checked', true);
				idx++;										// idx 1씩 증가
				if($(this).prev('span').length > 0){
					$(this).prev('span').text('ON');
				}
			}else if(!$(this).is(':checked')){
				$(this).prop('checked', false);
				idx--;										// idx 1씩 감소
				if($(this).prev('span').length > 0){
					$(this).prev('span').text('OFF');
				}
			}
			ui.getEvt();
		});
		_parent_item.on('change', function(){
			if($(this).is(':checked')){
				$(this).prop('checked', true);
				_children_item.prop('checked', true);
				idx = _children_item.length;
				_hidden_txt.text('ON');
				if(_allHidden_txt.length > 0){
					_allHidden_txt.text('ON');
				}
				if(_children_item.parents('.check_type2').length > 0) {
					_children_item.parents('.check_type2').find('label').addClass('on');
				}
			}else if(!$(this).is(':checked')){
				$(this).prop('checked', false);
				_children_item.prop('checked', false);
				idx = 0;
				_hidden_txt.text('OFF');
				if(_allHidden_txt.length > 0){
					_allHidden_txt.text('OFF');
				}
				if(_children_item.parents('.check_type2').length > 0) {
					_children_item.parents('.check_type2').find('label').removeClass('on');
				}
			}
		});
	};
	ui.getEvt = function(){
		if(idx == children_len){							// idx 값과 각input length 값이 같다면 상태값 변경
			status = true;
		}else {
			status = false;
		}
		ui.allCheckEvt();
	};
	ui.allCheckEvt = function(){							// status 값으로 전체선택 ON/OFF
		if(status){
			_parent_item.prop('checked', true);				// status true : ON
			_allHidden_txt.text('ON');
		}else{
			_parent_item.prop('checked', false);			// status false: OFF
			_allHidden_txt.text('OFF');
		}
	};
	ui.init();
	return ui;
};

////////////////////document ready ////////////////////
$(document).ready(function() {

	// 레이어팝업(딤) 닫기 / 닫은 후 스크롤 생성
	$(document).on('click', '.dim_close, button[name=cancel], a[name=noTodayClose]', function() {
		var thisLayerPop = $(this).closest('.layer_wrap'),
			_thisTargetBtnId = thisLayerPop.attr('id');

		if(thisLayerPop.find('input[name=noToday]').is(':checked')) {
			setLsAt00(_thisTargetBtnId, 1);
		}

		thisLayerPop.hide();
		if($('.layer_wrap:visible').length == 0 ){
			$('body').css('overflow-y','auto');
		}
		if(typeof _thisBtn != 'undefined') {
			_thisBtn.focus();
			_thisBtn = undefined;
		}
	});

	// 툴팁 레이어 오픈
	var asi = [];
	$('.tooltip_wrap').each(function(i){
		var tlpClose = $(this).find('.tooltip_close');
		var tlpBtn = $(this).find('.btn_info');
		var tlpLayers = $('.layer_tooltip');
		tlpBtn.on('click', function(){
			var openTlp = tlpBtn.next('.layer_tooltip');
			tlpLayers.hide();
			openTlp.show();
		});
		tlpBtn.index = i
		asi.push(tlpBtn);
	});

	// 레이어 닫기 / 툴팁
	$('.tooltip_close').each(function(){
		$(this).on('click', function(){
			var thisLayerPop = $(this).parent('div');
			thisLayerPop.hide();
			thisLayerPop.prev('a').focus();
		});
	});

	//레이어 닫기 / 쉐도우레이어
	$(document).on('click', '.layer_close', function() {
		var $this = $(this),
			$thisLayerPop = $this.parent('div');
		$thisLayerPop.hide();
		$thisLayerPop.prev('a').focus();
	});

	// DatePicker Focus 이벤트
	$(document).off("click", ".datepicker").on("click", ".datepicker, .calendar_focus", function(event) {
		var $this				= $(this),
			$itinerary			= $this.parents("[name=itinerary]"),
			$target_calendar	= $itinerary.find(".compareCalendar"),
			$cal_wrap			= $this.parents('.calendar_wrap'),
			_departureDate		= $cal_wrap.find('[id^=departureDate]').val(),
			_arrivalDate		= $cal_wrap.find('[id^=arrivalDate]').val(),
			_idx				= '',
			_startTd,
			_endTd;

		if(typeof $this.attr('id') != 'undefined') {
			_idx = $this.attr('id').replace(/[^0-9]/g, '');
		}

		if(_idx == '') {
			_idx = 1;
		}

		$target_calendar.parent().find('.cal_reset').click();
		
		if(RequestUrlArr[4].indexOf('Change.do') == -1 && RequestUrlArr[4].indexOf('GetMileageSaveRequest') == -1 && RequestUrlArr[4].indexOf('PurchaseHistory.do') == -1
				&& RequestUrlArr[4].indexOf('DreamFareDetail.do') == -1 && RequestUrlArr[4].indexOf('SuperSaleDetail.do') == -1 && RequestUrlArr[4].indexOf('TargetSalesDetail.do') == -1) {
			if($('#departureArea'+_idx).val() == 'US' || $('#departureArea'+_idx).val() == 'MX') {
				$target_calendar.datepicker("option", "minDate", -1);
			}else {
				$target_calendar.datepicker("option", "minDate", 0);
			}
		}else if(RequestUrlArr[4].indexOf('Change.do') > -1 ){
			var dateMinDate = $target_calendar.attr("minDate"),
				dateMaxDate = $target_calendar.attr("maxDate");
		
			var minDate_Year	= Number(dateMinDate.substr(0, 4)),
				minDate_Month	= Number(dateMinDate.substr(4, 2)),
				minDate_Day		= Number(dateMinDate.substr(6, 2));
			dateMinDate		= new Date(minDate_Year + "/" + minDate_Month + "/" + minDate_Day);
	
			var maxDate_Year	= Number(dateMaxDate.substr(0, 4)),
				maxDate_Month	= Number(dateMaxDate.substr(4, 2)),
				maxDate_Day		= Number(dateMaxDate.substr(6, 2));
			dateMaxDate		= new Date(maxDate_Year + "/" + maxDate_Month + "/" + maxDate_Day);
			
			$target_calendar.datepicker("option", {
				"minDate"	: dateMinDate,
				"maxDate"	: dateMaxDate
			});
		}

		if(typeof isStarAlliance != "undefined" && isStarAlliance){
			$target_calendar.datepicker("option", "minDate", +3);
		}
		
		if(typeof _departureDate != 'undefined' && _departureDate != '') {
			//if($target_calendar.find('.startDay').length == 0) {
				// 가는날 세팅
				var depYear		= Number(_departureDate.substr(0, 4)),
					depMonth	= Number(_departureDate.substr(4, 2)),
					depDay		= Number(_departureDate.substr(6, 2));

				if($target_calendar.closest('[id^=multi_calendar]').length < 1) {
					var _date = new Date(depYear + "/" + depMonth + "/" + depDay);
					_date.setMonth(_date.getMonth() - 1);
					$target_calendar.datepicker("setDate", _date);
				}

				$target_calendar.find('[data-year="' + depYear + '"][data-month="' + (depMonth - 1) + '"]').each(function() {
					if($(this).children().html() == String(depDay)) {
						closeCalendar = false;
						$(this).click(); // 지정한 날 클릭
						closeCalendar = true;
					}
				});
			//}
		}
		if(typeof _arrivalDate != 'undefined' && _arrivalDate != '') {
			//if($target_calendar.find('.endDay').length == 0) {
				// 오는날 세팅
				var arrYear		= Number(_arrivalDate.substr(0, 4)),
					arrMonth	= Number(_arrivalDate.substr(4, 2)),
					arrDay		= Number(_arrivalDate.substr(6, 2));

				if($target_calendar.closest('[id^=multi_calendar]').length < 1) {
					var _edate = new Date(arrYear + "/" + arrMonth + "/" + arrDay);
					_edate.setMonth(_edate.getMonth() - 1);
					$target_calendar.datepicker("setDate", _edate);
				}

				$target_calendar.find('[data-year="' + arrYear + '"][data-month="' + (arrMonth - 1) + '"]').each(function() {
					if($(this).children().html() == String(arrDay)) {
						closeCalendar = false;
						$(this).click(); // 지정한 날 클릭
						closeCalendar = true;
					}
				});
			//}
		}

		if($('.compareCalendar').length > 1) {

			if(_idx != 1) {
				var jsPrevDate = '';
				if(RequestUrlArr[4].indexOf('FavoriteRouteForm.do') > -1){
					jsPrevDate = $('#modifyDepartureDate'+(_idx-1)).val().replace(/-/gi, '');
				}else {
					jsPrevDate = $('#departureDate'+(_idx-1)).val().replace(/-/gi, '');
				}

				if(jsPrevDate != null && jsPrevDate != "") {		// 이전 DatePicker에 설정된 날짜가 있을 경우
					var jsPrevDate_year		= Number(jsPrevDate.substring(0, 4));
					var jsPrevDate_month	= Number(jsPrevDate.substring(4, 6));
					var jsPrevDate_day		= Number(jsPrevDate.substring(6, 8));
					var jsDatePrevDate		= new Date(jsPrevDate_year + "/" + jsPrevDate_month + "/" + jsPrevDate_day);

					// 이전 DatePicker 날짜 기준으로 Min Date 세팅
					var _date = new Date(jsPrevDate_year + "/" + jsPrevDate_month + "/" + jsPrevDate_day);
					_date.setMonth(_date.getMonth() - 1);
					$target_calendar.datepicker("setDate", _date);
					setTimeout(function() {
						$target_calendar.datepicker("option", "minDate", jsDatePrevDate);
					}, 1);
				}
			}

		}
	});

	$(document).off('click', '.cal_reset').on('click', '.cal_reset', function() {
		var $this = $(this),
			_idx = $('.cal_reset').index(this) + 1;
		
		if(RequestUrlArr[4].indexOf('Change.do') == -1 && RequestUrlArr[4].indexOf('GetMileageSaveRequest') == -1 && RequestUrlArr[4].indexOf('PurchaseHistory.do') == -1
				&& RequestUrlArr[4].indexOf('DreamFareDetail.do') == -1 && RequestUrlArr[4].indexOf('SuperSaleDetail.do') == -1 && RequestUrlArr[4].indexOf('TargetSalesDetail.do') == -1) {
			if($('#departureArea'+_idx).val() == 'US' || $('#departureArea'+_idx).val() == 'MX') {
				$this.parent().find(".compareCalendar").datepicker("option", "minDate", -1);
			}else {
				$this.parent().find(".compareCalendar").datepicker("option", "minDate", 0);
			}
		}

		if(_idx != 1) {
			var jsPrevDate = '';
			if(RequestUrlArr[4].indexOf('FavoriteRouteForm.do') > -1){
				jsPrevDate = $('#modifyDepartureDate'+(_idx-1)).val().replace(/-/gi, '');
			}else {
				jsPrevDate = $('#departureDate'+(_idx-1)).val().replace(/-/gi, '');
			}

			if(jsPrevDate != null && jsPrevDate != "") {		// 이전 DatePicker에 설정된 날짜가 있을 경우
				var jsPrevDate_year		= Number(jsPrevDate.substring(0, 4));
				var jsPrevDate_month	= Number(jsPrevDate.substring(4, 6));
				var jsPrevDate_day		= Number(jsPrevDate.substring(6, 8));
				var jsDatePrevDate		= new Date(jsPrevDate_year + "/" + jsPrevDate_month + "/" + jsPrevDate_day);

				// 이전 DatePicker 날짜 기준으로 Min Date 세팅
				setTimeout(function() {
					$this.parent().find(".compareCalendar").datepicker("option", "minDate", jsDatePrevDate);
				}, 1);
			}
		}
	});

	$('.faq_wrap').each(function(){

		var _this = $(this);
		var btn_acco_toggle = _this.find('.acco_tit');

		// 기본 Open Accodian
		if( _this.hasClass('on') ){
			_this.find('.acco_cont').show();
		};

		//click event
		btn_acco_toggle.on('click',function(){
			var parentsItem = $(this).parents('.faq_wrap');
			var siblingsItem = parentsItem.siblings('.faq_wrap');
			var acco_cont = parentsItem.find('.acco_cont');

			if (!parentsItem.hasClass('on')) {
				parentsItem.addClass('on').siblings('.faq_wrap').removeClass('on');
				siblingsItem.find('.btn_faq_toggle').text(jsJSON.J0232); // 펼치기
				parentsItem.find('.btn_faq_toggle').text(jsJSON.J1001); // 접기
				siblingsItem.find('.acco_cont').slideUp(300);
				acco_cont.slideToggle(300, function() {
					// toggle이 완료된 후 toogleAfter Function이 있으면 실행한다.
					if(typeof toggleAfter == "function") {
						toggleAfter($(this));
					}
				});
			} else {
				parentsItem.find('.btn_faq_toggle').text(jsJSON.J0232); // 펼치기
				acco_cont.slideToggle(300);
				parentsItem.removeClass('on');
			}
		})

		//faq_wrap 이 한개만 있는 경우
		if (_this.siblings('.faq_wrap').length == 0) {
			btn_acco_toggle.trigger('click')
		}
  	});

	$('.tab_wrap3').each(function() {
		var _this = $(this);
		var tabs = _this.find('.tab_head > li > a'),
			activeTab = _this.find('.tab_head > li.on > a'),
			activeTab2 = _this.find('.t_head > li.on > a'),
		tabsCont = _this.find('> .tab_content > .tab_cont'),
		tabsContOn = _this.find('> .tab_content > .tab_cont.on'),
		tab_2depth = tabs.next().find('.t_head > li > a');

		activeTab.attr('title', jsJSON.J0022); // 선택됨
		activeTab2.attr('title', jsJSON.J0022); // 선택됨

		// 1depth 클릭 시
		tabs.click(function() {
			if ($(this).parents('.tab_wrap3 ').attr('data-tabtype') == 'link') {
				return
			} else {
				tabs.parent('li').removeClass('on');
				$('.t_head > li > a').attr('title', '');

				$(this).next('.tab_2depth').find('li').removeClass('on');
				$(this).next('.tab_2depth').find('li').eq(0).addClass('on').find('a').attr('title',jsJSON.J0022); // 선택됨
				tabsContOn.removeClass('on');
				tabsContOn.eq(0).addClass('on');
				$(this).parent('li').addClass('on');
				var idx = $(this).parent('li').index();
				tabsCont.removeClass('on');
				$(this).parents('.tab_wrap3').find('> .tab_content > .tab_cont').eq(idx).addClass('on');

				if( $(this).parents('.tab_wrap3').find('> .tab_content > .tab_cont').eq(idx).find('.t_content') ){
					$(this).parents('.tab_wrap3').find('> .tab_content > .tab_cont').eq(idx).find('.t_content .t_cont').removeClass('on')
					$(this).parents('.tab_wrap3').find('> .tab_content > .tab_cont').eq(idx).find('.t_content .t_cont').eq(0).addClass('on');
				}


				tabs.attr('title', '');
				$(this).attr('title', jsJSON.J0022); // 선택됨

				innerTabMenu();
				// 예약안내 페이지에서 사용
				if ($('.visual_slider_wrap').length > 0) {
					//infoSlider();
				}
			};
		});

		_this.each(function(){
			tabWrap3H($(this));
		});

	});

	//weblog(와이즈로그) 항공권선택 아웃링크 관련 함수 호출 => 관련 link에 name="bookingOutlink" 속성 추가 필요
	$(document).off('click', 'a[name=bookingOutlink]').on('click', 'a[name=bookingOutlink]', function() {
		var _hyperLink = $(this).attr('href');

		// 아웃링크 web 함수 호출(weblog.js 호출)
		action_logging({catetype:'ALL_PC_BK', outlink:_hyperLink});
	});


});
////////////////////document ready end ////////////////////

//Header - 회원가입쿠폰 안내 배너 쿠키 get/set
var newSubscriptionCoupon = {
	mz_cookie: {
		mz_get: function(name) {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				key = cookies[i].substr(0, cookies[i].indexOf('='));
				values = cookies[i].substr(cookies[i].indexOf('=') + 1);
				key = key.replace(/^\s+|\s+$/g, ''); // 공백 제거
				if (key == name) {
					return true;
				}
			}
			return false;
		}, 
		mz_set: function(key, value, day) {
			var date = new Date();
			date.setTime(date.getTime() + day * 24*60*60*1000);
			document.cookie = key + '=' + value + ';expires=' + date.toGMTString() + ';path=/';
		}
	}
}

//Header - 회원가입쿠폰 안내 배너 show
$(function(){
	if(!newSubscriptionCoupon.mz_cookie.mz_get('newSubscriptionCoupon')) {
		$('.new_subscription').show();
	}
});

//Header - 회원가입쿠폰 안내 배너 쿠키 닫기 버튼 클릭 이벤트
$('.new_subscription .join_event_btn_x').each(function(){
	$('.new_subscription .join_event_btn_x').click(function(){
		newSubscriptionCoupon.mz_cookie.mz_set('newSubscriptionCoupon', 'newSubscriptionCoupon', 1);
		$('.new_subscription').hide();
	});
	if(newSubscriptionCoupon.mz_cookie.mz_get('newSubscriptionCoupon')) {
		$('.new_subscription').remove();
	}
});


//배열안에 맵 중복제거  ex : [{key1-1 : val1-1, key1-2 : val1-2},{key2-1 : val2-1, key2-1 : val2-2}......]
var getRemoveDupArrayMap = function getRemoveDupArrayMap(originalArray, prop, prop2, prop3) {
	var dupArray = [];
  var lookupObject  = {};
   
  var lookupObject2  = originalArray;
  for(var i in originalArray) {
      for(var k in lookupObject2) {
      	var dupIdx = 0;
      	if(lookupObject2[k][prop] == originalArray[i][prop]
      		&& lookupObject2[k][prop2] == originalArray[i][prop2]
      			&& lookupObject2[k][prop3] == originalArray[i][prop3]
          ){
      		dupIdx++;
      	}
      
      	if(dupIdx > 1){
      		dupArray.push(dupIdx);
      	}
     }
  }
   
  for(var i=dupArray.length; i>=0; i--){
  	originalArray.splice(dupArray[i], 1);
  }
  return originalArray;
}

//공백체크 
var isEmpty = function (val){
	var rtnVal = true;
	if(val != undefined && val != "" && val != null){
		rtnVal = false;
	}
	return rtnVal;
}

// ipad일때, viewport 변경 
function fixViewPort() {
	var userAgent = navigator.userAgent.toLowerCase();
	//screen.availWidth
	if(typeof userAgent != 'undefined' && typeof screen != 'undefined' && typeof screen.availWidth != 'undefined') {
		var ipad =  userAgent.search('ipad|macintosh');
		if(ipad > -1 && screen.availWidth > 0 && screen.availWidth <= 800) {
			$("meta[name=viewport]").attr("content","width=device-width, initial-scale=0.6, maximum-scale=1.0, minimum-scale=0.6, user-scalable=no");
		} else if(ipad > -1 && screen.availWidth > 800 && screen.availWidth <= 1100) {
			$("meta[name=viewport]").attr("content","width=device-width, initial-scale=0.8, maximum-scale=1.0, minimum-scale=0.8, user-scalable=no");
		}
	}
}
