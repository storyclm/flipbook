$(function () {
	flipbook = $("#flipbook");

	flipbook.turn({
		width: 700,
		height: 450,
		//autoCenter: true,
		acceleration: true,
		duration: 1200,
	});


	flipbook.bind("turning",function(event, page, view){
		storyCLMNavigation.blockSwipe();
	});
});
