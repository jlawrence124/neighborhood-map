var locationList = [
{
	name: "Midwood Smokehouse",
	address: "1401 Central Ave, Charlotte, NC 28205",
	latlng: {lat: 35.221024,  lng: -80.814854},
	type: "Barbecue Restaurant"
},
{
	name: "The Capital Grille",
	address: "201 N Tryon St, Charlotte, NC 28202",
	latlng: {lat: 35.228327,  lng: -80.841997},
	type: "Classy"
},
{
	name: "Rooftop 210",
	address: "210 E Trade St B320, Charlotte, NC 28202",
	latlng: {lat: 35.225317, lng: -80.842488},
	type: "Bar"
},
{
	name: "Lucky's Bar and Arcade",
	address: "300 N College St #104, Charlotte, NC 28202",
	latlng: {lat: 35.227832,  lng: -80.839238},
	type: "Bar"
}];


var Model = function(data) {
	var self = this;

	this.name = ko.observable(data.name);
	this.address = ko.observable(data.address);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.type = ko.observable(data.type);

};

var ViewModel = function () {
	var self = this;

	//blank array for all the markers used
	var markers = [];

	var locations = [];

	//blank array for all locations
	this.location = ko.observableArray([]);

	//TO DO:  FIX THIS FOREACH LOOP
	//push each location to a new observableArray
/*	locationList.forEach(function(location){
		self.locationList.push(new Model(location));
	});
*/
	//google maps Autocomplete.  this has to change to only Autocomplete what's on list to start
	var searchAutocomplete = new google.maps.places.Autocomplete(
		document.getElementById('search-bar'));

	function makeMarkerIcon(markerColor) {
		var markerImage = new google.maps.MarkerImage(
		  'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
		  '|40|_|%E2%80%A2',
		  new google.maps.Size(21, 34),
		  new google.maps.Point(0, 0),
		  new google.maps.Point(10, 34),
		  new google.maps.Size(21,34));
		return markerImage;
	};
 	// Styling the marker
     var defaultIcon = makeMarkerIcon('DC143C');

 	// mouse over icon
     var highlightedIcon = makeMarkerIcon('FFFFFF');

	//create an array of markers on initialize
	for (var i = 0; i < locationList.length; i++) {
		//get the position from the location array

		/* TO DO:  FIX LOOP FOR ALL values
		/*for (var key in locationList) {
			//var key = locations[i].value;
		}; */

		var position = locationList[i].latlng;
		var name = locationList[i].name;
		var address = locationList[i].address;

		var marker = new google.maps.Marker({
			position: position,
			title: name,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon,
			id: i
		})

		markers.push(marker);

		// Two event listeners - one for mouseover, one for mouseout,
		// to change the colors back and forth.
		marker.addListener('mouseover', function() {
		  this.setIcon(highlightedIcon);
		});
		marker.addListener('mouseout', function() {
		  this.setIcon(defaultIcon);
		});
	}
	console.log(defaultIcon)
	// Loop through markers and display them
	  function showMarkers() {
	    var bounds = new google.maps.LatLngBounds();
	    // Extend the boundaries of the map for each marker and display the marker
	    for (var i = 0; i < markers.length; i++) {
	      markers[i].setMap(map);
	      bounds.extend(markers[i].position);
	    }
	    map.fitBounds(bounds);
	  }

	 //tie show markers to the DOM
  	document.getElementById('show-markers').addEventListener('click', showMarkers);


};


var View = function () {
	var self = this;




};




//declaring global map variable
var map;

(function initMap() {

	// Create new google map
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 35.2271, lng: -80.8431},
	  zoom: 14
	});

	console.log('starting map');
})();

ko.applyBindings(new ViewModel());
