var mfui = mfui || {};
mfui._languageCode = $('html').attr('lang');
mfui._uiLangs = mfui._uiLangs || {};    

switch(mfui._languageCode) {
case 'KO' :
    mfui._uiLangs.UH0001 = '현재 단계';
    mfui._uiLangs.UH0002 = '지역/언어 선택 열기';
    mfui._uiLangs.UH0003 = '지역/언어 선택 닫기';
    break;
case 'EN' :
    mfui._uiLangs.UH0001 = 'current stage';
    mfui._uiLangs.UH0002 = 'Open region/language options';
    mfui._uiLangs.UH0003 = 'Close region/language options';
    break;
case 'JA' :
    mfui._uiLangs.UH0001 = '現段階';
    mfui._uiLangs.UH0002 = '地域/言語選択を開く';
    mfui._uiLangs.UH0003 = '地域/言語選択を閉じる';
    break;
case 'CH' :
    mfui._uiLangs.UH0001 = '当前阶段';
    mfui._uiLangs.UH0002 = '地区/语言选择开启';
    mfui._uiLangs.UH0003 = '地区/语言选择关闭';
    break;
case 'DE' :
    mfui._uiLangs.UH0001 = 'derzeitiger Stand';
    mfui._uiLangs.UH0002 = 'Regions-/Sprachoptionen öffnen';
    mfui._uiLangs.UH0003 = 'Auswahl soziale Medien schließen';
    break;
case 'FR' :
    mfui._uiLangs.UH0001 = 'étape actuelle';
    mfui._uiLangs.UH0002 = 'Ouvrir les options de région/langue';
    mfui._uiLangs.UH0003 = 'Fermer les options de région/langue';
    break;
case 'RU' :
    mfui._uiLangs.UH0001 = 'текущий этап';
    mfui._uiLangs.UH0002 = 'Открыть параметры региона/языка';
    mfui._uiLangs.UH0003 = 'Закрыть параметры региона/языка';
    break;
case 'ZH' :
    mfui._uiLangs.UH0001 = '目前階段';
    mfui._uiLangs.UH0002 = '地區/語言選擇開啟';
    mfui._uiLangs.UH0003 = '地區/語言選擇關閉';
    break;
case 'ES' :
    mfui._uiLangs.UH0001 = 'etapa actual';
    mfui._uiLangs.UH0002 = 'Abrir opciones de región/idioma';
    mfui._uiLangs.UH0003 = 'Cerrar opciones de región/idioma';
    break;
case 'VI' :
    mfui._uiLangs.UH0001 = 'Giai đoạn hiện tại';
    mfui._uiLangs.UH0002 = 'Mở tùy chọn vùng/ngôn ngữ';
    mfui._uiLangs.UH0003 = 'Đóng tùy chọn vùng/ngôn ngữ';
    break;
}

