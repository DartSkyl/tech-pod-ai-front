export function useCookies() {
  function getCookie(name) {
    return document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1]
  }

  function setCookie(name, value, hours = 0) {
    const expires = getHoursExpires(hours)
    document.cookie = `${name}=${value}; expires=${expires}; path=/`
  }

  function getHoursExpires(hours) {
    if (!hours) return 0

    const now = new Date()
    now.setTime(now.getTime() + hours * 60 * 60 * 1000) // 24h
    return now.toUTCString()
  }

  return {
    getCookie,
    setCookie
  }
}