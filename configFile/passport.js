
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../Models/Schema');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({usernameField: 'email'},
    async (email, password, done) => {

      try {

        const UserData = await User.findOne({ email: email });

        if(UserData){

            const DataUser = await bcrypt.compare(password, UserData.password);

            if(DataUser){

                console.log("LOGIN SUCCESSFUL");
                return done(null, UserData);

            }else{

                console.log("INCORRECT PASSWORD");
                return done(null, false);

            }

        }

    }catch(err){

        console.error("ERROR:", err);
        return done(err);

    }

    }
  ));

  passport.serializeUser(function(user, done) {
    console.log("user>>>>>>", user);
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    console.log("id>>>>>>", id);
    const user = await User.findById(id);

    console.log("USER<<<<<<", user);
    if(user){
        done(null,user);
    }

  });

  module.exports = passport;








