// require('socket.io') 得到的是一個函數
// require('socket.io')() 執行函數
// 直接向外暴露方便傳入server
module.exports = function (server) {
    const io = require('socket.io')(server);

    // 監視客戶端與服務器的連接，使用on()方法
    io.on('connection', (socket) => {
        console.log(`------- 一個客戶端連上服務器 -------`);

        // 綁定監聽，接收客戶端發送的消息
        socket.on('sendMsg', (data) => {
            console.log(`------- 服務器接收到客戶端發送的消息：`,data, `-------`);

            // 處理數據
            data.name = data.name.toUpperCase();

            // 服務器向客戶端發送消息
            // socket.emit('receiveMsg', data);
            io.emit('receiveMsg', data);
            console.log(`------- 服務器向客戶端發送的消息：`, data, `-------`);

        });
    });
};
