const { io } = require('socket.io-client');

// WebSocket客户端使用示例
class WebSocketClient {
  constructor(serverUrl, token) {
    this.serverUrl = serverUrl;
    this.token = token;
    this.socket = null;
    this.currentUser = null;
  }

  // 连接到WebSocket服务器
  connect() {
    try {
      this.socket = io(this.serverUrl, {
        auth: {
          token: this.token
        },
      });

      // 连接事件监听
      this.socket.on('connect', () => {
        console.log('✅ WebSocket连接成功');
        console.log('Socket ID:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('❌ WebSocket连接断开');
        this.currentUser = null;
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ WebSocket连接错误:', error.message);
      });

      // 连接成功事件
      this.socket.on('connection_success', (data) => {
        console.log('🎉 连接成功:', data);
        this.currentUser = data.user;
      });

      // 用户上线事件
      this.socket.on('user_connected', (data) => {
        console.log('👤 用户上线:', data.username, `(ID: ${data.userId})`);
        console.log('📊 当前在线用户数:', data.onlineCount);
      });

      // 用户下线事件
      this.socket.on('user_disconnected', (data) => {
        console.log('👋 用户下线:', data.username, `(ID: ${data.userId})`);
        console.log('📊 当前在线用户数:', data.onlineCount);
      });

      // 消息事件监听
      this.socket.on('message', (data) => {
        console.log('📨 收到消息:', data);
      });

      this.socket.on('joined', (data) => {
        console.log('🏠 房间状态:', data);
      });

      this.socket.on('message_sent', (data) => {
        console.log('✅ 消息发送成功:', data);
      });

      this.socket.on('events', (data) => {
        console.log('📡 收到事件:', data);
      });

      // 在线用户事件
      this.socket.on('online_users', (data) => {
        console.log('👥 在线用户列表:', data.total, '人');
        data.users.forEach(user => {
          console.log(`  - ${user.username} (${user.userId}) - 连接时间: ${new Date(user.connectedAt).toLocaleString()}`);
        });
      });

      // 心跳响应
      this.socket.on('pong', (data) => {
        console.log('💓 心跳响应:', data);
      });

      // 用户信息
      this.socket.on('user_info', (data) => {
        console.log('👤 用户信息:', data);
      });

      // 在线用户数量
      this.socket.on('online_count', (data) => {
        console.log('📊 在线用户数:', data.count);
      });

      // 连接日志
      this.socket.on('connection_logs', (data) => {
        console.log('📋 连接日志:', data.total, '条');
        data.logs.forEach(log => {
          console.log(`  - ${log.event === 'connect' ? '连接' : '断开'}: ${log.username} (${log.userId}) - ${new Date(log.timestamp).toLocaleString()}`);
        });
      });

      // 用户连接历史
      this.socket.on('user_connection_history', (data) => {
        console.log('📚 用户连接历史:', data.total, '条');
        data.logs.forEach(log => {
          console.log(`  - ${log.event === 'connect' ? '连接' : '断开'}: ${log.username} (${log.userId}) - ${new Date(log.timestamp).toLocaleString()}`);
        });
      });

      // 连接统计
      this.socket.on('connection_stats', (data) => {
        console.log('📈 连接统计:', data);
      });

    } catch (error) {
      console.error('❌ 连接失败:', error.message);
    }
  }

  // 断开连接
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentUser = null;
      console.log('🔌 WebSocket连接已断开');
    }
  }

  // 发送消息
  sendMessage(message) {
    if (!this.socket || !this.socket.connected) {
      console.error('❌ WebSocket未连接');
      return;
    }

    this.socket.emit('message', { message }, (response) => {
      console.log('📤 消息响应:', response);
    });
  }

  // 加入房间
  joinRoom() {
    if (!this.socket || !this.socket.connected) {
      console.error('❌ WebSocket未连接');
      return;
    }

    this.socket.emit('join', {}, (response) => {
      console.log('🏠 加入房间响应:', response);
    });
  }

  // 发送事件
  sendEvent(data) {
    if (!this.socket || !this.socket.connected) {
      console.error('❌ WebSocket未连接');
      return;
    }

    this.socket.emit('events', data, (response) => {
      console.log('📡 事件响应:', response);
    });
  }

  // 发送心跳
  sendPing() {
    if (!this.socket || !this.socket.connected) {
      console.error('❌ WebSocket未连接');
      return;
    }

    this.socket.emit('ping', {}, (response) => {
      console.log('💓 心跳响应:', response);
    });
  }

  // 获取在线用户
  getOnlineUsers() {
    if (!this.socket || !this.socket.connected) {
      console.error('❌ WebSocket未连接');
      return;
    }

    this.socket.emit('get_online_users', {}, (response) => {
      console.log('👥 在线用户响应:', response);
    });
  }

  // 获取用户信息
  getUserInfo() {
    if (!this.socket || !this.socket.connected) {
      console.error('❌ WebSocket未连接');
      return;
    }

    this.socket.emit('get_user_info', {}, (response) => {
      console.log('👤 用户信息响应:', response);
    });
  }

  // 获取在线用户数量
  getOnlineCount() {
    if (!this.socket || !this.socket.connected) {
      console.error('❌ WebSocket未连接');
      return;
    }

    this.socket.emit('get_online_count', {}, (response) => {
      console.log('📊 在线用户数量响应:', response);
    });
  }

  // 获取连接日志
  getConnectionLogs(limit = 20) {
    if (!this.socket || !this.socket.connected) {
      console.error('❌ WebSocket未连接');
      return;
    }

    this.socket.emit('get_connection_logs', { limit }, (response) => {
      console.log('📋 连接日志响应:', response);
    });
  }

  // 获取用户连接历史
  getUserConnectionHistory(userId = null, limit = 10) {
    if (!this.socket || !this.socket.connected) {
      console.error('❌ WebSocket未连接');
      return;
    }

    this.socket.emit('get_user_connection_history', { userId, limit }, (response) => {
      console.log('📚 用户连接历史响应:', response);
    });
  }

  // 获取连接统计
  getConnectionStats() {
    if (!this.socket || !this.socket.connected) {
      console.error('❌ WebSocket未连接');
      return;
    }

    this.socket.emit('get_connection_stats', {}, (response) => {
      console.log('📈 连接统计响应:', response);
    });
  }

  // 获取连接状态
  isConnected() {
    return this.socket && this.socket.connected;
  }

  // 获取当前用户
  getCurrentUser() {
    return this.currentUser;
  }
}

