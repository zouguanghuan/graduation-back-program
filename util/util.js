const setting = require('./setting')
function responseInfo(res, options) {
  let config = Object.assign(
    {
      code: 0,
      codeText: "Ok!",
      signTime: setting.token.signTime
    },
    options
  );
  // 发送相应数据
  res.status(200).type("application/json").send(config);
}

function againMD5(text) {
  // 前提保证是字符串
  return text
    .substring(4, text.length - 4)
    .split("")
    .reverse()
    .join("");
}
module.exports = {
  responseInfo,
  againMD5,
};
