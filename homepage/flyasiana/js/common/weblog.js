/**
 * weblog
 */

var _n_p01 = null;		// (deviceType) 플랫폼(PC)
var _n_p02 = null;		// (countryCode) 국가(KR)
var _n_p03 = null;		// (languageCode) 언어(KO)
var _n_p04 = null;		// (loginType) 로그인 처리과정에 성공 후 발생(ID,ACNO,SNS)
var _n_p05 = null;		// (snsType) 로그인 종류(kakao,naver,facebook)
var _n_p06 = null;		// (certType) 가입 인증수단(ipin,mobile,email)
var _n_p07 = null;		// (route) 노선정보(1INC-ZRH_2ZRH-INC)
var _n_p08 = null;		// (paxType) PAX 타입
var _n_p09 = null;		// (mealCode) Meal_code(STML,CHML)
var _n_p10 = null;		// (intervalDay) 신청시점 출발-구매일(00)
var _n_p11 = null;		// (pnrSource) PNR 생성 출처 구분(online,offline,other,etc)
var _n_p12 = null;		// (seatCount) 좌석수(00)
var _n_p13 = null;		// (freeSeatCount) 무료좌석수(00)
var _n_p14 = null;		// (paidSeatCount) 유료좌석수(00)
var _n_p15 = null;		// (emailSendCount) email발송수(00)
var _n_p16 = null;		// (smsSendCount) sms발송수(00)
var _n_p17 = null;		// (oid) 점소(SELOZ08RS)
var _n_p18 = null;		// (currency) currency(USD,CNY)
var _n_p19 = null;		// (amount) 금액(1000)
var _n_p20 = null;		// (passengerCount) 탑승객수(00)
var _n_p21 = null;		// (segCount) seg수(00)
var _n_p22 = null;		// (bizType) REV,RED
var _n_p23 = null;		// (domIntType) 국내,국제
var _n_p24 = null;		// (arriveArea) 도착지대노선(KR)
var _n_p25 = null;		// (paymentType) 결제타입
var _n_p26 = null;		// (bookingClass) BKG CLS 통계(Y.B.M.S.I)
var _n_p27 = null;		// (tripType) 여정 유형(OW,RT,ETC)
var _n_p28 = null;		// (selfBoarding) 본인탑승여부(self,other)
var _n_p29 = null;		// (refundType) 취소,환불(VOID,refund)
var _n_p30 = null;		// (likeEvent) 개인화 엄지 클릭으로 이벤트 조회(personal)
var _n_p31 = null;		// (subscribeEvent) 찜한 이벤트 클릭으로 이벤트 조회(thumb)
var _n_p32 = null;		// (errorInfo) 에러발생 에러정보(94_[94]탑승정보가 없습니다.)
var _n_p33 = null;		// (mileage) 마일리지 금액(1000)
var _n_p34 = null;      // (onholdYn) Onhold 여부 : Y, N

var WL = {
	setDeviceType : function(deviceType) {
		_n_p01 = deviceType;
	},
	setCountryCode : function(countryCode) {
		_n_p02 = countryCode;
	},
	setLanguageCode : function(languageCode) {
		_n_p03 = languageCode;
	},
	setLoginType : function(loginType) {
		_n_p04 = loginType;
	},
	setSnsType : function(snsType) {
		_n_p05 = snsType;
	},
	setCertType : function(certType) {
		_n_p06 = certType;
	},
	setRoute : function(route) {
		_n_p07 = route;
	},
	setPaxType : function(paxType) {
		_n_p08 = paxType;
	},
	setMealCode : function(mealCode) {
		_n_p09 = mealCode;
	},
	setIntervalDay : function(intervalDay) {
		_n_p10 = intervalDay;
	},
	setPnrSource : function(pnrSource) {
		_n_p11 = pnrSource;
	},
	setSeatCount : function(seatCount) {
		_n_p12 = seatCount;
	},
	setFreeSeatCount : function(freeSeatCount) {
		_n_p13 = freeSeatCount;
	},
	setPaidSeatCount : function(paidSeatCount) {
		_n_p14 = paidSeatCount;
	},
	setEmailSendCount : function(emailSendCount) {
		_n_p15 = emailSendCount;
	},
	setSmsSendCount : function(smsSendCount) {
		_n_p16 = smsSendCount;
	},
	setOid : function(oid) {
		_n_p17 = oid;
	},
	setCurrency : function(currency) {
		_n_p18 = currency;
	},
	setAmount : function(amount) {
		_n_p19 = amount;
	},
	setPassengerCount : function(passengerCount) {
		_n_p20 = passengerCount;
	},
	setSegCount : function(segCount) {
		_n_p21 = segCount;
	},
	setBizType : function(bizType) {
		_n_p22 = bizType;
	},
	setDomIntType : function(domIntType) {
		_n_p23 = domIntType;
	},
	setArriveArea : function(arriveArea) {
		_n_p24 = arriveArea;
	},
	setPaymentType : function(paymentType) {
		_n_p25 = paymentType;
	},
	setBookingClass : function(bookingClass) {
		_n_p26 = bookingClass;
	},
	setTripType : function(tripType) {
		_n_p27 = tripType;
	},
	setSelfBoarding : function(selfBoarding) {
		_n_p28 = selfBoarding;
	},
	setRefundType : function(refundType) {
		_n_p29 = refundType;
	},
	setLikeEvent : function(likeEvent) {
		_n_p30 = likeEvent;
	},
	setSubscribeEvent : function(subscribeEvent) {
		_n_p31 = subscribeEvent;
	},
	setErrorInfo : function(errorInfo) {
		_n_p32 = errorInfo;
	},
	setMileage : function(mileage){
		_n_p33 = mileage;
	},
	setOnholdYn : function(onholdYn){
		_n_p34 = onholdYn;
	},
	/**
	 * wiseLog에서 제공된 script append
	 */
	appendScript : function() {
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = '/wlo/wl6.js';
		document.body.appendChild(s);
	},
	/**
	 * deviceType, countryCode, languageCode setting
	 */
	init : function(){
		// _n_p01 -> wl6.js 에서 처리하기로 함
//		if(_n_p01 == null){
//			var filter = 'win16|win32|win64|mac|macintel';
//			if(navigator.platform) {
//				if(filter.indexOf(navigator.platform.toLowerCase()) < 0) {
//					this.setDeviceType('M');
//				} else {
//					this.setDeviceType('PC');
//				}
//			}
//		}
		var pathName = location.pathname;
		var pathArr = pathName.split('/');
		if(_n_p02 == null){
			this.setCountryCode(pathArr[pathArr.length - 3]);
		}
		if(_n_p03 == null){
			this.setLanguageCode(pathArr[pathArr.length - 2]);
		}
	}
}

$(document).ready(function(){
	WL.init();
	// weblog script append
	WL.appendScript();
});