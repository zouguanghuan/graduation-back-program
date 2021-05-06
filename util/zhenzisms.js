const https = require('https');
var querystring = require('querystring');

class ZhenzismsClient{
    constructor(apiUrl, appId, appSecret){
        this.apiUrl=apiUrl;
        this.appId=appId;
        this.appSecret=appSecret;
    }
	//发送短信
	send(data){
		const options = {
		  hostname: this.apiUrl,
		  method: 'POST',
		  path: '/sms/v2/send.do',
		  rejectUnauthorized: false,
		  headers: {
		    'Content-Type': 'application/x-www-form-urlencoded'
		  }
		};
		data.appId = this.appId;
		data.appSecret = this.appSecret;
		if(data.templateParams)
		    data.templateParams = JSON.stringify(data.templateParams);
		return new Promise(function (resolve, reject) {
		    const req = https.request(options, (res) => {
			  res.setEncoding('utf8'); 
			  res.on('data', (d) => {
			  	var result = JSON.parse(d);
			    resolve(result);
			  }); 
			  
			});
			var content = querystring.stringify(data);
			req.write(content);
			req.end();
		});
	}
	//查看余额
	balance(){
		const options = {
		  hostname: this.apiUrl,
		  method: 'POST',
		  path: '/account/balance.do',
		  rejectUnauthorized: false,
		  headers: {
		    'Content-Type': 'application/x-www-form-urlencoded'
		  }
		};
		var data = {
		  appId: this.appId,
		  appSecret: this.appSecret
		};
		return new Promise(function (resolve, reject) {
		    const req = https.request(options, (res) => {
			  res.setEncoding('utf8'); 
			  res.on('data', (d) => {
			  	var result = JSON.parse(d);
			    resolve(result);
			  }); 
			  
			});
			var content = querystring.stringify(data);
			req.write(content);
			req.end();
		});
	}
	//查询单条短信
	findSmsByMessageId(messageId){
		const options = {
		  hostname: this.apiUrl,
		  method: 'POST',
		  path: '/smslog/findSmsByMessageId.do',
		  rejectUnauthorized: false,
		  headers: {
		    'Content-Type': 'application/x-www-form-urlencoded'
		  }
		};
		var data = {
		  appId: this.appId,
		  appSecret: this.appSecret,
		  messageId: messageId
		};
		return new Promise(function (resolve, reject) {
		    const req = https.request(options, (res) => {
			  res.setEncoding('utf8'); 
			  res.on('data', (d) => {
			  	var result = JSON.parse(d);
			    resolve(result);
			  }); 
			  
			});
			var content = querystring.stringify(data);
			req.write(content);
			req.end();
		});
	}
}


module.exports = ZhenzismsClient;