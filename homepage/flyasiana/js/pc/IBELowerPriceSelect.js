var RequestUrl      = $(location).attr('pathname');
var RequestUrlArr   = RequestUrl.split('/');
var countryCode		= RequestUrlArr[2].toUpperCase();
var languageCode    = RequestUrlArr[3].toUpperCase();

//layer popup close 함수
var layerAllClose = function(){
	$('.shadow_layer').hide();
	$('.calendar_layer').hide();
};

//출/도착지 최근검색 & 자동 완성 노출 구분
var layerVar = function layerVar($this, $shadowLayer) {
	if($this.val() === "") {
		$shadowLayer.find('div[name=search_lately]').show();
		$shadowLayer.find('div[name=search_auto]').hide();
		$shadowLayer.find('div[name=search_auto]').find('ul').children().remove();
	}else{
		$shadowLayer.find('div[name=search_lately]').hide();
		$shadowLayer.find('div[name=search_auto]').show();
	}
};

// 여정 초기화
var initItinerary = function initItinerary(tripType) {
	var $itinerary = $('div[name=itinerary]');
	$itinerary.find('input[type=hidden]').val('');
	$('#labelDepartureAirport1_lower').html(jsJSON.J0005);
	$('#labelArrivalAirport1_lower').html(jsJSON.J0006);
	$('div[name=spot_place]').show();
};

//오늘 일자 반환 - yyyyMMdd
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
};

