Emergency = new Mongo.Collection("emergency" );
// console.log(Meteor.userId());
// console.log(Meteor.user());
if (Meteor.isClient) {
  Session.setDefault('location', []);
  Session.setDefault('selectedPickup', undefined);
  Session.setDefault('iNeedHelp', false);
  Session.setDefault('iDontNeed', false);
  Session.setDefault('isMobile', false);
  // Session.setDefault('position', {"latitude": 34.0131067,'longitude': -118.4951});

  Template.body.helpers({
    'iNeedHelp': function () {
      return Session.get('iNeedHelp');
    },
    'iDontNeed' : function (){
      return Session.get('iDontNeed');
    },
    'isMobile' : function (){
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        Session.set('isMobile', true);
        console.log('THIS IS A MOBILE DEVICE :-)');
      }
      return Session.get('isMobile');
    }
  });

  Template.responderView.helpers({
    'theyAreInNeed': function(){
      console.log(Emergency.find({status: 'pending'}));
      console.log(Emergency.find({status: 'pending'}).collection._docs._map._id);
      return  Emergency.find({status: 'pending'});
      // Session.get('inNeed');
    }
  });

  Template.responderView.events({
    'click button':function(event, template){
      console.log('event', event);
      console.log('moment', moment().startOf().fromNow());
      Session.set('responderMap', event.currentTarget.id);
    }
  });

  Template.responseMap.helpers({
    'responseMap': function(){
      console.log('responseMap', Session.get('responderMap'));
      Session.set('needsHelp',  Emergency.findOne({'_id': Session.get('responderMap')}));
    },
      'mapTwoOptions': function() {
        if (GoogleMaps.loaded() ) {
          return {
            center: new google.maps.LatLng(Session.get('needsHelp').location[1],Session.get('needsHelp').location[0]),
            zoom: 17
          };
        }
      GoogleMaps.ready('mapTwo', function(map){
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(Session.get('needsHelp').location[1],Session.get('needsHelp').location[0]),
          map: map.instance
        });
        markerResponder = new google.maps.Marker({
          position: new google.maps.LatLng(34.016665, -118.488416),
          map: map.instance,
          icon: "/Responder_Icon44px.png"
        });
        var bounds = new google.maps.LatLngBounds();
        var inNeed_point = new google.maps.LatLng(Session.get('needsHelp').location[1],Session.get('needsHelp').location[0]);
        var responder_point = new google.maps.LatLng(34.016665, -118.488416);
        bounds.extend(inNeed_point);
        bounds.extend(responder_point);
        map.fitBounds(bounds);
      });
      GoogleMaps.load();
      }
  })

  Template.doYouNeedHelp.events({
    'click #iNeedHelp': function(){
      console.log('clicked YES');
      Session.set("iNeedHelp", true);
      Session.setDefault('iDontNeed', false);
      function handleSuccess(position){
        // console.log('clicked 4 location',position.coords);
        // console.log('clicked 4 longitude',position.coords.longitude);
        var location = [position.coords.longitude, position.coords.latitude]
        // console.log('location from Jimmy:', location);
        Session.set('location',  location);
        Session.set('position',  position.coords);
        Session.set('lat', Session.get('location')[1]);
        var lat = Session.get('lat');
        Session.set('lng', Session.get('location')[0]);
        var lng = Session.get('lng');
        // console.log('lat & lng',lat , lng);
        GoogleMaps.load();

        Emergency.insert({
            userId  : Meteor.userId(),
            location: location,
            date    : new Date(),
            status  : 'pending'
            });
        GoogleMaps.ready('map', function(map){
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat,lng),
            map: map.instance
          });
        });
        reverseGeocode.getLocation(lat, lng, function(address){
          var AddressObj = reverseGeocode.getAddrObj();
          var address = AddressObj[0].shortName + ' ' + AddressObj[1].shortName + ' ' + AddressObj[2].shortName
             + ' ' + AddressObj[4].shortName + ' ' + AddressObj[6].shortName;
          Session.set('address', address);
          console.log('add:', AddressObj);
        });
      }
      function handleError(err){
        console.log(err);
      }
      window.navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
//
    },
    'click #iDontNeed': function(){
      console.log('clicked NO');
      Session.set('iDontNeed', true);
      Session.set('iNeedHelp', false);
      console.log( 'log iNeedHelp', Session.get('iNeedHelp'));
    }
  });


  Template.requestHelp.helpers({
    location: function () {
      return Session.get('address');
    }
  });

  Template.requestHelp.events({
      'click button': function () {}
          // get the client's coordinates when the button is clicked
        //   function handleSuccess(position){
        //     console.log('clicked 4 location',position.coords);
        //     console.log('clicked 4 longitude',position.coords.longitude);
        //     var location = [position.coords.longitude, position.coords.latitude]
        //     console.log('location from Jimmy:', location);
        //     Session.set('location',  location);
        //     Session.set('position',  position.coords);
        //     console.log(Session.get('location')[0]);
        //
        //     Emergency.insert({
        //         userId  : Meteor.userId(),
        //         location: location,
        //         date    : new Date(),
        //         status  : 'pending'
        //         });
        //     // console.log(Meteor.user());
        //   }
        //   function handleError(err){
        //     console.log(err);
        //   }
        //   window.navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
        //   GoogleMaps.load();
        //
        // }
      });

  Template.helpInRoute.helpers({
    helpInRoute: function(){
        return Emergency.find({status: 'pending'});
        }
    });

    Template.helpInRoute.events({
        'click button': function(evt, tmpl){
            console.log('evt',evt);
            console.log('moment', moment().startOf(evt.timeSince).fromNow());
            Session.set('selectedPickup', evt.target.name)
        }
    });
    Template.selectedPickup.helpers({
            pickup: function(){
                return Pickups.findOne(Session.get('selectedPickup'));
            }
            ,longitude: function(location){
                return location[0];
            }
            ,customer: function(userId){
                return Meteor.users.findOne(userId);
            }
            ,timeSince: function(){
                console.log(moment());
            }
        });

  Accounts.ui.config({
      passwordSignupFields: "USERNAME_AND_EMAIL"
    });

Template.inNeedMap.helpers({
    // geolocationError: function() {
    //   var error = Geolocation.error();
    //   console.log('Geolocation Error', error);
    //   return error && error.message;
    // },
    mapOptions: function() {
      if (GoogleMaps.loaded() ) {
        return {
          center: new google.maps.LatLng(Session.get('location')[1], Session.get('location')[0]),
          zoom: 17
        };
      }
    }
  });

  Template.inNeedMap.onCreated(function() {
    var self = this;

    // GoogleMaps.ready('map', function(map) {
    //   var marker;
    //
    //   // Create and move the marker when latLng changes.
    //   self.autorun(function() {
    //     // var latLng = Session.get('position');
    //     // if (! latLng)
    //     //   return;
    //
    //     // If the marker doesn't yet exist, create it.
    //     // if (! marker) {
    //       marker = new google.maps.Marker({
    //         position: new google.maps.LatLng(latLng.latitude, latLng.longitude),
    //         map: map.instance
    //       });
    //     }
    //     // The marker already exists, so we'll just change its position.
    //     else {
    //       marker.setPosition(latLng);
    //     }
    //
    //     // Center and zoom the map view onto the current position.
    //     map.instance.setCenter(marker.getPosition());
    //     map.instance.setZoom(10);
    //   });
    // });
  });

}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
if(Meteor.isCordova){

  console.log(Session.get('isCordova'));

    // code goes here
}
