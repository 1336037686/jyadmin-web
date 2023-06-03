import CryptoJS from 'crypto-js'

// 加密密码
const defaultKeyHax = CryptoJS.enc.Utf8.parse('jyadminkeyhax123') // 密钥必须是16位

// DES加密
export function encryptByDES(message) {
  const keyHex = defaultKeyHax
  const ivHex = defaultKeyHax
  const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.CBC,
    iv: ivHex,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

