const express = require('express');
const router = express.Router();

const md5 = require('blueimp-md5');

const {UserModel, ChatModel} = require('../db/models');
// import {UserModel, ApplyJobSchemaModel, WantJobSchemaModel} from '../db/models';

const filter = {password: 0, __v: 0};   // 查詢時，過濾出指定的屬性

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

// 註冊一個路由：用戶註冊
/*
提供一個用戶注冊的接口
a) path 為: /register
b) 請求方式為: POST
c) 接收username 和 password 參數
d) admin 是已注冊用戶
e) 注冊成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
f) 注冊失敗返回: {code: 1, msg: '此用戶已存在'}
 */

/*
1.獲取請求參數
2.req（處裡請求）
3.res（返回響應）
 */
//
// router.post('/register', (req, res) => {
// console.log('register()');
// // 1.獲取請求參數
// const {username, password} = req.body;
//
// // 2.req（處裡請求）
// if (username === 'admin') {     // 註冊會失敗
//     // res（返回失敗響應）
//     res.send({code: 1, msg: '此帳號已存在'});
//
// } else {    // 註冊會成功
//     // res（返回成功響應）
//     res.send({code: 0, data: {id: 'abc123', username, password}});
// }
// });


// 註冊的路由

router.post('/register', (req, res) => {
    // 讀取請求參數數據
    const {username, password, type} = req.body;

    // 處理（req）：判斷帳號是否存在，如果帳號存在，返回錯誤的提示訊息，如果不存在，保存訊息
    // 查詢：根據username
    UserModel.findOne({username}, (error, user) => {
        // 如果user有值，表示帳號存在
        if (user) {
            // 返回響應數據（res）：錯誤的提示訊息，返回json格式的對象
            res.send({code: 1, msg: '此帳號已存在'});
        } else {    // user沒有值，表示帳號不存在
            // 保存訊息，通過UserModel的實例
            new UserModel({username, type, password: md5(password)}).save((error, user) => {
                // 返回響應數據（res）：成功註冊
                // 生成一個cookies(userId, user._id)，並交給瀏覽器保存，maxAge（保存時間） 毫秒*秒*分*小時
                res.cookie('userId', user._id, {maxAge: 1000 * 60 * 60 * 24});
                // 返回包含user的json數據
                const data = {username, type, _id: user._id};  //響應數據中不要攜帶密碼
                res.send({code: 0, data});
            });
        }
    });
});


// 失敗中  待解決
// router.post('/register', (req, res) => {
//     // 讀取請求參數數據
//     const {username, password, type} = req.body;
//
//     // 處理（req）：判斷帳號是否存在，如果帳號存在，返回錯誤的提示訊息，如果不存在，保存訊息
//     // 查詢：根據username
//     if (type === 'wantJob') {
//         WantJobSchemaModel.findOne({username}, (error, user) => {
//             // 如果user有值，表示帳號存在
//             if (user) {
//                 // 返回響應數據（res）：錯誤的提示訊息，返回json格式的對象
//                 res.send({code: 1, msg: '此帳號已存在'});
//             } else {    // user沒有值，表示帳號不存在
//                 // 保存訊息，通過UserModel的實例
//                 new WantJobSchemaModel({username, type, password: md5(password)}).save( (error, user) => {
//                     // 返回響應數據（res）：成功註冊
//                     // 生成一個cookies(userid, user._id)，並交給瀏覽器保存，maxAge（保存時間） 毫秒*秒*分*小時
//                     res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24});
//                     // 返回包含user的json數據
//                     const data = {username, type, _id: user._id} ;  //響應數據中不要攜帶密碼
//                     res.send({code: 0, data});
//                 });
//             }
//         });
//
//     } else {
//         ApplyJobSchemaModel.findOne({username}, (error, user) => {
//             // 如果user有值，表示帳號存在
//             if (user) {
//                 // 返回響應數據（res）：錯誤的提示訊息，返回json格式的對象
//                 res.send({code: 1, msg: '此帳號已存在'});
//             } else {    // user沒有值，表示帳號不存在
//                 // 保存訊息，通過UserModel的實例
//                 new ApplyJobSchemaModel({username, type, password: md5(password)}).save( (error, user) => {
//                     // 返回響應數據（res）：成功註冊
//                     // 生成一個cookies(userid, user._id)，並交給瀏覽器保存，maxAge（保存時間） 毫秒*秒*分*小時
//                     res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24});
//                     // 返回包含user的json數據
//                     const data = {username, type, _id: user._id} ;  //響應數據中不要攜帶密碼
//                     res.send({code: 0, data});
//                 });
//             }
//         });
//     }
// });


