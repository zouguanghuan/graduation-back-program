const express = require('express');
const route = express.Router();
const Admin = require('../module/jdbc');
const cache = require('memory-cache')
const verify = require('../util/verify');
const ZhenzismsClient = require('../util/zhenzisms');
const { responseInfo, againMd5 } = require('../util/util');
// 可以理解route和创建的app没有区别

// 正常登陆
route.post('/admin_login', async (req, res, next) => {
  let str = 'SELECT * FROM user where name=? and password=?'
  // console.log(req)
  let { name, password } = req.body
  let token = await verify.setToken(name, password)
  await Admin.query(str, [name, password], (err, data) => {
    if (err) {
      // console.log(err)
    }
    if (!data[0]) {
      console.log(data)
      responseInfo(res, {
        code: 2,
        success: false,
        message: '账号或者密码错误',
      })
    }
    else {
      responseInfo(res, {
        code: 1,
        success: true,
        message: '登录成功',
        token
      });
    }
  })
  
});

// 发送给短信验证码
route.post('/sendsms', async (req, res, next) => {
  let code = ("0000"+Math.floor(Math.random()*9999)).slice(-4)
  let {phone} = req.body;
  cache.put(phone, code)
  let client = new ZhenzismsClient('sms_developer.zhenzikj.com', '108764', '1e28d71f-5907-4541-ae7f-632f368a5b71');
  let smscode = await client.send({
    templateId: 4768,
    number: phone,
    templateParams: [code, "30"]
  })
  console.log(smscode)
  console.log(cache.get(phone))
  if(smscode.code === 0) {
    responseInfo(res, {
      code: 1,
      success: true,
      message: smscode.data
    })
  } else {
    responseInfo(res, {
      code: 0,
      success: false,
      message: smscode.data
    })
  }
  
  
}) 

//修改密码
route.post('/forget', async (req, res, next) =>{
  let { name, password, sms } = req.body;
  let str = 'UPDATE user SET password=? WHERE name = ?'
  if(sms !== cache.get(name)) {
    responseInfo(res, {
      code: 2,
      success: false,
      message: '验证码错误',
    })
    return
  }
  await Admin.query(str, [password, name], (err, data) => {
    if (err) {
      console.log(err)
      responseInfo(res, {
        code: 2,
        success: false,
        message: '服务器异常',
      })
    } else {
      responseInfo(res, {
        code: 1,
        success: true,
        message: '修改成功，请重新登录',
      });
    }
  })
})

//增加用户
route.post('add_user', async (req, res)=>{
  let queryLan = 'insert into user (name, password) values (?, ?)'
  let { user_name} = req.body
  await Admin.query(queryLan, [user_name, '123456'], (err, data)=>{
    if(err) {
      responseInfo(res, {
        code: 500,
        success: false,
        message: '服务器异常',
      })
    } else {
      responseInfo(res, {
        code: 200,
        success: true,
        message: '用户信息添加成功',
      });
    }
  })

})

//增加自习室
route.post('/add_room', async (req, res)=>{
  let queryLan = 'insert into room (room_id, room_name, seat_num, seat_surplus, area_id) values (?, ?, ?, ?, ?)'
  let { room_id, room_name, seat_num, area_id} = req.body
  await Admin.query(queryLan, [room_id, room_name, seat_num, seat_num, area_id], (err, data)=>{
    if(err) {
      responseInfo(res, {
        code: 500,
        success: false,
        message: '服务器异常',
      })
    } else {
      responseInfo(res, {
        code: 200,
        success: true,
        message: '图书室信息添加成功',
      });
    }
  })

})


module.exports = route