// 해당년 마지막월 계산
function getYearLastMonth(date, flag) {
	var tmp	= new Date(parseInt(date.substring(0,4),10), 0, 0);
	var result = tmp.getMonth()+1;

	if (flag != null) {
		result = "" + result;
		if (result.length == 1) result = "0" + result;
	}

	return result;
}

// 해당월 마지막일 계산
function getMonthLastDay(date) {
	return (new Date(Number(date.substring(0,4)), Number(date.substring(4,6)), 0)).getDate();
}


/**
 * Date: 2013.10.28
 * Desc: 파라미터로 받은 일자와 각 탑승객 타입별 나이의 최대일자와 최소일자를 돌려줌 
 * getPaxAgeLimitDate("20140102", "ADT", "I") → ret.minDate = "19140131", ret.maxDate = "20010102"
 */
var getPaxAgeLimitDate = function (targetDate, paxType, domIntType) {
	
	var ret = {};
	
	var MAX_CHD_AGE = domIntType == "I" ? 12 : 13;
	
	var tmpDate = null;
	
	if (paxType == "ADT") { 
		ret.maxDate = addDate("yyyy", -MAX_CHD_AGE, targetDate, "");

		tmpDate = addDate("yyyy", -100, targetDate, "");
		tmpDate = addDate("d", 1, tmpDate, "");
		
		var maxDay = getMonthLastDay(tmpDate);
		ret.minDate = tmpDate.substring(0, 6) + String(maxDay);
	} else if (paxType == "CHD") {
		ret.maxDate = addDate("yyyy", -2, targetDate, "");
		
		tmpDate = addDate("yyyy", -MAX_CHD_AGE, targetDate, "");
		ret.minDate = addDate("d", 1, tmpDate, "");
	} else { 
		ret.maxDate = targetDate;
		
		tmpDate = addDate("yyyy", -2, targetDate, "");
		ret.minDate = addDate("d", 1, tmpDate, "");
	}
	
	return ret;
};




// 오늘 일자 반환 - yyyyMMdd
function getCurrentDate() {
	var current = new Date();
	
	var year = current.getFullYear();
	var month = current.getMonth()+1;
	var day = current.getDate();
	
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	
	return "" + year + month + day;
}

// 현재 시간 반환 - yyyyMMddHHmmSS
function getCurrentTime() {
	var current = new Date();
	
	var year = current.getFullYear();
	var month = current.getMonth()+1;
	var day = current.getDate();
	var hour = current.getHours();
	var min = current.getMinutes();
	var sec = current.getSeconds();
	
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	if (hour < 10) {
		hour = "0" + hour;
	}
	if (min < 10) {
		min = "0" + min;
	}
	if (sec < 10) {
		sec = "0" + sec;
	}
	
	return "" + year + month + day + hour + min + sec;
}

//2012.11.28
//bdlee 
//오늘 일자 반환 - yyyy-MM-dd
function getToday() {
	var current = new Date();
	
	var year = current.getFullYear();
	var month = current.getMonth()+1;
	var day = current.getDate();
	
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	return year + "-" + month +"-"+ day;
}

//특정 일자의 요일을 숫자로 반환
function getDayNum(dateStr) {
	var day;
	
	if (dateStr != undefined) {
		var yyyymmdd = dateStr.replace(/-/g, "");

	    var yyyy     = yyyymmdd.substr(0,4);
	    var mm       = yyyymmdd.substr(4,2);
	    var dd       = yyyymmdd.substr(6,2);
	    var dateObj  = new Date(yyyy, mm - 1, dd);
	    
	    day = dateObj.getDay();
	} else {
		day = "";
	}
    
    return day;
}

