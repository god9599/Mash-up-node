#### 요청과 응답 이해하기

* 서버는 클라이언트가 있기에 동작한다. 클라이언트에서 서버로 요청을 보내고 서버에서는 요청의 내용을 읽고 처리한 뒤 클라이언트에 응답을 보낸다.
  * 따라서, 서버에는 요청을 받는 부분과 응답을 보내는 부분이 있어야 한다. 
  * 요청과 응답은 이벤트 방식이라고 생각하면 된다.
  * 클라이언트로부터 요청이 왔을 때 어떤 작업을 수행할지 이벤트 리스너를 미리 등록해두어야 한다.

이벤트 리스너를 가진 노드 서버를 만들어보자.

```javascript
//createServer.js

const http = require('http');

http.createServer((req,res)=>{
    // 어떻게 응답할지 적자.
});
```

* req 객체는 요청에 관한 정보들을, res 객체는 응답에 관한 정보를 담고 있다.



이제, 응답을 보내는 부분과 서버에 견결하는 부분을 추가해보자.

```javascript
//server.js

const http = require('http');

http.createServer((req,res)=>{
    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
    res.write('<h1>hello</h1>');
    res.end('<p>Hello server</p>');
}).listen(8080,()=>{ //서버에 연결
    console.log('8080번 포트에서 서버 대기 중');
});
```

* res.writeHead는 응답에 대한 정보를 기록하는 메서드
  * 200은 첫 번째 인수로 성공적인 요청임을 의미
  * 두 번쨰 인수로 응답에 대한 정보를 보내는 데 콘텐츠 형식이 HTML임을 알림
  * 한글 표시를 위해 charset은 utf-8로 지정
  * header라고 부른다.
* res.write 메서드의 첫 번째 인수는 클라이언트로 보낼 데이터이다.
  * body라고 부른다.
* res.end는 응답을 종료하는 메서드
  * 인수가 있다면 그 데이터도 클라이언트로 보내고 응답을 종료



listen 메서드에 콜백 함수를 넣는 대신, 다음과 같이 서버에 Listening 이벤트 리스너를 붙여도 된다. 추가로 error 이벤트 리스너도 붙여보자.

```javascript
const http = require('http');

const server = http.createServer((req,res)=>{
    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
    res.write('<h1>hello</h1>');
    res.end('<p>Hello server</p>');
});
server.listen(8080);

server.on('listening',()=>{
    console.log('8080번 포트에서 서버 대기중');
});

server.on('error',(err)=>{
    console.error(err);
});
```



> res.write와 res.end에 일일이 HTML을 적는 것은 비효율적이므로 미리 HTML 파일을 만들어두면 좋다.
>
> 그 HTML 파일을 fs 모듈로 읽어서 전송할 수 있다.



```html
//server.html

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>node.js</title>
    </head>
    <body>
        <h1>
            NODE.JS 서버
        </h1>
        <P>
            만들자
        </P>
    </body>
</html>
```

```javascript
//server.js

const http = require('http');
const fs = require('fs').promises;

http.createServer(async (req,res)=>{
    try{
        const data = await fs.readFile('./server.html');
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.end(data);
    }catch(err){
        console.error(err);
        res.writeHead(500, {'Content-Type':'text/html; charset=utf-8'});
        res.end(err.message);
    }
}).listen(8080,()=>{
    console.log('8080포트에서 서버 대기중');
});
```



> HTTP 상태 코드
>
> * 2XX : 성공을 알리는 상태 코드
> * 3XX : 다른 페이지로 이동을 알리는 상태 코드
>   * 어떤 주소를 입력했는데 다른 주소의 페이지로 넘어갈 때 사용.
>   * 304(수정되지 않음)는 요청의 응답으로 캐시를 사용했다는 뜻.
> * 4XX : 요청 오류를 나타낸다. 요청 자체에 오류가 있을 때 표시됨
>   * 400(잘못된 요청), 401(권한 없음), 402(금지됨), 404(찾을 수 없음)
> * 5XX : 서버 오류를 나타낸다. 요청은 제대로 왔지만 서버에 오류가 생겼을 때 발생한다.
>   * 500(내부 서버 오류), 502(불량 게이트웨이), 503(서비스를 사용할 수 없음)

