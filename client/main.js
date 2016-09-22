import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

Template.experiment.onCreated(function () {
  Meteor.subscribe("Games");
  Meteor.subscribe("Users");

  this.guessSubReady = new ReactiveVar(false);

  // Subscribe to guesses, but stop when template is destroyed
  this.autorun( () => {
    // Only react to the game id changing.
    const game = Games.findOne({}, {fields: {_id: 1}});
    const gameId = game && game._id;
    if (!gameId) return;

    this.guessSubReady.set(false);
    console.log("Fetching new game");
    Meteor.subscribe("Guesses", gameId, () => {
      this.guessSubReady.set(true);
      console.log("Ready");
    });
  });
});

Template.experiment.helpers({
  guessesReady: function() {
    return Template.instance().guessSubReady.get();
  }
});

Template.testForm.events({
  'submit form': function(e) {   //#guess .guess
    e.preventDefault();
    const n_p = parseInt(e.target.public.value);
    const n_v = parseInt(e.target.private.value);
    const incentive = e.target.incentive.value;
    const delphi = e.target.delphi.checked;

    Meteor.call("newGame", n_p, n_v, incentive, delphi);
  },
  'click .reset-payoffs': function() {
    Meteor.call("resetPayoffs");
  }
});

 Template.survey.events({
   'submit .survey': function (e) {
     e.preventDefault();
     var results = {
       confusing: e.target.confusing.value,
       feedback: e.target.feedback.value};
       TurkServer.submitExitSurvey(results);
   }
 });

Template.home.events({
  // 'click button': function (e) {
  //   // Start the game from client
  //   Meteor.call('Start');
  // }
});

Meteor.methods({
  flip: function(){
    //Animate: flip a coin and show H / T
  }
});

