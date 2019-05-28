var RoomID = 'xatuMcM';

var shareScreen = function() {
  //创建 Client 对象
  var screenClient = AgoraRTC.createClient({
    mode: 'interop'
  });
  //初始化 screenClient 对象
  screenClient.init("7972cd57573d4a09b27afcebb2ed496b", function() {
    console.log("AgoraRTC SCREEN client initialized");
    //加入频道，如果启用了channel key, 请将channel key作为第一个参数
    //若有自己的用户ID系统, 可在第三个参数传参, 不然可传undefined, 则Agora会自动分配一个uid
    screenClient.join('7972cd57573d4a09b27afcebb2ed496b', RoomID, undefined, function(uid) {
      console.log("User " + uid + " join channel successfully");
      console.log("Timestamp: " + Date.now());
      //创建屏幕视频流
      var screenStream = AgoraRTC.createStream({
        streamID: uid,
        audio: false,
        video: false,
        screen: true,
        mediaSource: 'screen' // 'screen', 'application', 'window'
      });
      //设置本地流视频属性
      screenStream.setVideoProfile("720p");
      //初始化屏幕视频流
      screenStream.init(function() {
        console.log("SCREEN stream initialized");
        screenStream.play("agora_screen");
        //发布屏幕视频流以使其可以被远端接收到
        screenClient.publish(screenStream, function(err) {
          console.log("Publish SCREEN stream failed", err);
        });
      });
    });
  });
}

var live = function() {
  //创建 Client 对象
  var client = AgoraRTC.createClient({
    mode: 'interop'
  });
  //初始化 Client 对象
  client.init("7972cd57573d4a09b27afcebb2ed496b", function() {
    console.log("AgoraRTC client initialized");
    //加入频道，如果启用了channel key, 请将channel key作为第一个参数
    //若有自己的用户ID系统, 可在第三个参数传参, 不然可传undefined, 则Agora会自动分配一个uid
    client.join('7972cd57573d4a09b27afcebb2ed496b', RoomID, undefined, function(uid) {
      console.log("User " + uid + " join channel successfully");
      console.log("Timestamp: " + Date.now());
      //创建本地流, 修改对应的参数可以指定启用/禁用特定功能
      var options = {
        streamID: uid,
        audio: true,
        video: true,
        screen: false,
      //chrome extension id
      //extensionId: "minllpmhdgpndnkomcoccfekfegnlikg"
      }
      var localStream = AgoraRTC.createStream(options);
      //设置本地流视频属性
      localStream.setVideoProfile("480p_4");
      //初始化本地流, 并同时申请本地媒体采集权限
      localStream.init(function() {
        console.log("Local stream initialized");
        localStream.play("agora_video");
        shareScreen();
        //发布本地流以使其可以被远端接收到
        client.publish(localStream, function(err) {
          console.err("Publish stream failed", err);
        });
      });
    });
  });
}
var now = new Date();
var cc = now.getTime() / 1000 / 60 / 5;
cc = cc.toFixed(0);
cc = md5(cc).substr(5, 4);
console.log(cc);
var code = prompt("请输入密码", "").toLowerCase();
if (code == cc) {
  live();
} else {
  alert('密码错误!')
}
