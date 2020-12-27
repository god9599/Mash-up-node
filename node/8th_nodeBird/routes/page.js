const express = require('express');
const { isLoggedIn, isNotLoggedIn} = require('./middlewares');

const router = express.Router();

//res.locals로 값을 설정한 이유는 변수를 모든 템플릿 엔진에서 공통으로 사용하기 때문
router.use((req, res, next)=>{
    res.locals.user = req.user;
    res.locals.follwerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
    next();
});

router.get('/profile', isLoggedIn, (req, res)=>{
    res.render('profile', {title : '내 정보 - NodeBird'});
});

router.get('/join', isNotLoggedIn, (req, res)=>{
    res.render('join', {title : '회원가입 - NodeBird'});
});

router.get('/', (req, res, next)=>{
    const twists = [];
    res.render('main',{
        title : 'NodeBird',
        twists,
    });
});

module.exports = router;