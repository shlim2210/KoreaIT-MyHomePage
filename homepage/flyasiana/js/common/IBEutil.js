$.fn.extend(jQuery,{
	cfn_cutFloat : function(s, i) {
		if (isNaN(s)) {
			return 0;
		}
		if (i === undefined) {
			i = 2;
		}
		
		return Number(Number(s).toFixed(i));
	}
});





/*
 * 대문자만 입력 가능
 * 
 * 00. $thisObject : 체크 대상 object
 * 
 * */
var keyupOnlyUpperCase = function keyupOnlyUpperCase($thisObject) {
	$thisObject.off("keyup").on("keyup", function(event) {
		event.stopPropagation(); 
		
		var $this = $(this);
		$this.val($this.val().toUpperCase());
	});
}



/*
 * 숫자만 입력 가능
 * 
 * 00. thisObject : 체크 대상 object
 * 
 * */
var keyupOnlyNum = function keyupOnlyNum($thisObject) {
	$thisObject.keyup(function(event) {
		event.stopPropagation();
		
		if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 37 || event.keyCode == 39)) {
			var inputVal = $thisObject.val();
			$thisObject.val(inputVal.replace(/[^0-9]/gi, ''));
		}
	});
};

var removeChar = function removeChar(event) {
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;
	if( keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 ) {
		return;
	}else {
		event.target.value = event.target.value.replace(/[^0-9]/g, "");
		if(event.target.value == '') {
			event.target.value = '0';
		}
		if(Number(event.target.value) < 10) {
			event.target.value = String(Number(event.target.value));
		}
	} 
};

// 0~9사이 숫자 여부 체크
function isNumber(a) {
	for (var i = 0; i < a.length; i++) {
		if (a.substring(i,i+1) < '0' || a.substring(i,i+1) > '9') {
			return false;
		}
	}
	return true;
}

// 동일 숫자 연속 입력 체크
function isEqualNum(val) {
	var equalNumReg = /([0-9])\1{2,}/;
	return equalNumReg.test(val);
}

// 연속된 숫자 연속 입력 체크 (오름차순)
function isContinueNum(val) {
	var continueNumReg = /012|123|234|345|456|567|678|789|890/;
	return continueNumReg.test(val);
}

//연속된 숫자 연속 입력 체크 (내림차순)
function isBackContinueNum(val) {
	var backContinueNumReg = /098|987|876|765|654|543|432|321|210/;
	return backContinueNumReg.test(val);
}



/* 
 * 문자열에서 특정문자를 치환
 * 
 * 00. entry		: 대상 문자열
 * 01. strOldChar	: 치환해야 할 문자
 * 02. strNewChar	: 치환 후 문자
 * 
 * */
var replaceChars = function replaceChars(entry, strOldChar, strNewChar) {
	var temp = String(entry);
	while (temp.indexOf(strOldChar) > -1) {
		temp = temp.replace(strOldChar, strNewChar);
	}
	
	return temp;
};



/* 
 * Null, NaN, "", undefined 값에 default 값 설정
 * 
 * 00. val			: 설정을 원하는 값
 * 01. defaultVal	: default 값
 * 
 * */
var getNullToDefault = function getNullToDefault(val, defaultVal) {
	if (typeof val == 'undefined') {
		val = defaultVal;
	} else {
		if (val == null || val == "NaN" || val == "") {
			val = defaultVal;
		}
	}
	
	return val;
};



