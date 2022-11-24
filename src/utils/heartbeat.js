import sendMessage from "./sendMessage";

let timer;
let flag = true;

// 开启发送心跳包
function startHeartbeat() {
    console.log("开始发送心跳包 --> --->");
    clearInterval(timer);
    timer = setInterval(() => {
        sendMessage({
            content: 'heartbeat_OK',
            mesType: "heartbeat"
        }).then(() => {
            console.log("每隔5秒发送心跳包成功");
        }).catch(() => {
            console.log("发送心跳包失败 ---!!!!!!!!!!!!!!");
        })
    }, 5000);
}

// 手动发送心跳包
function sendHeartbeat() {
    if (flag) {
        flag = false;
        sendMessage({
            content: 'heartbeat_OK',
            mesType: 'heartbeat'
        });
        startHeartbeat()
        setTimeout(() => {
            flag = true;
        }, 3000);
    }
}

// 停止发送
function stopHeartbeat() {
    console.log("关闭心跳包发送 -----------> ");
    clearInterval(timer)
}

export {
    startHeartbeat,
    stopHeartbeat,
    sendHeartbeat
}