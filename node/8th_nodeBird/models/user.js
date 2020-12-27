const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            email : {
                type : Sequelize.STRING(40),
                allowNull : true,
                unique : true,
            },
            nick : {
                type : Sequelize.STRING(15),
                allowNull: false,
            },
            password : {
                type : Sequelize.STRING(100),
                allowNull : true,
            },
            provider : {
                type : Sequelize.STRING(10),
                allowNull : false,
                defaultValue : 'local',
            },
            snsId : {
                type : Sequelize.STRING(30),
                allowNull : true,
            },
        },{
            sequelize : sequelize,
            timestamps : true,
            underscored : false,
            modelName : 'User',
            tableName : 'users',
            paranoid : true,
            charset : 'utf8',
            collate : 'utf8_general_ci',
        });
    }

    static associate(db){
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User,{
            foreignKey : 'followingId',
            as : 'Followers',
            through : 'Follow',
        });
        db.User.belongsToMany(db.User,{
            foreignKey : 'followerId',
            as : 'Followings',
            through : 'Follow',
        });
    }
};

// 사용자 정보를 저장하는 모델.
// 이메일, 닉네임, 비밀번호를 저장하고 SNS 로그인을 했을 경우에는 provider와 snsId를 저장. provider가 local이면 로컬 로그인,
// 카카오면 카카오 로그인을 한 것이다.
// 테이블 옵션으로 timestamps와 paranoid가 true로 주어졌으므로 createdAt, updatedAt, deletedAt 컬럼도 생성된다.