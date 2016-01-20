$(document).ready(function($){
   
	function get_height ()
	{
		var comp_height= $("#mainframe").height() - $(".page-headline").height() - $(".free-rooms").height();
		
		
		
		$(".news-img").css("height", comp_height+'px');
	}
	
	get_height();
	
	$(window).resize(function() {
		get_height();
	});
});
