import { openDB } from 'idb'

export default {
  install: (app, options = {}) => {
    const dbPromise = openDB('DreamKeeperDB', 1, {
      upgrade(db) {
        // Хранилище снов
        if (!db.objectStoreNames.contains('dreams')) {
          const dreamStore = db.createObjectStore('dreams', { 
            keyPath: 'id', 
            autoIncrement: true 
          })
          dreamStore.createIndex('date', 'date')
          dreamStore.createIndex('quality', 'quality')
        }
        
        // Хранилище состояния пользователя
        if (!db.objectStoreNames.contains('userStates')) {
          const stateStore = db.createObjectStore('userStates', { 
            keyPath: 'id', 
            autoIncrement: true 
          })
          stateStore.createIndex('date', 'date', { unique: true })
        }
      }
    })

    const db = {
      async getAll(store) {
        return (await dbPromise).getAll(store)
      },
      
      async get(store, id) {
        return (await dbPromise).get(store, id)
      },
      
      async add(store, data) {
        return (await dbPromise).add(store, data)
      },
      
      async put(store, data) {
        return (await dbPromise).put(store, data)
      },
      
      async delete(store, id) {
        return (await dbPromise).delete(store, id)
      },
      
      async getByIndex(store, index, value) {
        return (await dbPromise).getAllFromIndex(store, index, value)
      }
    }

    app.config.globalProperties.$db = db
    app.provide('db', db)
  }
}