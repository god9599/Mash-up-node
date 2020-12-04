<h1>const, let</h1>

* 보통 자바스크립트를 배울 때 var 변수를 선언하는 방법을 배운다. 하지만 var는 이제 const와 let으로 대체된다.

```javascript
if(true){
    var x = 1;
}
console.log(X); // 1

if(true){
    const y = 1;
}
console.log(y) //Refference error: y is not defined
```

* var는 함수 스코프를 가지므로 if문의 블록과 관계없이 접근이 가능하다.
* const와 let은 블록 스코프를 가지므로 블록 밖에서는 접근할 수 없다.
  * 함수 스코프 대신 블록 스코프를 사용하면서 호이스팅 같은 문제도 해결되고 코드 관리도 수월해진다
  * 호이스팅? 코드에 선언된 변수 및 함수를 코드 상단으로 끌어올리는 것을 말하며 이는 변수 범위가 전역 범위 인지 함수 범위인지에 따라 다르게 수행될 수 있다 -> 혼란을 가져올 수 있다.

* const는 한 번 값을 할당하면 다른 값 할당이 불가능하다. 또한 초기화할 때 할당을 같이 해주어야 한다.
  * const로 선언한 변수는 상수이다.
* **변수 선언 시에는 기본적으로 const를 사용하고, 다른 값을 할당해야 하는 상황이 생겼을 때 let을 사용하자**



<br>

# 템플릿 문자열

