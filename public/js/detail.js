$(function(){
	$('.comment').on('click', function(){
		var T = $(this),
			toID = T.data('tid'),
			commentID = T.data('cid');
		
		if($('toId').length) {
			$('toId').val(toID);
		}else{
			$('<input>').attr({
				type: 'hidden',
				id: 'toId',
				name: 'comment[tid]',
				value: toID
			}).appendTo('#commentForm');
		}
		
		if($('commentId').length) {
			$('commentId').val(commentID);
		}else{
			$('<input>').attr({
				type: 'hidden',
				id: 'commentId',
				name: 'comment[cid]',
				value: commentID
			}).appendTo('#commentForm');
		}
		
	})
});