const mongoose = require('mongoose');

// 개발 환경일 때만 콘솔을 통해 몽구스가 생성하는 쿼리 내용을 확인할 수 있게 하는 코드
const connect = () => {
    if(process.env.NODE_ENV !== 'production'){
        mongoose.set('debug', true);
    }

// 몽구스와 몽고디비를 연결하는 부분, 마지막 인수로 주어진 콜백 함수를 통해 연결 여부 확인
    mongoose.connect('mongodb://localhost/nodejs',{
        dbName : 'nodejs',
        useNewUrlParser : true,
        useCreateIndex : true,
    },(error)=>{
        if(error){
            console.log('몽고디비 연결 에러', error);
        }else{
            console.log('몽고디비 연결 성공');
        }
    });
};

// 몽구스 커넥션에 이벤트 리스너, 에러 발생 시 에러 내용 기록, 연결 종료 시 재연결 시도
mongoose.connection.on('error',(error)=>{
    console.error('몽고디비 연결 에러', error);
});
mongoose.connection.on('disconnected', ()=>{
    console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
    connect();
});

module.exports = connect;