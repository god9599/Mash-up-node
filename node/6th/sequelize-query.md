### 쿼리 알아보기

시퀄라이즈로 CRUD 작업을 하려면 먼저 시퀄라이즈 쿼리를 알아야 한다. 쿼리는 프로미스를 반환하므로 then을 붙여 결괏값을 받을 수 있다. async/await 문법과 같이 사용하 수도 있다.

로우를 생성하는 쿼리부터 보자. 첫 줄은 SQL문이고, 그 아래는 시퀄라이즈 쿼리이다.

```javascript
//SQL
INSET INTO nodejs.users (name, age, married, comment) VALUES ('JOO', 24, 0, '하이요');

//Sequelize Query
const { User } = require('../models');
User.create({
    name : 'joo',
    age : 24,
    married : false,
    comment : '하이요',
});
```



이번에는 로우를 조회하는 쿼리들을 알아보자.

users 테이블의 모든 데이터를 조회하는 SQL문이다. findAll 메서드를 사용하자.

```javascript
// sql
SELECT * FROM nodejs.users;

// Sequelize Query
User.findAll({});
```



users 테이블의 데이터 하나만 가져오는 SQL문이다. 데이터를 하나만 가져올 때는 findOne 메서드를, 여러 개 가져올 때는 findAll 메서드를 사용하자.

```javascript
// sql
SELECT * FROM nodejs.users LIMIT 1;

// Sequelize Query
User.findOne({});
```



attributes 옵션을 사용해서 원하는 컬럼만 가져올 수 있다.

```javascript
// sql
SELECT name, married FROM nodejs.users;

// Sequelize Query
User.findAll({
    attributes:['name', 'married'],
});
```



where 옵션이 조건들을 나열하는 옵션이다.

```javascript
// sql
SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 30;

// Sequelize Query
const {Op} = require('sequelize');
const {User} = require('../models');
User.findAll({
    attributes : ['name', 'age'],
    where:{
        married : true,
        age : {[Op.gt]:30},
    },
});
```

* Op.gt(초과), Op.gte(이상), Op.lt(미만), Op.lte(이하), Op.ne(같지 않음), Op.or(또는), Op.in(배열 요소 중 하나) 등이 있다.



시퀄라이즈의 정렬 방식은 order 옵션으로 가능하다.

```javascript
// sql
SELECT id, name FROM users ORDER BY age DESC;

// Sequelize Query
User.findAll({
    attributes : ['id', 'name'],
    order : [['age','DESC']],
});
```

* 배열 안에 배열이 있다는 점 주의



로우를 수정하는 쿼리

```javascript
// sql
UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;

// Sequelize Query
User.update({
    comment : '바꿀 내용',
},{
    where : {id : 2},
});
```

* update 메서드로 수정 가능. 첫 번째 인수는 수정할 내용, 두 번째 인수는 어떤 로우를 수정할 지에 대한 조건이다.



로우를 삭제하는 쿼리

```javascript
// sql
DELETE FROM nodejs.users WHERE id = 2;

// Sequelize Query
User.destory({
    where : {id : 2},
});
```

* destroy 메서드로 삭제한다. where 옵션에 조건들을 적는다.



관계 쿼리

findOne이나 findAll 메서드를 호출할 때 프로미스의 결과로 모델을 반환한다.

* findAll은 모두 찾는 것이므로 모델의 배열을 반환

```javascript
const user = await User.findOne({});
console.log(user.nick); // user 닉네임
```



편리한 점은 JOIN 기능을 제공한다는 점이다. 만약 특정 사용자를 가져오면서 그 사용자의 댓글을 모두 가져오고 싶다면 include 속성을 사용하면 된다.

```javascript
const user = await User.findOne({
    include : [{
        model : Comment,
    }]
});
console.log(user.Comments); // user 댓글
```

* 어떤 모델과 관계가 있는지를 include 배열에 넣어주면 된다. 배열인 이유는 다양한 모델과 관계가 있을 수 있기 때문이다.
* 댓글은 여러 개일 수 있으므로 user.Comments로 접근 가능하다.

또는 아래와 같이 댓글에 접근할 수 있다.

```javascript
const user = await User.findOne({});
const comments = await user.getComments();
console.log(comments); // 사용자 댓글
```

* 관계를 설정했다면 getComments(조회)외에도 setComments(수정), addComment(하나 생성), addComments(여러 개 생성), removeComments(삭제) 메서드를 지원한다.
  * 동사 뒤 모델 이름을 바꾸고 싶다면 관계 설정 시 as 옵션을 사용하면 된다.

```javascript
// 관계 설정할 때 as로 등록
db.User.hasMany(db.Comment, {foreignKey:'commenter', sourceKey:'id', as : 'Answers'});

const user = await User.findOne({});
const comments = await user.getAnswers();
console.log(comments); //사용자 댓글
```

* as를 설정하면 include시 추가되는 댓글 객체도 user.Answers로 바뀐다.



##### SQL 쿼리하기

시퀄라이즈의 쿼리를 사용하기 싫거나, 모른다면 직접 SQL문을 통해 쿼리할 수도 있다.

```javascript
const [result, metadata] = await sequelize.query('SELECT * from comments');
console.log(result);
```