//登入的路由
router.post('/login', (req, res) => {
    const {username, password} = req.body;

    // 根據username 和 password 查詢數據庫users
    // 如果沒有返回提示的錯誤訊息，如果有，返回登入成功的訊息（包含users）
    UserModel.findOne({username, password: md5(password)}, filter, (error, user) => {
        if (user) {     // 登入成功
            // 生成一個cookies(userId, user._id)，並交給瀏覽器保存
            res.cookie('userId', user._id, {maxAge: 1000 * 60 * 60 * 24});

            // 返回登入成功的訊息（包含users）
            res.send({code: 0, data: user});
        } else {        // 登入失敗
            res.send({code: 1, msg: '帳號或密碼錯誤，請重新新輸入'});
        }
    });

});

// 失敗中待處理
// router.post('/login', (req, res) => {
//     const {username, password} = req.body;
//
//     // 根據username 和 password 查詢數據庫users
//     // 如果沒有返回提示的錯誤訊息，如果有，返回登入成功的訊息（包含users）
//     UserModel.findOne({username, password: md5(password)}, filter, (error, user) => {
//         if (user) {     // 登入成功
//             // 生成一個cookies(userid, user._id)，並交給瀏覽器保存
//             res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24});
//
//             // 返回登入成功的訊息（包含users）
//             res.send({code: 0, data: user});
//         } else {        // 登入失敗
//             res.send({code: 1, msg: '帳號或密碼錯誤，請重新新輸入'});
//         }
//     });
//
// });


// 更新用戶資訊的路由
router.post('/update', (req, res) => {
    // 從請求的cookie中得到userId：需要根據id確認帳號，而id存在cookie裡面
    // cookies是一個對象
    const userId = req.cookies.userId;

    // 如果userId不存在，直接返回提示訊息的結果
    if (!userId) {
        return res.send({code: 1, msg: `請先登入`});
    }

    // userId存在，根據userId更新對應的user（文檔數據）
    // 得到保存的帳號資訊
    const user = req.body;  // 沒有_id
    UserModel.findByIdAndUpdate({_id: userId}, user, (error, oldUser) => {
        // 如果沒有舊的數據，表示為壞的數據，要刪除
        if (!oldUser) {
            // 通知瀏覽器刪除userId cookie（搜尋express 刪除cookie）
            res.clearCookie('userId');
            // 返回一個提示訊息
            res.send({code: 1, msg: `請先登入`});
        } else {
            // 準備一個返回的user數據對象
            const {_id, username, type} = oldUser;
            const data = Object.assign(user, {_id, username, type});

            // 返回
            res.send({code: 0, data});
        }
    });
});

// 獲取帳號訊息的路由（根據cookie中的userId獲取）
router.get('/user', (req, res) => {
    // 從請求的cookie中得到userId：需要根據id確認帳號，而id存在cookie裡面
    const userId = req.cookies.userId;
    // 如果userId不存在，直接返回提示訊息的結果
    if (!userId) {
        return res.send({code: 1, msg: `請先登入`});
    }
    // 根據userId查詢對應的user
    UserModel.findOne({_id: userId}, filter, (error, user) => {
        res.send({code: 0, data: user})
    });

});

// 獲取帳號列表，根據帳號type
router.get('/userlist', (req, res) => {
    const {type} = req.query;

    // 根據type獲取user的數組
    UserModel.find({type}, filter, (error, users) => {
        res.send({code: 0, data: users});
    });
});


// 獲取當前帳號所有相關的聊天消息列表

router.get('/msglist', (req, res) => {

    // 獲取cookie中的userId
    const userId = req.cookies.userId;

    // 查詢得到所有user的文檔數組
    UserModel.find((error, userDocs) => {
        // 用對象儲存所有user訊息：key為user的_id，val為name和avatar組成的user對象
        // const users = {};   // 對象容器
        // userDocs.forEach(doc => {
        //     users[doc._id] = {username: doc.username, avatar: doc.avatar}
        // });

        // 上面的寫法，可以用reduce()寫，參數為回調函數

        const users = userDocs.reduce((users, user) => {
            users[user._id] = {username: user.username, avatar: user.avatar};
            return users;
        }, {});

        /*
        查詢userId相關的所有聊天訊息
        參數1：查詢條件
        參數2：過濾條件
        參數3：回調函數
         */

        ChatModel.find(
            {'$or': [{from: userId}, {to: userId}]},
            filter,
            (error, chatMsgs) => {
            // 返回包含所走帳號和當前帳號相關的所有聊天數據
            res.send({code: 0, data: {users, chatMsgs}});
        });
    });
});

/*
修改指定消息為已讀
 */
router.post('/readmsg', (req, res) => {     // 用post()是因為要修改數據

    // 得到請求中的from和to
    const from = req.body.from;     // 對方id
    const to = req.cookies.userId;  // 我

    /*
    更新數據庫中的chat數據
    參數1：查詢條件
    參數2：更新為指定的數據對象
    參數3：是否一次更新多條，默認為更新一條
    參數4：更新完成的回調函數
     */

    ChatModel.update(
        {from, to, read: false},
        {read: true},
        {multi: true},
        (error, doc) => {
            res.send({code: 0, data: doc.nModified});   // 更新的數量
    });
});

module.exports = router;

