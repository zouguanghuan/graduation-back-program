module.exports = {
  port: 9999,
  session: {
    secret: 'zouguanghuan',
    saveUninitialized: false,
    resave: false,
    cookie: {
      // 30天有效期
      maxAge: 1000 * 60 * 60 * 24 * 30
    }
  },
  cros: {
    // 这里指定哪个网络源可以访问
    origin: '*',
    credential: true,
    headers: 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With',
    methods: 'PUT,POST,GET,DELETE,OPTIONS,HEAD'
  }
}