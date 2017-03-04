 var Model = {
     locationList: [{
             name: "Midwood Smokehouse",
             address: "1401 Central Ave, Charlotte, NC 28205",
             latlng: {
                 lat: 35.221024,
                 lng: -80.814854
             },
             type: "Barbecue",
             imgURL: "http://midwoodsmokehouse.com/locations/locations_charlotte_columbia_files/stacks-image-799e4d6-800x480.jpg",
             yelp: "midwood-smokehouse-charlotte",
             showLocation: ko.observable(true)
         },
         {
             name: "Queen City Q",
             address: "225 E 6th St A, Charlotte, NC 28202",
             latlng: {
                 lat: 35.227664,
                 lng: -80.838851
             },
             type: "Barbecue",
             imgURL: "http://www.charlotteburgerblog.com/wp-content/uploads/2013/08/queen-city-q-15.jpg",
             yelp: "midwood-smokehouse-charlotte",
             showLocation: ko.observable(true)
         },
         {
             name: "The Capital Grille",
             address: "201 N Tryon St, Charlotte, NC 28202",
             latlng: {
                 lat: 35.228327,
                 lng: -80.841997
             },
             type: "Classy",
             imgURL: "http://www.greatplacesdirectory.com/spaces/171/scotts-patio.jpg",
             yelp: "midwood-smokehouse-charlotte",
             showLocation: ko.observable(true)
         },
         {
             name: "Rooftop 210",
             address: "210 E Trade St B320, Charlotte, NC 28202",
             latlng: {
                 lat: 35.225317,
                 lng: -80.842488
             },
             type: "Bar",
             imgURL: "http://rooftop210.com/images/entertain.jpg",
             yelp: "midwood-smokehouse-charlotte",
             showLocation: ko.observable(true)
         },
         {
             name: "Lucky's Bar and Arcade",
             address: "300 N College St #104, Charlotte, NC 28202",
             latlng: {
                 lat: 35.227832,
                 lng: -80.839238
             },
             type: "Barcade",
             imgURL: "https://s3-media2.fl.yelpcdn.com/bphoto/VsTEI5nMod-5hPcSU0Qp7w/o.jpg",
             yelp: "midwood-smokehouse-charlotte",
             showLocation: ko.observable(true)
         }
     ]
 };


 var ViewModel = function() {
     var self = this;
     //blank array for all locations
     this.location = ko.observableArray([]);

     //create categoryList array to push categories
     this.categoryList = [];



     //append types to categoryList
     for (var i = 0; i < Model.locationList.length; i++) {
         if (self.categoryList.indexOf(Model.locationList[i].type) === -1) {
             self.categoryList.push(Model.locationList[i].type);
         }
     }

     //created selectedPlace observable
     this.selectedPlace = ko.observable();
     this.selectedName = ko.observable();
     this.selectedYelp = ko.observable();

     Model.locationList.forEach(function(data) {
         self.location.push(data);
     });

     self.selectedYelp(Model.locationList[2].yelp);

     console.log(self.selectedYelp());
     /*
     //change this from looping to updating!!!
     for (var i = 0; i < Model.locationList.length; i++) {
         self.selectedYelp(Model.locationList[i].yelp);
     }
     */

     //filters markers and list of locations
     self.selectedPlace.subscribe(function(newValue) {
         if (newValue == undefined) {
             // show all markers and locations at start
             self.location().forEach(function(place) {
                 place.showLocation(true);
                 place.marker.setVisible(true);
             });
         } else {
             self.location().forEach(function(place) {
                 if (place.type === self.selectedPlace()) {
                     place.showLocation(true);
                     place.marker.setVisible(true);
                 } else {
                     place.showLocation(false);
                     place.marker.setVisible(false);
                 }
             });
         }
     }, this);

     //filter items from the list view
     self.filterFromList = function(item) {
         self.selectedName(item.name);
         self.location().forEach(function(place) {
             if (place.name === self.selectedName()) {
                 place.showLocation(true);
                 place.marker.setVisible(true);
             } else {
                 place.showLocation(false);
                 place.marker.setVisible(false);
             }
         });
     };

     //remove items from view when not selected
     self.unfilter = function(item) {
         self.location().forEach(function(place) {
             place.showLocation(true);
             place.marker.setVisible(true);
         })
     };

     // YELP API AUTHENTICATION
     function nonce_generate() {
         return (Math.floor(Math.random() * 1e12).toString());
     }

     var yelp_url = 'http://api.yelp.com/v2/business/' + self.selectedYelp();

     var YELP_KEY = 'khBkEOW5FohZSnMNSp9NlQ',
         YELP_TOKEN = 'sv3hcY_HyOH2WdjWuEjCHbDXhhLwnz_X',
         YELP_KEY_SECRET = 'vPFLQCN_HH1v33bDuUTHv479WF8',
         YELP_TOKEN_SECRET = 'xn8agIL0m-1MU_Aw3Ng8UbC9bL0';

     var parameters = {
         oauth_consumer_key: YELP_KEY,
         oauth_token: YELP_TOKEN,
         oauth_nonce: nonce_generate(),
         oauth_timestamp: Math.floor(Date.now() / 1000),
         oauth_signature_method: 'HMAC-SHA1',
         oauth_version: '1.0',
         callback: 'cb' // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
     };

     var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
     parameters.oauth_signature = encodedSignature;

     var settings = {
         url: yelp_url,
         data: parameters,
         cache: true, // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
         dataType: 'jsonp',
         success: function(results) {
             // Do stuff with results
             console.log("Yelp! Success");
         },
         error: function() {
             // Do stuff on fail
             console.log("Yelp! Fail!");
         }
     };

     // Send AJAX query via jQuery library.
     $.ajax(settings);

 };


 //declaring global map variable
 var map,
     infoWindow;

 var markers = [];


 function initMap() {
     var self = this;

     //trace function for debugging
     function trace(message) {
         if (typeof console != 'undefined') {
             console.log(message);
         }
     }

     // Create new google map
     map = new google.maps.Map(document.getElementById('map'), {
         center: {
             lat: 35.2271,
             lng: -80.8431
         },
         zoom: 14
     });

     console.log('starting map');

     // Styling the marker
     var defaultIcon = makeMarkerIcon('DC143C');

     // mouse over icon
     var highlightedIcon = makeMarkerIcon('FFFFFF');

     infoWindow = new google.maps.InfoWindow({
         content: "test"
     });

     //unfilter results when closing infoWindow
     google.maps.event.addListener(infoWindow, 'closeclick', vm.unfilter);

     google.maps.event.addListener(map, "click", function(event) {
         infoWindow.close();
         vm.unfilter();
     });


     //create an array of markers on initialize
     for (var i = 0; i < vm.location().length; i++) {
         //get the position from the location array

         var position = vm.location()[i].latlng;
         var name = vm.location()[i].name;
         var address = vm.location()[i].address;
         var location = vm.location()[i];
         var yelp_id = vm.location()[i].yelp;

         var marker = new google.maps.Marker({
             position: position,
             location: location,
             title: name,
             animation: google.maps.Animation.DROP,
             icon: defaultIcon,
             yelp_id: yelp_id,
             id: i
         });
         markers.push(marker);

         vm.location()[i].marker = marker;

         // Two event listeners - one for mouseover, one for mouseout,
         // to change the colors back and forth.
         marker.addListener('mouseover', function() {
             this.setIcon(highlightedIcon);
         });
         marker.addListener('mouseout', function() {
             this.setIcon(defaultIcon);
         });
         marker.addListener('click', function() {
             var self = this;

             //animate marker on click
             this.setAnimation(google.maps.Animation.BOUNCE);
             //kill animation after 1425ms
             setTimeout(function() {
                 self.setAnimation(null);
             }, 1425);

             //filter out other results when clicking on marker
             vm.filterFromList(this.location);
             console.log(this.title);

         });

     }
     showMarkers();
 }

 //make new styled marker
 function makeMarkerIcon(markerColor) {
     var markerImage = new google.maps.MarkerImage(
         'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
         '|40|_|%E2%80%A2',
         new google.maps.Size(21, 34),
         new google.maps.Point(0, 0),
         new google.maps.Point(10, 34),
         new google.maps.Size(21, 34));
     return markerImage;
 };

 // Loop through markers and display them
 function showMarkers() {
     var bounds = new google.maps.LatLngBounds();
     // Extend the boundaries of the map for each marker and display the marker
     for (var i = 0; i < markers.length; i++) {
         markers[i].setMap(map);
         bounds.extend(markers[i].position);
     }
     map.fitBounds(bounds);
 };

 function populateInfoWindow(marker, infowindow) {
     if (infowindow.marker != marker) {
         infowindow.marker = marker;
         infowindow.open(map, marker);
         infowindow.addListener('closeclick', function() {
             infowindow.marker = null;
         });
     }
 };

 var vm = new ViewModel();
 ko.applyBindings(vm);
