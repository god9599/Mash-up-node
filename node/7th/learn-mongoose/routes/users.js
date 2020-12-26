const express = require('express');
const User = require('../schemas/user');
const Comment = require('../schemas/comment');

const router = express.Router();

router.route('/')
    .get(async (req, res, next)=>{
        try{
            const users = await User.find({});
            res.json(users);
        }catch(err){
            console.error(err);
            next(err);
        }
    })
    // 사용자를 등록할 때 먼저 모델.create 메서드로 저장한다. 정의한 스키마에 부합하지 않는 데이터를 넣었을 때는 몽구스가 에러를 발생 시킴. _id는 자동으로 생성
    .post(async (req, res, next)=>{
        try{
            const user = await User.create({
                name : req.body.name,
                age : req.body.age,
                married : req.body.married,
            });
            console.log(user);
            res.status(201).json(user);
        }catch(err){
            console.error(err);
            next(err);
        }
    });

// 댓글 다큐먼트를 조회하는 라우터
router.get('/:id/comments', async (req, res, next)=>{
    try{
        // 댓글을 쓴 사용자의 아이디로 댓글을 조회한 뒤 populate 메서드로 관련 있는 컬렉션의 다큐먼트를 불러옴
        // Comment 스키마 commenter 필드의 ref가 User로 해놨으므로 알아서 users 컬렉션에서 사용자 다큐먼트를 찾아서 합침
        const comments = await Comment.find({commenter : req.params.id})
            .populate('commenter');
        console.log(comments);
        res.json(comments);
    }catch(err){
        console.error(errr);
        next(err);
    }
});

module.exports = router;
