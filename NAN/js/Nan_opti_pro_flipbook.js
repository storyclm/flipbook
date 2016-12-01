$(function () {
	flipbook = $("#flipbook");
	prevPage = $("#flipbookPrevPage");
	nextPage = $("#flipbookNextPage");


	flipbook.turn({
		width: 700,
		height: 450,
		autoCenter: true,
		acceleration: true,
		duration: 1200,
	});
	totalPages = flipbook.turn("pages");

	if(flipbook.turn("page") == 1) {
		prevPage.hide();
	}

	prevPage.click(function(){
		flipbook.turn("previous");
		if(flipbook.turn("page") == 1) {
			prevPage.hide();
		}
		else {
			nextPage.show();
		};
	});

	nextPage.click(function(){
		flipbook.turn("next");

		if(flipbook.turn("page") == totalPages) {
			nextPage.hide();
		}
		else {
			prevPage.show();
		};
	});
});
