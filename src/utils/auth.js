
// access token
const TokenKey = 'Admin-Token'
// refresh token
const RefreshTokenKey = 'Admin-Refresh-Token'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function getRefreshToken() {
  return localStorage.getItem(RefreshTokenKey)
}

export function setRefreshToken(refreshToken) {
  return localStorage.setItem(RefreshTokenKey, refreshToken)
}

export function removeRefreshToken() {
  return localStorage.removeItem(RefreshTokenKey)
}

