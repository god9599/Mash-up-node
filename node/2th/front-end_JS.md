# AJAX

* AJAX는 비동기적 웹 서비스를 개발할 때 사용하는 기법이다.
* 쉽게 말해 페이지 이동 없이 서버에 요청을 보내고 응답을 받는 기술이다.

* 보통 AJAX 요청은 jQuery나 axios 같은 라이브러리를 이용해서 보낸다.
* 프론트엔드에서 사용하려면 HTML 파일을 하나 만들고 그 안에 script 태그를 추가해야 한다. 두 번째 태그 안에 앞으로 나오는 프론트엔드 예제 코드를 넣으면 된다.

```javascript
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
    // 예제 코드
</script>
```



먼저 요청의 한 종류인 GET요청을 보내보자. axios.get함수의 인수로 요청을 보낼 주소를 넣으면 된다.

```javascript
axios.get('https://www.yeah.com/api/get')
	.then((result)=>{
      console.log(result);
      console.log(result.data); // {}
})
	.catch((err)=>{
      console.error(err);
});
```

* axios.get 내부에도 new Promise가 들어있으므로 then과 catch를 사용할 수 있다.
* result.data에는 서버로부터 보낸 데이터가 들어 있다.
  * 이는 개발자 도구 Console 탭에서 확인 가능.



프로미스이므로 async/await 방식으로 변경 가능. 익명 함수라서 즉시 실행을 위해 코드를 소괄호로 감싸 호출.

```javascript
(async ()=>{
    try{
        const result = await axios.get('https://www.yeah.com/api/get');
        console.log(result);
        console.log(result.data); //{}
    }catch(err){
        console.error(err);
    }
})();
```





이번에는 POST 방식의 요청을 보내보자. POST 요청에서는 데이터를 서버로 보낼 수 있다.

```javascript
(async ()=>{
    try{
        const result = await axios.post('https://yeah/com/api/post/json',{
            name : 'zerojoo',
            birth : 1997,
        });
        console.log(result);
        console.log(result.data); //{}
    }catch(err){
        console.error(err);
    }
})();
```

* 전체적인 구조는 비슷한 데 두 번째 인수로 데이터를 넣어 보내는 것이 다르다. 
  * GET 요청이면 axios.get을, POST 요청이면 axios.post를 사용한다.





# FormData

* HTML form 태그의 데이터를 동적으로 제어할 수 있는 기능이다. 주로 AJAX와 함께 사용된다.

```javascript
const formData = new FormData();
FormData.append('name', 'joo');
FormData.append('item', 'banana');
FormData.append('item', 'apple');
FormData.has('item'); //true
FormData.has('wassup'); //false
FormData.get('item'); //banana
FormData.getAll('item'); //['banana', 'apple']
FormData.append('test',['hi', 'joo']);
FormData.delete('test');
FormData.get('test'); //null
FormData.set('item', 'melon');
FormData.getAll('item');//['melon']
```

* 생성된 객체의 append 메서드로 키-값 형식의 데이터 저장 가능.
* has는 키에 해당하는 값이 있는 지 여부를 알린다. 
* get은 주어진 키에 해당하는 값 하나를 가져온다. getAll은 모든 값을 가져온다.
* delete는 현재 키를 제거한다.
* set은 현재 키를 수정한다.





# encode/decodeURIComponent

* AJAX 요청을 보낼 때, 'http://localhost:3000/search/노드'처럼 주소에 한글이 들어갈 수 있다. 서버가 한글 주소를 이해하지 못하는 경우가 있는데, 이럴 때 사용한다.
* 한글 주소 부분만 encodeURIComponent 메서드로 감싼다.



```javascript
(async ()=>{
    try{
        const result = await axios.get(`https://www.yeah.com/api/search/
		 												${encodeURIComponent('노드')}`);
        console.log(result);
        console.log(result.data);//{}
    }catch(error){
        console.error(error);
    }
})();
```

* 노드라는 한글 주소가 ~라는 문자열로 변환된다.
* 받는 쪽에서는 decodeURIComponent를 사용하면 된다.

```javascript
decodeURIComponent('~'); //노드
```





# 데이터 속성과 dataset

* 노드를 웹 서버를 사용하는 경우, 클라이언트(프론트 엔드)와 빈번하게 데이터를 주고 받게 된다. 이때 서버에서 보내준 데이터를 프론트엔드 어디에 넣어야 할지 고민하게 된다.
* 프론트엔드에 데이터를 내려보낼 때 첫 번째로 고려해야 할 점은 보안이다. 
  * 비밀번호 같은 것은 절대 내려보내지 마라
* 보안과 무관한 데이터들은 자유롭게 프론트엔드로 보내도 된다. JS 변수에 저장해도 되지만 HTML5에도 HTML과 관련된 데이터를 저장하는 공식적인 방법이 있다. 바로 데이터 속성이다.

```html
<ul>
    <li data-id="1" data-user-job="programmer">Joo</li>
    <li data-id="2" data-user-job="designer">han</li>
    <li data-id="3" data-user-job="ceo">kim</li>
    <li data-id="4" data-user-job="dba">moon</li>
</ul>
<script>
    console.log(document.querySelector('li').dataset);
    //{id:'1', userJob:'programmer'}
</script>
```

* data-로 시작하는 것들이 바로 데이터 속성이다.
* 데이터 속성의 장점은 자바스크립트로 쉽게 접근할 수 있다는 점이다. 
* script 태그를 보면 dataset 속성을 통해 첫 번째 li 태그의 데이터 속성에 접근하고 있다. 
  * 단, 데이터 속성 이름이 조금씩 변형되었다. 앞의 data- 접두어는 사라지고 - 뒤에 위치한 글자는 대문자가 된다. data-id는 id, data-user-job은 userJob이 된다.
  * 반대로 dataset에 데이터를 넣어도 HTML 태그에 반영이 된다. dataset.monthSalary = 1000;을 넣으면 data-month-salary="1000"이라는 속성이 생긴다.
