const express = require('express');
const axios = require('axios');
const { token } = require('morgan');
const { precompile } = require('nunjucks');
const cors = require('cors');


const router = express.Router();
const URL = 'http://localhost:8002/v2';

router.use(cors({
    credentials : true,
}));

axios.defaults.headers.origin = 'http://localhost:4000'; // origin 헤더 추가
const request = async(req, api) => {
    try {
        if(!req.session.jwt){
            const tokenResult = await axios.post(`${URL}/token`, {
                clientSecret : process.env.CLIENT_SECRET,
            });
            req.session.jwt = tokenResult.data.token; //세션에 토큰 저장
        }
        return await axios.get(`${URL} ${api}`, {
            headers : {authorization: req.session.jwt},
        }); // API 요청
    }catch(error){ // 토큰 만료 시 토큰 재발급 받기
        if (error.response.status === 419){
            delete req.session.jwt;
            return request(req, api);
        }// 419 외 다른 에러
        return error.response;
    }
};

router.get('/mypost', async(req, res, next) => {
    try{
        const result = await request(req, '/posts/my');
        res.json(result.data);
    } catch(error){
        console.error(error);
        next(error);
    }
});

router.get('/search/:hashtag', async (req, res, next) => {
    try{
        const result = await request(
            req, `/post/hashtag/${encodeURIComponent(req.params.hashtag)}`,
        );
        res.json(result.data);
    }catch(error){
        if(error.code){
            console.error(error);
            next(error);
        }
    }
});

router.get('/', (req, res) => {
    res.render('main', { key: process.env.CLIENT_SECRET });    
});



module.exports = router;