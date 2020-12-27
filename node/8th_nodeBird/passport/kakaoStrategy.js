const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports= () => {
    passport.use(new kakaoStrategy({
        clientID : process.env.KAKAO_ID, // 카카오에서 발급해주는 아이디, 노출되지 않아야 함.
        callbackURL : '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done)=>{
        console.log('kakao profile', profile);
        try{
            const exUser = await User.findOne({
                where : {snsId : profile.id, provider : 'kakao'},
            });
            if(exUser){ // 기존에 카카오를 통해 회원가입한 사용자가 있는 지 조회 
                done(null, exUser); // 이미 있다면 사용자 정보와 함께 done 함수를 호출하고 전략을 종료
            }else{ // 기존에 없다면 회원가입을 진행
                const newUser = await User.create({
                    email : profile._json && profile._json.kakao_account_email,
                    nick : profile.displayName,
                    snsId : profile.id,
                    provider : 'kakao',
                });
                done(null, newUser);
            }
        }catch(error){
            console.error(error);
            done(error);
        }
    }));
};