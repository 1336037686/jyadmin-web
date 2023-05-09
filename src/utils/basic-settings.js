import Cookies from 'js-cookie'

const BasicSettingsKey = 'Admin-Basic-Settings'

export function getBasicSettings() {
  const values = Cookies.get(BasicSettingsKey)
  if (!values) return null
  return JSON.parse(values)
}

export function setBasicSettings(basicSettings) {
  return Cookies.set(BasicSettingsKey, JSON.stringify(basicSettings))
}
