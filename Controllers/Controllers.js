const User = require('../Models/Schema');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const otpGenerator = require('otp-generator');
const nodeMailer = require('nodemailer');
let OTP = [];

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: 'your.smtp.server',
    port: 465,
    secure: false,
    auth: {
        user: 'masummangukiya1816@gmail.com',
        pass: 'xbtsmlpyhcnokjgx'
    }
})

const isAuthenticated = (req, res, next) => {

    console.log("ISAUTHENTICATED CONTROLLER", req.user);

    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/logIn');
};


const DefaultController = async (req, res) => {
    console.log("DEFAULT CONTROLLER");

    try {

        const loggedInUser = req.user;
        console.log("LOGGED IN USER: ", loggedInUser);

        res.render('index', { user: loggedInUser }); 

    } catch (err) {

        console.error("ERROR: ", err);
        res.render('index', { user: null });

    }
}


const LogInController = (req, res) => {

    console.log("LOGIN CONTROLLER");
    res.render('logIn');

};

const logINCon = (req, res) =>{
    res.redirect('/');
}

const SignUpController = async (req, res) => {

    console.log("SIGNUP CONTROLLER");

    if(req.body.password === req.body.confirmPassword){

        try{

            const hashPassword = await bcrypt.hash(req.body.password, saltRounds);

            const UserData = {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword
            };

            const newUser = new User(UserData);
            await newUser.save();
            console.log("User Data:", UserData);
            res.redirect('/logIn');

        }catch(err){

            console.error("ERROR:", err);
            res.render('signUp', { message: 'An error occurred while signing up. Please try again.' });

        }

    }else{

        console.log("Passwords do not match");
        res.render('signUp', { message: 'Passwords do not match, please try again.' });

    }
};

const LogOutController = (req, res) => {

    console.log("LOGOUT CONTROLLER");

    req.logout(err => {
        if (err) {
          console.error('ERROR : ', err);
          res.redirect('/');
        }
        console.log('LOGGES OUT');
        res.redirect('/logIn');
      });

}

const ProfilePageController = async (req, res) => {
    console.log("PROFILE PAGE CONTROLLER");

    try {

        const loggedInUser = req.user;
        console.log("LOGGED IN USER: ", loggedInUser);

        res.render('profilePage', { user: loggedInUser });

    } catch (err) {
        console.error("ERROR: ", err);
        res.render('index');
    }
}


const ChangePasswordController = (req, res) => {

    console.log("CHANGE PASSWORD CONTROLLER");
    res.render('changePassword');

}

const ChangePasswordFormController = async (req, res) => {

    console.log("CHANGE PASSWORD FORM CONTROLLER");

    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    const user = await User.find(req.user);
    console.log("USER : ", user[0].password);

    const result = await bcrypt.compare(currentPassword, user[0].password);
    console.log("RESULT : ", result);

        if(result){

            if(newPassword == confirmPassword){

                bcrypt.hash(newPassword, saltRounds, async (err, hashPassword) => {

                    console.log("HASH PASSWORD : ", hashPassword);

                    const updatePassword = await User.updateOne({_id: user[0]._id}, {password: hashPassword});
                    console.log("UPDATE PASSWORD : ", updatePassword);
                    res.redirect('/');

                })

            }

        }

        else{
            res.redirect('/changePasswordForm');
        }

        req.logout(err => {
            if (err) {
                console.error('ERROR : ', err);
                return res.redirect('/');
            }
            console.log('Logged out after password change');
            res.redirect('/logIn');
        });

    }

const ForgetPasswordController = (req, res) => {

    console.log("FORGET PASSWORD CONTROLLER");
    res.render('forgetPassword');

}    

const ForgetPasswordFormController = async (req, res) => {

    console.log("FORGET PASSWORD FORM CONTROLLER");

    const email = req.body.email;
    const user = await User.findOne({email});
    console.log("USER EMAIL : ", user);
    const userId = user.id;
    console.log("USER ID : ", userId);

    const link = `http://localhost:3003/changeNewPassword/${userId}`;
    console.log("LINK : ", link);

    
    
    if(email == user.email){
        
        console.log("Email Match");

        const otp = await otpGenerator.generate(4, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
        console.log("OTP : ", otp);

        OTP = otp;
        console.log("OTP : ", OTP);
        
        const mail = {
            from: 'masummangukiya1816@gmail.com',
            to: user.email,
            subject: 'RESET OTP FORM',
            text: `OTP: ${OTP}`
        }
        
        await transporter.sendMail(mail);
        
        console.log("SEND MAIL");
        res.redirect(`/otpConfirm/${userId}`);

        
    }else{
        console.log("Email do not match");
        res.redirect('/forgetPasswordForm');
    }

}



const OTPConfirmController = async (req, res) => {

    const userId = req.params.id;

    console.log("OTP CONFIRM CONTROLLER");

    res.render('otpConfirm', {userId});
    
}

const OTPCofirmFormController = (req, res) => {

    console.log("OTP CONFIRM FORM CONROLLER");
    const userId = req.params.id;

    const otp = req.body.otp;

    if(OTP == otp){
        console.log("OTP Match");
        res.redirect(`/changeNewPassword/${userId}`);
    }else{
        console.log("OTP not match");
    }

}

const ChangeNewPasswordController = (req, res) => {

    console.log("CHANGE NEW PASSWORD CONTROLLER");
    const userId = req.params.id;
    res.render('changePasswordForm', {userId});

}

const ChangeNewPasswordFormController = async (req, res) => {

    console.log("CHANGE NEW PASSWORD FORM CONTROLLER");
    
    const NewPassword = req.body.newPassword;
    const ConfirmPassword = req.body.confirmPassword;
    const userID = req.params.id
    const user = await User.findById(userID);
    console.log("USER : ", user);

    if(NewPassword == ConfirmPassword){
        
        console.log("Password Match");

            bcrypt.hash(NewPassword, saltRounds, async (err, hashPassword) => {

                console.log("HASH PASSWORD : ", hashPassword);

                const updatePassword = await User.updateOne({_id: userID}, {password: hashPassword});
                console.log("UPDATE PASSWORD : ", updatePassword);
                res.redirect('/');

            })

    }else{
        console.log("Password not Match");
    }

}



module.exports = { isAuthenticated, DefaultController, LogInController, SignUpController, ProfilePageController, LogOutController, ChangePasswordController, ChangePasswordFormController, ForgetPasswordController, ForgetPasswordFormController, OTPConfirmController, OTPCofirmFormController, ChangeNewPasswordFormController, ChangeNewPasswordController,logINCon };
