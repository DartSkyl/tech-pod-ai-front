import { ref } from 'vue'

export function useLocalStorage() {
  const storageKey = 'rc_chat'
  const storageRef = ref(getStorageObject())

  function getStorageObject() {
    const storedValue = localStorage.getItem(storageKey)
    return storedValue ? JSON.parse(storedValue) : {}
  }

  function saveStorageObject(newObject) {
    localStorage.setItem(storageKey, JSON.stringify(newObject))
    storageRef.value = newObject
  }

  function getStoredValue(key) {
    const storageObject = getStorageObject()
    return Object.prototype.hasOwnProperty.call(storageObject, key) ? storageObject[key] : null
  }

  function setStoredValue(key, value) {
    const storageObject = getStorageObject()
    storageObject[key] = value
    saveStorageObject(storageObject)
  }

  return {
    getStoredValue,
    setStoredValue
  }
}