$(function () {
	flipbook = $("#flipbook");
	prevPage = $("#flipbookPrevPage");
	nextPage = $("#flipbookNextPage");

	flipbook.turn({
		width: 700,
		height: 450,
		acceleration: true,
		duration: 1200,
	});


	flipbook.bind("turning",function(event, page, view){
		storyCLMNavigation.blockSwipe();
	});

	prevPage.click(function(){
		flipbook.turn("previous");
	});

	nextPage.click(function(){
		flipbook.turn("next");
	});
});
