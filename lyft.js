Pickups = new Mongo.Collection("pickups" );

// console.log(Meteor.userId());
// console.log(Meteor.user());
if (Meteor.isClient) {
  // location starts at 0
  Session.setDefault('location', []);
  Session.setDefault('selectedPickup', undefined);
  Session.setDefault('iNeedHelp', false);
  Session.setDefault('iDontNeed', undefined);

  Template.doYouNeedHelp.events({
    'click #iNeedHelp': function(){
      console.log('clicked YES');
      Session.set("iNeedHelp", true);
    },
    'click #iDontNeed': function(){
      console.log('clicked NO');
      Session.set('iNeedHelp', false);
      Session.set('iDontNeed', true);
    }
  });

  Template.body.helpers({
    'iNeedHelp': function () {
      return Session.get('iNeedHelp');
    },
    "iDontNeed" : function (){
      return Session.get('iDontNeed');
    }
  })



  Template.requestHelp.helpers({
    location: function () {
      return Session.get('location');
    }
  });

  Template.requestHelp.events({
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
  Template.helpInRoute.helpers({
    helpInRoute: function(){
        return Pickups.find({status: 'pending'});
        }
    });

    Template.helpInRoute.events({
        'click button': function(evt, tmpl){
            console.log('evt',evt);
            console.log('moment',moment().startOf(evt.timeSince).fromNow());
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