//String에 comma 삽입
String.prototype.setComma = function (type, pCipher) {
	var objValue = this;
	var splitString = objValue.split('.'); // 소수점(.)에서 분할하여 배열변수에 저장한다.

	var str = new Array();
	var v = splitString[0];

	for (var i = 1; i <= v.length; i++) { //문자열만큼 루프를 돈다.
		str[str.length] = v.charAt(v.length - i); //스트링에 거꾸로 담음
		if (i % 3 == 0 && i != 0 && i != v.length && !(i == v.length - 1 && v.charAt(0) == '-')) { //첫부분이나, 끝부분에는 콤마가 안들어감
			str[str.length] = '.'; //배열을 핸들링할때 쉼표가 들어가면 헷갈리므로 세자리마다 점을 찍음
		}
	}

	str = str.reverse().join('').replace(/\./gi, ','); //배열을 거꾸로된 스트링으로 바꾼후에, 점을 콤마로 치환
	if (splitString.length == 2) {
		str = str + '.' + splitString[1];
	}
	
	if(typeof type == 'undefined') {
		var currencyCipherLastIdx = 0,
		decimalPointLength = 0;
		
		// currencyCipher must be declare
		if(typeof currencyCipher != 'undefined') {
			if(currencyCipher.indexOf('.') > -1) {
				currencyCipherLastIdx = currencyCipher.split('.')[1].length;
			}
		}
		
		if(str.indexOf('.') > -1) {
			decimalPointLength = str.split('.')[1].length;
		}
		
		if(decimalPointLength > currencyCipherLastIdx) {
			var cutIdx = decimalPointLength - currencyCipherLastIdx;
			str = str.substring(0, str.length-cutIdx);
			if((str.length-1) == str.indexOf('.')) {
				str = str.substring(0, str.length-1);
			}
		}else if(decimalPointLength < currencyCipherLastIdx){
			if(str.indexOf(".") > -1){
				var cutIdx = currencyCipherLastIdx - decimalPointLength;
				for(var i=0; i<cutIdx; i++){
					str = str+"0";
				}
			}else{
				str = str + ".";
				var cutIdx = currencyCipherLastIdx - decimalPointLength;
				for(var i=0; i<cutIdx; i++){
					str = str+"0";
				}
			}
		}
	} else if (type == "seat" && type == "emd") {
		var currencyCipherLastIdx = 0,
		decimalPointLength = 0;
		
		if(typeof pCipher != 'undefined') {
			if(pCipher.indexOf('.') > -1) {
				currencyCipherLastIdx = pCipher.split('.')[1].length;
			}
		}
		
		if(str.indexOf('.') > -1) {
			decimalPointLength = str.split('.')[1].length;
		}
		
		if(decimalPointLength > currencyCipherLastIdx) {
			var cutIdx = decimalPointLength - currencyCipherLastIdx;
			str = str.substring(0, str.length-cutIdx);
			if((str.length-1) == str.indexOf('.')) {
				str = str.substring(0, str.length-1);
			}
		}else if(decimalPointLength < currencyCipherLastIdx){
			if(str.indexOf(".") > -1){
				var cutIdx = currencyCipherLastIdx - decimalPointLength;
				for(var i=0; i<cutIdx; i++){
					str = str+"0";
				}
			}else{
				str = str + ".";
				var cutIdx = currencyCipherLastIdx - decimalPointLength;
				for(var i=0; i<cutIdx; i++){
					str = str+"0";
				}
			}
		}
	}
	
	return str;
};

String.prototype.toKorChars = function() {
	var cCho = [ 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ],
		cJung = [ 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ' ],
		cJong = [ '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ],
		cho,
		jung,
		jong;
	
	var str = this,
		cnt = str.length,
		chars = '',
		cCode;
		
	for(var i=0; i<cnt; i++) {
		cCode = str.charCodeAt(i);
		if(cCode == 32) {
			continue;
		} // 한글이 아닌 경우
		if(cCode < 0xAC00 || cCode > 0xD7A3) {
			chars += str.charAt(i);
			continue;
		}
		cCode = str.charCodeAt(i) - 0xAC00;
		
		jong = cCode % 28; // 종성
		jung = ((cCode - jong) / 28 ) % 21 // 중성
		cho = (((cCode - jong) / 28 ) - jung ) / 21 // 초성

		chars += cCho[cho];
		chars += cJung[jung];
		
		if(cJong[jong] !== '') {
			chars += cJong[jong];
		}
	}
	return chars;
}

//문자형 데이타에서 날짜 추출(YYYYMMDD -> DATE)
String.prototype.getDate = function(){
	var dateString = this;
	var yy	= Number(dateString.substr(0, 4));
	var mm	= Number(dateString.substr(4, 2));
	var dd	= Number(dateString.substr(6, 2));
	
	var returnDate	= new Date(yy + "/" + mm + "/" + dd);
	
	return returnDate;
}

//날짜형 데이타에서 문자 추출
Date.prototype.getYYYYMMDD = function (){
	var yy = this.getFullYear();
	var mm = this.getMonth()+1;
	var dd = this.getDate();
	var fullYear = ''+yy+(mm <10?'0':'')+mm+''+(dd <10?'0':'')+dd;
	
	return fullYear;
}

// 숫자에 comma 삽입
Number.prototype.setComma = function () {
	return this.toString().setComma();
}

/////////////////////////// Date 관련 ///////////////////////////

//생년월일에서 (만)나이를 구한다.
var getAgeToday = function getAgeToday(d1, d2) {
    var day1 = stringToDate(d1);
    var day2 = stringToDate(d2);

    day2 = day2 || new Date();
    var diff = day2.getTime() - day1.getTime();
    var iAge = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));

    return iAge;
}

