if(typeof NetFunnel == "object"){
	
	var NFLanguageCode = getNFLanguageCode();
	
	/********** basic Start **********/
	var skinHtml = '<div id="NetFunnel_Skin_Top" class="layer_wrap" style="display:block">'
				 + '	<div class="dim_layer"></div>'
				 + '	<div class="layer_pop" style="width:800px;">'
				 + '		<div class="pop_cont">'
				 + '			<div class="gate_wrap">'
				 + '				<div class="logo">'
				 + '					<img src="/C/pc/image/common/logo_header_star.png" alt="ASIANA AIRLINES">'
				 + '				</div>'
				 + '				<div class="status">';
	if(NFLanguageCode == 'EN'){
	   skinHtml += '					<p class="tit">Waiting to connect</p>'
				 + '					<p class="time">Expected waiting time <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else if(NFLanguageCode == 'CH'){
	   skinHtml += '					<p class="tit">等待访问</p>'
				 + '					<p class="time">预计等待时间 <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else if(NFLanguageCode == 'ZH'){
	   skinHtml += '					<p class="tit">等待存取</p>'
		   		 + '					<p class="time">預計等待時間 <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else if(NFLanguageCode == 'JA'){
	   skinHtml += '					<p class="tit">接続待機中</p>'
				 + '					<p class="time">予想待機時間 <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else if(NFLanguageCode == 'DE'){
	   skinHtml += '					<p class="tit">Auf Verbindung warten</p>'
		   		 + '					<p class="time">Geschätzte Wartezeit <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else if(NFLanguageCode == 'FR'){
	   skinHtml += '					<p class="tit">En attente de connexion</p>'
		   		 + '					<p class="time">Temps d’attente estimé <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else if(NFLanguageCode == 'RU'){
	   skinHtml += '					<p class="tit">Ожидание подключения</p>'
		   		 + '					<p class="time">Приблизительное время ожидания <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else if(NFLanguageCode == 'ES'){
	   skinHtml += '					<p class="tit">Esperando para conectarse</p>'
				 + '					<p class="time">Tiempo de espera estimado <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else if(NFLanguageCode == 'VI'){
		skinHtml += '					<p class="tit">Chờ kết nối</p>'
			+ '					<p class="time">Thời gian chờ đợi dự kiến<span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else{
	   skinHtml += '					<p class="tit">접속 대기중</p>'
				 + '					<p class="time">예상 대기 시간 <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}
	   skinHtml += '				</div>'
				 + '				<div class="loading_bar">'
				 + '					<span id="netfunnel_loading_bar" class="load"></span>'
				 + '				</div>'
				 + '				<div class="txt_desc_wrap">'
				 + '					<p class="txt_desc">';
	if(NFLanguageCode == 'EN'){
	   skinHtml += '						There are <span class="num netfunnel_wait_front"></span> people in front of you and <span class="num netfunnel_wait_back"></span> people waiting after you. <br>'
				 + '						Please wait, we are processing your access to our site. If you leave this page, longer wait times occur.';
	}else if(NFLanguageCode == 'CH'){
	   skinHtml += '						顾客前面有 <span class="num netfunnel_wait_front"></span>人，后面有 <span class="num netfunnel_wait_back"></span>人等待。 <br>'
		   		 + '						正在加载页面请稍后，同时请勿刷新页面，否则加载时间会更长。';
	}else if(NFLanguageCode == 'ZH'){
	   skinHtml += '						客戶前面有 <span class="num netfunnel_wait_front"></span>人，後面有 <span class="num netfunnel_wait_back"></span>人等待。 <br>'
		   		 + '						請稍候.將會盡快為您自動登入，一旦離開.將需等待更久時間。';
	}else if(NFLanguageCode == 'JA'){
	   skinHtml += '						お客様の前に <span class="num netfunnel_wait_front"></span>人、後ろに <span class="num netfunnel_wait_back"></span>人の待機ユーザーがいます。 <br>'
		   		 + '						接続されるまで画面を閉じずに、しばらくお待ち下さい。';
	}else if(NFLanguageCode == 'DE'){
	   skinHtml += '						Vor Ihnen sind noch <span class="num netfunnel_wait_front"></span> Personen, nach Ihnen warten noch <span class="num netfunnel_wait_back"></span> Personen. <br>'
		   		 + '						Bitte haben Sie einen Augenblick Geduld, Sie werden gleich automatisch mit unserer Website verbunden. Bei einem erneuten Versuch kann es zu einer etwas verlängerten Wartezeit kommen.';
	}else if(NFLanguageCode == 'FR'){
	   skinHtml += '						Il y a <span class="num netfunnel_wait_front"></span> personnes avant vous et <span class="num netfunnel_wait_back"></span> personnes après vous. <br>'
		   		 + "						Si vous patientez un instant, vous serez connecté automatiquement, si vous vous reconnectez, le temps d'attente pourrait être plus long.";
	}else if(NFLanguageCode == 'RU'){
	   skinHtml += '						Всего <span class="num netfunnel_wait_front"></span> человек перед вами и <span class="num netfunnel_wait_back"></span> человек за вами. <br>'
		   		 + '						Соединение будет возоблено автоматически после короткого ожидания, самостоятельное возобновление соединения может продлить время ожидания.';
	}else if(NFLanguageCode == 'ES'){
	   skinHtml += '						Hay <span class="num netfunnel_wait_front"></span> personas delante de usted y <span class="num netfunnel_wait_back"></span> personas esperando después de usted.<br>'
		   		 + '						Por favor, espere, estamos procesando su acceso a nuestro sitio. Si abandona esta página, se producirán tiempos de espera más largos.';
	}else if(NFLanguageCode == 'VI'){
		skinHtml += '						Có <span class="num netfunnel_wait_front"></span> người trước mặt bạn và <span class="num netfunnel_wait_back"></span> người chờ đợi sau khi bạn.<br>'
				+  '						Xin vui lòng chờ, chúng tôi đang xử lý truy cập của bạn vào trang web của chúng tôi. Xin vui lòng chờ, chúng tôi đang xử lý truy cập của bạn vào trang web của chúng tôi.';
	}else{
	   skinHtml += '						고객님 앞에 <span class="num netfunnel_wait_front"></span>명, 뒤에 <span class="num netfunnel_wait_back"></span>명의 대기자가 있습니다.<br>'
		   		 + '						잠시만 기다리시면 자동 접속되며, 재접속하시면 대기 시간이 더 길어집니다.';
	}
	   skinHtml += '					</p>'
				 + '				</div>'
				 + '			</div>'
				 + '		</div>';
	if(NFLanguageCode == 'EN'){
	   skinHtml += '		<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="dim_close"><span class="hidden">Close</span></a>';
	}else if(NFLanguageCode == 'CH'){
	   skinHtml += '		<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="dim_close"><span class="hidden">关闭</span></a>';
	}else if(NFLanguageCode == 'ZH'){
	   skinHtml += '		<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="dim_close"><span class="hidden">關閉</span></a>';
	}else if(NFLanguageCode == 'JA'){
	   skinHtml += '		<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="dim_close"><span class="hidden">閉じる</span></a>';
	}else if(NFLanguageCode == 'DE'){
	   skinHtml += '		<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="dim_close"><span class="hidden">Schließen</span></a>';
	}else if(NFLanguageCode == 'FR'){
	   skinHtml += '		<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="dim_close"><span class="hidden">Fermer</span></a>';
	}else if(NFLanguageCode == 'RU'){
	   skinHtml += '		<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="dim_close"><span class="hidden">Закрыть</span></a>';
	}else if(NFLanguageCode == 'ES'){
	   skinHtml += '		<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="dim_close"><span class="hidden">Cerrar</span></a>';
	}else if(NFLanguageCode == 'VI'){
		skinHtml += '		<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="dim_close"><span class="hidden">Đóng</span></a>';
	}else{
	   skinHtml += '		<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="dim_close"><span class="hidden">닫기</span></a>';
	}
	   skinHtml += '	</div>'
				 + '</div>';
	
	// NetFunnel_Loading_Popup
	NetFunnel.SkinUtil.add('basic', {
		 htmlStr : skinHtml
		,prepareCallback : function(){
			// layer가 center에 존재하지 않아 updateCallback시 최초 한번만 실행하도록 하기위한 변수 세팅
			NetFunnel.centerCall = true;
		}
		,updateCallback : function(percent, nwait, totwait, timeleft) {
			updateNetFunnelInfo(percent, nwait, totwait, timeleft);
		}
	}, 'normal');
	
	/********** basic End **********/
	
	/********** basic_M Start **********/
	
	var skinHtmlM = '<div id="NetFunnel_Skin_Top" class="layer_wrap" style="display:block;">'
				  + '	<div class="dim_bg"></div>'
				  + '	<div class="layer_container">'
				  + '		<div class="layer_content layer_basic">'
				  + '			<div class="layer_logo">'
				  + '				<span class="hidden">ASIANA AIRLINES</span>'
				  + '			</div>'
				  + '			<div class="netfunnel_load">'
				  + '				<div class="nfl_head">'
				  + '					<div class="status">';
	if(NFLanguageCode == 'EN'){
	   skinHtmlM += '						<p class="tit">Waiting to connect</p>'
	   		  	  + '						<p class="time">Expected waiting time <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else if(NFLanguageCode == 'CH'){
	   skinHtmlM += '						<p class="tit">等待访问</p>'
		   		  + '						<p class="time">预计等待时间 <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else if(NFLanguageCode == 'ZH'){
	   skinHtmlM += '						<p class="tit">等待存取</p>'
		   		  + '						<p class="time">預計等待時間 <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else if(NFLanguageCode == 'JA'){
	   skinHtmlM += '						<p class="tit">接続待機中</p>'
		   		  + '						<p class="time">予想待機時間 <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else if(NFLanguageCode == 'DE'){
	   skinHtmlM += '						<p class="tit">Auf Verbindung warten</p>'
		   		  + '						<p class="time">Geschätzte Wartezeit <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else if(NFLanguageCode == 'FR'){
	   skinHtmlM += '						<p class="tit">En attente de connexion</p>'
		   		  + '						<p class="time">Temps d’attente estimé <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else if(NFLanguageCode == 'RU'){
	   skinHtmlM += '						<p class="tit">Ожидание подключения</p>'
		   		  + '						<p class="time">Приблизительное время ожидания <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else if(NFLanguageCode == 'ES'){
	   skinHtmlM += '						<p class="tit">Esperando para conectarse</p>'
		   		  + '						<p class="time">Tiempo de espera estimado <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else if(NFLanguageCode == 'VI'){
	   skinHtmlM += '						<p class="tit">Chờ kết nối</p>'
		   		  + '						<p class="time">Thời gian chờ đợi dự kiến <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}else{
	   skinHtmlM += '						<p class="tit">접속 대기중</p>'
		   		  + '						<p class="time">예상 대기 시간 <span id="netfunnel_timeleft" class="col_red"></span></p>';
	}
	   skinHtmlM += '					</div>'
				  + '				</div>'
				  + '				<div class="loading_bar">'
				  + '					<span id="netfunnel_loading_bar" class="load"></span>'
				  + '				</div>'
				  + '				<div class="txt_desc_wrap">'
				  + '					<p class="txt_desc mar_bo10">';
	if(NFLanguageCode == 'EN'){
	   skinHtmlM += '						There are <span class="num netfunnel_wait_front"></span> people in front of you and <span class="num netfunnel_wait_back"></span> people waiting after you.'
		   		  + '						Please wait, we are processing your access to our site. If you leave this page, longer wait times occur.';
	}else if(NFLanguageCode == 'CH'){
	   skinHtmlM += '						顾客前面有 <span class="num netfunnel_wait_front"></span>人，后面有 <span class="num netfunnel_wait_back"></span>人等待。'
		   		  + '						正在加载页面请稍后，同时请勿刷新页面，否则加载时间会更长。';
	}else if(NFLanguageCode == 'ZH'){
	   skinHtmlM += '						客戶前面有 <span class="num netfunnel_wait_front"></span>人，後面有 <span class="num netfunnel_wait_back"></span>人等待。'
		   		  + '						請稍候.將會盡快為您自動登入，一旦離開.將需等待更久時間。';
	}else if(NFLanguageCode == 'JA'){
	   skinHtmlM += '						お客様の前に <span class="num netfunnel_wait_front"></span>人、後ろに <span class="num netfunnel_wait_back"></span>人の待機ユーザーがいます。'
		   		  + '						接続されるまで画面を閉じずに、しばらくお待ち下さい。';
	}else if(NFLanguageCode == 'DE'){
	   skinHtmlM += '						Vor Ihnen sind noch <span class="num netfunnel_wait_front"></span> Personen, nach Ihnen warten noch <span class="num netfunnel_wait_back"></span> Personen.'
		   		  + '						Bitte haben Sie einen Augenblick Geduld, Sie werden gleich automatisch mit unserer Website verbunden. Bei einem erneuten Versuch kann es zu einer etwas verlängerten Wartezeit kommen.';
	}else if(NFLanguageCode == 'FR'){
	   skinHtmlM += '						Il y a <span class="num netfunnel_wait_front"></span> personnes avant vous et <span class="num netfunnel_wait_back"></span> personnes après vous.'
		   		  + "						Si vous patientez un instant, vous serez connecté automatiquement, si vous vous reconnectez, le temps d'attente pourrait être plus long.";
	}else if(NFLanguageCode == 'RU'){
	   skinHtmlM += '						Всего <span class="num netfunnel_wait_front"></span> человек перед вами и <span class="num netfunnel_wait_back"></span> человек за вами.'
		   		  + '						Соединение будет возоблено автоматически после короткого ожидания, самостоятельное возобновление соединения может продлить время ожидания.';
	}else if(NFLanguageCode == 'ES'){
	   skinHtmlM += '						Hay <span class="num netfunnel_wait_front"></span> personas delante de usted y <span class="num netfunnel_wait_back"></span> personas esperando después de usted.'
			  	  + '						Por favor, espere, estamos procesando su acceso a nuestro sitio. Si abandona esta página, se producirán tiempos de espera más largos.';
	}else if(NFLanguageCode == 'VI'){
	   skinHtmlM += '						Có <span class="num netfunnel_wait_front"></span> người trước mặt bạn và <span class="num netfunnel_wait_back"></span> người chờ đợi sau khi bạn.'
				  + '						Xin vui lòng chờ, chúng tôi đang xử lý truy cập của bạn vào trang web của chúng tôi. Xin vui lòng chờ, chúng tôi đang xử lý truy cập của bạn vào trang web của chúng tôi.';
	}else{
	   skinHtmlM += '						고객님 앞에 <span class="num netfunnel_wait_front"></span>명, 뒤에 <span class="num netfunnel_wait_back"></span>명의 대기자가 있습니다.'
			  	  + '						잠시만 기다리시면 자동 접속되며, 재접속하시면 대기 시간이 더 길어집니다.';
	}
	   skinHtmlM += '					</p>'
				  + '				</div>'
				  + '			</div>';
	if(NFLanguageCode == 'EN'){
	   skinHtmlM += '			<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="layer_close"><span class="hidden">Close</span></a>';
	}else if(NFLanguageCode == 'CH'){
	   skinHtmlM += '			<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="layer_close"><span class="hidden">关闭</span></a>';
	}else if(NFLanguageCode == 'ZH'){
	   skinHtmlM += '			<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="layer_close"><span class="hidden">關閉</span></a>';
	}else if(NFLanguageCode == 'JA'){
	   skinHtmlM += '			<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="layer_close"><span class="hidden">閉じる</span></a>';
	}else if(NFLanguageCode == 'DE'){
	   skinHtmlM += '			<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="layer_close"><span class="hidden">Schließen</span></a>';
	}else if(NFLanguageCode == 'FR'){
	   skinHtmlM += '			<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="layer_close"><span class="hidden">Fermer</span></a>';
	}else if(NFLanguageCode == 'RU'){
	   skinHtmlM += '			<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="layer_close"><span class="hidden">Закрыть</span></a>';
	}else if(NFLanguageCode == 'ES'){
	   skinHtmlM += '			<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="layer_close"><span class="hidden">Cerrar</span></a>';
	}else if(NFLanguageCode == 'VI'){
	   skinHtmlM += '			<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="layer_close"><span class="hidden">Đóng</span></a>';
	}else{
	   skinHtmlM += '			<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="layer_close"><span class="hidden">닫기</span></a>';
	}
	   skinHtmlM += '		</div>'
				  + '	</div>'
				  + '</div>';
	
	NetFunnel.SkinUtil.add('basic_M', {
		 htmlStr : skinHtmlM
		,updateCallback : function(percent, nwait, totwait, timeleft) {
			updateNetFunnelInfo(percent, nwait, totwait, timeleft);
		}
	}, 'normal');
	
	/********** basic_M End **********/
	
	/********** basic_all Start **********/
	
	var skinHtmlAll = '<div id="NetFunnel_Skin_Top" class="layer_wrap" style="display:block">'
					+ '		<div class="dim_layer"></div>'
					+ '		<div class="layer_pop" style="width:800px;">'
					+ '			<div class="pop_cont">'
					+ '				<div class="gate_wrap">'
					+ '					<div class="logo">'
					+ '						<img src="/C/pc/image/common/logo_header_star.png" alt="ASIANA AIRLINES">'
					+ '					</div>'
					+ '					<div class="status type2">'
					+ '						<div class="ico"></div>'
					+ '						<p class="time"><span class="col_red" id="netfunnel_timeleft"></span></p>'
					+ '						<p class="desc">접속 대기중 Waiting to connect 等待访问 接続待機中</p>'
					+ '					</div>'
					+ '					<div class="loading_bar">'
					+ '						<span class="load" id="netfunnel_loading_bar"></span>'
					+ '					</div>'
					+ '					<div class="txt_desc_wrap">'
					+ '						<p class="txt_desc">'
					+ '							고객님 앞에 <span class="num netfunnel_wait_front"></span>명, 뒤에 <span class="num netfunnel_wait_back"></span>명의 대기자가 있습니다. <br>'
					+ '							잠시만 기다리시면 자동 접속되며, 재접속하시면 대기 시간이 더 길어집니다.'
					+ '						</p>'
					+ '						<p class="txt_desc">'
					+ '							There are <span class="num netfunnel_wait_front"></span> people in front of you and <span class="num netfunnel_wait_back"></span> people waiting after you. <br>'
					+ '							Please wait, we are processing your access to our site. If you leave this page, longer wait times occur.'
					+ '						</p>'
					+ '						<p class="txt_desc">'
					+ '							顾客前面有 <span class="num netfunnel_wait_front"></span>人，后面有 <span class="num netfunnel_wait_back"></span>人等待。 <br>'
					+ '							正在加载页面请稍后，同时请勿刷新页面，否则加载时间会更长。'
					+ '						</p>'
					+ '						<p class="txt_desc">'
					+ '							お客様の前に<span class="num netfunnel_wait_front"></span>人、後ろに<span class="num netfunnel_wait_back"></span>人の待機ユーザーがいます。 <br>'
					+ '							接続されるまで画面を閉じずに、しばらくお待ち下さい。'
					+ '						</p>'
					+ '					</div>'
					+ '				</div>'
					+ '			</div>'
					+ '			<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="dim_close"><span class="hidden">닫기</span></a>'
					+ '		</div>'
					+ '</div>';
	
	NetFunnel.SkinUtil.add('basic_all', {
		 htmlStr : skinHtmlAll
		,prepareCallback : function(){
				// layer가 center에 존재하지 않아 updateCallback시 최초 한번만 실행하도록 하기위한 변수 세팅
				NetFunnel.centerCall = true;
		}
		,updateCallback : function(percent, nwait, totwait, timeleft) {
			updateNetFunnelInfo(percent, nwait, totwait, timeleft);
		}
	}, 'normal');
	
	/********** basic_all End **********/
	
	/********** basic_M_all Start **********/
	
	var skinHtmlMAll = '<div id="NetFunnel_Skin_Top" class="layer_wrap" style="display:block;">'
				  	 + '	<div class="dim_bg"></div>'
				  	 + '	<div class="layer_container">'
				  	 + '		<div class="layer_content layer_basic">'
				  	 + '			<div class="layer_logo">'
				  	 + '				<span class="hidden">ASIANA AIRLINES</span>'
				  	 + '			</div>'
				  	 + '			<div class="netfunnel_load">'
				  	 + '				<div class="nfl_head">'
				  	 + '					<div class="status type2">'
				  	 + '						<div class="ico"></div>'
				  	 + '						<p class="time"><span class="col_red" id="netfunnel_timeleft"></span></p>'
				  	 + '						<p class="desc">접속 대기중 Waiting to connect 等待访问 接続待機中</p>'
				  	 + '					</div>'
				  	 + '					<div class="loading_bar">'
				  	 + '						<span class="load" id="netfunnel_loading_bar"></span>'
				  	 + '					</div>'
				  	 + '					<div class="txt_desc_wrap">'
				  	 + '						<p class="txt_desc">'
				  	 + '							고객님 앞에 <span class="num netfunnel_wait_front"></span>명, 뒤에 <span class="num netfunnel_wait_back"></span>명의 대기자가 있습니다. '
				  	 + '							잠시만 기다리시면 자동 접속되며, 재접속하시면 대기 시간이 더 길어집니다.'
				  	 + '						</p>'
				  	 + '						<p class="txt_desc">'
				  	 + '							There are <span class="num netfunnel_wait_front"></span> people in front of you and <span class="num netfunnel_wait_back"></span> people waiting after you. '
				  	 + '							Please wait, we are processing your access to our site. If you leave this page, longer wait times occur.'
				  	 + '						</p>'
				  	 + '						<p class="txt_desc">'
				  	 + '							顾客前面有 <span class="num netfunnel_wait_front"></span>人，后面有 <span class="num netfunnel_wait_back"></span>人等待。'
				  	 + '							正在加载页面请稍后，同时请勿刷新页面，否则加载时间会更长。'
				  	 + '						</p>'
				  	 + '						<p class="txt_desc">'
				  	 + '							お客様の前に<span class="num netfunnel_wait_front"></span>人、後ろに<span class="num netfunnel_wait_back"></span>人の待機ユーザーがいます。'
				  	 + '							接続されるまで画面を閉じずに、しばらくお待ち下さい。'
				  	 + '						</p>'
				  	 + '					</div>'
				  	 + '				</div>'
				  	 + '				<a href="javascript:;" id="NetFunnel_Countdown_Stop" class="layer_close"><span class="hidden">닫기</span></a>'
				  	 + '			</div>'
				  	 + '		</div>'
				  	 + '	</div>'
				  	 + '</div>';
		
		NetFunnel.SkinUtil.add('basic_M_all', {
		 htmlStr : skinHtmlMAll
		,updateCallback : function(percent, nwait, totwait, timeleft) {
			updateNetFunnelInfo(percent, nwait, totwait, timeleft);
		}
	}, 'normal');
	
	/********** basic_M_all End **********/
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	$(window).resize(function(){
		netfunnelLayerCenter();
	});
	
	// pc 에서 센터 정렬
	function netfunnelLayerCenter(){
		var skinId = NetFunnel.gSkinId;
		
		if(skinId == 'basic' || skinId == 'basic_all'){
			var innerWidth = window.innerWidth;
			var layerWidth = $('#NetFunnel_Skin_Top > .layer_pop').width();
			
			var innerHeight = window.innerHeight;
			var layerHeight = $('#NetFunnel_Skin_Top > .layer_pop').height();
			
			var scrollTop = window.scrollY;
			
			if(scrollTop == undefined){
				scrollTop = window.pageYOffset;
			}
			
			var popupLeft = (innerWidth - layerWidth)/2;
			var popupTop = (innerHeight - layerHeight)/2 + scrollTop;
			
			if(popupTop < 0){
				popupTop = 0;
			}
			
			$('#NetFunnel_Loading_Popup').css('left', popupLeft+'px');
			$('#NetFunnel_Loading_Popup').css('top', popupTop+'px');
		}
	}
	
	// second -> 00:00:00 로 변환
	function makeTimeLeft(timeleft){
		var hour = Math.floor(timeleft%(60*60*60)/(60*60));
		var min = Math.floor(timeleft%(60*60)/60);
		var sec = Math.floor(timeleft%60);
		
		hour = hour < 10 ? "0" + hour : hour;
		min  = min  < 10 ? "0" + min  : min;
		sec  = sec  < 10 ? "0" + sec  : sec;
		
		return hour + ":" + min + ":" + sec;
	}
	
	function getNFLanguageCode(){
		var uri = location.pathname;
		var uriArr = uri.split('/');
		var languageCode = uriArr[3];
		
		if(languageCode == 'EN' || languageCode == 'en'){
			return 'EN';
		}else if(languageCode == 'CH' || languageCode == 'ch'){
			return 'CH';
		}else if(languageCode == 'ZH' || languageCode == 'zh'){
			return 'ZH';
		}else if(languageCode == 'JA' || languageCode == 'ja'){
			return 'JA';
		}else if(languageCode == 'DE' || languageCode == 'de'){
			return 'DE';
		}else if(languageCode == 'FR' || languageCode == 'fr'){
			return 'FR';
		}else if(languageCode == 'RU' || languageCode == 'ru'){
			return 'RU';
		}else if(languageCode == 'ES' || languageCode == 'es'){
			return 'ES';
		}else if(languageCode == 'VI' || languageCode == 'vi'){
			return 'VI';
		}
		return "KO";
	}
	
	function updateNetFunnelInfo(percent, nwait, totwait, timeleft){
		
		// layer가 center에 존재하지 않아 updateCallback시 최초 한번만 실행
		if(NetFunnel.centerCall){
			netfunnelLayerCenter();
			// layer가 center에 존재하지 않아 updateCallback시 최초 한번만 실행하도록 하기위한 변수 세팅
			NetFunnel.centerCall = false;
		}
		
		percent  == undefined ? 0 : percent;
		nwait	 == undefined ? 0 : nwait;
		totwait  == undefined ? 0 : totwait;
		timeleft == undefined ? 0 : timeleft;
		
		// 00:00:00 - netfunnel_timeleft
		$('#netfunnel_timeleft').text(makeTimeLeft(timeleft));		// 남아있는 대기시간
		// 로딩 : netfunnel_loading_bar
		$('#netfunnel_loading_bar').css('width', percent+'%');		// 진행률
		// 앞에 남은 대기자수 : netfunnel_wait_front
		$('.netfunnel_wait_front').text(nwait);						// 현재 남아있는 대기자수
		// 뒤에 남은 대기자수 : netfunnel_wait_back
		$('.netfunnel_wait_back').text(totwait-nwait);				// 전체 대기자수 - 현재 남아있는 대기자수  ----- 자신도 포함해야하나??
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}