import request from '@/utils/request-api'

export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/api/auth/register',
    method: 'post',
    data
  })
}

export function refreshToken(data) {
  return request({
    url: '/api/auth/refreshToken',
    method: 'post',
    headers: { 'X-RefreshToken': data }
  })
}

export function getInfo() {
  return request({
    url: '/api/auth/info',
    method: 'get'
  })
}

export function getMenus() {
  return request({
    url: '/api/auth/menus',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}

export function getIdempotentToken() {
  return request({
    url: '/api/auth/idempotent-token',
    method: 'get'
  })
}

export function getRsaPublicKey() {
  return request({
    url: '/api/auth/rsa-public-key',
    method: 'get'
  })
}