//두 날짜의 차이 일수 구하는 함수
var getDiffDate = function getDiffDate(poSourceDate, poTargetDate) {
	var fromDate = stringToDate(poSourceDate);
	var toDate = stringToDate(poTargetDate);
	
	return ((fromDate.getTime() - toDate.getTime()) / (1000 * 60 * 60 * 24));
};



//차이 시간 계산
var getDifferentTime = function getDifferentTime(firstDate, secondDate, changeType) {
	
	if (firstDate.length == 8) {
		firstDate += "000000";
	}
	if (secondDate.length == 8) {
		secondDate += "000000";
	}
	
	var firstDateObject = new Date(firstDate.substring(0,4), parseInt(firstDate.substring(4,6),10) - 1, firstDate.substring(6,8), firstDate.substring(8,10), firstDate.substring(10,12), firstDate.substring(12,14)).valueOf();
	var secondDateObject = new Date(secondDate.substring(0,4), parseInt(secondDate.substring(4,6),10) - 1, secondDate.substring(6,8), secondDate.substring(8,10), secondDate.substring(10,12), secondDate.substring(12,14)).valueOf();
	
	var differentTime = secondDateObject - firstDateObject;
	var differentTimeParse;
	
	if (changeType == "DAY") {
		differentTimeParse = Math.floor(differentTime / (24 * 60 * 60 * 1000) * 1);
	} else if (changeType == "HOUR") {
		differentTimeParse = Math.floor(differentTime / (60 * 60 * 1000) * 1);
	} else if (changeType == "MIN") {
		differentTimeParse = Math.floor(differentTime / (60 * 1000)) % 60;
	} else if (changeType == "SEC") {
		differentTimeParse = Math.floor(differentTime / 1000 * 1);
	}
	
	return differentTimeParse;
};

var dateToString = function dateToString(date) {
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var day = date.getDate();
	
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	
	return "" + year + month + day;
};

//입력받은 문자열을 날짜 형식으로 만들어준다.
var stringToDate = function stringToDate(basicDate) {
	var newDate = null;
	
	if (basicDate != undefined) {
		basicDate = basicDate.replace(/[^0-9]/gi, ""); // 숫자가 아닌것은 empty로 치환.
		if (basicDate.length == 8) {
			var year	= basicDate.substring(0, 4);
			var Month	= basicDate.substring(4, 6);
			var day		= basicDate.substring(6, 8);
				newDate	= new Date(Number(year), Number(Month) - 1, Number(day));
		} else if (basicDate.length == 10) {
			var year	= basicDate.substring(0, 4);
			var Month	= basicDate.substring(4, 6);
			var day		= basicDate.substring(6, 8);
			var hour	= basicDate.substring(8, 10);
				newDate	= new Date(Number(year), Number(Month) - 1, Number(day), Number(hour));
		} else if (basicDate.length == 12) {
			var year	= basicDate.substring(0, 4);
			var Month	= basicDate.substring(4, 6);
			var day		= basicDate.substring(6, 8);
			var hour	= basicDate.substring(8, 10);
			var second	= basicDate.substring(10, 12);
				newDate	= new Date(Number(year), Number(Month) - 1, Number(day), Number(hour), Number(second));
		} else if (basicDate.length == 14) {
			var year	= basicDate.substring(0, 4);
			var Month	= basicDate.substring(4, 6);
			var day	 	= basicDate.substring(6, 8);
			var hour	= basicDate.substring(8, 10);
			var second	= basicDate.substring(10, 12);
			var msecond	= basicDate.substring(12, 14);
				newDate	= new Date(Number(year), Number(Month) - 1, Number(day), Number(hour), Number(second), Number(msecond));
		}
	}
	
	return newDate;
};



/*-----------------------------------------
	Date format String Return
-------------------------------------------*/
//var getDateFormat = function getDateFormat(pDate, dateFormat) {
//	var oDateFormat;
//	if(dateFormat != null && typeof dateFormat != 'undefined') {
//		oDateFormat = dateFormat;
//	} else {
//		oDateFormat = 'yyyy-MM-dd';
//	}
//	if(pDate.length < 8 ) {
//		return pDate;
//	}
//	
//	// yyyymmdd
//	var orgYear		= pDate.substr(0, 4);
//	var orgMonth	= pDate.substr(4, 2);
//	var orgDay		= pDate.substr(6, 2);
//	
//	//var chgValue	= $.format(new Date(orgYear,orgMonth-1,orgDay), oDateFormat);
//	var chgValue	= $.format(stringToDate(pDate), oDateFormat);
//	
//	return chgValue;
//};

