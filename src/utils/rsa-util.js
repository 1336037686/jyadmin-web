import JSEncrypt from 'jsencrypt'
import { getLocalStorageRsaPublicKey } from '@/utils/basic-settings'

// RSA加密
// 创建一个新的JSEncrypt对象，然后设置公钥，并对数据进行加密。
// 加密默认使用是'RSA/ECB/PKCS1Padding'模式，加密后的数据是Base64编码的字符串。
export function encryptByRSA(password) {
  // 获取缓存中的公钥
  const publicKey = getLocalStorageRsaPublicKey()
  // 创建JSEncrypt对象
  const encryptor = new JSEncrypt()
  // 设置公钥
  encryptor.setPublicKey(publicKey)
  // 加密，默认为Base64编码的字符串
  const encrypted = encryptor.encrypt(password)
  return encrypted
}

