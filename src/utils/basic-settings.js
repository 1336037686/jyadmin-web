const BasicSettingsKey = 'Admin-Basic-Settings'

export function getBasicSettings() {
  const values = localStorage.getItem(BasicSettingsKey)
  if (!values) return null
  return JSON.parse(values)
}

export function setBasicSettings(basicSettings) {
  return localStorage.setItem(BasicSettingsKey, JSON.stringify(basicSettings))
}