var getMomentDateFormat = function getMomentDateFormat(pDate, dateFormat) {
	
	if(dateFormat != null && typeof dateFormat != 'undefined') {
		oDateFormat = dateFormat.toUpperCase();
	} else {
		oDateFormat = 'YYYY-MM-DD';
	}
	if(pDate.length < 8 ) {
		return pDate;
	}
	
	var chgValue = moment(stringToDate(pDate)).format(oDateFormat);
	
	return chgValue;
}

/* 
 * Min / Max Date 세팅
 * 
 * 00. $target	: 대상 Date Picker의 Input Text
 * 01. minDate	: 세팅할 Min Date		ex) 20180101
 * 02. value	: Max Date 값
 * 03. type		: Value Type (ArrDate / Range)
 * 
 * */
var setMinMaxDate = function setMinMaxDate($target, minDate, value, type) {
	var $target_calendar = $target.parents(".itinerary").find(".compareCalendar");		// 세팅할 캘린더
	
	if($target_calendar.length == 0){
		$target_calendar = $target.parent().next().find(".compareCalendar");
	}
	
	if(typeof minDate != 'undefined') {
		var minDate_Year	= Number(minDate.substr(0, 4));
		var minDate_Month	= Number(minDate.substr(4, 2));
		var minDate_Day		= Number(minDate.substr(6, 2));
		
		var dateMinDate		= new Date(minDate_Year + "/" + minDate_Month + "/" + minDate_Day);
		//$target_calendar.datepicker("setDate", dateMinDate);
		
		if(type.toLowerCase() == "arrdate") {
			var maxDate_Year	= Number(value.substr(0, 4));
			var maxDate_Month	= Number(value.substr(4, 2));
			var maxDate_Day		= Number(value.substr(6, 2));
			var dateMaxDate		= new Date(maxDate_Year + "/" + maxDate_Month + "/" + maxDate_Day);
			
			// Min / Max Date 세팅
			$target_calendar.datepicker("option", {
				"minDate"	: dateMinDate,
				"maxDate"	: dateMaxDate
			});
		}
		if(type.toLowerCase() == "range") {
			var dateRange	= value;
			if(typeof(dateRange) != "number") {				// dateRange 값이 Number가 아닐 경우 Number형으로 형변환
				dateRange	= Number(value); 
			}
			
			// Min / Max Date 세팅
			$target_calendar.datepicker("option", {
				"minDate"	: dateMinDate,
				"maxDate"	: cfn_addDate(minDate, dateRange, "D")
			});
		}
	}else {
		var maxDate_Year	= Number(value.substr(0, 4));
		var maxDate_Month	= Number(value.substr(4, 2));
		var maxDate_Day		= Number(value.substr(6, 2));
		var dateMaxDate		= new Date(maxDate_Year + "/" + maxDate_Month + "/" + maxDate_Day);
		
		$target_calendar.datepicker("option", {
			"maxDate"	: dateMaxDate
		});
	}
	
};



/* 
 * 이벤트 캘린더 세팅
 * 
 * 00. $target			: 대상 Date Picker의 Input Text
 * 01. depDate_start	: 선택 가능한 첫 출발일자		ex) 20180101
 * 02. depDate_end		: 선택 가능한 마지막 출발일자
 * 03. selectRange		: 도착일자까지의 범위
 * 
 * */
var setEventCalendar	= function setEventCalendar($target, depDate_start, depDate_end, selectRange) {
	setMinMaxDate($target, depDate_start, depDate_end, "ArrDate");
	
	if(typeof(selectRange) != "number") {				// selectRange 값이 Number가 아닐 경우 Number형으로 형변환
		selectRange	= Number(selectRange); 
	}
	
	$target.siblings("[name=departureDate]").on('textchange', function() {
		var $this	= $(this);
		setMinMaxDate($this.siblings(".datepicker"), $this.val(), selectRange, "Range");
	});
};

