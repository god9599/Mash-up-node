# https와 http2

* https 모듈은 웹 서버에  SSL 암호화를 추가한다. GET이나 POST 요청을 할 때 오가는 데이터를 암호화해서 중간에 다른 사람이 요청을 가로채더라도 내용을 확인할 수 없게 한다.

* https는 아무나 사용할 수 있는 것은 아니다. 인증서 발급을 받아야 한다. 
  * 아래 코드는 인증서가 있다는 가정하에 작성했다.

```javascript
const https = require('https');
const fs = require('fs');

https.createServer({
    cert : fs.readFileSync('도메인 인증서 경로'),
    key : fs.readFileSync('도메인 비밀키 경로'),
    ca : [
        fs.readFileSync('상위 인증서 경로'),
        fs.readFileSync('상위 인증서 경로'),
    ],
},(req,res)=>{
   res.writeHead(200, 'Content-Type':'text/html; charset=utf-8'});
   res.write('<h1>hello</h1>');
   res.end('<p>hi</P>');
}).listen(443,()=>{
    console.log('server start');
}); 
```

* createServer 메서드가 인수를 두 개 받는다. 인증서를 구입하면 pem이나 crt, key 확장자를 가진 파일들을 제공한다.



노드의 http2 모듈은 SSL 암호화와 더불어 최신 HTTP 프로토콜인 http/2를 사용할 수 있게 한다.

```javascript
const http2 = require('http2');
const fs = require('fs');

https.createSecureServer({
    cert : fs.readFileSync('도메인 인증서 경로'),
    key : fs.readFileSync('도메인 비밀키 경로'),
    ca : [
        fs.readFileSync('상위 인증서 경로'),
        fs.readFileSync('상위 인증서 경로'),
    ],
},(req,res)=>{
   res.writeHead(200, 'Content-Type':'text/html; charset=utf-8'});
   res.write('<h1>hello</h1>');
   res.end('<p>hi</P>');
}).listen(443,()=>{
    console.log('server start');
}); 
```




