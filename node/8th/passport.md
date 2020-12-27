# passport

한글로 여권이다. 말 그대로 이름처럼 자신의 웹 사이트에 방문할 때 여권같은 역할을 한다.

* 로그인을 쉽게 할 수 있게 도와준다.
* passport-local은 로그인을 직접 구현할 때 사용된다.
* 이외에 passport-google-oauth, passport-facebook, passport-twitter, passport-kakao, passport-naver와 같이 SNS 계정을 통해서 바로 로그인을 할 수 있는 패키지도 있다.
* express-session은 passport로 로그인 후 유저 정보를 세션에 저장하기 위해 사용한다.

* passport.intialize 미들웨어는 req 객체에 passport 설정을 심는다.
* passport.session 미들웨어는 req.session 객체에 passport 정보를 저장한다.
  * req.session 객체는 express-session에서 생성하는 것이므로 passport 미들웨어는 express-session 미들웨어보다 뒤에 연결해야 한다.
<br>
<hr>
<br>
<br>

```javascript
// passport/index.js
const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });

    passport.deserializeUser((user, done)=>{
        User.findOne({where:{id}})
          .then(user => done(null, user))
          .catch(err => done(err));
    });

    local();
    kakao();
};
```


모듈 내부를 보면 passport.serialUser와 passport.deserializeUser가 있다. 이 부분이 핵심이다.

serializeUser는 로그인 시 실행되며, req.session 객체에 어떤 데이터를 저장할 지 정하는 메서드이다.

매개변수로 user를 받고 나서, done 함수에 두 번째 인수로 user.id로 넘기고 있다. 사용자 정보가 들어

있다고 생각하자.  done 함수의 첫 번째 인수는 에러 발생 시 사용하는 것이고, 두 번째 인수에는 저장

하고 싶은 데이터를 넣는다. 세션에 사용자 정보를 저장하면 세션의 용량이 커지고 데이터 일관성에

문제가 발생하므로 사용자의  아이디만 저장하는 것이다.

deserializeUser는 매 요청 시 실행된다. passport.session 미들웨어가 이 메서드를 호출한다. 

seriializeUser의 done의 두 번째 인수로 넣었던 데이터가 deserializeUser의 매개변수가 된다.

serializeUser에서 세션에 저장했던 아이디를 받아 데이터베이스에서 사용자 정보를 조회한다. 

조회한 정보를 req.user에 저장하므로 앞으로 req.user를 통해 사용자의 정보를 가져올 수 있다. 


<br>


위에 설명을 간단히 정리해보자.

> serializeUser는 사용자 정보 객체를 세션에 아이디로 저장하는 것이고, deserializeUser는 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것이다. 세션에 불필요한 데이터를 담아두지 않기 위한 과정이다.

<br>

#### 전체 과정

1. 라우터를 통해 로그인 요청이 들어옴.
2. 라우터에서 passport.authenticate 메서드 호출
3. 로그인 전략 수행
4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
5. req.login 메서드가 passport.serializeUser 호출
6. req.session에 사용자 아이디만 저장
7. 로그인 완료

<br>

#### 다음은 로그인 이후의 과정

1. 요청이 들어옴
2. 라우터에 요청이 도달하기 전에 passport.session 미들웨어가 passport.deserializeUser 호출
3. req.session에 저장된 아이디로 데이터베이스에서 사용자 조회
4. 조회된 사용자 정보를 req.user에 저장
5. 라우터에서 req.user 객체 사용 가능

<br>
<br>

### Strategy

위 코드에서 localStrategy와 kakaoStrategy 파일은 각각 로컬 로그인과 카카오 로그인 전략에 대한 파일이다. passport는 로그인 시의 동작을 전략(strategy)이라는 용어로 표현한다. 로그인 과정을 어떻게 처리할 지 설명하는 파일이라고 생각하면 된다.

* 모든 passport의 플러그인들은 사용하려면 전략을 짜 주어야 한다.