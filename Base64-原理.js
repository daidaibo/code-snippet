/*
  对照表

  0~25  26~51  52~61  62  63

  A~Z    a~z    0~9   +    /

*/

const love = Buffer.from('爱')

// <Buffer e7 88 b1>
console.log(love)

/*

e7 88 b1

11100111 10001000 10110001

(111111 = 63 每六位分隔)

00111001 00111000 00100010 00110001

(转十进制)

57 56 34 49

(对照表)
54ix

*/

console.log(Buffer.from([0xe7, 0x88, 0xb1]).toString())

console.log(Buffer.from('54ix', 'base64').toString('utf-8'))
console.log(Buffer.from('爱', 'utf-8').toString('base64'))