$(function(){  
    
    /**
     * Header 
     * 
     * //1dep 메뉴 호버시 
     *      1.풀메뉴다운
     *      2.해당메뉴 2dep,3dep show          
     *      3.현재메뉴 라인 move
     * 
     * //nav 영역 아웃시
     *      1.풀메뉴 hide
     * 
     * //Layer 
     *      toggle, 오픈시 다른레이어 닫기
     *      1.언어선택
     *      2.마이아시아나
     *      3.검색test
     **/
    
    //***********************
    //		header - nav
    //***********************
    $('header').each(function(){

        var header = $('header'),
            nav = $('nav'),
            navA = $('nav > ul > li > a'),
            navLastMn = $('.nav_d3 > li').last().find('a'),
            navCont = $('.nav_cont'),
            navLine = $('.nav_line');
            //hdHeight = 400;        

		//GNB CLASS 관련 처리 - sj.jun 2017.02.06
		navCont.each(function (idx, el) {
			var $el = $(el)
				, depth2LiCnt = $el.find('> ul > li').length
				, $gnbBanner = $el.find('div.gnb_banner')
				, isAppendClassWide = !$gnbBanner.length;

			$el.addClass('col' + depth2LiCnt);
			if (isAppendClassWide) {
				$el.addClass('wide');
			} else {
				if (!$gnbBanner.find('div.txt_wrap').length) {
					$gnbBanner.addClass('type2');
				}
			}
		});
		// GNB 배너 위치 변경

        //nav 영역 아웃시
        nav.on('mouseleave blur', function(){
            //console.log('nav out');
            fullMenuHide();
        });


        //키보드로 마지막 메뉴 진입시
        navLastMn.on('focus', function(){
            //console.log('last menu focus');
            fullMenuShow();
            hideMyasianaLayer();
        });

        //키보드로 첫번째 메뉴 백탭
        header.find('.logo > a').on('focus', function(){
            fullMenuHide();
        });


        //메뉴 호버시
        navA.on('mouseenter focus', function(){  
            var targetA = $(this);
            var tragetALi = targetA.parent('li');

            fullMenuShow();           
            navCont.hide();
            targetA.next(navCont).show();

            //navCont show 이후 height 받아오기
            var targetNavCont = targetA.next('.nav_cont');
            var targetNavContH = targetNavCont.find('.nav_d2').height()+70;

            //1depth
            navA.removeClass('current');
            targetA.addClass('current'); 

            //nav_line animation 
            var navIdx = tragetALi.index()+1;
            var navWid = tragetALi.width()-15;

            var nav2 = tragetALi.prev('li').width();
            var nav3 = nav2 + tragetALi.prev('li').prev('li').width();
            var nav4 = $('nav').width() - navWid;


            //메뉴 width 가변 분기
            if(navIdx == 1){
                $('nav').find(navLine).velocity('stop').velocity({
                    'left':0,
                    'width':navWid+15+'px'
                },lineSpd,'easeOut');
            } else if(navIdx == 2){
                $('nav').find(navLine).velocity('stop').velocity({
                    'left':+nav2+15+'px',
                    'width':navWid+'px'
                },lineSpd,'easeOut');
            } else if(navIdx == 3){
                $('nav').find(navLine).velocity('stop').velocity({
                    'left':+nav3+15+'px',
                    'width':navWid+'px'
                },lineSpd,'easeOut');
            } else if(navIdx == 4){
                $('nav').find(navLine).velocity('stop').velocity({
                    'left':+nav4+'px',
                    'width':navWid+'px'
                },lineSpd,'easeOut');
            }

            //header_bg resizing
            $('.header_bg').velocity('stop').velocity({height:targetNavContH},hdSpdOpen,easing1).show();
            navCont.each(function(){
                navCont.velocity('stop').velocity({height:targetNavContH},hdSpdOpen,easing1),100;
            });

        });

        //fullMenuShow
        function fullMenuShow(){
            //console.log('show');
            header.addClass('open');
            navLine.show();      
        }

        //fullMenuHide
        function fullMenuHide(){
            //console.log('hide');
            header.removeClass('open');
            navLine.hide();
            navA.removeClass('current');
            $('.header_bg').css('height',0).hide();
            navCont.css('height',0).hide();
        }


        //***********************
        //		myasiana layer 
        //***********************
        $('#btnMyasiana').off('click').on('click', function(){

			/* Header MyAsiana 알림함 조회 */
        	cms.getMyAsiana();

            if(!openMyasiana){
                openMyasiana = true;
                $(this).addClass('on');
                $('#layerMyasiana').velocity('slideDown',lySpdOpen1,easing1);
            } else {
                hideMyasianaLayer();
            }
            hideSearchLayer2();    
        });
        $('.myasiana_close').on('click', function(){
            hideMyasianaLayer();
            $('#btnMyasiana').focus();
        });

        //로그인 로그아웃 상관없이 포커스갈경우 gnb 접기
        $('.btn_myasiana').on('focus',function(){
            fullMenuHide();
        });

        //hide MyasianaLayer animate 
        function hideMyasianaLayer(){
            openMyasiana = false;
            $('#btnMyasiana').removeClass('on');
            $('#layerMyasiana').velocity('slideUp',lySpdHide,easing1);
        }


        //***********************
        //		search layer  
        //***********************
        $(".search_area").find('.btn_search').off('click').on('click', function(){	// mr.kim    2018/03/12 수정

            var searchIpt = $('#layerSearch').find('input:text');
            var searchBtn = $('#layerSearch').find('button');
            var isInput = false;

            if(!openSearch){
                openSearch = true;
                $(this).addClass('on');
                $('#layerSearch').velocity('slideDown',lySpdOpen2,easing1, function(){
                    searchIpt.focus();
                    //검색어 입력시 레드버튼 change
                    searchIpt.on('input', function(){
                        var searchVal = searchIpt.val();
                        if(searchVal !== ''){
                            //입력시
                            if(!isInput){
                                isInput = true;
                                searchBtn.removeClass('gray').addClass('red');
                            }
                        } else if(searchVal == '') {
                            //텍스트 없을시
                            if(isInput){
                                isInput = false;
                                searchBtn.removeClass('red').addClass('gray');
                            }
                        }
                    });
                });
                $('.search_close').off('click').on('click', function(){
                    hideSearchLayer();
                    $('.btn_search').focus();
                });
            } else {
                hideSearchLayer();
            }
            hideMyasianaLayer2();    
        });

        //hide SearchLayer animate 
        function hideSearchLayer(){
            openSearch = false;
            $('.btn_search').removeClass('on');
            $('#layerSearch').velocity('slideUp',lySpdHide,easing1);
        }        

        //headerHeightResize
        headerHeightResize();
    });
    

    //최대 메뉴 높이값에 따라 헤더높이 결정
    function headerHeightResize(){
        var dep2heights = $('.nav_d2').map(function (){
            return $(this).height();
        }).get(),
        maxHeight = Math.max.apply(null, dep2heights);
        //TODO 높이확인필요 ...
        hdHeight = maxHeight+60; 
        //console.log(dep2heights,maxHeight);
    }     
    
    //***********************
    //		speed & easing
    //***********************
    var hdSpdOpen = 400, //풀메뉴 다운
        lySpdOpen1 = 700, //마이아시아나 다운
        lySpdOpen2 = 400, //검색레이어 다운
        lySpdHide = 300, //레이어 업
        lineSpd = 400, //1depth 라인
        easing1 = [0.15, 0.21, 0.3, 1]; //easing
            

    //***********************
    //		language select
    //***********************
    $('.btn_language').attr('title',mfui._uiLangs.UH0002);
    $('.btn_language').on('click', function(){
        $('#layerLanguage').toggle();

        //오픈시 redline
        if ($('#layerLanguage').css("display") !== "none"){
            $(this).addClass('on').attr('title',mfui._uiLangs.UH0003);
        } else {
            $(this).removeClass('on').attr('title',mfui._uiLangs.UH0002);
        }

        //마이아시아나, 검색레이어 열려있을 경우 닫기
        hideMyasianaLayer2();
        hideSearchLayer2();
    });

    $(document).ready(function(){
        $('#layerLanguage').find('.lang_close, .layer_close').on('click', function(){
            $('#layerLanguage').hide();
            $('.btn_language').removeClass('on').focus().attr('title',mfui._uiLangs.UH0002);
        });
    });



    //***********************
    //		열려진 레이어들 닫기 위한 스위칭 
    //***********************    
    var openMyasiana = false;    
    var openSearch = false;

    //MyasianaLayer 슬라이드 없이 hide
    function hideMyasianaLayer2(){
        openMyasiana = false;
        $('#btnMyasiana').removeClass('on');
        $('#layerMyasiana').hide();
    }

    //SearchLayer 슬라이드 없이 hide
    function hideSearchLayer2(){
        openSearch = false;
        $('.btn_search').removeClass('on');
        $('#layerSearch').hide();
    }



    //***********************
    //		header_booking 
    //***********************
    var hdToggleSpd = 500; //헤더 토글 오픈
    var hdToggle = false;

    $('.all_menu').on('click', function(){
        $('.util_wrap').velocity('slideDown',hdToggleSpd);
        $('#over_header').velocity('slideDown',hdToggleSpd,function(){
            $('#booking_header').hide();
            $('.btn_header_toggle').focus();

            //최초 한번만 실행
            if(!hdToggle){
                hdToggle = true;
                headerHeightResize(); //오버헤더 show 이후 maxheight 재계산
            }
        });
    });

    $('.btn_header_toggle').on('click', function(){
        $('.util_wrap').velocity('slideUp');
        $('#booking_header').show();    
        $('#over_header').velocity('slideUp',hdToggleSpd,function(){
            $('.all_menu').focus();
        }); 
    });
    

    //***********************
    //		sub_location_bar  
    //***********************
    $('.location_bar').each(function(){
        var locaUl = $('.loca_menulist > li > ul');
        var locaA = $('.loca_menulist > li > a');

        $('.loca_menulist > li > a').on('click', function(){
            locaUl.stop().slideUp();
            $(this).next('ul').stop().slideToggle();

            if($(this).hasClass('open')){
                $(this).removeClass('open');
            } else {
                locaA.removeClass('open');
                $(this).addClass('open');
            }
        });

        $('.btn_toggle_event').on('click focus', function(){
            if($(this).parent('.toggle_event_wrap').hasClass('on')){
                locaUl.stop().slideUp().prev('.current').removeClass('open');
            }
        });

        $('.loca_menulist > li > ul > li').last().find('a').on('blur', function(){
            locaA.removeClass('open');
            locaUl.stop().slideUp();
        });

        $('.loca_menulist > li > ul').on('mouseleave', function(){
            locaA.removeClass('open');
            locaUl.stop().slideUp();
        });
    });


    //***********************
    //		footer_famlysite
    //***********************
    $('.famliy_site').on('click', function(){
    	if($(this).hasClass('animating')){
    		return;
    	}
    	$(this).addClass('animating');
    	var $_list = $(this).next('.site_list');
    	var $_that = $(this);
    	
        if($(this).hasClass('on')){
        	$(this).removeClass('on');
        	$_list.velocity('finish').velocity('slideUp', { complete: function() { $_that.removeClass('animating'); } });
        } else {
        	$(this).addClass('on');
        	$_list.velocity('finish').velocity('slideDown', { complete: function() { $_that.removeClass('animating'); } });
        }
    });
    
    $('.group_site').on('mouseleave blur', function(){
    	$(this).find('.famliy_site').removeClass('on');
    	$('.site_list').velocity('finish').velocity('slideUp', { complete: function() { $('.famliy_site').removeClass('animating'); } });
    }); 
    
    var groupIcoA = $('.group_icon').find('a');
    groupIcoA.first().on('focus', function(){
        famHide();
    });
    groupIcoA.on('mouseenter focus', function(){
        groupIcoA.removeClass('active');
        $(this).addClass('active');
    });
    groupIcoA.on('mouseleave blur', function(){
        $(this).removeClass('active');
    });

    function famHide(){
        isFamOpen = false;
        $('.site_list').velocity('stop').velocity('slideUp');
    }

	/**
		쿠키 관련 유틸
		IBE 영역에서 공통 사용 GNB 영역으로 이관 처리
	*/
	$.cookie = {
		map: {},
		init: function () {
			var map = this.map,
				tempArr = document.cookie.split('; ');

			$(tempArr).each(function () {
				var entyty = this.split('=');

				map[entyty[0]] = entyty[1];
			});
		},
		get: function (key) {
			if ($.isEmptyObject(this.map)) {
				this.init();
			}
			return this.map[key];
		},
		getCookie: function (cName) {
			cName = cName + '=';
			var cookieData = document.cookie;
			var start = cookieData.indexOf(cName);
			var cValue = '';
			if(start != -1) {
				start += cName.length;
				var end = cookieData.indexOf(';', start);
				if(end == -1) {
					end = cookieData.length;
				}
				cValue = cookieData.substring(start, end);
			}
			return unescape(cValue);
		}
		, setCookie: function (cName, cValue, cDay) {
			var expire = new Date();
			expire.setDate(expire.getDate() + cDay);
			cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
			if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
			document.cookie = cookies;
		}
		, removeCookie: function (cName) {
			asiana.setCookie(cName, '', -1);
		}
	};
});


