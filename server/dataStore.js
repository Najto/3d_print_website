// server/dataStore.js
const path = require('path');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

// Speicherort der Datei
const dataFilePath = path.join(__dirname, '../data/aos-data.json');
const adapter = new JSONFile(dataFilePath);
const db = new Low(adapter);

// Initialisiere DB
async function initDB() {
  await db.read();
  db.data ||= {
    armies: [],
    otherCategories: []
  };
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
  db.data = {
    armies: [],
    otherCategories: []
  };
  await db.write();
}

module.exports = {
  initDB,
  getData,
  setData,
  clearData
};
