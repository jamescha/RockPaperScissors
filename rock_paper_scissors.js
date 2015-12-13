Games = new Mongo.Collection("Games");
Router.route('/', function () {
  this.render('welcomePage');
});

Router.route("/playerOne");
Router.route("/playerTwo");
Router.route("/gameResults");

function checkWinner(playerOne, playerTwo) {
  if (playerOne === playerTwo) {
    return "Tie";
  }
  if (playerOne === "rock") {
    if (playerTwo === "paper") {
      return "Player Two";
    }
  } else if (playerOne === "paper") {
    if (playerTwo === "scissors") {
      return "Player Two";
    }
  } else if (playerOne === "scissors") {
    if (playerTwo === "rock") {
      return "Player Two";
    }
  } else {
    return undefined;
  }
  return "Player One";
}

if (Meteor.isClient) {

  Template.playerOne.events({
    'click button': function (event) {
      var whichButton = event.target.id;
      var gameFound = Games.findOne({playerOne: false});
      //If a game is found that playerTwo has done but playerOne has not
      //Else make a new game
      if (gameFound != null) {
        Games.update(gameFound._id,
                     {$set: {playerOne: whichButton,
                             winner:checkWinner(whichButton,
                                                gameFound.playerTwo)}});
        var resultGame = Games.findOne(gameFound._id);
        Session.set("playerOneGameId", gameFound._id);
      } else {
        var  gameId = Games.insert({gameNumber: Games.find().count() + 1,
                                    playerOne: whichButton,
                                    playerTwo: false,
                                    winner: false,
                                    timeStamp: event.timeStamp
                                  });
        Session.set("playerOneGameId", gameId);
      }
    }
  });

  Template.playerTwo.events({
    'click button': function (event) {
      var whichButton = event.target.id;
      var gameFound = Games.findOne({playerTwo: false});
      //If a game is found that playerTwo has done but playerTwo has not
      //Else make a new game
      if (gameFound != null) {
        Games.update(gameFound._id,
                     {$set: {playerTwo: whichButton,
                             winner:checkWinner(gameFound.playerOne,
                                                whichButton)}});
        var resultGame = Games.findOne(gameFound._id);
        Session.set("playerTwoGameId", resultGame._id);
      } else {
        var gameId = Games.insert({ gameNumber: Games.find().count() + 1,
                                    playerOne: false,
                                    playerTwo: whichButton,
                                    winner: false,
                                    timeStamp: event.timeStamp
                                  });
        Session.set("playerTwoGameId", gameId);
      }
    }
  });

  Template.playerOne.helpers({
    yourChoice: function () {
      var playerOneGameId = Session.get("playerOneGameId");
      var currentGame = Games.findOne(playerOneGameId);
      var playerOne = currentGame.playerOne;
      switch (playerOne) {
        case "rock":
          return '/rock.png';
        case "paper":
          return '/paper.svg';
        case "scissors":
          return '/scissors.png';
        default:
          break;
      }
    },
    choice: function () {
      var playerOneGameId = Session.get("playerOneGameId");
      var currentGame = Games.findOne(playerOneGameId);
      var playerTwo = currentGame.playerTwo;
      switch (playerTwo) {
        case "rock":
          return '/rock.png';
        case "paper":
          return '/paper.svg';
        case "scissors":
          return '/scissors.png';
        default:
          break;
      }
    },
    winner: function () {
      var playerOneGameId = Session.get("playerOneGameId");
      var currentGame = Games.findOne(playerOneGameId);
      var theWinner = currentGame.winner;
      switch (theWinner) {
        case "Player One":
          return "You Win!";
        case "Player Two":
          return "You Lose!";
        case "Tie":
          return "You Tied!";
        default:
          return "";
      }
    }
  });

  Template.playerTwo.helpers({
    yourChoice: function () {
      var playerTwoGameId = Session.get("playerTwoGameId");
      var currentGame = Games.findOne(playerTwoGameId);
      var playerTwo = currentGame.playerTwo;
      switch (playerTwo) {
        case "rock":
          return '/rock.png';
        case "paper":
          return '/paper.svg';
        case "scissors":
          return '/scissors.png';
        default:
          break;
      }
    },
    choice: function () {
      var playerTwoGameId = Session.get("playerTwoGameId");
      var currentGame = Games.findOne(playerTwoGameId);
      var playerOne = currentGame.playerOne;
      switch (playerOne) {
        case "rock":
          return '/rock.png';
        case "paper":
          return '/paper.svg';
        case "scissors":
          return '/scissors.png';
        default:
          break;
      }
    },
    winner: function () {
      var playerTwoGameId = Session.get("playerTwoGameId");
      var currentGame = Games.findOne(playerTwoGameId);
      var theWinner = currentGame.winner;
      switch (theWinner) {
        case "Player One":
          return "You Lose!";
        case "Player Two":
          return "You Win!";
        case "Tie":
          return "You Tied!";
        default:
          return "";
      }
    }
  });

  Template.gameResults.helpers({
    results: function () {
      return Games.find();
    }
  });

  Template.welcomePage.events({
    'click #playerOne': function (event) {
      Router.go('playerOne');
    },

    'click #playerTwo': function (event) {
      Router.go('playerTwo');
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