//특정 일자의 요일 조회*(언어별)
function getDayByLang(dateStr, lang) {
	var day = "";
	var week;
	if(lang == "ko" || lang == "KO"){
		week     = new Array("\uC77C","\uC6D4","\uD654","\uC218","\uBAA9","\uAE08","\uD1A0");
	} else if(lang == "en" || lang == "EN"){
		week     = new Array("SU", "MO", "TU", "WE", "TH", "FR", "SA");
	} else if(lang == "ja" || lang == "JA"){
		//week     = new Array("日", "月", "火", "水", "木", "金", "土");
		week     = new Array("\u65E5","\u6708","\u706B","\u6C34","\u6728","\uF90A","\u571F");
	} else if(lang == "ch" || lang == "CH"){
		//week     = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
		week     = new Array("\u5468\u65E5","\u5468\u4E00","\u5468\u4E8C","\u5468\u4E09","\u5468\u56DB","\u5468\u4E94","\u5468\u516D");
	} else if(lang == "ru" || lang == "RU"){
		//week     = new Array("Воскр",  "Пон", "Вт", "Ср", "Чет", "Пят",  "Субб");
		week     = new Array("\u0412\u043E\u0441\u043A\u0440","\u041F\u043E\u043D","\u0412\u0442","\u0421\u0440","\u0427\u0435\u0442","\u041F\u044F\u0442","\u0421\u0443\u0431\u0431");
	} else if(lang == "de" || lang == "DE"){
		week     = new Array("SO","MO","DI","MI","DO","FR","SA");
	} else if(lang == "fr" || lang == "FR"){
		week     = new Array("DI","LU","MA","ME","JE","VE","SA");
	} else if(lang == "zh" || lang == "ZH"){
		week     = new Array("\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\uf9d1");
	} else if(lang == "es" || lang == "ES"){
		//week = new Array(dom, lun, mar, mié, jue, vie, sáb);
		week     = new Array("dom","lun","mar","\u006d\u0069\u00e9","jue","vie","\u0073\u00e1\u0062");
	}else if(lang == "vi" || lang == "VI"){ //베트남어 추가
		week = new Array("Chủ Nhật", "thứ hai", "Thứ Ba", "Thứ Tư", "thứ năm", "Thứ Sáu", "thứ bảy");
	}
	
	if (dateStr != undefined) {
		var yyyymmdd = dateStr.replace(/-/g, "");

	    var yyyy     = yyyymmdd.substr(0,4);
	    var mm       = yyyymmdd.substr(4,2);
	    var dd       = yyyymmdd.substr(6,2);
	    var dateObj  = new Date(yyyy, mm - 1, dd);
	    
	    day = week[dateObj.getDay()];
	}
    
    return day;
}

// 나이 계산
function getAge(baseDate, birthDate) {
	var result = parseInt(baseDate.substring(0,4)) - parseInt(birthDate.substring(0,4)) - 1;
	if (parseInt(baseDate.substring(4,8)) >= parseInt(birthDate.substring(4,8))) {
		result++;
	}
	
	return result;
}

// 차이 시간 계산
function getDifferentTime(firstDate, secondDate, changeType) {
	
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
		differentTimeParse = Math.floor(differentTime / (60 * 1000) * 1);
	} else if (changeType == "SEC") {
		differentTimeParse = Math.floor(differentTime / 1000 * 1);
	}
	
	return differentTimeParse;
}

/* ----------------------------------------------------------------------------
 * 특정 날짜에 대해 지정한 값만큼 가감(+-)한 날짜를 반환
 * 
 * 입력 파라미터 -----
 * pInterval : "yyyy" 는 연도 가감, "m" 은 월 가감, "d" 는 일 가감
 * pAddVal  : 가감 하고자 하는 값 (정수형)
 * pYyyymmdd : 가감의 기준이 되는 날짜
 * pDelimiter : pYyyymmdd 값에 사용된 구분자를 설정 (없으면 "" 입력)
 * 
 * 반환값 ----
 * yyyymmdd 또는 함수 입력시 지정된 구분자를 가지는 yyyy?mm?dd 값
 *
 * 사용예 ---
 * 2008-01-01 에 3 일 더하기 ==> addDate("d", 3, "2008-08-01", "-");
 * 20080301 에 8 개월 더하기 ==> addDate("m", 8, "20080301", "");
 --------------------------------------------------------------------------- */
function addDate(pInterval, pAddVal, pYyyymmdd, pDelimiter) {
	var yyyy;
	var mm;
	var dd;
	var cDate;
	var cYear, cMonth, cDay;

	if (pDelimiter != "") {
		pYyyymmdd = pYyyymmdd.replace(eval("/\\" + pDelimiter + "/g"), "");
	}

	yyyy = pYyyymmdd.substr(0, 4);
	mm  = pYyyymmdd.substr(4, 2);
	dd  = pYyyymmdd.substr(6, 2);

	if (pInterval == "yyyy") {
		yyyy = (yyyy * 1) + (pAddVal * 1); 
	} else if (pInterval == "m") {
		mm  = (mm * 1) + (pAddVal * 1);
	} else if (pInterval == "d") {
		dd  = (dd * 1) + (pAddVal * 1);
	}

	cDate = new Date(yyyy, mm - 1, dd); // 12월, 31일을 초과하는 입력값에 대해 자동으로 계산된 날짜가 만들어짐.
	cYear = cDate.getFullYear();
	cMonth = cDate.getMonth() + 1;
	cDay = cDate.getDate();

	cMonth = cMonth < 10 ? "0" + cMonth : cMonth;
	cDay = cDay < 10 ? "0" + cDay : cDay;

	if (pDelimiter != "") {
		return cYear + pDelimiter + cMonth + pDelimiter + cDay;
	} else {
		return String(cYear) + String(cMonth) + String(cDay);
	}
}
