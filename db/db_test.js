/*
測試使用mongoose操作mongo數據庫
1. 連接數據庫
1.1. 引入mongoose
1.2. 連接指定數據庫(URL 只有數據庫是變化的)
1.3. 獲取連接對像
1.4. 綁定連接完成的監聽(用來提示連接成功)
2. 得到對應特定集合的Model
2.1. 字義Schema(描述文檔結構)
2.2. 定義Model(與集合對應, 可以操作集合)
3. 通過Model 或其實例對集合數據進行CRUD 操作
3.1. 通過Model 實例的save()添加數據
3.2. 通過Model 的find()/findOne()查詢多個或一個數據
3.3. 通過Model 的findByIdAndUpdate()更新某個數據
3.4. 通過Model 的remove()刪除匹配的數據
*/

// 加密函數，md5加密
const md5 = require('blueimp-md5');

// 1. 連接數據庫
// 1.1. 引入mongoose
const mongoose = require('mongoose');

// 1.2. 連接指定數據庫(URL 只有數據庫是變化的)
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

// 1.3. 獲取連接對像
const connection = mongoose.connection;

// 1.4. 綁定連接完成的監聽(用來提示連接成功)
connection.on('connected', () => console.log(`mongo數據庫連接成功`));    // 連接成功自動回調


// 2. 得到對應特定集合的Model
// 2.1. 字義Schema(描述文檔結構)，Schema約束，定義文檔的結構
const userSchema = mongoose.Schema({    // 指定文檔的結構
    // 屬性名 / 屬性值的類型，是否是必須，是否有默認值
    username: {type: String, required: true},   // 用戶名
    password: {type: String, required: true},   // 密碼
    type: {type: String, required: true},       // 用戶類型: wantJob/applyJob
    header: {type: String}
});

// 2.2. 定義Model(與集合對應, 可以操作集合)
const UserModel = mongoose.model('user', userSchema);     // 集合名稱：users --> 所以要寫成user

// CRUD
// 3. 通過Model 或其實例對集合數據進行CRUD 操作
// 3.1. 通過Model 實例的save()添加數據
function testSave() {
    // 創建UserModel的實例
    const userModel = new UserModel({username: '白羽瞳', password: md5('0000'), type: 'wantJob'});
    // 調用save()保存數據
    userModel.save((error, user) => console.log('save()', error, user));
}

// testSave();

// 3.2. 通過Model 的find()/findOne()查詢多個或一個數據
function testFind() {
    // 查詢多個
    // 得到的是包含所有文檔匹配對象的數組，如果沒有匹配的對象，回傳空數組[]
    UserModel.find((error, users) => console.log('find()', error, users));

    // 查詢一個
    // 得到的是匹配的文檔對象，如果沒有匹配的就是null
    UserModel.findOne({_id: '5c2a35384839c539e0c97ff2'}, (error, user) => console.log('findOne()', error, user));

}

// testFind();

// 3.3. 通過Model 的findByIdAndUpdate()更新某個數據
function testUpdate() {
    // 返回的是就的資料
    UserModel.findByIdAndUpdate({_id: '5c2a35384839c539e0c97ff2'},
        {username: '展貓貓'},
        (error, oldUser) => console.log('findByIdAndUpdate()', error, oldUser));
}

// testUpdate();

// 3.4. 通過Model 的remove()刪除匹配的數據
function testDelete() {
    // n: 1（刪除幾筆資資料）, ok: 1（執行）
    UserModel.remove({_id: '5c2a35384839c539e0c97ff2'},
        (error, doc) => console.log('remove()', error, doc));
}

testDelete();