// 使用示例
async function example() {
  // 替换为你的JWT Token
  const token = 'your-jwt-token-here';
  const serverUrl = 'http://localhost:3000/admin';

  const client = new WebSocketClient(serverUrl, token);

  // 连接
  client.connect();

  // 等待连接建立
  setTimeout(() => {
    if (client.isConnected()) {
      // 获取用户信息
      client.getUserInfo();

      // 获取在线用户
      client.getOnlineUsers();

      // 获取连接统计
      client.getConnectionStats();

      // 加入房间
      client.joinRoom();

      // 发送消息
      client.sendMessage('Hello from Node.js client!');

      // 发送事件
      client.sendEvent({ type: 'test', data: 'test event' });

      // 发送心跳
      client.sendPing();

      // 获取连接日志
      client.getConnectionLogs(10);

      // 获取用户连接历史
      client.getUserConnectionHistory();

      // 5秒后断开连接
      setTimeout(() => {
        client.disconnect();
      }, 5000);
    }
  }, 1000);
}

// 如果直接运行此文件
if (require.main === module) {
  console.log('🚀 WebSocket客户端示例');
  console.log('请确保：');
  console.log('1. 服务器正在运行 (npm run dev:admin)');
  console.log('2. 已获取有效的JWT Token');
  console.log('3. 已安装socket.io-client: npm install socket.io-client');
  console.log('');
  
  // 检查是否提供了token参数
  const token = process.argv[2];
  if (!token) {
    console.error('❌ 请提供JWT Token作为参数');
    console.log('使用方法: node websocket-usage-example.js <your-jwt-token>');
    process.exit(1);
  }

  // 创建客户端并运行示例
  const client = new WebSocketClient('http://localhost:3000/admin', token);
  client.connect();

  // 等待连接建立后发送测试消息
  setTimeout(() => {
    if (client.isConnected()) {
      console.log('\n🔍 开始测试各种功能...\n');
      
      // 获取用户信息
      client.getUserInfo();
      
      // 获取在线用户
      client.getOnlineUsers();
      
      // 获取连接统计
      client.getConnectionStats();
      
      // 加入房间
      client.joinRoom();
      
      // 发送消息
      client.sendMessage('Hello from command line!');
      
      // 发送事件
      client.sendEvent({ type: 'test', data: 'command line test' });
      
      // 发送心跳
      client.sendPing();
      
      // 获取连接日志
      client.getConnectionLogs(5);
      
      // 获取用户连接历史
      client.getUserConnectionHistory();
    }
  }, 1000);

  // 10秒后自动断开
  setTimeout(() => {
    client.disconnect();
    process.exit(0);
  }, 10000);
}

module.exports = WebSocketClient;
