const express = require('express');
const Comment = require('../schemas/comment');

const router = express.Router();

// 다큐먼트를 등록하는 라우터 Comment.create 메서드로 댓글을 저장. 그 후 populate 메서드로 프로미스의 결과로 반환된 comment 객체에 다른 컬렉션 다큐먼트를 불러옴
router.post('/', async (req, res, next)=>{
    try{
        const comment = await Comment.create({
            commenter : req.body.id,
            comment : req.body.comment,
        });
        console.log(comment);
        const result = await Comment.populate(comment, {path:'commenter'});
        res.status(201).json(result);
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.route('/:id')
// 다큐먼트를 수정하는 라우터
    .patch(async (req, res, next)=>{
        try{
            const result = await Comment.update({
                _id : req.params.id, //어떤 다큐먼트를 수정할 지 나타낸 쿼리 객체
            },{
                comment : req.body.comment, // 수정할 필드와 값이 들어있는 객체
            });
            res.json(result);
        }catch(err){
            console.error(err);
            next(err);
        }
    })
    // 다큐먼트를 삭제하는 라우터
    .delete(async (req, res, next)=>{
        try{
            // 어떤 다큐먼트를 삭제할지에 대한 조건(첫 번째 인수)
            const result = await Comment.remove({_id:req.params.id});
            res.json(result);
        }catch(err){
            console.error(err);
            next(err);
        }
    });

module.exports = router;


