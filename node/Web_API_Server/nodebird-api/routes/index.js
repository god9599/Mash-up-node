// 도메인 등록, 로그인하지 않으면 로그인 먼저, 로그인한 사용자는 도메인 등록 화면 보여준다.

const express = require('express');
const {v4: uuidv4} = require('uuid');
const {User, Domain} = require('../models');
const {isLoggedIn} = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try{
        const user = User.findOne({
            where : {id : req.user && req.user.id || null},
            include : {model : Domain},
        });
        res.render('login', {
            user,
            domains : user && user.Domains,
        });
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.post('/domain', isLoggedIn, async(req, res, next) => {
    try{
        await Domain.create({
            UserId : req.user.id,
            host : req.body.host,
            type : req.body.type,
            clientSecret : uuidv4(),
        });
        res.redirect('/');
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;