//항공권예약 stepper 현재 단계 표기
if($('.step_indi_wrap').length){
    var _stepIndi = $('.step_indi_wrap');
    _stepIndi.find('.step.on').prepend('<span class="hidden">'+mfui._uiLangs.UH0001+'</span>');
}

//컨테이너 스킵내비 tabindex 추가 (키보드 접근성)
// $('#container').attr('tabindex','0');


/**
 * 대상 레이어 : '.shadow_layer:visible, .calendar_layer:visible , .hdlayer_wrap:visible , .layer_pop:visible'
 * 레이어 영역이외 부분 클릭시 공통닫기 처리 (팝업들은 제외)
 */

var fui = fui || {};

(function(global, $, fui) {
    var collisionCalculator = {

        // 포커스인 레이어  체크 (포커스로 구동되는 레이어체크)
        SpotentryFlag: false,
        init: function() {
            this.build_event();
        },
        build_event: function() {
            // 이벤트가 바인되어 있는지 체크가 필요함 - $.data를 이용
            $(document).on('focusin', '#wrap', function(e) {
            	e.preventDefault();
                if ($(e.target).hasClass('spotentry') || $(e.target).parent().hasClass('ipt_elt')) {
                    this.SpotentryFlag = true; // 포커스인 레이어 열렸다.
                } else {
                    this.SpotentryFlag = false;
                }
            });
            $(document).on('click', '#wrap', function(e) {
                var visibleLayers = $('.shadow_layer:visible, .calendar_layer:visible , .hdlayer_wrap:visible');
                if (visibleLayers.length > 0 && 
                !this.SpotentryFlag && !$(e.target).hasClass('airport_open') && 
                !$(e.target).hasClass('fav_star') && 
                !$(e.target).hasClass('calendar_focus')&& 
                !$(e.target).parents().hasClass('layer_wrap')&& 
                !$(e.target).parents().hasClass('calendar_layer') && 
                !$(e.target).parents().hasClass('shadow_layer') && 
                !$(e.target).is(':button') && 
                !$(e.target).hasClass('datepicker')) {
                    if (!collisionCalculator.isCollision(visibleLayers, e)) {
//                        layerAllClose();
                    	visibleLayers.find(' .layer_close, .btn_cal_close ').eq(0).trigger('click');
                    }

                }
                this.SpotentryFlag = false;
            });
        },

        getLayerRectange: function(scope) {
            return {
                'ax': $(scope).offset().left || 0,
                'ay': $(scope).offset().top || 0,
                'rx': $(scope).position().left || 0,
                'ry': $(scope).position().top || 0,
                'w': $(scope).innerWidth() || 0,
                'h': $(scope).innerHeight() || 0
            };
        },
        isCollision: function(scope, e) {
            var bool = false;
            var pos = {
                'left': e.pageX,
                'top': e.pageY
            };

            var arect = this.getLayerRectange(scope);
            var abool = (
                (pos.left >= arect.ax && pos.left <= arect.ax + arect.w) &&
                (pos.top >= arect.ay && pos.top <= arect.ay + arect.h)
            ) ? true : false;
            return abool;
        }

    };
    collisionCalculator.init();
    fui.collisionCalculator = collisionCalculator
})(window, window.jQuery, window.fui);


$(document).ready(function() {
	  
	$(document).find('a[href="#none"]').each(function(a){
    
    $(this).attr('href', 'javascript:sharpNothig();');
  
  
  });
});


function sharpNothig(){
//empty function	
}