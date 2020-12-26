const express = require('express');
const User = require('../schemas/user');

const router = express.Router();

//모든 사용자를 찾은 뒤, mongoose.html을 렌더링할 때 users 변수로 넣는다. 
router.get('/', async (req, res, next)=>{
    try{
        const users = await User.find({});
        res.render('mongoose', {users});
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;
