module.exports = {
    token:{
      // token密匙
      signKey:'123456',
      // 过期时间
      // signTime: 3600 * 24,
        signTime: 60,
      // 请求头参数
      header: 'authorization',
      //不用校验的路由
      unRoute:[
        {url:'/login',methods:['POST']},
      ]
    }
  }