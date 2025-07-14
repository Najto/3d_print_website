// server/dataStore.js
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const file = path.join(__dirname, '../data/aos-data.json');
const adapter = new JSONFile(file);
const defaultData = { armies: [], otherCategories: [] }; // ← das brauchst du!
const db = new Low(adapter, defaultData); // ← Fehler war: kein defaultData

async function initDB() {
  await db.read();
  db.data ||= defaultData;
  await db.write();
}

async function getData() {
  await db.read();
  return db.data;
}

async function setData(newData) {
  db.data = newData;
  await db.write();
}

async function clearData() {
  db.data = defaultData;
  await db.write();
}

module.exports = { initDB, getData, setData, clearData };
