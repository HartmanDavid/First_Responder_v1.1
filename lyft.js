Pickups = new Mongo.Collection("pickups" );

// console.log(Meteor.userId());
// console.log(Meteor.user());
if (Meteor.isClient) {
  // location starts at 0
  Session.setDefault('location', []);
  Session.setDefault('selectedPickup', undefined);

  Template.requestPickup.helpers({
    location: function () {
      return Session.get('location');
    }
  });

  Template.requestPickup.events({
      'click button': function () {
          // get the client's coordinates when the button is clicked
          function handleSuccess(position){
            console.log(position.coords);
            var location = [position.coords.longitude, position.coords.latitude]
            Session.set('location',  location);
            Pickups.insert({
                userId  : Meteor.userId(),
                location: location,
                date    : new Date(),
                status  : 'pending'
                });
            // console.log(Meteor.user());
          }
          function handleError(err){
            console.log(err);
          }
          window.navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
        }
      });
  Template.pendingPickups.helpers({
    pendingPickups: function(){
        return Pickups.find({status: 'pending'});
        }
    });

    Template.pendingPickups.events({
        'click button': function(evt, tmpl){
            console.log(evt);
            console.log(moment().startOf(evt.timeSince).fromNow());
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
}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
if (Meteor.isCordova){
  Template.requestPickup.events({
      'click button': function () {
          // get the client's coordinates when the button is clicked
          function handleSuccess(position){
            console.log(position.coords);
            var location = [position.coords.longitude, position.coords.latitude]
            Session.set('location',  location);
            Pickups.insert({
                userId  : Meteor.userId(),
                location: location,
                date    : new Date(),
                status  : 'pending'
                });
            // console.log(Meteor.user());
          }
          function handleError(err){
            console.log(err);
          }
          window.navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
        }
      });

}
