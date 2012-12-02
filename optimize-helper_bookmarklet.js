/*

<a href="javascript:(function(){url='http://optimize-helper.local/optimize-helper_bookmarklet.js';document.body.appendChild(document.createElement('script')).src=url+'?ref='+encodeURIComponent(document.location)+'&'+new Date().getTime();})();">optimize-helper</a>

*/

var site_url = 'http://optimize-helper.local';

(function(window, undefined) { // global namespace protection

// ganked from http://feather.elektrum.org/book/src.html
var scripts = document.getElementsByTagName('script');
var myScript = scripts[ scripts.length - 1 ];

var queryString = myScript.src.replace(/^[^\?]+\??/,'');

var params = parseQuery( queryString );

function parseQuery ( query ) {
	var Params = new Object ();
	if ( ! query ) return Params; // return empty object
	var Pairs = query.split(/[;&]/);
	for ( var i = 0; i < Pairs.length; i++ ) {
		var KeyVal = Pairs[i].split('=');
		if ( ! KeyVal || KeyVal.length != 2 ) continue;
		var key = unescape( KeyVal[0] );
		var val = unescape( KeyVal[1] );
		val = val.replace(/\+/g, ' ');
		Params[key] = val;
	}
	return Params;
}

var includejs = function(url, date) {
	document.body.appendChild(
		document.createElement('script')
	).src = url + ((date != undefined)?'?' + new Date().getTime():'');
}

// Include jquery
var jquery_version = params['jquery'] || '1.8.1';

var do_noconflict = false;
if ( window.jQuery == undefined ) {
	includejs('https://ajax.googleapis.com/ajax/libs/jquery/' + jquery_version + '/jquery.min.js');
	do_noconflict = true;
}

var postmessage_included = false;
var main_init = function() {
	// Check to see if jQuery has loaded
	if ( window.jQuery == undefined ) {
		setTimeout(main_init, 100);
		return;
	} else if ( !postmessage_included ) {
		// Load after jQuery is loaded
		postmessage_included = true;
		includejs(site_url + '/jquery.ba-postmessage.min.js');
		setTimeout(main_init, 0);
		return;
	} else if ( window.jQuery.postMessage == undefined ) {
		setTimeout(main_init, 100);
		return;
	}

	if (do_noconflict) jQuery.noConflict();

	// Main program:
	(function($) {
		var div_id = 'optimize-helper_dot_local_div_container';
		var link_href = site_url + '/optimize-helper_test.css?' + (new Date).getTime();
		var $body = $('body');
		var $div = $('#' + div_id);
		var $link = $('#' + div_id + '_link');
		var iframe_url = site_url + '/optimize-helper.php?ref=' + encodeURIComponent(document.location) + '&' + (new Date().getTime());
		var $iframe = $('<iframe src="' + iframe_url + '" frameBorder="0"></iframe>').css({border:0,margin:0,width:'100%',height:'100%'});

		if ( window.optimize_helper_dot_local_receiving == undefined ) {
			// Only do this stuff once
			$.receiveMessage(
				function(e){
					var colonloc = e.data.indexOf(':');
					var command = e.data.substring(0, colonloc);
					var param = e.data.substring(colonloc + 1);
					switch(command) {
						// case 'msg':
						// 	alert(param);
						// 	break;
						case 'bodyRemoveClass':
							$body.removeClass(param)
							break;
						case 'bodyAddClass':
							$body.addClass(param)
							break;
						// case 'shortcut':
						// 	window.focus();
						// 	insertAtCaret(last_textarea, param);
						// 	break;
						case 'resize':
							var d = param.split('x');
							if ( d[1] > $(window).height() ) d[1] = $(window).height();
							$div.css({width: d[0] + 'px', height: d[1] + 'px'});
							break;
						// case 'close':
						// 	$div.fadeOut(function() {
						// 		$div.remove();
						// 		delete $div;
						// 	});
						// 	break;
					}
				},
				site_url
			);
			window.optimize_helper_dot_local_receiving = true;
		}

		if ( !$div[0] ) $div = $('<div id="' + div_id + '"></div>');
		$div.html('');
		$div.append($iframe);
		$body.append($div);
		$div.css({
			width: 270,
			height: 300,
			position:  'fixed',
			top: 0,
			right: 0,
			zIndex: 2000
		});

		if ( !$link[0] ) {
			$link = $('<link rel="stylesheet" id="' + div_id + '_link" />');
			$link.attr({href: link_href});
			$body.append($link);
		} else {
			$link.attr({href: link_href});
		}

		$body.addClass('optimize-helper');
		includejs(site_url + '/optimize-helper_test.js?' + (new Date().getTime()));
	})(window.jQuery);
}

setTimeout(main_init, 0); // 

})(window); // end namespace protection