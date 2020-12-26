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

module.exports = monoose.model('User', userSchema);