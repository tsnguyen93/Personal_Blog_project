Tweets = new Mongo.Collection('tweets');


if (Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  Template.body.helpers({
    tweets: function() {
      return Tweets.find({}, {
        sort: { createdAt: -1} //descending order
      });
    }
  });

  Template.tweet.helpers({
    time: function () {
      return moment(this.createdAt).fromNow();
    },
    username: function () {
      return Meteor.users.findOne(this.userId).username;
    },
    current_user: function () {
      return Meteor.user()._id === this.userId;
    }
  });


  Template.body.events({
    'submit .new-tweet': function (event) {
      event.preventDefault();

      Meteor.call('createTweet', event.target.text.value);
      //Tweets.insert({
        //text: event.target.text.value,
        //createdAt: new Date(),
        //userId: Meteor.user()._id
      //});
      event.target.text.value ='';
    }
  });

  Template.tweet.events({
    'click .delete-tweet': function(event){
      //Tweets.remove(this._id);
      Meteor.call('deleteTweet', this._id);
    }
  });

  Template.tweet.events({
	  'click .update-tweet': function(event){
	   Tweets.update(
	   this._id,
	   {
		   $set: {"text": "edit test"}
	   });
		  
	}
  });

}



if (Meteor.isServer) {

}

Meteor.methods({
  createTweet: function (text) {
    if (!Meteor.userId()) throw new Meteor.Error('not-authorized');
    Tweets.insert({
      text: text,
      createdAt: new Date(),
      userId: Meteor.user()._id
    });
  },

  deleteTweet: function (tweetId) {
    Tweets.remove(tweetId);
  }
});

