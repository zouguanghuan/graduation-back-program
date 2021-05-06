const jwt = require('jsonwebtoken'); //使用jwt 来生成或者解密 token
const setting = require('./setting');

const verify = {
  //设置 token
  setToken(name,pwd){
    return new Promise(resolve=>{
      let token = jwt.sign(
        //存储数据，自定义
        {name,pwd},
        //密匙
        setting.token.signKey,
        // 过期时间
        { expiresIn: setting.token.signTime}
      )
      resolve(token)
    })
  },
  getToken(token){
    return new Promise((res,rej)=>{
      //判断token是否存在
      if(!token){
        console.log("这里是空的 没有数据");
        rej({error:'The token value is empty'})
      }else{
         //jwt.verify 里面传入三个参数第一个 token, 第二个 signKey 就是生成token的密匙 第三个 方法 判断； 是否解密成功
        jwt.verify(token,setting.token.signKey,(err,data)=>{
          if(err){
            // console.log("请求失败");
            res({
              state: false,
              info: "token验证失败"
            });
          }else{
            // console.log("请求成功");
            res({
              state: true,
              info: "token验证成功"
            });
          }
        });

      }
    })
  }
}
module.exports = verify;