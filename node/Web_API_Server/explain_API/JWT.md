# JWT(JSON Web Token)

* JSON 형식의 데이터를 저장하는 토큰
* JWT는 다음과 같이 세 부분으로 구성되어 있다.

1. 헤더 : 토큰 종류와 해시 알고리즘 정보가 들어있다.
2. 페이로드 : 토큰의 내용물이 인코딩된 부분
3. 시그니처 : 일련의 문자열이며, 시그니처를 통해 토큰이 변조되었는지 여부를 확인할 수 있다. 시그니처는 JWT 비밀 키로 만들어 진다. 이 비밀 키가 노출되면 JWT 토큰을 위조할 수 있으므로 비밀 키를 철저하게 숨겨야 한다.

* JWT에는 민감한 내용을 넣으면 안된다. 내용을 볼 수 있기 때문이다.

<BR>

내용이 노출되는 토큰을 왜 사용할까?

- 모순적이지만 내용이 들어있기 때문이다. 변조한 토큰은 시그니처를 비밀 키를 통해 검사할 때 들통이 난다. 변조할 수 없으므로 내용물이 바뀌지 않았는지 걱정할 필요가 없다. 내용물을 믿고 사용할 수가 있다. 단, 외부에 노출되어도 좋은 정보에 한해서 이다.

<BR>

JWT 토큰의 단점은 용량이 크다는 것이다. 내용물이 들어 있으므로 랜덤한 토큰을 사용할 떄와 비교해서 용량이 클 수밖에 없다. 매 요청 시 토큰이 오고 가서 데이터 양이 증가한다.

<br>

웹 서버에서 JWT 토큰 인증과정을 구현하기 위해 먼저 JWT 모듈을 설치해야 한다.

* npm i jsonwebtoken

```javascript
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    try{
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    }catch(error){
        if(error.name == 'TokenExpiredError'){ //유효기간 초과
            return res.status(419).json({
                code : 419,
                message : '토큰이 만료되었습니다.',
            });
        } 
        return res.status(401).json({
            code : 401,
            message : '유효하지 않은 토큰입니다.',
        });
    }
};
```

* 요청 헤더에 저장된 토큰(req.headers.authorization)을 사용한다. 사용자가 쿠키처럼 헤더에 토큰을 넣어 보낼 것이다. jwt.verify 메서드로 토큰을 검증할 수있다.
* 메서드의 첫 번쨰 인수로는 토큰을, 두 번째 인수로는 토큰의 비밀키를 넣는다.

* 토큰의 비밀 키가 일치하지 않는다면 인증을 받을 수 없다. 그런 경우에 에러가 발생해서 catch문으로 이동하게 된다. 또한, 올바른 토큰이더라도 유효 기간이 지난 경우라면 역시 catch문으로 이동한다.
* 인증에 성공한 경우에는 토큰의 내용이 반환되어 req.decoded에 저장된다. 토큰의 내용은 조금 전에 넣은 사용자의 아이디와 닉네임, 발급자, 유효 기간 등이다. req.decoded를 통해 다음 미들웨어에서 토큰의 내용물을 사용할 수 있다.

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');

const {verifyToken} = require('./middlewares');
const {Domain, User} = require('../models');

const router = express.Router();

// 토큰 발급 라우터
router.post('/token', async (req, res)=>{
    const {clientSecret} = req.body;
    try {
        const domain = await Domain.findOne({
            where : {clientSecret},
            include : {
                model : User,
                attribute : ['nick', 'id'],
            },
        });
        if(!domain){
            return res.status(401).json({
                code : 401,
                message : '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
            });
        }
        // jwt.sign 메서드로 토큰 발급
        const token = jwt.sign({
            id : domain.User.id,
            nick : domain.User.nick,
        }, process.env.JWT_SECRET, {
            expiresIn : "1m", //1분
            issuer : 'nodebird',
        });
        return res.json({
            code : 200,
            message : '토큰이 발급되었습니다.',
            token,
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            code : 500,
            message : '서버 에러',
        });
    }
});

// 사용자가 토큰 테스트해볼 수 있는 라우터
router.get('/test', verifyToken, (req, res)=>{
    res.json(req.decoded);
});

module.exports = router;
```

* 토큰을 발급하는 라우터와 사용자가 토큰을 테스트해볼 수 있는 라우터가 있다.
* jwt.sign 메서드를 주목해보자.
  * sign 메서드의 첫 번쨰 인수는 토큰의 내용이다. 사용자의 아이디와 닉네임이 있다. 두 번째 인수는 토큰의 비밀 키이다. 이 비밀키가 유출되면 다른 사람이 서비스의 토큰을 임의로 만들어 낼 수 있으므로 조심하자. 세 번째 인수는 토큰의 설정이다. 

* test 라우터는 토큰을 검증하는 미들웨어를 거친 후, 검증이 성공했다면 토큰의 내용물들을 응답으로 보낸다.



> 최근에 JWT 토큰을 사용해서 로그인하는 방법이 많이 사용된다. 세션을 사용하지 않고 로그인 할 수 있기 때문이다. 로그인 완료 시 세션에 데이터를 저장하고 세션 쿠키를 발급하는 대신 JWT 토큰을 쿠키로 발급하면 된다.

```javascript
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', {session : false}, (authError, user, info) => {
        if(authError)
            // ...
    })
})
```

* authenticate 메서드 두 번째 인수로 옵션을 주면 세션을 사용하지 않는다.