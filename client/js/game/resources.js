Resources = (function() {
	var private, Resources = {
		images : []
	};

	Resources.initialize = function(finishCallback, progressCallback)
	{
		var self = this;

		var totalImages = 0;
		var imagesLoaded = 0;

		$.ajax({
			type: 'post',
			url: 'http://www.student.bth.se/~raap11/DV1483/kmom10/game/client/ajax/getFilesInFolder.php?folder=img&extensions={"extensions": ["gif", "png", "jpg", "jpeg"]}',
			dataType: "json",
			success: function(data) {
				loadImages(data);
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.log('Ajax request failed: ' + textStatus + ', ' + errorThrown);
			},
		});

		function loadImages(data)
		{
			for (var img in data)
			{
				Resources.images[img] = {
					name : img,
					img : Resources.images[img] = new Image()
				};

				Resources.images[img].img.onload = function () {
					imageLoaded(this.src);
				};

				Resources.images[img].img.src = data[img];

				totalImages++;
			}
		}

		function imageLoaded(src)
		{
			imagesLoaded++;

			if(totalImages > 0) {
				progressCallback(imagesLoaded / totalImages);
			}

			if(imagesLoaded === totalImages) {
				finishCallback();
			}
		}
	};

	return Resources;
}());
