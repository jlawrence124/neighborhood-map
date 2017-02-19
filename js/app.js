var Model = function() {

};

var ViewModel = function () {

};

var View = function () {
	function initMap() {
		// Constructor creates a new map - only center and zoom are required.
		map = new google.maps.Map(document.getElementById('#map'), {
		  center: {lat: 35.2271, lng: 80.8431},
		  zoom: 13,
		  mapTypeControl: false
		});
	}
};
