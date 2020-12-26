# 시퀄라이즈 사용

MySQL 작업을 쉽게 할 수 있도록 도와주는 라이브러리이다.

* 시퀄라이즈는 자바스크립트 객체와 데이터베이스의 릴레이션을 매핑해주는 도구이다.
  * MariaDB, PostgreSQL 등 다른 데이터베이스도 같이 쓸 수 있다.





시퀄라이즈에 필요한 sequelize와 sequelize-cli, mysql2 패키지를 설치하자.

* sequelize-cli는 시퀄라이즈 명령어를 실행하기 위한 패키지이고, mysql2는 MYSQL과 시퀄라이즈를 이어주는 드라이버이다.

그 다음 sequelize init 명령어를 호출한다. 그러면 config, models, migrations, seeders 폴더가 생성된다. models 폴더 안의 index.js 내용을 수정하자.

```javascript
models/index.js

const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

module.exports = db;
```

* Sequelize는 시퀄라이즈 패키지이자 생성자이다. config/config.json에서 데이터베이스 설정을 불러온 후 new Sequelize를 통해 MYSQL 연결 객체를 생성한다. 연결 객체를 나중에 재사용하기 위해 db.sequelize에 넣어두었다.





#### MySQL 연결

이제 시퀄라이즈를 통해 익스프레스 앱과 MySQL을 연결해보자. app.js를 생성하고 코드 작성하자.

```javascript
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');

const {sequelize} = require('./models');

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
nunjucks.configure('views',{
    express : app,
    watch : true,
});

sequelize.sync({force:false})
    .then(()=>{
        console.log('database connected');
    })
    .catch((err)=>{
        console.error(err);
    });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(()=>{
    console.log('server start');
});
```

* MySQL과 연동할 때는 config 폴더 안의 config.json 정보가 사용된다. 들어가서 본인의 정보로 수정해주면 된다.





#### 모델 정의

이제 MySQL에서 정의한 테이블을 시퀄라이즈에서도 정의해야 한다. MySQL의 테이블은 시퀄라이즈의 모델과 대응된다. 시퀄라이즈는 모델과 MySQL의 테이블을 연결해주는 역할을 한다. 

> 시퀄라이즈는 기본적으로 모델 이름은 단수형으로 테이블 이름은 복수형으로 사용한다.

예시

```javascript
const express = require('express');
const { STRING } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            name : {
                type : Sequelize.STRING(20),
                allowNull : false,
                unique : true,
            },
            age : {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
            },
            married : {
                type : Sequelize.BOOLEAN,
                allowNull : false,
            },
            comment : {
                type : Sequelize.TEXT,
                allowNull : true,
            },
            created_at : {
                type : Sequelize.DATE,
                allowNull : false,
                defaultValue : Sequelize.NOW,
            },
        },{
            sequelize,
            timestamps : false,
            underscored : false,
            modelName : 'User',
            tableName : 'users',
            paranoid : false,
            charset : 'utf8',
            collate : 'utf8_general_ci',
        });
    }
    static associate(db){}
};
```

* 모델은 크게 static init, static associate로 나뉜다.
* init 메서드에는 테이블에 대한 설정을 하고, associate 메서드에는 다른 모델과의 관계를 적는다.
* 위 super.init 메서드의 첫 번째 인수가 테이블 컬럼에 대한 설정이고, 두 번째 인수가 테이블 자체에 대한 설명이다.
  * 시퀄라이즈의 자료형은 MySQL의 자료형과는 조금 다르다.
    * VARCHAR는 STRING, INT는 INTEGER, TINYINIT는 BOOLEAN, DATETIME은 DATE
    * allowNull은 NOT NULL이다.



이제 index.js와 연동한다.

```javascript
const Sequelize = require('sequelize');
const User = require('./user');


const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

db.User = User;

User.init(sequelize);

User.associate(db);

module.exports = db;
```

* db 객체에 User를 담아두었다. 앞으로 db 객체를 require하여 User 모델에 접근할 수 있다.
* User.init은 각각의 모델의 static.init 메서드를 호출하는 것.
  * init이 실행되어야 테이블이 모델로 연결된다.



#### 관계 정의

예를 들어, 사용자 한 명은 댓글을 여러 개 작성할 수 있다. 하지만 댓글 하나에 사용자가 여러 명일 수는 없다. 이러한 관계를 일대다 관계라고 한다. 다른 관계로 일대일, 다대다 관계가 있다.

* MySQL에서는 JOIN이라는 기능으로 여러 테이블간의 관계를 파악해 결과를 도출한다. 시퀄라이즈는 JOIN 기능도 알아서 구현한다. 대신 테이블 간에 어떠한 관계가 있는지 시퀄라이즈에 알려야 한다.





#### 1:N

시퀄라이즈에서는 1:N 관계를 hasMany 메서드로 표현한다. 

* 예를 들어, 사용자 테이블의 로우 하나를 불러올 때 연결된 댓글 테이블의 로우들도 같이 불러올 수 있다. 

반대로 belongsTo 메서드도 있다.

* 댓글 테이블의 로우를 불러올 때 연결된 사용자 테이블의 로우를 가져온다.

> 다른 모델의 정보가 들어가는 테이블에 belongsTo를 사용한다.

![image](https://user-images.githubusercontent.com/59276134/102595850-a15d2e80-415b-11eb-88d0-23e3150d98b4.png)

* hasMany에서는 sourceKey를 쓰고, belongsTo에서는 targetKey를 쓴다고 보면 된다.



##### 1:1

1:1 관계에서는 hasOne메서드를 사용한다. 사용자 정보를 담고있는 가상의 info 모델이 있다고 하면 다음과 같이 표현 가능하다.

```javascript
db.user.hasOne(db.Info, {foreignKey : 'userId', sourceKey:'id'});
db.user.belongsTo(db.user, {foreignKey : 'userId', targetKey:'id'});
```

* 1:1 관계라고 해도 belongsTo와 hasOne이 반대면 안된다.
  * belongsTo를 사용하는 Info 모델에 UserId 컬럼이 추가되기 때문이다.



##### N:M 

N:M 관계를 표현하기 위한 belongsToMany 메서드가 있다. 

게시글 정보를 담고있는 가상의 Post 모델과 해시태그 정보를 담고 있는 가상의 Hashtag 모델이 있다고 하면 다음과 같이 표현할 수 있다.

```javascript
db.Post.belongsToMany(db.Hashtag, {through:'PostHashtag'});
db.Hashtag.belongsToMany(db.Post, {through:'PostHashtag'});
```

* 양쪽 모델에 모두 belongsToMany 메서드를 사용한다.
* N:M 관계의 특성상 새로운 모델이 생성된다. through 속성에 그 이름을 적으면 된다. 새로 생성된 PostHashtag 모델에는 게시글과 해시태그의 아이디가 저장된다.

> N:M에서 데이터를 조회할 때 여러 단계를 거쳐야 한다.

예를 들어, #노드 해시태크를 사용한 게시물을 조회하는 경우를 생각해보자.

먼저, #노드 해시태크를 Hashtag 모델에서 조회하고, 가져온 태그의 아이디 (1)를 바탕으로 PostHashtag 모델에서 hashtagId가 1인 postId를 찾아 Post 모델에서 정보를 가져온다.
