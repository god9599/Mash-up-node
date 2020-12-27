# 로컬 로그인 구현

로컬 로그인이란 다른 SNS 서비스를 통해 로그인하지 않고 자체적으로 회원가입 후 로그인하는 것을 의미한다. 즉, 아이디/비밀번호 또는 이메일/비밀번호를 통해 로그인하는 것이다.

* passport에서 이를 구현하려면 passport-local 모듈이 필요하다.

<br>

라우터에 접근 권한을 제어하는 미들웨어가 필요하다. 

* 로그인한 사용자는 회원가입과 로그인 라우터에 접근 no
* 로그인하지 않은 사용자는 로그아웃 라우터에 접근 no
* 미들웨어를 만들어보며 passport가 req객체에 추가해주는 req.isAuthenticated 메서드를 사용한다

```javascript
// routes/middleware.js
exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        next();
    }else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};
```

* passport는 req 객체에 isAuthenticated 메서드를 추가한다. 로그인 중이면 req.isAuthenticate()가 true이고, 그렇지 않으면 false이다. 따라서 로그인 여부를  이 메서드로 파악할 수 있다.





### 로컬 로그인 전략

```javascript
// passport/localStrategy.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
    }, async(email, password, done)=>{
        try{
            const exUser = User.findOne({where : {email} });
            if(exUser){
                const result = await bcrypt.compare(password, exUser.password);
                if(result){
                    done(null, exUser);
                }else{
                    done(null, false, {message:'비밀번호가 일치하지 않습니다.'});
                }
            }else{
                done(null, false, {message : "가입되지 않은 회원입니다."});
            }
        }catch(eror){
            console.error(error);
            done(error);
        }   
    }));
};
```

* LocalStrategy 생성자의 첫 번째 인수로 주어진 객체는 전략에 관한 설정을 하는 곳이다. 
  * usernameField와 passwordField에는 일치하는 로그인 라우터의 req.body 속성명을 적는다.
* async 함수는 실제 전략을 수행한다. LocalStrategy 생성자의 두 번째 인수로 들어간다. 첫 번째 인수에서 넣어준 email과 password는 각각 async 함수의 첫 번째, 두 번째 매개변수가 된다.
<br>

>  위 코드는 먼저 사용자 데이터베이스에서 일치하는 이메일이 있는 지 찾은 후 있다면, bcrypt의 compare 함수로 비밀번호를 비교한다. 비밀번호까지 일치한다면 done 함수의 두 번째 인수로 사용자 정보를 넣어 보낸다. 두 번째 인수를 사용하지 않는 경우는 로그인에 실패했을 때 뿐이다. done 함수의 첫 번째 인수는 서버 쪽에서 에러가 발생했을 때고, 세 번째 인수를 사용하는 경우는 로그인 처리 과정에서 비밀번호가 일치하지 않거나 존재하지 않은 회원일 때와 같은 사용자 정의 에러가 발생했을 때이다.



<br>
<br>
<br>


# 카카오 로그인 구현

카카오 로그인이란 로그인 인증 과정을 카카오에 맡기는 것을 뜻한다. 사용자는 번거롭게 사이트에 회원가입하지 않다고 되고, 서비스 제공자는 로그인 과정을 검증된 SNS에 안심하고 맡길 수 있어 좋다.

<BR>

SNS 로그인의 특징은 회원가입 절차가 없다는 것이다. 처음 로그인 할 때는 회원가입 처리를 해야하고, 두 번째 로그인부터는 로그인 처리를 해야한다. 따라서 로컬 로그인 전략보다 복잡하다.

```javascript
// passport/kakaoStrategy.js

const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports= () => {
    passport.use(new kakaoStrategy({
        clientID : process.env.KAKAO_ID,
        callbackURL : '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done)=>{
        console.log('kakao profile', profile);
        try{
            const exUser = await User.findOne({
                where : {snsId : profile.id, provider : 'kakao'},
            });
            if(exUser){
                done(null, exUser);
            }else{
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
```

<br>



라우터는 비교적 간단하다.

```javascript
// routes/auth.js

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao',{
    failureRedirect : '/', // 로그인에 실패했을 때를 속성에 적은 것임
}), (req, res)=>{
    res.redirect('/'); // 로그인에 성공했을 때 이동
});
```

