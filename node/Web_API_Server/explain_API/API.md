
<br>

> 노드는 자바스크립트 문법을 사용하므로 웹 API 서버에서 데이터를 전달할 때 사용하는 JSON을 100% 활용하기에 좋다. 특히 JWT 토큰은 모바일 앱과 노드 서버 간에 사용자 인증을 구현할 때 자주 사용된다.

<br>
<br>

# API 서버 이해하기

* API는 Application Programming Interface의 두문자어로, 다른 어플리케이션에서 현재 프로그램의 기능을 사용할 수 있게 허용하는 접점을 의미한다.
* 웹 API는 다른 웹 서비스의 기능을 사용하거나 자원을 가져올 수 있는 창구이다. 
  * 흔히 API를 '열었다'또는 '만들었다'고 표현하는데, 이는 다른 프로그램에서 현재 기능을 사용할 수 있게 허용했음을 뜻한다.
  * API를 열어놓았다 해도 인증된 사람만 일정 횟수 내에서 가져가게 제한을 둘 수도 있다.
* 위와 같은 서버에 API를 올려서 URL을 통해 접근할 수 있게 만든 것을 웹 API 서버라고 한다.

<BR>

여기서 크롤링의 개념을 알아두면 좋다. 크롤링은 웹 사이트가 자체적으로 제공하는 API가 없거나 API 이용에 제한이 잇을 때 사용하는 방법이다. 하지만 웹 사이트에서 직접 제공하는 API가 아니므로 원하는 정보를 얻지 못할 수도 있다. 또한 웹 사이트에서 제공하길 원치 않는 정보를 수집한다면 법적인 문제도 발생한다.                                                                       서비스 제공자 입장에서도 주기적으로 크롤링을 당하면 웹 서버의 트래픽이 증가하여 서버에 무리가 가므로, 공개해도 되는 정보들은 API로 만들어 가져가게 하는 것이 좋다.

 