var setSelectMonthDeselect = function(strStartMonth,strEndMonth){
	var $slcChangeMonth = $('#slcChangeMonth');
	
	$slcChangeMonth.find('option').each(function(){
		var montTxt = parseInt($(this).text().replace(".","")); 
		var startMonth = parseInt(strStartMonth.replace(".",""));
		var endMonth = parseInt(strEndMonth.replace(".",""));
		if(montTxt >endMonth || montTxt < startMonth){
			$(this).attr('disabled','disabled');
		}
	});
};



/* 
 * Add Date
 * 
 * 00. sDate	: 변경할 날짜
 * 01. value	: 더할 값
 * 02. type		: Add Type (Y or M or D)
 * 
 * */
var cfn_addDate	= function cfn_addDate(sDate, value, type) {
	var Year	= Number(sDate.substr(0, 4));
	var Month	= Number(sDate.substr(4, 2));
	var Day		= Number(sDate.substr(6, 2));
	
	if(typeof(value) != "number") {				// value 값이 Number가 아닐 경우 Number형으로 형변환
		value	= Number(value); 
	}
	
	var date	= new Date();
	
	if(type == "D") {
		date = new Date(Year, Month - 1, Day + value);
	} else if(type == "M") {
		date = new Date(Year, Month - 1 + value, Day);
	} else if(type == "Y") {
		date = new Date(Year + value, Month - 1, Day);
	} else {
		date = new Date(Year, Month - 1, Day + value);
	}
	
	return date;
};



/*
* 예상총액 운임 날짜 format function
* 
* 8자리 또는 8자리 이상인 날짜 형식 String을 YYYY.MM.DD(E) 형태로 반환.
* 
* ex)
* getDateNWeekName('201711290000', 'JA');	=> 2017.11.29(水)
* getDateNWeekName('20171129', 'ko');		=> 2017.11.29(수)
* 
*/
var getDateNWeekName = function getDateNWeekName(dateString, langCode) {
//	return getDateFormat(dateString, 'yyyy.MM.dd') + '(' + getDayByLang(dateString.substr(0,8), langCode) + ')';
	return getMomentDateFormat(dateString, 'YYYY.MM.DD') + '(' + getDayByLang(dateString.substr(0,8), langCode) + ')';
};

/////////////////////////// Date 관련 ///////////////////////////



/* 사용법 */
/*
- 스탬프 시작점 : TimeStamp.start();
- 스탬프 중간점 : TimeStamp.stamp();
 // ID가 들어갈 수 있습니다.(대소문자구분X) 
 // start 와 finish는 등록할 수 없습니다. 예약어 느낌
- 스탬프 종료 : TimeStamp.finish();
- 스탬프 시작 -> 종료 기간 출력 
 : TimeStamp.printResult();
-  모든 스탬프 출력 
 1) 시작점 - 각 스탬프들 : TimeStamp.printAll(true);
  ex) [Start -> track_0] , [Start -> track_1]
 2) 각 스탬프들 사이의 시간 : TimeStamp.printAll(false);
  ex) [Start -> track_0] , [track_0 -> finish]
- 특정 스탬프끼리 비교 
 : TimeStamp.compareWithId(start_id , end_id);
  ex) [track_0 -> track_3]
- 특정 스탬프 가져오기
  : TimeStamp.getStampWithId(id);	    
*/
var TimeStamp = {
    track : {},
    tag : 0,
    state : 0,
    clear : function(){
        this.track = {};
        this.tag = 0;
    },
    start : function(){
        if(this.state == 0){
            this.clear();
            var _now = new Date();
            this.state = 1;
            
            this.track["start"] = _now;
        }
        else{
            throw "타임스탬프가 이미 실행중입니다.";
        }
    },
    stamp : function(id){
        if(this.state == 1){
            var _stamp_id
            if(id != undefined){
                if(id.toLowerCase() == "start" || id.toLowerCase() == "finish"){
                    throw "START 혹은 FINISH는 예약어입니다. 다른 이름으로 입력해주세요";
                }
                else{
                    if(this.track[id] == undefined){
                        _stamp_id = id.toLowerCase();
                    }
                    else{
                        throw "이미 등록된 id입니다";
                    }
                }
            }
            else{
                _stamp_id = "track_" + this.tag;
                this.tag++;
            }
            
            this.track[_stamp_id] = new Date();
        }
        else {
            throw "타임스탬프가 실행중이지 않습니다. 먼저 실행해주세요";
        }
    },
    finish : function(){
        if(this.state == 1){
            var _now = new Date();
            this.state = 0;
            this.track["finish"] = _now;
            this.printResult();
        }
        else{
            throw "타임스탬프가 실행중이지 않습니다. 먼저 실행해주세요";
        }
    },
    getStampWithId : function(id){
        if(id == undefined){ return undefined; }
        else{
            return this.track[id.toLowerCase()];
        }
    },
    hasStamp : function(id){
        if(id == undefined){ return undefined; }
        else{
            return this.track[id.toLowerCase()] != undefined;
        }
    },
    printResult : function(){
        var _dStart = this.getStampWithId("start");
        var _dFinish = this.getStampWithId("finish");
        
        console.log("# 총 소요 : " + (_dFinish.getTime() - _dStart.getTime()) + "ms");
    },
    printAll : function(compare_with_start){
        if(compare_with_start == true){
            var _target = -1;
            console.log("## TIME STAMP RESULT ##");
            for(var name in this.track){
                if(_target == -1){ _target = this.track["start"]; continue; }
                else{
                    console.log("# [start -> "+name+"] : " + ((this.track[name]).getTime() - _target.getTime()) + "ms");
                }
            }
        }
        else{
            var _target_name = -1;
            console.log("## TIME STAMP RESULT ##");
            for(var name in this.track){
                if(_target_name == -1){ _target_name = name; continue; }
                else{
                    if(name == undefined){ break; }
                    
                    var _c1 = this.getStampWithId(_target_name);
                    var _c2 = this.getStampWithId(name);
                    var _ret = _c2.getTime() - _c1.getTime();
                    console.log("# ["+_target_name+" -> "+name+"] : " + _ret + "ms");
                    
                    _target_name = name;
                }
            }
        }
    },
    compareWithId : function(start_id , end_id){
        if(!this.hasStamp(start_id) || !this.hasStamp(end_id)){
            throw "비교할 객체가 존재하지 않습니다.";
        }
        else{
            var _c1 = this.getStampWithId(start_id);
            var _c2 = this.getStampWithId(end_id);
            var _ret = _c2.getTime() - _c1.getTime();
            console.log("# 결과 ["+start_id+" -> "+end_id+"] : " + _ret + "ms");
        }
    }
};