* ES2015 문법에 새로 생겼다.
* 기존 문자열과 다르게 백틱(`)으로 감싼다. 새로운 점은 문자열 안에 변수를 넣을 수 있는 것이다.

```javascript
var num1 = 1;
var num2 = 2;
var string1 = '숫자 두 개는' + num1 + '과' + num2 + '이다.'

// 가독성이 좋지 않다. escape 구문이 들어간다면 더 지저분해진다.
```



```javascript
const num1 = 1;
const num2 = 2;
const string1 = `숫자 두 개는 ${num1}과 ${num2}이다.`;

//위 코드보다 훨씬 깔끔해진다. ${변수} 형식으로 문자열에 넣을 수 있다.
```



# 객체 리터럴

<기존>

```javascript
var sayNode = function(){
    console.log("Node");
};
var es = 'ES';
var oldObject = {
    sayJs : function(){
        console.log("JS");
    },
    sayNode : sayNode,
};

oldObject[es + 6] = 'Good';
oldObject.sayNode(); // Node
oldObject.sayJS(); // JS
console.log(oldObject.ES6) // Good
```



<변경>

```javascript
const newObject = {
    sayJS(){
        console.log("JS");
    },
    sayNode,
    [es + 6] : 'Good',
};

newObject.sayNode(); //Node
newObject.sayJS(); //JS
console.log(newObject.ES6); //Good
```



* oldObject와 newObject를 비교해보면, 콜론과 function을 더는 붙이지 않아도 된다.
* 또한 속성명과 변수명이 동일한 경우 한 번만 써도 된다.
  * {name : name, age: age} >> {name, age}



# 화살표 함수

* 화살표 함수(arrow function)라는 새로운 함수가 추가되었으며, 기존의 function() {}도 그대로 사용할 수 있다.

```javascript
function add1(x,y){
    return x+y;
}

const add2 = (x,y) => {
    return x+y;
}

const add3 = (x,y) => x+y;

const add4 = (x,y) => (x+y);

function not1(x){
    return !x;
}

const not2 = x => !x;
```

* add1, add2, add3, add4는 같은 기능을 하는 함수다.
* not1, not2도 같은 기능을 하는 함수이다.
* 화살표 함수는 function 선언 대신 => 기호로 함수를 선언한다. 또한 변수에 대입하면 나중에 재사용할 수 있다.



* 화살표 함수가 기존 fucntion과 다른 점은 this 바인드 방식이다. 다음 예제를 보자.

```javascript
var relationship1 = {
    name : 'zero',
    friends : ['nero', 'hero', 'xero'],
    logFriends : function(){
        var that  = this; //relationship1을 가리키는 this를 that에 저장
        this.friends.forEach(function(friend){
            console.log(that.name, friend);
        });
    },
};
relationship1.logFriends();

const relationship2 = {
    name : 'zero',
    friends : ['nero', 'hero', 'xero'],
    logFriends(){
        this.friends.forEach(friend => {
            console.log(this.name, friend);
        });
    },
};
relationship2.logFriends();

//output
zero nero
zero hero
zero xero
zero nero
zero hero
zero xero

```

* relationship1.logFriends()안의 forEach문에서는 function 선언문을 사용했다.
  * 각자 다른 함수 스코프의 this를 가지므로 that이라는 변수를 사용해서 relationship1에 간접적으로 접근
* relationship2.logFriends()안의 forEach문에서는 화살표 함수를 사용했다.
  * 바깥 스코프인 logFriends()의 this를 그대로 사용할 수 있다. 상위 스코프의 this를 물려 받는다.
* 즉, 기본적으로 화살표 함수를 쓰되, this를 사용해야 하는 경우에는 화살표 함수와 function 중 하나를 고르자





# 구조분해 할당

* 구조분해 할당을 사용하면 객체와 배열로부터 속성이나 요소를 쉽게 꺼낼 수 있습니다.

다음은 객체의 속성을 같은 이름의 변수에 대입하는 코드이다.

```javascript
var appleMachine = {
    status : {
        name : 'node',
        count : 5,
    },
    getApple : function(){
        this.status.count--;
        return this.status.count;
    },
};
var getApple = appleMachine.getApple;
var count = appleMachine.status.count;
```

위와 같은 코드를 다음과 같이 바꿀 수 있다.

```javascript
const appleMachine = {
    status : {
        name : 'node',
        count : 5,
    },
    getApple(){
        this.status.count--;
        return this.status.count;
    },
};
const {getApple, status:{count}} = appleMachine;
```

* appleMachine 객체 안의 속성을 찾아서 변수와 매칭한다. count처럼 여러 단계 안의 속성도 찾을 수 있다.
* 다만, 구조분해 할당을 사용하면 함수의 this가 달라질 수 있다. 달리진 this를 원래대로 바꿔주려면 bind 함수를 따로 사용해야 한다.



배열에 대한 구조분해 할당 문법도 존재한다

```javascript
var array = ['nodejs', {}, 10, true];
var node = array[0];
var obj = array[1];
var bool = array[3];
```

다음과 같이 바꿀 수 있다.

```javascript
const array = ['nodejs', {}, 10, true];
const [node, obj, , bool] = array;
```

* 세 번째 요소인 10에는 변수명을 지어주지 않았으므로 10은 무시된다.
* 구조분해 할당 문법은 코드 줄 수를 상당히 줄여주므로 유용하다. 특히 노드는 모듈 시스템을 사용하므로 이러한 방식을 자주 쓴다.





# 클래스

* 클래스 문법도 추가되었다. 하지만 다른 언어처럼 클래스 기반으로 동작하는 것이 아니라 여전히 프로토타입 기반으로 동작한다. 프로토타입 기반 문법을 보기 좋게 클래스로 바꾼 것이라고 이해하면 된다.

다음은 프로토타입 상속 예제 코드이다.

```javascript
var Human = function(type){
    this.type = type || 'human';
};

Human.isHuman = function(human){
    return human is instanceof Human;
}

Human.prototype.breathe = function(){
    alert('h-a-a-a-m');
};

var Zero = function(type, firstName, lastName){
    Human.apply(this, arguments);
    this.firstName = firstName;
    this.lastName = lastName;
};

Zero.prototype = Object.create(Human.prototype);
Zero.prototype.constructor = Zero; //상속하는 부분
Zero.prototype.sayName = function(){
    alert(this.firstName + '' + this.lastName);
};

var oldZero = new Zero('human', 'Zero', 'Cho');
Human.isHuman(oldZero); //true
```

* Human 생성자 함수가 있고, 그 함수를 Zero 생성자 함수가 상속한다. 상당히 코드가 난해하다.

위 코드를 클래스 기반 코드로 바꿔보자.

```javascript
class Human{
    constructor(type = 'human'){
        this.type = type;
    }
    static isHuman(human){
        return human instanceof Human;
    }
    breathe(){
        alert('h-a-a-a-m');
    }
}

class Zero extends Human{
    constructor(type, firstName, lastName){
        super(type);
        this.firstName = firstName;
        this.lastName = lastName;
    }
    sayName(){
        super.breathe();
        alert(`${this.firstName} ${this.lastName}`);
    }
}

const newZero = new Zero('human', 'Zero', 'Cho');
Human.isHuman(newZero); //true
```

* 전반적으로 class 안으로 그룹화되어있다.
* 프로토타입 함수들도 모두 class 블록 안에 포함되어 어떤 함수가 어떤 클래스 소속인지 보기도 쉽다.
* 상속도 간단해져 extends로 쉽게 상속이 가능하다.
* **다만, 이렇게 클래스 문법으로 바뀌었더라도 자바스크립트는 프로토타입 기반으로 동작한다.**





# 프로미스

* 자바스크립트와 노드에서는 주로 비동기를 접한다. 특히 이벤트 리스너를 사용할 때 콜백 함수를 자주 사용한다.
* ES2015부터는 자바스크립트와 노드의 API들이 콜백 대신 프로미스 기반으로 재구성되며, 콜백 지옥 현상을 극복했다는 평가를 받는다.



프로미스는 다음과 같은 규칙이 있다. 먼저 프로미스 객체를 생성해야 한다.

```javascript
const condition = true; //true면 resolve, false면 reject
const promise = new Promise((resolve, reject)=>{
    if(condition){
        resolve('성공');
    }else{
        reject('실패');
    }
});
// 다른 코드 가능

promise
	.then((message)=>{
      console.log(message); //성공(resolve)한 경우 실행
})
	.catch((error)=>{
      console.error(error); //실패(reject)한 경우 실행
})
	.finally(()=>{ //끝나고 무조건 실행
      console.log('항상 실행')
});
```

* new Promise로 프로미스를 생성할 수 있으며, 그 내부에 resove와 reject를 매개변수로 갖는 콜백 함수를 넣는다.
* promise 변수에 then과 catch  메서드를 붙일 수 있다.
  * 프로미스 내부에서 resolve가 호출되면 then이 실행되고, reject가 호출되면 catch가 실행된다.
* 만약, reject('실패')가 호출되면 catch의 error가 '실패'가 된다.
  * condition 변수를 false로 바꿔보면 catch에서 에러가 로깅된다.



**프로미스를 쉽게 설명하면, 실행은 바로 하되 결괏값은 나중에 받는 객체이다. 결괏값은 실행이 완료된 후 then이나 catch 메서드를 통해 받는다.**

* then이나 catch에서 다시 다른 then이나 catch를 붙일 수 있다. 이전 then의 return값을 다음 then의 매개변수로 넘긴다. 프로미스를 return한 경우에 프로미스가 수행된 후 다음 then이나 catch가 호출된다.

```javascript
promise
	.then((message)=>{
      return new Promise((resole, reject)=>{
          resolve(message);
      });
  })
	.then((message2)=>{
      console.log(message2);
      return new Promise((resolve, reject)=>{
          resolve(message2);
      });
  })
	.then((message3)=>{
       console.log(message3);  
  })
	.catch((error)=>{
       console.log(error);
  });
	
```

* 처음 then에서 message를 resolve하면 다음 then에서 message2로 받을 수 있다. 여기서 다시 message2를 resolve한 것을 다음 then에서 message3로 받았다.
  * 단, then에서 new Promise를 return해야 다음 then에서 받을 수 있다.
* 이 것을 활용해서 콜백을 프로미스로 바꿀 수 있다.



다음은 콜백을 쓰는 패턴 중 하나이다.

```javascript
function findAndSaveUser(Users){
    Users.findOne({}, (err, user)=>{ //첫 번째 콜백
        if(err){ 
            return console.log(err);
        }
        user.name = 'zero';
        user.save((err)=>{ //두 번째 콜백
            if(err){
                return console.error(err);
            }
            Users.findOne({gender:'m'},(err,user)=>{ //세 번째 콜백
                //다른 코드 삽입
            });
        });
    });
}
```

* 콜백 함수가 세 번 중첩되어 있다. 각 콜백 함수마다 에러도 따로 처리해줘야 한다.

이 코드를 다음과 같이 바꿀 수 있다.

```javascript
function findAndSaveUser(Users){
    Users.findOne({})
      .then((user)=>{
        user.name = 'zero';
        return user.save();
    })
      .then((user)=>{
        return Users.findOne({gender : 'm'});
    })
      .then((user)=>{
        //다른 코드 삽입
    })
      .catch(err=>{
        console.error(err);
    });
}
```

* 위 코드에서 then 메서드들은 순차적으로 실행된다.
* 콜백에서 매번 따로 처리해야 했던 에러도 마지막 catch에서 한 번에 처리할 수 있다.
* 모든 콜백 함수를 위와 같이 바꿀 수 있는 것은 아니다. 메서드가 프로미스 방식을 지원해야 한다.
  * 예제의 코드는 findOne과 save 메서드가 내부적으로 프로미스 객체를 가지고 있다고 가정했다.
  * new Promise가 함수 내부에 구현되어 있어야 한다.



프로미스 여러 개를 한 번에 실행할 수 있는 방법이 있다. 기존의 콜백 패턴이었다면 콜백을 여러번 중첩해서 사용해야 했다. 하지만 ***promise.all***을 활용하면 간단히 할 수 있다.

```javascript
const promise1 = Promise.resolve('성공!');
const promise2 = Promise.resolve('성공이다!');
Promise.all([promise1, promise2])
	.then((result)=>{
      console.log(result); //['성공!', '성공이다!']
})
	.catch((error)=>{
      console.error(err);
});	
	
```

* Promise.resolve는 즉시 resolve하는 프로미스를 만드는 방법이다.
* 프로미스가 여러 개 있을 때, Promise.all에 넣으면 모두 resolve될 때 까지 기다렸다가 then으로 넘어간다.
* result 매개변수에 각각의 프로미스 결괏값이 배열로 들어있다. Promise 중 하나라도 reject가 되면 catch로 넘어간다.





# async/await

* 노드 7.6 버전부터 지원되는 기능이다. ES2017에서 추가되었으며, 알아두면 편리한 기능이다. 특히 노드처럼 비동기 위주로 프로그래밍을 할 때 도움이 많이 된다.
* 프로미스가 콜백 지옥을 해결했지만, 여전히 코드가 장황하다. then과 catch가 계속 반복되기 때문이다. async/await 문법은 프로미스를 사용한 코드를 한 번 더 깔끔하게 줄여준다.

```javascript
function findAndSaveUser(Users){
    Users.findOne({})
      .then((user)=>{
        user.name = 'zero';
        return user.save();
    })
      .then((user)=>{
        return Users.findOne({gender : 'm'});
    })
      .then((user)=>{
        //다른 코드 삽입
    })
      .catch(err=>{
        console.error(err);
    });
}
```

위 코드에서 async/await 문법을 사용하면 다음과 같이 바꿀 수 있다. async function이 추가되었다.

```javascript
async function findAndUser(Users){
    let user = await Users.findOne({});
    user.name = 'zero';
    user = await user.save();
    user = await Users.findOne({gender : 'm'});
    // 생략
}
```

* 엄청나게 코드가 짧아졌다. 함수 선언부를 일반 함수 대신에 async function으로 교체한 후에, 프로미스 앞에 await을 붙였다. 
* 이제 함수는 resolve될 때까지 기다린 뒤 다음 로직으로 넘어간다.
  * 예를 들어, await Users.findOne({})이 resolve될 때까지 기다린 다음에 user 변수를 초기화 한다.



위 코드는 에러를 처리하는 부분(프로미스가 reject된 경우)이 없으므로 다음과 같은 추가 작업이 필요하다.

```javascript
async function findAndUser(Users){
    try{
        let user = await Users.findOne({});
        user.name = 'zero';
        user = await user.save();
        user = await Users.findOne({gender : 'm'});
        //생략
    }catch(err){
        console.error(err);
    }
}
```

* try / catch문으로 로직을 감쌌다. 프로미스의 catch 메서드처럼 try / catch문의 catch가 에러를 처리한다.



화살표 함수도 async와 같이 사용할 수 있다.

```javascript
const findAndUser = async(Users) => {
    try{
        let user = await Users.findOne({});
        user.name = 'zero';
        user = await user.save();
        user = await Users.findOne({gender : 'm'});
        //생략
    }catch(err){
        console.error(err);
    }
}
```



for문과 async/await을 같이 써서 프로미스를 순차적으로 실행할 수도 있다. for문과 함께 쓰는 것은 노드 10버전부터 지원하는 ES2018 문법이다.

```javascript
const promise1 = Promise.resolve('성공!');
const promise2 = Promise.resolve('성공이다!');
(async ()=>{
    for await (promise of [promise1, promise2]){
        console.log(promise);
    }
})();
```

* for await of문을 사용해 프로미스 배열을 순회하는 모습이다. 
* async 함수의 반환값은 항상 Promise로 감싸진다.
  * 따라서, 실행 후 then을 붙이거나 또 다른 async 함수 안에서 await을 붙여서 처리할 수 있다.
