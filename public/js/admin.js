$(function(){
	$('.del').on('click', function(){
		var T = $(this),
			id = T.data('id'),
			$tr = $('.item-id-' + id);
		
		$.ajax({
			url: '/admin/list?id=' + id,
			type: 'DELETE'
		})
		.done(function(results) {
			if (results.success === 1) {
				$tr.remove();
			};
		});
		
	})
});