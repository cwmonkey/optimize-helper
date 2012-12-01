// So I don't break ie while debugging
console = console || {log: function() {}};

// Local storage fallback
if (!window.localStorage) {
  window.localStorage = {
    getItem: function (sKey) {
      if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
      return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
    },
    key: function (nKeyId) {
      return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
    },
    setItem: function (sKey, sValue) {
      if(!sKey) { return; }
      document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
      this.length = document.cookie.match(/\=/g).length;
    },
    length: 0,
    removeItem: function (sKey) {
      if (!sKey || !this.hasOwnProperty(sKey)) { return; }
      document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      this.length--;
    },
    hasOwnProperty: function (sKey) {
      return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    }
  };
  window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
}

(function($,window,undefined) {
$(function() {
	var $body = $('body');
	var $document = $(document);
	var experimenttpl = $('#experimenttpl').html();
	var experiment_num = 1;
	var variationtpl = $('#variationtpl').html();
	var $experiments = $('#experiments');

	var add_experiment = function(name) {
		if ( name == undefined ) name = 'experiment' + experiment_num;

		var tpl = experimenttpl
			.replace(/\{experiment\}/g, experiment_num)
			.replace(/\{experiment_name\}/g, name);

		var $experiment = $(tpl);
		$experiment.data('variation_num', '1');
		$experiments.append($experiment);
		experiment_num++;
		// $experiment.find('.add_variation input').click();
		return $experiment;
	};

	var add_variation = function($experiment, name) {
		var experiment = $experiment.data('experiment');
		var experiment_name = $experiment.find('h2 input').val();
		var variation_num = $experiment.data('variation_num');
		var $experiment_variations = $experiment.find('.experiment_variations');

		if ( name == undefined ) name = experiment_name + '_variation' + variation_num;
		var tpl = variationtpl
			.replace(/\{experiment\}/g, experiment)
			.replace(/\{experiment_name\}/g, experiment_name)
			.replace(/\{variation\}/g, variation_num)
			.replace(/\{variation_name\}/g, name)
			;

		var $variation = $(tpl);
		$experiment_variations.append($variation);
		variation_num++;
		$experiment.data({variation_num: variation_num});
		$variation.find('.radio input').attr({checked: 'checked'});
		update_body_class();
		save_experiments();
	};

	var update_body_class = function() {
		$('.experiment').each(function() {
			var c = $('.radio input:checked', this).closest('.variation_container').find('input[type="text"]').val();
			$(this).find('.text [type="text"]').each(function() {
				var val = $(this).val();

				if ( val != c ) {
					post('bodyRemoveClass:' + val);
				} else {
					post('bodyAddClass:' + val);
				}
			});
		});
	};

	var save_experiments = function() {
		var experiments = [];

		$('.experiment').each(function() {
			var c = $('h2 input', this).val();
			var variations = [];
			$(this).find('.text [type="text"]').each(function() {
				var val = $(this).val();
				variations.push(val);
			});
			experiments.push({name: c, variations: variations});
		});

		set('experiments', experiments);
	};

	// Event delegation
	$body
		.delegate('#add_experiment input', 'click', function(e) {
			e.preventDefault();
			add_experiment();
		})
		.delegate('.add_variation input', 'click', function(e) {
			e.preventDefault();
			add_variation($(this).closest('.experiment'));
		})
		.delegate('.radio input', 'change', function() {
			update_body_class();
		})
		.delegate('input[type="text"]', 'change keypress', function() {
			update_body_class();
			save_experiments();
		})
		/*.delegate('#add_image', 'submit', function(e) {
			e.preventDefault();
			var val = $src.val();
			$src.val('');
			if ( val ) {
				var img = {src: val};
				var shortcut = $shortcut.val();
				if ( shortcut ) img.shortcut = shortcut;
				$shortcut.val('')
				add_image(img);
				save();
			}
		})
		.delegate('#use_shortcut', 'click', function() {
			var use_shortcuts = ( $('#use_shortcut').is(':checked') ? 1 : 0 );
			set('use_shortcuts', use_shortcuts);
		})
		.delegate('input[name="code"]', 'click', function() {
			var code = $('input[name="code"]:checked').val();
			set('code', code);
		})
		.delegate('a.smiley', 'click', function(e) {
			e.preventDefault();
			var use_shortcuts = $('#use_shortcut').is(':checked');
			var shortcut = $('.shortcut', this.parentNode).val();
			if ( use_shortcuts && shortcut ) return post('shortcut:' + shortcut);
			var src = $('img', this)[0].src;
			var code = $('input[name="code"]:checked').val();
			if ( code == 'html' ) {
				src = '<img src="' + src + '" />';
			} else if ( code == 'url' ) {
			} else {
				src = '[IMG]' + src + '[/IMG]';
			}
			if ( src ) return post('img:' + src);
		})
		.delegate('#images .shortcut', 'blur', function(e) {
			save();
		})
		.delegate('#images li', 'mouseenter', function(e) {
			hoverli = this;
			clearInterval(lito);
			lito = setTimeout(showli, 700);
		})
		.delegate('#images li', 'mouseleave', function(e) {
			clearInterval(lito);
			$('.controls', hoverli).fadeOut();
		})
		.delegate('#wider', 'click', function(e) {
			e.preventDefault();
			$body.removeClass('width' + width);
			if ( width < 8 ) width++;
			$body.addClass('width' + width);
			resize();
			set('width', width);
		})
		.delegate('#thinner', 'click', function(e) {
			e.preventDefault();
			$body.removeClass('width' + width);
			if ( width > 1 ) width--;
			$body.addClass('width' + width);
			resize();
			set('width', width);
		})
		.delegate('.remove', 'click', function(e) {
			e.preventDefault();
			if ( !clicked_remove ) {
				clicked_remove = true;
				return true;
			}
			$(this).closest('.container').remove();
			save();
			resize();
		})*/
		;

	// functions
	var showli = function() {
		$('.controls').fadeOut();
		$('.controls', hoverli).fadeIn();
		clicked_remove = false;
	};

	var post = function(msg) {	
		$.postMessage(
			msg,
			window.calling_ref,
			parent
		);
		return true;
	};

	/*$.receiveMessage(
		function(e){
			alert( 'Parent says: ' + e.data );
		},
		'<?=$url?>'
	);*/

	var set = function(name, val) {
		if ( typeof val != 'string' &&  typeof val != 'number' ) {
			val = JSON.stringify(val);
		}

		localStorage.setItem(name, val);
	};

	var get = function(name, json) {
		var val = localStorage.getItem(name);

		if ( val == null ) return null;

		if ( json != undefined ) {
			try {
				val = JSON.parse(val);
			} catch(e) {
				val = null;
			}
		}
		return val;
	};

	var add_image = function(img) {
		var $controls = $('<div class="controls"></div>').hide();
		var $img = $('<img src="' + img.src + '"/>');
		var $a = $('<a class="smiley" href="#"/>');
		var $shortcut = $('<input type="text" class="shortcut" placeholder="Shortcut Text" />');
		var $container = $(smileytpl);
		var $remove = $('<a href="#" class="remove" title="click twice">Remove</a>');

		if ( img.shortcut != undefined ) $shortcut.val(img.shortcut);
		$container
			.append(
				$a
					.append($img)
			).append(
				$controls
					.append($shortcut).append($remove)
			).appendTo($images);

		$instructions.fadeOut();

		resize();
	};

	var save = function() {
		var imgs = [];
		$images.find('li').each(function() {
			var img = {};
			var src = $('img', this)[0].src;
			if ( !src ) return true;
			img.src = src;
			var shortcut = $('.shortcut', this).val();
			if ( shortcut ) img.shortcut = shortcut;
			imgs.push(img);
		});

		set('images', imgs);
	};

	var resize = function() {
		post('resize:' + $body.width() + 'x' + $body[0].scrollHeight);
	};

	// Main program
	// $body
	// 	.bind('dragstart', function(e) {
	// 		drag_random = true;
	// 		return true;
	// 	})
	// 	.bind('dragover', function(e) {
	// 		e.preventDefault();
	// 		return true;
	// 	})
	// 	.bind('dragleave', function(e) {
	// 		drag_enters--;
	// 		if ( !drag_enters ) $body.removeClass('dragenter');
	// 		return true;
	// 	})
	// 	.bind('dragenter', function(e) {
	// 		drag_enters++;
	// 		$body.addClass('dragenter');
	// 		return true;
	// 	})
	// 	.bind('drop', function(e) {
 	//     	e.preventDefault();
	// 		$body.removeClass('dragenter');
	// 		var data;
	// 		if ( drag_random ) {
	// 			data = $('#random img')[0].src;
	// 		} else {
	// 			data = e.originalEvent.dataTransfer.getData('text');
	// 		}
	// 		if ( data == document.location ) return true;
	// 		$src.val(data);
	// 		$add_image.submit();
	// 		return true;
	// 	})
	// 	.bind('dragend', function() {
	// 		drag_random = false;
	// 	})
	// 	;

	// images = get('images', true);
	// if ( !images || typeof images != 'object' ) images = [];

	// width = get('width') || width;
	// width = parseInt(width)
	// if ( width < min_width ) width = min_width;
	// if ( width > max_width ) width = max_width;
	// $body.addClass('width' + width);

	// for ( var i=0, img; i < images.length && (img = images[i]); i++ ) {
	// 	$instructions.hide();
	// 	add_image(img);
	// }

	// $close.bind('click', function() {
	// 	post('close:');
	// })
	// .appendTo($page);

	// if ( get('use_shortcuts') == 0 ) {
	// 	$('#use_shortcut').prop("checked", false);
	// }

	// get_code = get('code');
	// if ( get_code == 'html' ) {
	// 	$('#html').prop("checked", true);
	// } else if ( get_code == 'url' ) {
	// 	$('#url').prop("checked", true);
	// } else {
	// 	$('#bb').prop("checked", true);
	// }

	// add_test();
	// $('#test1').attr('checked', 'checked');
	// update_body_class();

	experiments = get('experiments', true);
console.log(experiments);
	if ( experiments != undefined ) {
		for ( var experiment_i in experiments ) {
			var experiment = experiments[experiment_i];
			var $experiment = add_experiment(experiment.name);

			for ( var variation_i in experiment.variations ) {
				var variation = experiment.variations[variation_i];
				add_variation($experiment, variation);
			}
		}
	}

	setTimeout(resize, 0);
});
})(jQuery, window);
