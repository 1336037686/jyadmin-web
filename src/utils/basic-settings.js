// basic settings
const BasicSettingsKey = 'Admin-Basic-Settings'
// rsa public key
const RsaPublicKey = 'Rsa-Public-Key'

export function getBasicSettings() {
  const values = localStorage.getItem(BasicSettingsKey)
  if (!values) return null
  return JSON.parse(values)
}

export function setBasicSettings(basicSettings) {
  return localStorage.setItem(BasicSettingsKey, JSON.stringify(basicSettings))
}

export function getLocalStorageRsaPublicKey() {
  return localStorage.getItem(RsaPublicKey)
}

export function setLocalStorageRsaPublicKey(publicKey) {
  return localStorage.setItem(RsaPublicKey, publicKey)
}

export function removeLocalStorageRsaPublicKey() {
  return localStorage.removeItem(RsaPublicKey)
}
