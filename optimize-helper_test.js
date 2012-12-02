(function($) {
$(function() {
	var $state = $('.field-name-field-sig-state select');
	var $new_state = $state.clone();
	$new_state.addClass('optimize-helper');
	$new_state.find('option').each(function() {
		var $this = $(this);
		$this.html($this.attr('value'));
	}).first().html('');
	$new_state.insertAfter($state);
});
})(jQuery);
