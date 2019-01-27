const {ChatModel} = require('../db/models');

/*
require('socket.io') 得到的是一個函數
require('socket.io')() 執行函數
直接向外暴露方便傳入server
*/

module.exports = function (server) {
    const io = require('socket.io')(server);

    // 監聽客戶端與服務器的連接
    io.on('connection', (socket) => {
        console.log(`------- 一個客戶端連上server -------`);

        // 綁定監聽，接收客戶端發送的消息
        socket.on('sendMsg', ({from, to, content}) => {
            console.log(`------- 服務器接收到客戶端發送的消息：`, {from, to , content}, `-------`);

            // 處理數據（保存消息）
            // 準備chatMsg對象的相關數據
            // 格式：from_to 或 to_from，不能只是單一種格式，因為要保證兩邊來回沒有錯誤
            const chat_id = [from, to].sort().join('_');
            const create_time = Date.now();
            new ChatModel({from, to, content, chat_id, create_time}).save((error, chatMsg) => {
                // server向所有連接上的客戶端發送消息
                // 當瀏覽器端收到消息以後，要卻認識不是我發的消息，還是發給我的，因此和我沒關係的消息會收到，但是不能顯示
                io.emit('receiveMsg', chatMsg);

            });

        });

    });
};
