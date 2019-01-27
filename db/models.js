/*
包含多個操作數據庫集合數據的Model模塊
1. 连接数据库
1.1. 引入mongoose
1.2. 连接指定数据库(URL 只有数据库是变化的)
1.3. 获取连接对象
1.4. 绑定连接完成的监听(用来提示连接成功)
2. 定义出对应特定集合的Model 并向外暴露
2.1. 字义Schema(描述文档结构)
2.2. 定义Model(与集合对应, 可以操作集合)
2.3. 向外暴露Model
 */

// 1. 連接數據庫
// 1.1. 引入mongoose
const mongoose = require('mongoose');

// 1.2. 連接指定數據庫(URL 只有數據庫是變化的)
mongoose.connect('mongodb://localhost:27017/e04', {useNewUrlParser: true});

// 1.3. 獲取連接對像
const connection = mongoose.connection;

// 1.4. 綁定連接完成的監聽(用來提示連接成功)
connection.on('connected', () => console.log(`mongoDB connect success!!`));

// 2. 定義出對應特定集合的Model 並向外暴露
// 2.1. 字義Schema(描述文檔結構)

const userSchema = mongoose.Schema({
    username: {type: String, required: true},   // 用戶名
    password: {type: String, required: true},   // 密碼
    type: {type: String, required: true},       // 用戶類型: wantJob/applyJob
    avatar: {type: String},                     // 頭像名稱
    position: {type: String},                       // 職位
    info: {type: String},                       // 個人或職位簡介
    company: {type: String},                    // 公司名稱
    place: {type: String},                      // 工作地點
    salary: {type: String},                     // 月薪
    skill: {type: String},                      // 技能
    experience: {type: String},                 // 經歷
    language: {type: String},                   // 語言

});

// const applyJobSchema = mongoose.Schema({
//     username: {type: String, required: true},   // 用戶名
//     password: {type: String, required: true},   // 密碼
//     type: {type: String, required: true},       // 用戶類型: applyJob
//     avatar: {type: String},                     // 頭像名稱
//     position: {type: String},                       // 職位
//     info: {type: String},                       // 個人或職位簡介
//     company: {type: String},                    // 公司名稱
//     place: {type: String},                      // 工作地點
//     salary: {type: String},                      // 月薪
//     experience: {type: String},                  // 經歷
//
// });

// const wantJobSchema = mongoose.Schema({
//     username: {type: String, required: true},   // 用戶名
//     password: {type: String, required: true},   // 密碼
//     type: {type: String, required: true},       // 用戶類型: wantJob
//     avatar: {type: String},                     // 頭像名稱
//     position: {type: String},                       // 職位
//     info: {type: String},                       // 個人或職位簡介
//     skill: {type: String},                       // 技能
//     experience: {type: String},                  // 經歷
//     language: {type: String},                   // 語言
//
// });

// 2.2. 定義Model(與集合對應, 可以操作集合)
const UserModel = mongoose.model('user', userSchema);   // 集合為users
// const ApplyJobSchemaModel = mongoose.model('applyJob', applyJobSchema);
// const WantJobSchemaModel = mongoose.model('wantJob', wantJobSchema);

// 2.3. 向外暴露Model
exports.UserModel = UserModel;
// exports.ApplyJobSchemaModel = ApplyJobSchemaModel;
// exports.WantJobSchemaModel = WantJobSchemaModel;

// 定義chats 集合的文檔結構
const chatSchema = mongoose.Schema({
    from: {type: String, required: true},       // 發送消息的帳號id
    to: {type: String, required: true},         // 接收消息的帳號id
    chat_id: {type: String, required: true},    // from 和 to 組成的字符串
    content: {type: String, required: true},    // 內容
    read: {type:Boolean, default: false},       // 標識消息是否已讀
    create_time: {type: Number}                 // 創建時間，用於排序顯示，越新的聊天紀錄會在越上面
});
// 定義能操作chats 集合數據的Model
const ChatModel = mongoose.model('chat', chatSchema);   // 集合為chats

// 向外暴露Model
exports.ChatModel = ChatModel;

// module.exports = xxx;    可以寫多次（一次行暴露）
// exports.xxx = value;     只能寫一次（分別暴露）
// exports.yyy = value;     只能寫一次（分別暴露）

