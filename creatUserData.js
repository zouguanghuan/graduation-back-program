const { readFile, writeFile } = require('./myFs/myFs'),
  fs = require('fs')

area1 = '0123456789',
  area2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  arr = [];

// 生产n到m的随机数
function random(n, m) {
  return Math.round(Math.random() * (m - n) + n)
}

function queryAge() {
  return new Array(2).fill(null).map((item) => {
    return area1[random(0, 25)]
  }).join('');
};

function queryName() {
  return new Array(4).fill(null).map((item) => {
    return area2[random(0, 25)]
  }).join('');
};

for (var i = 2; i <= 49; i++) {
  arr.push({
    id: i,
    name: queryName(),
    age: queryAge()
  })
}

let USER_DATA = fs.readFileSync('./mock/user.json', 'utf8');
USER_DATA = JSON.parse(USER_DATA)
// console.log(USER_DATA)
USER_DATA = USER_DATA.concat(arr)
USER_DATA = [{ id: 1, name: '大神', age: 14 }]
writeFile('./mock/user.json', JSON.stringify(USER_DATA), 'utf8')
  .then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)
  })

