const WebSocket = require('ws'); // 웹소켓 모듈 임포트

const wss = new WebSocket.Server({ port: 8080 }); // 웹소켓 서버

const clients = new Map(); // 클라이언트 매퍼

wss.on('connection', (ws) => { // 웹소켓 서버의 on 함수
  ws.on('message', (message) => { // 
    const data = JSON.parse(message);
    
    if (data.type )
    
    // 데이터 타입이 join일 경우 
    if (data.type === 'join') {
      // 클라이언트 매퍼에 웹소켓 id와 유저 id, chat id를 매핑
      clients.set(ws, { userId: data.userId, chatId: data.chatId });
    }
    
    // 웹소켓 전송 데이터 타입이 메시지일 경우
    if (data.type === 'message') {
      // 전송자를 매퍼에서 조회(userid, chatid)
      const sender = clients.get(ws);
      wss.clients.forEach((client) => {
        // 현재 웹소켓 요청 클라이언트의 정보를 조회
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          // 클라이언트에서 수신자 조회
          const receiver = clients.get(client);
          // 수신자가 있고, sender와 receiver의 chatid가 동일하면 
          if (receiver && receiver.chatId === sender.chatId) {
            // 메시지 전송
            client.send(JSON.stringify({
              type: 'message',
              message: data.message,
              userId: sender.userId,
              timestamp: new Date().toISOString()
            }));
          }
        }
      });
    }
  });

  // 종료 메시지
  ws.on('close', () => {
    clients.delete(ws);
  });
});

console.log('WebSocket server running on port 8080');