# Mongoose

노드와 몽고디비를 연동해줄 뿐만 아니라 쿼리를 만들어주는 라이브러리이다.

* 몽구스는 시퀄라이즈와 달리 ODM(Object Document Mapping)이라고 불린다. 몽고디비는 relation이 아니라 document를 사용하기 때문이다.
* 몽고디비 자체가 이미 자바스크립트인데도 굳이 자바스크립트 객체와 매핑하는 이유는 몽고디비에 없어서 불편한 기능들을 몽구스가 보완해주기 때문이다.
  * 먼저 스키마라는 것이 생긴다. 몽고디비는 테이블이 없어서 자유롭게 데이터를 넣을 수 있지만, 때로는 자유로움이 불편함을 초래한다. 실수로 잘못된 자료형의 데이터를 넣을 수도 있고, 다른 다큐먼트에는 없는 필드의 데이터를 넣을 수도 있다. 

> 몽구스는 몽고디비에 데이터를 넣기 전에 노드 서버 단에서 데이터를 한 번 필터링하는 역할을 한다.

* MySQL에 있는 JOIN 기능을 populate메서드로 어느 정도 보완한다. 따라서, 관계가 있는 데이터를 쉽게 가져올 수 있다.



#### 스키마 정의

schemas 폴더에 user.js와 comment.js를 만든다. (예시)

```javascript
// schemas/user.js

// Schema 생성자를 사용해 스키마를 만든다. 필드를 각각 정의

const monoose = require('mongoose');

const {Schema} = monoose;

const userSchema = new Schema({
    name : {
        type : String,
        required : true,
        unique : true,
    },
    age : {
        type : Number,
        required : true,
    },
    married : {
        type : Boolean,
        required : true,
    },
    comment : {
        type : String,
    },
    createdAt : {
        type : Date,
        default : Date.now,
    },
});

// 마지막에는 몽구스의 model 메서드로 스키마와 몽고디비 컬렉션을 연결하는 모델을 만든다.
module.exports = monoose.model('User', userSchema);
```

* 몽구스는 알아서 _id를 기본 키로 생성하므로 적어줄 필요가 없다.

```javascript
// schemas/comment.js
const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types:{objectId}} = Schema;
const commentSchema = new Schema({
    commenter : {
        type : objectId,
        required : true,
        ref : 'User',
    },
    comment : {
        type : String,
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now,
    },
});

module.exports = mongoose.model('Comment', commentSchema);
```

* commenter 속성만 봐보자.
  * 자료형이 ObjectId이다. 옵션으로 ref 속성의 값이 User로 주어져 있다. commenter 필드에 User 스키마의 사용자 ObjectId가 들어간다는 뜻이다. 
  * 나중에 몽구스가 JOIN과 비슷한 기능을 할 때 사용된다.



#### 컬렉션 이름 바꾸기

몽구스는 model 메서드의 첫 번째 인수로 컬렉션 이름을 만든다. 첫 번째 인수가 User라면 첫 글자를 소문자로 만든 뒤 복수형으로 바꿔서 users 컬렉션을 생성한다. 이러한 강제 개명이 싫다면 세 번째 인수로 컬렉션 이름을 주자

```javascript
mongoose.model('User', userSchema, 'user_table')
```

