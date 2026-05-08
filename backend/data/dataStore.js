/**
 * dataStore.js - Simple JSON file-based data persistence
 * 
 * WHY: For a capstone project, this avoids the complexity of setting up
 * MongoDB/PostgreSQL while still demonstrating proper data persistence.
 * The backend reads/writes a JSON file — same concept as a database.
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

// Read all data from the JSON file
function readData() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading data:', error.message);
    // Return default structure if file is corrupted
    return { tasks: [], pomodoroSessions: [] };
  }
}

// Write data back to the JSON file
function writeData(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing data:', error.message);
    return false;
  }
}

// Get a specific collection (e.g., "tasks" or "pomodoroSessions")
function getCollection(collectionName) {
  const data = readData();
  return data[collectionName] || [];
}

// Save a specific collection back
function saveCollection(collectionName, items) {
  const data = readData();
  data[collectionName] = items;
  return writeData(data);
}

module.exports = { readData, writeData, getCollection, saveCollection };
