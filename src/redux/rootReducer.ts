import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

import favoritReducer from './slices/favorit'
import currentContactReducer from './slices/current-contact'

const createNoopStorage = () => ({
  async getItem(_key: string) {
    return await Promise.resolve(null)
  },
  async setItem(_key: string, value: any) {
    return await Promise.resolve(value)
  },
  async removeItem(_key: string) {
    await Promise.resolve()
  }
})

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-'
}
const favoritPersistConfig = {
  key: 'favorit',
  storage,
  keyPrefix: 'redux-'
}

const rootReducer = combineReducers({
  currentContact: currentContactReducer,
  favorit: persistReducer(favoritPersistConfig, favoritReducer)
})

export { rootPersistConfig, rootReducer }
