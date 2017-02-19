var locationList = [
{
	name: "Midwood Smokehouse",
	address: "1401 Central Ave, Charlotte, NC 28205",
	lat: "35.221024",
	lng: "-80.814854",
	type: "Barbecue Restaurant"
},
{
	name: "The Capital Grille",
	address: "201 N Tryon St, Charlotte, NC 28202",
	lat: "35.228327",
	lng: "-80.841997",
	type: "Classy"
},
{
	name: "Rooftop 210",
	address: "210 E Trade St B320, Charlotte, NC 28202",
	lat: "35.225317",
	lng: "-80.842488",
	type: "Bar"
},
{
	name: "Lucky's Bar and Arcade",
	address: "300 N College St #104, Charlotte, NC 28202",
	lat: "35.227832",
	lng: "-80.839238",
	type: "Bar"
}

var Model = function() {
	var self = this;


	this.name = ko.observable(data.name);
	this.address = ko.observable(data.address);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.type = ko.observable(data.type);


]};

var ViewModel = function () {
	var self = this;

	//blank array for all locations
	this.locationList = ko.observableArray([]);

	var searchAutocomplete = new google.maps.places.Autocomplete(
		document.getElementById('search-bar'));
};

var View = function () {
	var self = this;


	//blank array for all the markers used
	var markers = [];




};

//declaring global map variable
var map;

function initMap() {

	// Create new google map
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 35.2271, lng: -80.8431},
	  zoom: 14
	});

	console.log('starting map');
};
