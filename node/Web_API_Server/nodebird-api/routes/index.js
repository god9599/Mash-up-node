// 도메인 등록, 로그인하지 않으면 로그인 먼저, 로그인한 사용자는 도메인 등록 화면 보여준다.

const express = require('express');
const {v4: uuidv4} = require('uuid');
const {User, Domain, Post, Hashtag} = require('../models');
const {isLoggedIn, verifyToken} = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try{
        const user = await User.findOne({
            where : {id : req.user && req.user.id || null},
            include : {model : Domain},
        });
        res.render('login', {
            user : user,
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

router.get('/posts/my', verifyToken, (req, res) => {
    Post.findAll({ where : {userId : req.decoded.id} })
        .then((posts) => {
            console.log(posts);
            res.json({
                code : 200,
                payload : posts,
            });
        })
        .catch((error) => {
            console.error
            return res.status(500).json({
                code : 500,
                message : '서버 에러',
            });
        });
});

router.get('/posts/hashtag/:title', verifyToken, async (req, res) => {
    try{
        const hashtag = await Hashtag.findOne({ where : {title : req.params.id} });
        if(!hashtag){
            return res.status(404).json({
                code : 404,
                message : '검색 결과가 없습니다.',
            });
        }
        const posts = await hashtag.getPosts();
        return res.json({
            code : 200,
            payload : posts,
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            code : 500,
            message : '서버 에러',
        });
    }
});

module.exports = router;