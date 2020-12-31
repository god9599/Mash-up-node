const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const User = require('../models');

const router = express.Router();

router.post('/join', isNotLoggedIn, async(req, res, next)=>{
    const {email, nick, password} = req.body;
    try{
        const exUser = await User.find({where:{email}});
        if(exUser){
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email : email,
            nick : nick,
            password : hash,
        });
        return res.redirect('/');
    }catch(error){
        console.error(error);
        return next(error);
    }
});


router.post('/login', isNotLoggedIn, (req, res, next)=>{
    passport.authenticate('local', (authError, user, info)=>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어
});

router.get('/logout', isLoggedIn, (req, res, next)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/');
});


router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao',{
    failureRedirect : '/', // 로그인에 실패했을 때를 속성에 적은 것임
}), (req, res)=>{
    res.redirect('/'); // 로그인에 성공했을 때 이동
});

module.exports = router;

// app.js와 연결할 때 /auth 접두사를 붙일 것이므로 주소는 각각 /auth/join, /auth/login, /aith/logout이 된다.