/*
* 최근 검색 list 그리기
* 00. target : focusin 된 input target
* */
var setMgtAreaCustom = false;
var drawSearchLatelyCustom = function drawSearchLatelyCustom(target){
	var $this = target;	
	var tripType = $('#searchTripType').val();
	var depArrType = $this.attr('depArrType');
	var $searchLately = $this.parent().next().find('div[name=search_lately]'),
	$children = $searchLately.children(),
	html = [];
	
	if($children.length > 1) {
		$children.eq(1).replaceWith('');
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
		
		if(!setMgtAreaCustom) {
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
						
						setMgtAreaCustom = true;
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
								searchLatelyData.arrivalAirport+','+searchLatelyData.arrivalCity+','+searchLatelyData.arrivalCityName+
								'-'+searchLatelyData.departureDateTime+','+searchLatelyData.arrivalDateTime+','+searchLatelyData.adultCnt+','+searchLatelyData.childCnt+','+searchLatelyData.infantCnt+'" data-itinerary="'+searchLatelyData.itinerary+'">' +
								'<a href="#none">' +
									'<span>'+searchLatelyData.departureAirportName+'<var>'+searchLatelyData.departureAirport+'</var></span>' +
									'<span>'+searchLatelyData.arrivalAirportName+'<var>'+searchLatelyData.arrivalAirport+'</var></span>' +
								'</a>' +
								'<button type="button" class="btn_detlete" name="btn_delete" onclick="javascript:deleteSearchLatelyDataCustom(this, \''+lsKey+'\', \''+searchLatelyData.itinerary+'\', \''+depArrType+'\');"><span class="hidden">'+jsJSON.J0101+'</span></button>' +//삭제
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

	$searchLately.append(html.join(''));
};

//최근검색 항목 삭제
var deleteSearchLatelyDataCustom = function deleteSearchLatelyDataCustom(object, lsKey, itinerary, depArrType) {
	
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
								'<button type="button" class="btn_detlete" name="btn_delete" onclick="javascript:deleteSearchLatelyDataCustom(this, \''+lsKey+'\', \''+appendSearchLatelyData.itinerary+'\', \''+depArrType+'\');"><span class="hidden">'+jsJSON.J0101+'</span></button>' +//삭제
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

/*출/도착지 switching*/
var switchingAirport = function switchingAirport() {
	switching = true;
	
	var depAirport	= $('#departureAirport1').val(),
		arrAirport	= $('#arrivalAirport1').val();
	
	if(depAirport == '' && arrAirport == '') {
		alert(jsJSON.J0015);
		switching = false;
		return false;
	}
	
	$('#departureAirport1').val(arrAirport);
	$('#arrivalAirport1').val(depAirport);
	beforeSwitchingObject = {};
	beforeSwitchingObject.depAirport	= depAirport;
	beforeSwitchingObject.depAirportName= $('#departureAirportName1').val();
	beforeSwitchingObject.depArea		= $('#departureArea1').val();
	beforeSwitchingObject.depCity		= $('#departureCity1').val();
	beforeSwitchingObject.depCityName	= $('#departureCityName1').val();
	beforeSwitchingObject.depLabel		= $('#labelDepartureAirport1_lower').html();
	beforeSwitchingObject.depTxt		= $('#txtDepartureAirport1').attr('placeholder');
	beforeSwitchingObject.arrAirport	= arrAirport;
	beforeSwitchingObject.arrAirportName= $('#arrivalAirportName1').val();
	beforeSwitchingObject.arrArea		= $('#arrivalArea1').val();
	beforeSwitchingObject.arrCity		= $('#arrivalCity1').val();
	beforeSwitchingObject.arrCityName	= $('#arrivalCityName1').val();
	beforeSwitchingObject.arrLabel		= $('#labelArrivalAirport1_lower').html();
	beforeSwitchingObject.arrTxt		= $('#txtArrivalAirport1').attr('placeholder');
	
	$('#departureAirport1').trigger('textchange');
};

/*switching validation*/
var switchingValidation = function switchingValidation() {
	
	var arrAirport	= beforeSwitchingObject.depAirport,
		switchingArrivalInfo = JSON.parse($(document).data('switchingAirportData')),
		containsCnt = 0,
		i = 0,
		idx = 0,
		saLength = switchingArrivalInfo.length;
	
	while(i<saLength) {
		var routeCityAirportData = switchingArrivalInfo[i],
			j = 0,
			cLength = routeCityAirportData.cityAirportDatas.length;
			
		while(j<cLength) {
			var cityAirportData = routeCityAirportData.cityAirportDatas[j],
				airport = cityAirportData.airport;
			
			if(arrAirport == airport){
				containsCnt++;
				break;
			}
			
			j++;
			idx++;
		};
		i++;
	};
	
	if(containsCnt != 0) {
		$('#departureAirportName1').val(beforeSwitchingObject.arrAirportName);
		$('#departureArea1').val(beforeSwitchingObject.arrArea);			
		$('#departureCity1').val(beforeSwitchingObject.arrCity);			
		$('#departureCityName1').val(beforeSwitchingObject.arrCityName);			
		$('#labelDepartureAirport1_lower').html(beforeSwitchingObject.arrLabel);
		$('#txtDepartureAirport1').attr('placeholder', beforeSwitchingObject.arrTxt);
		$('#arrivalAirportName1').val(beforeSwitchingObject.depAirportName);
		$('#arrivalAirport1').val(beforeSwitchingObject.depAirport);
		$('#arrivalArea1').val(beforeSwitchingObject.depArea);			
		$('#arrivalCity1').val(beforeSwitchingObject.depCity);			
		$('#arrivalCityName1').val(beforeSwitchingObject.depCityName);			
		$('#labelArrivalAirport1_lower').html(beforeSwitchingObject.depLabel);			
		$('#txtArrivalAirport1').attr('placeholder', beforeSwitchingObject.depTxt);
	}else{
		alert(jsJSON.J0016);
		
		$('#departureAirportName1').val(beforeSwitchingObject.depAirportName);
		$('#departureAirport1').val(beforeSwitchingObject.depAirport);
		$('#departureArea1').val(beforeSwitchingObject.depArea);
		$('#departureCity1').val(beforeSwitchingObject.depCity);
		$('#departureCityName1').val(beforeSwitchingObject.depCityName);
		$('#labelDepartureAirport1_lower').html(beforeSwitchingObject.depLabel);
		$('#labelDepartureAirport1_lower').css('opacity', '1');
		$('#txtDepartureAirport1').attr('placeholder', beforeSwitchingObject.depTxt);
		
		$('#arrivalAirportName1').val(beforeSwitchingObject.arrAirportName);
		$('#arrivalAirport1').val(beforeSwitchingObject.arrAirport);
		$('#arrivalArea1').val(beforeSwitchingObject.arrArea);
		$('#arrivalCity1').val(beforeSwitchingObject.arrCity);
		$('#arrivalCityName1').val(beforeSwitchingObject.arrCityName);
		$('#labelArrivalAirport1_lower').html(beforeSwitchingObject.arrLabel);
		$('#labelArrivalAirport1_lower').css('opacity', '1');
		$('#txtArrivalAirport1').attr('placeholder', beforeSwitchingObject.arrTxt);
		
	}
	
	switching = false;
};

//최근 검색 중복 데이터 제거
var removeDupSearchLately = function removeDupSearchLately(searchLatelyDatas) {
	var i = 0,
		sLength = searchLatelyDatas.length,
		removeDupSearchLatelyDatas = [],
		searchLatelyData,
		spliceIndex;
	
	while(i<sLength) {
		searchLatelyData = searchLatelyDatas[i];
		if(i == 0){
			removeDupSearchLatelyDatas.push(searchLatelyData);
		}else{
			var j = 0,
				rLength = removeDupSearchLatelyDatas.length,
				cnt = 0,
				removeDupSearchLatelyData;
			while(j<rLength) {
				removeDupSearchLatelyData = removeDupSearchLatelyDatas[j];
				if(searchLatelyData.itinerary == removeDupSearchLatelyData.itinerary) {
					removeDupSearchLatelyDatas[j] = searchLatelyData;
					spliceIndex = j;
					break;
				}else{
					cnt++;
				}
				j++;
			}
			if(cnt == rLength) {
				removeDupSearchLatelyDatas.push(searchLatelyData);
			}
		}
		i++;
	}
	
	var tempData;
	if(typeof spliceIndex != 'undefined') {
		tempData = removeDupSearchLatelyDatas[j];
		removeDupSearchLatelyDatas.splice(j, 1);
		removeDupSearchLatelyDatas.push(tempData);
	}
	
	return removeDupSearchLatelyDatas;
};

//최근 검색
var searchLatelyObject = function searchLatelyObject() {
	departureArea			= '';
	departureAirportName	= '';
	departureAirport		= '';
	departureCity			= '';
	departureCityName		= '';
	departureDateTime		= '';
	arrivalArea				= '';
	arrivalAirportName		= '';
	arrivalAirport			= '';
	arrivalCity				= '';
	arrivalCityName			= '';
	arrivalDateTime			= '';
	itinerary				= '';
	adultCnt				= 0;
	childCnt				= 0;
	infantCnt				= 0;
};

//최근검색에 추가
var setSearchLately = function setSearchLately() {
	var searchLatelyDatas = [],
		removeDupSearchLatelyDatas = [],
		tempSearchLatelyDatas = [],
		searchLatelyData = new searchLatelyObject();
	
	searchLatelyData.departureArea 			= $('#departureArea1').val()		!= '' ? $('#departureArea1').val() : $('#DEP_AREA_R').val();
	searchLatelyData.departureAirportName	= $('#departureAirportName1').val() != '' ? $('#departureAirportName1').val() : $('#DEP_AIRPORT_DESC_R').val();
	searchLatelyData.departureAirport		= $('#departureAirport1').val()		!= '' ? $('#departureAirport1').val() : $('#DEP_AIRPORT_R').val();
	searchLatelyData.departureCity			= $('#departureCity1').val()		!= '' ? $('#departureCity1').val() : $('#DEP_CITY_R').val();
	searchLatelyData.departureCityName		= $('#departureCityName1').val()	!= '' ? $('#departureCityName1').val() : $('#DEP_CITY_NAME_R').val();
	searchLatelyData.departureDateTime		= moment().format('YYYYMMDD');
	searchLatelyData.arrivalArea			= $('#arrivalArea1').val()			!= '' ? $('#arrivalArea1').val() : $('#ARR_AREA_R').val();
	searchLatelyData.arrivalAirportName		= $('#arrivalAirportName1').val()	!= '' ? $('#arrivalAirportName1').val() : $('#ARR_AIRPORT_DESC_R').val();
	searchLatelyData.arrivalAirport			= $('#arrivalAirport1').val()		!= '' ? $('#arrivalAirport1').val() : $('#ARR_AIRPORT_R').val();
	searchLatelyData.arrivalCity			= $('#arrivalCity1').val()			!= '' ? $('#arrivalCity1').val() : $('#ARR_CITY_R').val();
	searchLatelyData.arrivalCityName		= $('#arrivalCityName1').val()		!= '' ? $('#arrivalCityName1').val() : $('#ARR_CITY_NAME_R').val();
	searchLatelyData.arrivalDateTime		= moment().add(3, 'd').format('YYYYMMDD');
	searchLatelyData.itinerary				= searchLatelyData.departureAirport + '-' + searchLatelyData.arrivalAirport;
	searchLatelyDatas[0] = searchLatelyData;
	searchLatelyData.adultCnt				= 1;
	searchLatelyData.childCnt				= 0;
	searchLatelyData.infantCnt				= 0;

	removeDupSearchLatelyDatas = removeDupSearchLately(searchLatelyDatas);
	
	var searchTripType = $('#searchTripType').val();
	
	var lsKey;
	if('RT' == searchTripType) {
		lsKey = 'searchLatelyDatasRT_'+countryCode+languageCode;
	}else if('OW' == searchTripType) {
		lsKey = 'searchLatelyDatasOW_'+countryCode+languageCode;
	}
	
	if(localStorage.getItem(lsKey) != null) {
		tempSearchLatelyDatas = JSON.parse(localStorage.getItem(lsKey));
		$.merge(tempSearchLatelyDatas, removeDupSearchLatelyDatas);
		
		tempSearchLatelyDatas = removeDupSearchLately(tempSearchLatelyDatas);
	}else{
		tempSearchLatelyDatas = removeDupSearchLatelyDatas;
	}
	
	if(tempSearchLatelyDatas.length > 10) {
		for(var i=0, tl=tempSearchLatelyDatas.length-10; i<tl; i++) {
			tempSearchLatelyDatas.splice(0, 1);
		}
	}
	
	if('RT' == searchTripType) {
		localStorage.setItem('searchLatelyDatasRT_'+countryCode+languageCode, JSON.stringify(tempSearchLatelyDatas));
	}else if('OW' == searchTripType) {
		localStorage.setItem('searchLatelyDatasOW_'+countryCode+languageCode, JSON.stringify(tempSearchLatelyDatas));
	}
	
};


////////////////////document ready ////////////////////
$(function(){
	
	// 출/도착지 focusin & out event
	$(document).on('focus', '.spotentry', function() {
		
		var $this = $(this),
			$shadowLayer = $this.parent().next('div[name=shadow_layer]'),
			$thisId = $this.attr('id');
		
		/*if(!prevAirportValidation($thisId)) {
			return false;
		}*/

		$this.parent().find('label').css('opacity','0');	// 활성화시 label 가리기
		layerAllClose();
		
		$shadowLayer.css('display', 'block');				// 레이어팝업 노출
		$shadowLayer.find('div[name=search_lately]').show();
		$shadowLayer.find('div[name=search_auto]').hide();
	
		$this.keyup(function() {
			layerVar($this, $shadowLayer);
		});
		
		/*최근검색 list set
		 *  ; 다구간/OPENJAW는 최근 검색 노선 scope 제외 (최저가조회는 왕복, 편도만 있음)
		 */
			drawSearchLatelyCustom($this);
		
	});
	
	$(document).on('focusout', '.spotentry', function() {
		var $this = $(this);
		$this.parent().find('label').css('opacity','1');
		
		$this.val('');
	});
	
	// 최근 검색 클릭
	$(document).on('click', 'div[name=search_lately] > ul > li > a', function() {
		
		var $this = $(this),
			$thisVal = $this.parents('li').attr('val');
			$thisVal = $thisVal.split('-');
		
		var $thisValDep = $thisVal[0].split(',');
		var $thisValArr	= $thisVal[1].split(',');
		
		var $depHidden = $this.closest('div[name=itinerary]').find('.spot_proven').children(); 
		var $arrHidden = $this.closest('div[name=itinerary]').find('.spot_destin').children('input');
		
		$depHidden.eq(0).val($thisValDep[0]);
		$depHidden.eq(1).val($thisValDep[2]);
		$depHidden.eq(2).val($thisValDep[3]);
		$depHidden.eq(3).val($thisValDep[4]);
		$depHidden.eq(1).trigger('textchange');
		$arrHidden.eq(0).val($thisValArr[0]);
		$arrHidden.eq(1).val($thisValArr[2]);
		$arrHidden.eq(2).val($thisValArr[3]);
		$arrHidden.eq(3).val($thisValArr[4]);
		$arrHidden.eq(1).trigger('textchange');
		
		$('#departureAirportName1').val($thisValDep[1]);
		$('#arrivalAirportName1').val($thisValArr[1]);
		$("#txtDepartureAirport1").attr("placeholder",$thisValDep[2]+' '+$thisValDep[1]);
		$("#txtArrivalAirport1").attr("placeholder",$thisValArr[2]+' '+$thisValArr[1]);
		
		//$this.closest('div[name=itinerary]').find('.spot_proven > label[name=spot_place]').html('<span class="hidden">'+$thisValDep[2]+' '+$thisValDep[1]+'</span>');
		//$this.closest('div[name=itinerary]').find('.spot_destin > label[name=spot_place]').html('<span class="hidden">'+$thisValArr[2]+' '+$thisValArr[1]+'</span>');
		layerAllClose();
	});
	
	var itineraryReset = function itineraryReset() {
		$('div[name=itinerary] > div[name=shadow_layer]').hide();
	};
	
});
////////////////////document ready end ////////////////////