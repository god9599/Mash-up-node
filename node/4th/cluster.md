
# cluster

* cluster 모듈은 기본적으로 싱글 프로세스로 동작하는 노드가 CPU 코어를 모두 사용할 수 있게 해준다.
  * 포트를 공유하는 노드 프로세스를 여러 개 둘 수 있으므로, 요청이 많이 들어왔을 때 병렬로 실행된 서버의 개수만큼 요청이 분산되게 할 수 있다.
    * 서버에 무리가 덜 가게 된다.
* 성능은 개선되지만, 메모리를 공유하지 못한다는 등의 단점도 있다.
  * 세션을 메모리에 저장하는 경우 문제가 될 수있다.
    * ​	이는 레디스 등의 서버를 도입하여 해결 가능

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if(cluster.isMaster){
    console.log(`마스터 프로세스 아이디 : ${process.pid}`);
    // CPU 개수만큼 워커를 생산
    for(let i=0; i<numCPUs; i+=1 ){
        cluster.fork();
    }
    // 워커가 종료되었을 때
    cluster.on('exit', (worker, code, signal)=>{
        console.log(`${worker.process.pid}번 종료`);
        console.log('code', code, 'signal', signal);
    });
}else
    // 워커들이 포트에서 대기
    http.createServer((req,res)=>{
        res.writeHead(200, 'Content-Type':'text/html; charset=utf-8'});
   		res.write('<h1>hello</h1>');
  		res.end('<p>hi</P>');
    }).listen(8080);
	console.log(`${process.pid}번 워커 실행`);
}
```

* cluster에는 마스터 프로세스와 워커 프로세스가 있다.
  * 마스터 프로세스는 CPU 개수만큼 워커 프로세스를 만들고, 8080포트에서 대기한다.
  * 요청이 들어오면 만들어진 워커 프로세스에 요청을 분배한다.

* 직접 cluster 모듈로 클러스터링을 구현할 수 있지만, pm2 등의 모듈로 cluster 기능을 사용하는 게 더 편하다.