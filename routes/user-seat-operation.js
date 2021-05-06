const express = require('express');
const route = express.Router();
const Seat = require('../module/jdbc');

const { responseInfo } = require('../util/util');
const { Router } = require('express');

//获得自习室信息
route.post('/get_room_info', async (req, res)=>{
    let queryLan = 'select * from room where room_id= ?'
    let {room_id} = req.body
    await Seat.query(queryLan, [room_id], async (err, data)=>{
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
          message: '获取自习室详细信息',
          data: data
        })
      }
    })
  })
// 预定座位
route.post('/book_seat', async (req, res) => {
    let queryLan = 'update user set status = ? where user_id = ?'
    let { user_id, seat_id, date, room_id } = req.body
    await Seat.query(queryLan, [2, user_id], async (err, data) => {
        if (err) {
            console.log('1' + err)
            responseInfo(res, {
                code: 500,
                success: false,
                message: '服务器异常',
            })
        } else {
            let queryLan2 = 'update seat set status = ? where seat_id = ?'
            await Seat.query(queryLan2, [3, seat_id], async (err2, data2) => {
                if (err2) {
                    console.log('2' + err2)
                    responseInfo(res, {
                        code: 500,
                        success: false,
                        message: '服务器异常',
                    })
                } else {
                    let queryLan3 = 'insert into user_seat_rel (user_id, seat_id, book_date) values (?,?,?)'
                    await Seat.query(queryLan3, [user_id, seat_id, date], async (err3, data3) => {
                        if (err3) {
                            responseInfo(res, {
                                code: 500,
                                success: false,
                                message: '服务器异常',
                            })
                        } else {
                            let querylan4 = 'update room set seat_surplus = seat_surplus-1 where room_id = ?';
                            await Seat.query(querylan4, [room_id], (err4, data4) => {
                                if (err4) {
                                    responseInfo(res, {
                                        code: 500,
                                        success: false,
                                        message: '服务器异常',
                                    })
                                } else {
                                    responseInfo(res, {
                                        code: 200,
                                        success: true,
                                        message: '预定成功',
                                        data: data4
                                    });
                                }
                            })
                        }
                    })

                }
            })
        }
    })
})
//取消座位
route.post('/cancel_seat', async (req, res) => {
    let queryLan = 'update user set status = ? where user_id = ?'
    let { user_id, seat_id, room_id } = req.body
    await Seat.query(queryLan, [1, user_id], async (err, data) => {
        if (err) {
            console.log('1' + err)
            responseInfo(res, {
                code: 500,
                success: false,
                message: '服务器异常',
            })
        } else {
            let queryLan2 = 'update seat set status = ? where seat_id = ?'
            await Seat.query(queryLan2, [1, seat_id], async (err2, data2) => {
                if (err2) {
                    console.log('2' + err2)
                    responseInfo(res, {
                        code: 500,
                        success: false,
                        message: '服务器异常',
                    })
                } else {
                    let queryLan3 = 'delete from user_seat_rel where user_id = ? and seat_id = ?'
                    await Seat.query(queryLan3, [user_id, seat_id], async (err3, data3) => {
                        if (err3) {
                            responseInfo(res, {
                                code: 500,
                                success: false,
                                message: '服务器异常',
                            })
                        } else {
                            let querylan4 = 'update room set seat_surplus = seat_surplus+1 where room_id = ?';
                            await Seat.query(querylan4, [room_id], (err4, data4) => {
                                if (err4) {
                                    responseInfo(res, {
                                        code: 500,
                                        success: false,
                                        message: '服务器异常',
                                    })
                                } else {
                                    responseInfo(res, {
                                        code: 200,
                                        success: true,
                                        message: '取消成功',
                                        data: data4
                                    });
                                }
                            })
                        }
                    })

                }
            })
        }
    })
})

//查询用户已经选择了哪个座位
route.post('/get_user_seat_relation', async (req, res) => {
    let queryLan = 'select seat_id from user_seat_rel where user_id = ?'
    let { user_id } = req.body
    await Seat.query(queryLan, [user_id], async (err, data) => {
        if (err) {
            responseInfo(res, {
                code: 500,
                success: false,
                message: '服务器异常',
            })
        } else {
            console.log(data)
            let seat_id = data[0].seat_id
            let queryLan2 = 'select * from seat where seat_id = ?'
            await Seat.query(queryLan2, [seat_id], (err2, data2) => {
                if (err2) {
                    responseInfo(res, {
                        code: 500,
                        success: false,
                        message: '服务器异常',
                    })
                } else {
                    responseInfo(res, {
                        code: 200,
                        success: true,
                        message: '查询选中的座位成功',
                        data: data2
                    });
                }
            })
        }
    })
})
//获得用户当前座位
route.post('/get_user_seat', async (req, res, next) => {
    let queryLan = 'select * from user where user_id = ?'
    await Seat.query(queryLan, (err, res) => {
        console.log(res)
    })
})

module.exports = route