const bodyParser = require('body-parser');
const express = require('express');
  // session = require('express-session'),
const expressJWT = require('express-jwt');
  // 导入配置文件
const setting = require('./util/setting');
  // 导入token配置文件
const verify = require('./util/verify');
const {responseInfo} = require('./util/util');
const app = express();


const config = require('./config');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const seatRouter = require('./routes/user-seat-operation');
const { urlencoded } = require('express');

app.listen(config.port, () => {
  console.log('开启服务监听', config.port)
})

// 中间件的处理

// cros跨域请求中间件
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.cros.origin);
  res.header('Access-Control-Allow-Credentials', config.cros.credential);
  res.header('Access-Control-Allow-Headers', config.cros.headers);
  res.header('Access-Control-Allow-Methods', config.cros.methods);
  /^OPTIONS$/i.test(req.method) ? res.send('CURRENT SERVICES SUPPORT CROSS DOMAIN REQUESTS!') : next()
})

app.use(bodyParser.urlencoded({
  extended: false
}));

//配置post请求中的bodyParser，可以直接使用req.body-req.query
app.use(bodyParser.json())


// app.use(session(config.session));
// 以后获取session: require.session.XXX
// 以后设置session: require.session.XXX = XX

// 使用expressJWT 验证token是否过期
// app.use(expressJWT({
//   secret: setting.token.signKey, // 签名的密钥 或 PublicKey
//   algorithms: ['HS256']
// }).unless({ // 设置并规定哪些路由不用验证 token
//   path: ['/login', '/sendsms', '/forget', '/admin_login'] // 指定路径不经过 Token 解析
// }));


// //当token失效返回提示信息 时间过期了执行这一条
// app.use((err, req, res, next) => {
//     // console.log(req.headers);
//   if (err.status === 401) {
//     responseInfo(res, {
//       code: err.status,
//       success: false,
//       message: 'token失效'
//     });
//     return
//   }
// });

// api处理
app.post('/get_room_info', seatRouter);

app.post('/get_room_list', userRouter);

app.post('/get_seat_list', userRouter);

app.post('/admin_login', adminRouter);

app.post('/login', userRouter);

app.post('/get_user_info', userRouter);

app.post('/sendsms', userRouter);

app.post('/forget', userRouter);

app.post('/book_seat', seatRouter);

app.post('/get_user_seat_relation', seatRouter);

app.post('/cancel_seat', seatRouter);

// app.post('/get_user_seat', seatRouter)

app.use((req, res) => {
  res.status(404).send({
    code: 404,
    codeText: 'not found',
    success: false
  })
})