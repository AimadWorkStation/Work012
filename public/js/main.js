jQuery(document).ready(function() {
	$('.delete-article').on('click',function(e){
		// $target = $(e.target);
		// console.log($target.attr('data-id'));
		const id = $(this).data('id');
		$.ajax({
			type: 'DELETE',
			url: '/articles/'+id,
			success : (response)=>{
				alert('Deleting Article');
				window.location.href='/';
			},
			error : (err)=>{
				console.log(err);
			}
		});
	});
});