/* 
 * RSA 암호화
 * 
 * 00. publicKeyModulus		: publicKeyModulus
 * 01. publicKeyExponent	: publicKeyExponent
 * 02. orgStr				: 암호화할 문자
 * 
 * */
var encryptRSA = function encryptRSA(publicKeyModulus, publicKeyExponent, orgStr) {
	var rsa = new RSAKey();
	rsa.setPublic(publicKeyModulus, publicKeyExponent);
	var encTxt = rsa.encrypt(orgStr);
	return encTxt;
};


/* 
 * 바이트 길이 체크
 * kimeg [1OPT2011002]
 * 
 * 00. el: 체크 대상 object
 * 
 * */
var byteCheck = function byteCheck(el){
    var codeByte = 0;
    for (var idx = 0; idx < el.val().length; idx++) {
        var oneChar = escape(el.val().charAt(idx));
        if ( oneChar.length == 1 ) {
            codeByte ++;
        } else if (oneChar.indexOf("%u") != -1) {
            codeByte += 2;
        } else if (oneChar.indexOf("%") != -1) {
            codeByte ++;
        }
    }
    return codeByte;
}

/* 
 * 제한 바이트까지 문자열 가져오기
 * kimeg [1OPT2011002]
 * 
 * 00. el: 체크 대상 object
 * 00. limitBytes: 제한 바이트
 * 
 * */
var getStringUpToLimitBytes = function getStringUpToLimitBytes(el, limitBytes){
	if (el == null || !el.length) {
		return '';
	}
    var codeByte = 0;
    for (var idx = 0; idx < el.val().length; idx++) {
        var oneChar = escape(el.val().charAt(idx));
        if ( oneChar.length == 1 ) {
            codeByte ++;
        } else if (oneChar.indexOf("%u") != -1) {
            codeByte += 2;
        } else if (oneChar.indexOf("%") != -1) {
            codeByte ++;
        }
        if (limitBytes < codeByte) {
        	return el.val().substr(0, idx);
        }
    }
    return el.val();
}

/* 
 * JSON 여부 판단
 * jeonms
 * 
 * 00. obj: JEON 여부 체크 대상 파라메터
 * 
 * */
function isJson(obj){
	try{
		JSON.parse(obj);
	}catch (e){
		return false;
	}
	
return true;
}


