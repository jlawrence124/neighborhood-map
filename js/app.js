
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
             yelp: "https://api.yelp.com/v2/business/midwood-smokehouse-charlotte",
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
             yelp: "https://api.yelp.com/v2/business/queen-city-q-charlotte",
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
             yelp: "https://api.yelp.com/v2/business/the-capital-grille-charlotte",
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
             yelp: "https://api.yelp.com/v2/business/rooftop-210-charlotte-2",
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
             yelp: "https://api.yelp.com/v2/business/luckys-bar-and-arcade-charlotte",
             showLocation: ko.observable(true)
         }
     ]
 };

 var Yelp = function(i) {
     var self = this;
     // YELP API AUTHENTICATION
     function nonce_generate() {
         return (Math.floor(Math.random() * 1e12).toString());
     }

     var yelp_url = Model.locationList[i].yelp;

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
         success: function(data) {
             vm.location()[i].data = data;
             vm.location()[i].rating = data.rating_img_url;
             vm.location()[i].review = data.snippet_text;
             vm.location()[i].yelpIMG = data.snippet_image_url;
         },
         error: function(e) {
             // Do stuff on fail
             console.log("YELP Fail!");
             console.log(e.error());
         }
     };
      $.ajax(settings)
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

      //created selected observables
      this.selectedPlace = ko.observable();
      this.selectedName = ko.observable();
      this.selectedImg = ko.observable();

      Model.locationList.forEach(function(data) {
          self.location.push(data);
      });

      //filters markers and list of locations
      this.selectedPlace.subscribe(function(newValue) {
          if (newValue == undefined) {
              // show all markers and locations at start
              self.location().forEach(function(place) {
                  place.showLocation(true);
                  place.marker.setVisible(true);
                  place.marker.infoWindow.close();
                  self.unfilter();
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
      this.filterFromList = function(item) {
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
      this.unfilter = function(item) {
          self.location().forEach(function(place) {
              place.showLocation(true);
              place.marker.setVisible(true);
          })
      };

  };

var initMap = function () {
     var self = this;

     // Create new google map
     map = new google.maps.Map(document.getElementById('map'), {
         center: {
             lat: 35.2271,
             lng: -80.8431
         },
         zoom: 14
     });

     for (var i = 0; i < Model.locationList.length; i++) {
        Yelp(i);
        }

     // Styling the marker
     var defaultIcon = makeMarkerIcon('DC143C');

     // mouse over icon
     var highlightedIcon = makeMarkerIcon('FFFFFF');

     var myInfoWindow = new google.maps.InfoWindow();

     //create an array of markers on initialize
         for (var i = 0; i < vm.location().length; i++) {
             var that = this;

             //get info from location array
             var position = vm.location()[i].latlng,
                 name = vm.location()[i].name,
                 address = vm.location()[i].address,
                 review = vm.location()[i].review,
                 image_url = vm.location()[i].yelpIMG,
                 rating = vm.location()[i].rating,
                 location = vm.location()[i];

             var marker = new google.maps.Marker({
                 position: position,
                 location: location,
                 title: name,
                 animation: google.maps.Animation.DROP,
                 icon: defaultIcon,
                 review: review,
                 id: i,
                 image_url: image_url,
                 infoWindow: myInfoWindow
             });

             //unfilter results when closing infoWindow
             google.maps.event.addListener(marker.infoWindow, 'closeclick', vm.unfilter);

             google.maps.event.addListener(map, "click", function(event) {
                 marker.infoWindow.close();
                 vm.unfilter();
             });

             markers.push(marker);

             vm.location()[i].marker = marker;

             console.log(vm.location()[i].rating);

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

                 vm.selectedImg(this.image_url);

                 this.infoWindow.setContent(
                    // '<div id="info-content">' + '<img src="' + vm.location()[i].review + '"></img></div>"'
                 );

                 this.infoWindow.open(map, this);
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

 //declaring global map variable
 var map,
     infoWindow;

 var markers = [];



 var vm = new ViewModel();
 ko.applyBindings(vm);
