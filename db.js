/** 
 * db.js - IndexedDB wrapper for local-first PWA storage
 * Stores generic key-value items (users) and a store for calculations (history).
 */

const DB_NAME = 'ElecCalcDB';
const DB_VERSION = 1;
let db = null;

const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (e) => reject('Database error: ' + e.target.errorCode);

        request.onsuccess = (e) => {
            db = e.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (e) => {
            const database = e.target.result;

            // Store 1: Users (key: username, value: object with password/email)
            if (!database.objectStoreNames.contains('users')) {
                database.createObjectStore('users', { keyPath: 'username' });
            }

            // Store 2: History (key: auto-increment id)
            if (!database.objectStoreNames.contains('history')) {
                const historyStore = database.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
                // Indexes to query by user, category or date
                historyStore.createIndex('username', 'username', { unique: false });
                historyStore.createIndex('category', 'category', { unique: false });
                historyStore.createIndex('date', 'date', { unique: false });
            }
        };
    });
};

// === User Methods ===

const addUser = async (userObj) => {
    if (!db) await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['users'], 'readwrite');
        const store = tx.objectStore('users');
        const req = store.add(userObj); // Fails if username already exists keyPath
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject('Kullanıcı adı zaten var!');
    });
};

const getUser = async (username) => {
    if (!db) await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['users'], 'readonly');
        const store = tx.objectStore('users');
        const req = store.get(username);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject('Bulunamadı');
    });
};

// === History / Calculation Methods ===

const saveCalculation = async (calcObj) => {
    if (!db) await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['history'], 'readwrite');
        const store = tx.objectStore('history');
        calcObj.date = new Date().toISOString();
        const req = store.add(calcObj);
        req.onsuccess = () => resolve(req.result); // returns the ID
        req.onerror = () => reject('Kayıt başarısız');
    });
};

const getHistoryByUser = async (username) => {
    if (!db) await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['history'], 'readonly');
        const store = tx.objectStore('history');
        const index = store.index('username');
        const req = index.getAll(IDBKeyRange.only(username));

        req.onsuccess = () => {
            // Return sorted by newest first
            const sorted = req.result.sort((a, b) => new Date(b.date) - new Date(a.date));
            resolve(sorted);
        };
        req.onerror = () => reject('Okuma hatası');
    });
};

const deleteHistoryItem = async (id) => {
    if (!db) await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['history'], 'readwrite');
        const store = tx.objectStore('history');
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject('Silme başarısız');
    });
};

const clearUserHistory = async (username) => {
    if (!db) await initDB();
    return new Promise((resolve, reject) => {
        getHistoryByUser(username).then(items => {
            const tx = db.transaction(['history'], 'readwrite');
            const store = tx.objectStore('history');
            let count = 0;
            if (items.length === 0) resolve(true);
            items.forEach(item => {
                store.delete(item.id).onsuccess = () => {
                    count++;
                    if (count === items.length) resolve(true);
                };
            });
        }).catch(reject);
    });
};

// Auto-init on load
initDB().catch(console.error);

// Expose globally
window.dbAPI = { addUser, getUser, saveCalculation, getHistoryByUser, deleteHistoryItem, clearUserHistory };
