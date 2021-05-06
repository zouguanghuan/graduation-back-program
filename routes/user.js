const express = require('express');
const route = express.Router();
const User = require('../module/jdbc');
const cache = require('memory-cache')
const { readFile, writeFile } = require('../myFs/myFs');
const verify = require('../util/verify');
const ZhenzismsClient = require('../util/zhenzisms');
const { responseInfo, againMd5 } = require('../util/util');
const { Router } = require('express');
// 可以理解route和创建的app没有区别

// 正常登陆
route.post('/login', async (req, res, next) => {
  let str = 'SELECT * FROM user where name=? and password=?'
  // console.log(req)
  let { name, password } = req.body
  let token = await verify.setToken(name, password)
  await User.query(str, [name, password], (err, data) => {
    if (err) {
      // console.log(err)
      throw err;
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
        code: 200,
        success: true,
        message: '登录成功',
        data,
        token
      });
    }
  })

});

// 发送给短信验证码
route.post('/sendsms', async (req, res, next) => {
  let code = ("0000" + Math.floor(Math.random() * 9999)).slice(-4)
  let { phone } = req.body;
  cache.put(phone, code)
  let client = new ZhenzismsClient('sms_developer.zhenzikj.com', '108764', '1e28d71f-5907-4541-ae7f-632f368a5b71');
  let smscode = await client.send({
    templateId: 4768,
    number: phone,
    templateParams: [code, "30"]
  })
  console.log(smscode)
  console.log(cache.get(phone))
  if (smscode.code === 0) {
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
route.post('/forget', async (req, res, next) => {
  let { name, password, sms } = req.body;
  let str = 'UPDATE user SET password=? WHERE name = ?'
  if (sms !== cache.get(name)) {
    responseInfo(res, {
      code: 2,
      success: false,
      message: '验证码错误',
    })
    return
  }
  await User.query(str, [password, name], (err, data) => {
    if (err) {
      console.log(err)
      responseInfo(res, {
        code: 2,
        success: false,
        message: '服务器异常',
      })
    } else {
      responseInfo(res, {
        code: 200,
        success: true,
        message: '修改成功，请重新登录',
      });
    }
  })
})

//获取自习室列表
route.post('/get_room_list', async (req, res) => {
  let queryLan = 'SELECT a.*,r.* FROM AREA a  JOIN room r ON a.area_id = r.area_id';
  await User.query(queryLan, (err, data) => {
    if (err) {
      responseInfo(res, {
        code: 500,
        success: false,
        message: '服务器异常',
      })
    } else {
      responseInfo(res, {
        code: 200,
        success: true,
        message: '修改成功，请重新登录',
        data: data
      });
    }
    
  })
})

// 获取座位列表
route.post('/get_seat_list', async(req, res)=>{
  let queryLan = 'select r.room_name, s.* from seat s join room r where r.room_id = ? and r.room_id = s.room_id';
  let {room_id} = req.body
  await User.query(queryLan,[room_id], (err, data) => {
    if (err) {
      responseInfo(res, {
        code: 500,
        success: false,
        message: '服务器异常',
      })
    } else {
      responseInfo(res, {
        code: 200,
        success: true,
        message: '获取自习室座位',
        data: data
      });
    }
    
  })
})

//获取用户信息
route.post('/get_user_info', async (req, res)=>{
  let queryLan = 'select * from user where user_id= ?'
  let {user_id} = req.body
  await User.query(queryLan, [user_id], async (err, data)=>{
    if(err) {
      console.log(err)
      responseInfo(res, {
        code: 500,
        success: false,
        message: '服务器异常',
      })
    } else {
      responseInfo(res, {
        code: 200,
        success: true,
        message: '获取用户详细信息',
        data: data
      })
    }
  })
})
module.exports = route