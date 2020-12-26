# mysql

#### 데이터베이스

데이터 베이스는 관련성을 가지며 중복이 없는 데이터들의 집합이다. 이러한 데이터베이스를 관리하는 시스템을 DBMS(DataBase Management System)라고 부른다.

* 보통 서버의 하드 디스크나 SDD 등의 저장 매체에 데이터를 저장한다. 
  * 저장 매체가 고장나거나 사용자가 직접 데이터를 지우지 않는 이상 계속 데이터가 보존되므로 서버 종료 여부와 상관없이 데이터를 지속적으로 사용할 수 있다.

* 서버에 데이터베이스를 올리면 여러 사람이 동시에 사용할 수 있다.
  * 각기 다른 사람들에게 다른 권한을 줄 수 있다.

* 데이터베이스를 관리하는 DBMS 중에서 RDBMS라고 부르는 관계형 DBMS가 많이 사용된다.
  * 대표적인  RDBMS로는 오라클, MYSQL, MSSQL 등이 있다. 이들은 SQL이라는 언어를 사용해 데이터를 관리한다.



#### CRUD

CRUD는 Create, Read, Update, Delete를 나타내는 말이며 데이터베이스에서 많이 수행하는 네 가지 작업을 일컫는다. 



#### Create

데이터를 생성해서 데이터베이스에 넣는 작업.



데이터를 넣는 명령어

```sql
INSERT INTO [테이블명] ([컬럼1], [컬럼2], ...) VALUES ([값1], [값2], ...)
```



#### Read

데이터베이스에 있는 데이터를 조회하는 작업.



데이터 조회 명령어

```sql
SELECT * FROM [테이블명]
```

* *는 테이블에 있는 모든 컬럼을 불러오는 것이다.
* 특정 컬럼만 조회할 수 있다. 조회를 원하는 컬럼을 * 대신에 넣으면 된다.



WHERE 절을 사용하면 특정 조건을 가진 데이터만 조회할 수도 있다. 아래는 예시이다.

```sql
SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 30;
```

* 결혼을 했고 나이가 30세 이상인 사용자를 조회하는 SQL문이다. AND로 여러 조건을 묶었다.
  * 물론 OR 조건도 가능하다.



ORDER BY [컬럼명] [ASC || DESC] 키워드를 사용하면 정렬도 가능하다. 아래는 예시이다.

```sql
SELECT id, name FROM nodejs.users ORDER BY age DESC;
```

* 나이가 많은 순서대로 정렬하는 SQL문이다.
  * ASC 오름차순, DESC 내림차순



조회할 로우 개수 설정도 가능하다. LIMIT [숫자] 키워드를 사용하면 된다. 

```SQL
SELECT id, name FROM nodejs.users ORDER BY age DESC LIMIT 1;
```

* 하나만 조회하려면 LIMIT 1을 SQL문 끝에 붙이면 된다.



로우 개수를 설정하면서 몇 개를 건너뛸지 설정할 수도 있다. 이는 게시판 등의 페이지네이션 기능을 구현할 때 유용하다. 예를 들어 첫 번째 페이지에서 1-20번 게시물을 조회했다면, 두 번째 페이지에서는 21-40번 게시물을 조회해야 한다. 이 때 20개를 건너뛰고 조회하는 것이 가능하다. OFFSET[건너뛸 숫자] 키워드를 사용한다.

```sql
SELECT id, name FROM nodejs.users ORDER BY age DESC LIMIT 1 OFFSET 1;
```





#### Update

데이터베이스에 있는 데이터를 수정하는 작업.

```sql
UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;
```

* UPDATE [테이블명] SET [컬럼명 = 바꿀 값] WHERE [조건] 형식이다.
* 위의 명령어는 WHERE id = 2로 id가 2인 로우의 컬럼을 수정할 수 있다.
* AND, OR 사용 가능





#### Delete

데이터베이스에 있는 데이터를 삭제하는 작업.



DELETE FROM [테이블명] WHERE [조건] 형식

```sql
DELETE FROM nodejs.users WHERE id = 2;
```

* 조건이 WHERE id = 2인데, 이는 users 테이블에서 id가 2인 로우를 제거하라는 것이다.
* AND, OR 사용 가능
