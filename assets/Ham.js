/**
 * FL0W OS - A desktop environment simulation
 * Vanilla JavaScript implementation
 */

// Main application state
const appState = {
  openWindows: [],
  windowOrder: [],
  nextZIndex: 10,
  installedApps: [],
  settings: {
    appearance: {
      darkMode: true,
      transparency: true,
    },
    sound: {
      systemSounds: true,
      volume: 50,
    },
    display: {
      brightness: 80,
    },
    power: {
      autoSleep: "Never",
    },
  },
  minimizedWindows: [],
}

// Dummy implementations to resolve "is not defined" errors
function createCalculator(container) {
  container.textContent = "Calculator App"
}

function createAppStore(container) {
  container.textContent = "App Store App"
}

function createTextEditor(container) {
  container.textContent = "Text Editor App"
}

function createSystemMonitor(container) {
  container.textContent = "System Monitor App"
}

function createCanvasApp(container) {
  container.textContent = "Canvas App"
}

function createNotesApp(container) {
  container.textContent = "Notes App"
}

function createWeatherApp(container) {
  container.textContent = "Weather App"
}

function createCalendarApp(container) {
  container.textContent = "Calendar App"
}

function createTaskManager(container) {
  container.textContent = "Task Manager App"
}

// Window application definitions
const APPS = {
  terminal: {
    title: "Terminal",
    icon: "terminal",
    component: createTerminal,
  },
  audio: {
    title: "Music Player",
    icon: "music",
    component: createAudioPlayer,
  },
  settings: {
    title: "Settings",
    icon: "settings",
    component: createSettings,
  },
  calculator: {
    title: "Calculator",
    icon: "calculator",
    component: createCalculator,
  },
  appstore: {
    title: "App Store",
    icon: "store",
    component: createAppStore,
  },
  editor: {
    title: "Text Editor",
    icon: "file-text",
    component: createTextEditor,
  },
}

// Update STORE_APPS to include all apps
const STORE_APPS = {
  monitor: {
    title: "System Monitor",
    icon: "activity",
    component: createSystemMonitor,
    description: "Monitor system resources and processes",
    category: "Utilities",
  },
  canvas: {
    title: "Canvas Draw",
    icon: "edit-3",
    component: createCanvasApp,
    description: "Simple drawing application",
    category: "Graphics",
  },
  notes: {
    title: "Notes",
    icon: "file-text",
    component: createNotesApp,
    description: "Create and organize notes",
    category: "Productivity",
  },
  weather: {
    title: "Weather",
    icon: "cloud",
    component: createWeatherApp,
    description: "Check weather forecasts",
    category: "Utilities",
  },
  calendar: {
    title: "Calendar",
    icon: "calendar",
    component: createCalendarApp,
    description: "Manage your schedule",
    category: "Productivity",
  },
  tasks: {
    title: "Task Manager",
    icon: "check-square",
    component: createTaskManager,
    description: "Organize your tasks",
    category: "Productivity",
  },
}

// Audio track data
const AUDIO_TRACK = {
  title: "Alone",
  artist: "BoDleasons",
  url: "https://cdn.pixabay.com/audio/2025/02/03/audio_502e27ab2b.mp3",
}

// Remove Discord and Spotify from FEATURED_APPS
const FEATURED_APPS = [
  {
    name: "System Monitor",
    description: "Monitor system resources and processes",
    icon: "📊",
    category: "Utilities",
    id: "monitor",
  },
  {
    name: "Canvas Draw",
    description: "Simple drawing application",
    icon: "🎨",
    category: "Graphics",
    id: "canvas",
  },
  {
    name: "Notes",
    description: "Create and organize notes",
    icon: "📝",
    category: "Productivity",
    id: "notes",
  },
  {
    name: "Weather",
    description: "Check weather forecasts",
    icon: "🌤️",
    category: "Utilities",
    id: "weather",
  },
]

// Database configuration
const DB_CONFIG = {
  name: "flowOS",
  version: 1,
  stores: {
    settings: { keyPath: "id" },
    apps: { keyPath: "id" },
    windows: { keyPath: "id" },
    notes: { keyPath: "id" },
    tasks: { keyPath: "id" },
    calendar: { keyPath: "id" },
    files: { keyPath: "id" },
  },
}

/**
 * Initialize the application when DOM is fully loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  initializeDB().then(() => {
    loadAppState().then(() => {
      initializeApp()
    })
  })
})

/**
 * Initialize the IndexedDB database
 * @returns {Promise} A promise that resolves when the database is ready
 */
function initializeDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version)

    request.onerror = (event) => {
      console.error("Database error:", event.target.error)
      reject(event.target.error)
    }

    request.onsuccess = (event) => {
      console.log("Database opened successfully")
      resolve(event.target.result)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("apps")) {
        db.createObjectStore("apps", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("windows")) {
        db.createObjectStore("windows", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("notes")) {
        db.createObjectStore("notes", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("tasks")) {
        db.createObjectStore("tasks", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("calendar")) {
        db.createObjectStore("calendar", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id" })
      }
    }
  })
}

/**
 * Save data to IndexedDB
 * @param {string} storeName - The name of the object store
 * @param {Object} data - The data to save
 * @returns {Promise} A promise that resolves when the data is saved
 */
function saveToDb(storeName, data) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_CONFIG.name)

    request.onerror = (event) => {
      console.error("Error opening database:", event.target.error)
      reject(event.target.error)
    }

    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)

      const saveRequest = store.put(data)

      saveRequest.onsuccess = () => {
        resolve()
      }

      saveRequest.onerror = (event) => {
        console.error("Error saving data:", event.target.error)
        reject(event.target.error)
      }
    }
  })
}

/**
 * Get data from IndexedDB
 * @param {string} storeName - The name of the object store
 * @param {string} id - The ID of the data to get
 * @returns {Promise} A promise that resolves with the data
 */
function getFromDb(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_CONFIG.name)

    request.onerror = (event) => {
      console.error("Error opening database:", event.target.error)
      reject(event.target.error)
    }

    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)

      const getRequest = store.get(id)

      getRequest.onsuccess = (event) => {
        resolve(event.target.result)
      }

      getRequest.onerror = (event) => {
        console.error("Error getting data:", event.target.error)
        reject(event.target.error)
      }
    }
  })
}

/**
 * Load application state from IndexedDB
 */
async function loadAppState() {
  try {
    // Load settings
    const settings = await getFromDb("settings", "userSettings")
    if (settings) {
      appState.settings = settings.data
    } else {
      // Save default settings if none exist
      await saveToDb("settings", { id: "userSettings", data: appState.settings })
    }

    // Load installed apps
    const installedApps = await getFromDb("apps", "installedApps")
    if (installedApps) {
      appState.installedApps = installedApps.data
    } else {
      // Save default installed apps if none exist
      await saveToDb("apps", { id: "installedApps", data: [] })
    }

    console.log("App state loaded successfully")
  } catch (error) {
    console.error("Error loading app state:", error)
  }
}

/**
 * Save application state to IndexedDB
 */
async function saveAppState() {
  try {
    // Save settings
    await saveToDb("settings", { id: "userSettings", data: appState.settings })

    // Save installed apps
    await saveToDb("apps", { id: "installedApps", data: appState.installedApps })

    console.log("App state saved successfully")
  } catch (error) {
    console.error("Error saving app state:", error)
  }
}

// Update the initializeApp function to add Ubuntu-style dock and app menu
function initializeApp() {
  const root = document.getElementById("root")

  // Initialize minimized windows array
  appState.minimizedWindows = []

  // Create main container
  const mainContainer = document.createElement("div")
  mainContainer.className =
    "min-h-screen bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986')] bg-cover bg-center"

  const innerContainer = document.createElement("div")
  innerContainer.className = "min-h-screen bg-gradient-to-b from-black/40 to-black/60 backdrop-blur-sm"

  // Create top bar
  const topBar = createTopBar()

  // Create content area
  const contentArea = document.createElement("div")
  contentArea.className = "container mx-auto p-4 pt-16 relative"
  contentArea.id = "content-area"

  // Create dock
  const dock = createDock()

  // Create app menu overlay
  const appMenu = createAppMenu()

  // Assemble the DOM structure
  innerContainer.appendChild(topBar)
  innerContainer.appendChild(contentArea)
  innerContainer.appendChild(dock)
  mainContainer.appendChild(innerContainer)
  root.appendChild(mainContainer)
  root.appendChild(appMenu)

  // Set up event listeners for keyboard shortcuts
  document.addEventListener("keydown", handleKeyboardShortcuts)

  // Apply settings
  applySettings()
}

/**
 * Apply settings to the UI
 */
function applySettings() {
  // Apply dark mode
  if (appState.settings.appearance.darkMode) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }

  // Apply transparency
  const transparencyLevel = appState.settings.appearance.transparency ? "80" : "100"
  document.querySelectorAll(".bg-gray-900\\/80").forEach((el) => {
    el.className = el.className.replace("bg-gray-900\\/80", `bg-gray-900\\/${transparencyLevel}`)
  })

  // Apply brightness
  const brightness = appState.settings.display.brightness
  document.body.style.filter = `brightness(${brightness / 100})`
}

/**
 * Handle keyboard shortcuts
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyboardShortcuts(event) {
  // Ctrl+Alt+T to open terminal
  if (event.ctrlKey && event.altKey && event.key === "t") {
    openWindow("terminal")
  }
}

/**
 * Create the top bar with app launchers and system info
 * @returns {HTMLElement} The top bar element
 */
function createTopBar() {
  const topBar = document.createElement("div")
  topBar.className =
    "fixed top-0 left-0 right-0 h-8 bg-black/40 backdrop-blur-md text-gray-300 px-4 flex items-center justify-between text-sm z-50"

  // Left side - App launchers
  const leftSide = document.createElement("div")
  leftSide.className = "flex items-center space-x-4"

  // Create app launcher buttons for built-in apps
  Object.keys(APPS).forEach((appId) => {
    const button = document.createElement("button")
    button.className = "hover:bg-white/10 p-1 rounded"
    button.innerHTML = createIconSVG(APPS[appId].icon, 16)
    button.addEventListener("click", () => openWindow(appId))
    leftSide.appendChild(button)
  })

  // Create app launcher buttons for installed apps
  appState.installedApps.forEach((appId) => {
    if (STORE_APPS[appId]) {
      const button = document.createElement("button")
      button.className = "hover:bg-white/10 p-1 rounded"
      button.innerHTML = createIconSVG(STORE_APPS[appId].icon, 16)
      button.addEventListener("click", () => openWindow(appId))
      leftSide.appendChild(button)
    }
  })

  // Right side - System info
  const rightSide = document.createElement("div")
  rightSide.className = "flex items-center space-x-4"

  // Battery indicator
  const batteryContainer = document.createElement("div")
  batteryContainer.className = "flex items-center"
  batteryContainer.id = "battery-indicator"

  // WiFi indicator
  const wifiIndicator = document.createElement("div")
  wifiIndicator.innerHTML = createIconSVG("wifi", 16)

  // Volume indicator
  const volumeIndicator = document.createElement("div")
  volumeIndicator.innerHTML = createIconSVG("volume-2", 16)

  // Clock
  const clock = document.createElement("span")
  clock.id = "clock"
  updateClock(clock)

  // Add elements to right side
  rightSide.appendChild(batteryContainer)
  rightSide.appendChild(wifiIndicator)
  rightSide.appendChild(volumeIndicator)
  rightSide.appendChild(clock)

  // Add sides to top bar
  topBar.appendChild(leftSide)
  topBar.appendChild(rightSide)

  // Set up clock update interval
  setInterval(() => updateClock(clock), 1000)

  // Initialize battery info if available
  initializeBattery(batteryContainer)

  return topBar
}

/**
 * Update the clock with current time
 * @param {HTMLElement} clockElement - The clock element to update
 */
function updateClock(clockElement) {
  const now = new Date()
  clockElement.textContent = now.toLocaleTimeString()
}

/**
 * Initialize battery information if available
 * @param {HTMLElement} container - The container for battery info
 */
function initializeBattery(container) {
  if ("getBattery" in navigator) {
    navigator.getBattery().then((battery) => {
      updateBatteryInfo(container, battery)

      // Set up event listeners for battery changes
      battery.addEventListener("levelchange", () => {
        updateBatteryInfo(container, battery)
      })

      battery.addEventListener("chargingchange", () => {
        updateBatteryInfo(container, battery)
      })
    })
  }
}

/**
 * Update battery information display
 * @param {HTMLElement} container - The container for battery info
 * @param {BatteryManager} battery - The battery manager object
 */
function updateBatteryInfo(container, battery) {
  const level = Math.round(battery.level * 100)
  const charging = battery.charging

  container.innerHTML = `
	  <span>${level}%${charging ? " ⚡" : ""}</span>
	  ${createIconSVG("battery", 16, "ml-1")}
	`
}

// Add new icons to createIconSVG function
function createIconSVG(iconName, size = 24, extraClasses = "") {
  // This is a simplified version - in a real app, you'd have proper SVG paths for each icon
  const iconPaths = {
    terminal: '<polyline points="4 17 10 11 4 5"></polyline><line x1="12" x2="20" y1="19" y2="19"></line>',
    music:
      '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>',
    settings:
      '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle>',
    calculator:
      '<rect width="16" height="20" x="4" y="2" rx="2"></rect><line x1="8" x2="16" y1="6" y2="6"></line><line x1="16" x2="16" y1="14" y2="18"></line><path d="M16 10h.01"></path><path d="M12 10h.01"></path><path d="M8 10h.01"></path><path d="M12 14h.01"></path><path d="M8 14h.01"></path><path d="M12 18h.01"></path><path d="M8 18h.01"></path>',
    store:
      '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"></path>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>',
    "file-text":
      '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path>',
    battery:
      '<rect width="16" height="10" x="2" y="7" rx="2" ry="2"></rect><line x1="22" x2="22" y1="11" y2="13"></line>',
    wifi: '<path d="M12 20h.01"></path><path d="M2 8.82a15 15 0 0 1 20 0"></path><path d="M5 12.859a10 10 0 0 1 14 0"></path><path d="M8.5 16.429a5 5 0 0 1 7 0"></path>',
    "volume-2":
      '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>',
    x: '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
    play: '<polygon points="5 3 19 12 5 21 5 3"></polygon>',
    pause: '<rect width="4" height="16" x="6" y="4"></rect><rect width="4" height="16" x="14" y="4"></rect>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><path d="M15 2v2"></path><path d="M15 20v2"></path><path d="M2 15h2"></path><path d="M2 9h2"></path><path d="M20 15h2"></path><path d="M20 9h2"></path><path d="M9 2v2"></path><path d="M9 20v2"></path>',
    "memory-stick":
      '<path d="M6 19v-3"></path><path d="M10 19v-3"></path><path d="M14 19v-3"></path><path d="M18 19v-3"></path><path d="M8 11V9"></path><path d="M16 11V9"></path><path d="M12 11V9"></path><path d="M2 15h20"></path><path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.837Z"></path>',
    "hard-drive":
      '<line x1="22" x2="2" y1="12" y2="12"></line><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0-1.79 1.11z"></path><line x1="6" x2="6.01" y1="16" y2="16"></line><line x1="10" x2="10.01" y1="16" y2="16"></line>',
    download:
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>',
    "edit-3": '<path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>',
    chevron_left: '<polyline points="15 18 9 12 15 6"></polyline>',
    chevron_right: '<polyline points="9 6 15 12 9 18"></polyline>',
    trash:
      '<path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line>',
    plus: '<line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line>',
    minimize:
      '<polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line>',
    maximize: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>',
    calendar:
      '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
    "check-square":
      '<polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>',
    cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>',
    search: '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>',
    "wifi-off":
      '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>',
    bluetooth: '<path d="m7 7 10 10-5 5V2l5 5L7 17"></path>',
    monitor:
      '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>',
    "grid-3x3":
      '<rect x="4" y="4" width="16" height="16" rx="2"></rect><path d="M4 12h16"></path><path d="M12 4v16"></path>',
    sun: '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>',
    "bell-off":
      '<path d="M8.56 2.9A7 7 0 0 1 19 9v4m-2 4H2a3 3 0 0 0 3-3V9a7 7 0 0 1 .78-3.22M13.73 21a2 2 0 0 1-3.46 0"></path><line x1="1" y1="1" x2="23" y2="23"></line>',
    "mouse-pointer": '<path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="m13 13 6 6"></path>',
    mouse: '<rect x="6" y="3" width="12" height="18" rx="6"></rect><path d="M12 7v4"></path>',
    keyboard:
      '<rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><path d="M6 8h.001"></path><path d="M10 8h.001"></path><path d="M14 8h.001"></path><path d="M18 8h.001"></path><path d="M8 12h.001"></path><path d="M12 12h.001"></path><path d="M16 12h.001"></path><path d="M7 16h10"></path>',
    "grid-4x4":
      '<rect x="2" y="2" width="20" height="20" rx="2"></rect><path d="M2 12h20"></path><path d="M12 2v20"></path><path d="M2 7h20"></path><path d="M2 17h20"></path><path d="M7 2v20"></path><path d="M17 2v20"></path>',
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${extraClasses}">${iconPaths[iconName] || ""}</svg>`
}

// Update createWindowElement function to add minimize and maximize buttons
function createWindowElement(appId, title, iconName) {
  const window = document.createElement("div")
  window.className =
    "absolute bg-gray-900/80 backdrop-blur-md rounded-lg overflow-hidden border border-gray-700/50 shadow-lg"
  window.id = `window-${appId}`
  window.style.left = `${50 + Math.random() * 100}px`
  window.style.top = `${50 + Math.random() * 100}px`
  window.style.minWidth = "400px"
  window.dataset.isMaximized = "false"

  // Window header
  const header = document.createElement("div")
  header.className = "p-2 bg-gray-800/50 border-b border-gray-700/50 flex items-center justify-between cursor-move"

  // Title area
  const titleArea = document.createElement("div")
  titleArea.className = "flex items-center space-x-2 text-gray-300 text-sm"
  titleArea.innerHTML = `
    ${createIconSVG(iconName, 16)}
    <span>${title}</span>
  `

  // Window controls
  const controlsArea = document.createElement("div")
  controlsArea.className = "flex items-center space-x-1"

  // Minimize button
  const minimizeButton = document.createElement("button")
  minimizeButton.className = "text-gray-400 hover:text-gray-200 cursor-pointer p-1"
  minimizeButton.innerHTML = createIconSVG("minimize", 14)
  minimizeButton.addEventListener("click", (e) => {
    e.stopPropagation()
    minimizeWindow(appId)
  })

  // Maximize button
  const maximizeButton = document.createElement("button")
  maximizeButton.className = "text-gray-400 hover:text-gray-200 cursor-pointer p-1"
  maximizeButton.innerHTML = createIconSVG("maximize", 14)
  maximizeButton.addEventListener("click", (e) => {
    e.stopPropagation()
    toggleMaximizeWindow(appId, window)
  })

  // Close button
  const closeButton = document.createElement("button")
  closeButton.className = "text-gray-400 hover:text-gray-200 cursor-pointer p-1"
  closeButton.innerHTML = createIconSVG("x", 14)
  closeButton.addEventListener("click", () => closeWindow(appId))

  // Add buttons to controls
  controlsArea.appendChild(minimizeButton)
  controlsArea.appendChild(maximizeButton)
  controlsArea.appendChild(closeButton)

  // Window content
  const content = document.createElement("div")
  content.className = "p-4 window-content"

  // Assemble window
  header.appendChild(titleArea)
  header.appendChild(controlsArea)
  window.appendChild(header)
  window.appendChild(content)

  // Make window draggable
  makeDraggable(window, header)

  // Add click event to bring window to front
  window.addEventListener("mousedown", () => bringWindowToFront(appId))

  return window
}

// Function to minimize window
function minimizeWindow(appId) {
  const windowElement = document.getElementById(`window-${appId}`)
  if (windowElement) {
    // Store window for restoration
    const minimizedWindows = appState.minimizedWindows || []
    if (!minimizedWindows.includes(appId)) {
      minimizedWindows.push(appId)
      appState.minimizedWindows = minimizedWindows
    }

    // Hide window
    windowElement.style.display = "none"

    // Add to dock if not already there
    updateDock()
  }
}

// Function to restore minimized window
function restoreWindow(appId) {
  const windowElement = document.getElementById(`window-${appId}`)
  if (windowElement) {
    // Remove from minimized windows
    if (appState.minimizedWindows) {
      appState.minimizedWindows = appState.minimizedWindows.filter((id) => id !== appId)
    }

    // Show window
    windowElement.style.display = "block"

    // Bring to front
    bringWindowToFront(appId)

    // Update dock
    updateDock()
  }
}

// Function to toggle maximize window
function toggleMaximizeWindow(appId, windowElement) {
  if (windowElement.dataset.isMaximized === "true") {
    // Restore window size and position
    if (windowElement.dataset.prevWidth) windowElement.style.width = windowElement.dataset.prevWidth
    if (windowElement.dataset.prevHeight) windowElement.style.height = windowElement.dataset.prevHeight
    if (windowElement.dataset.prevLeft) windowElement.style.left = windowElement.dataset.prevLeft
    if (windowElement.dataset.prevTop) windowElement.style.top = windowElement.dataset.prevTop
    windowElement.dataset.isMaximized = "false"
  } else {
    // Store current size and position
    windowElement.dataset.prevWidth = windowElement.style.width
    windowElement.dataset.prevHeight = windowElement.style.height
    windowElement.dataset.prevLeft = windowElement.style.left
    windowElement.dataset.prevTop = windowElement.style.top

    // Maximize window
    windowElement.style.width = "100%"
    windowElement.style.height = "calc(100vh - 45px)"
    windowElement.style.left = "0"
    windowElement.style.top = "45px"
    windowElement.dataset.isMaximized = "true"
  }
}

// Create Ubuntu-style dock
function createDock() {
  const dock = document.createElement("div")
  dock.className =
    "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/70 backdrop-blur-md rounded-lg p-2 flex items-center space-x-2 z-30"
  dock.id = "app-dock"

  // Add app launchers
  Object.keys(APPS)
    .slice(0, 6)
    .forEach((appId) => {
      const button = document.createElement("button")
      button.className = "p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 relative group"
      button.innerHTML = createIconSVG(APPS[appId].icon, 24)
      button.addEventListener("click", () => {
        if (
          appState.openWindows.includes(appId) &&
          appState.minimizedWindows &&
          appState.minimizedWindows.includes(appId)
        ) {
          restoreWindow(appId)
        } else if (appState.openWindows.includes(appId)) {
          minimizeWindow(appId)
        } else {
          openWindow(appId)
        }
      })

      // Add tooltip
      const tooltip = document.createElement("div")
      tooltip.className =
        "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
      tooltip.textContent = APPS[appId].title
      button.appendChild(tooltip)

      dock.appendChild(button)
    })

  // Add app menu button
  const menuButton = document.createElement("button")
  menuButton.className = "p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 relative group"
  menuButton.innerHTML = createIconSVG("grid-3x3", 24)
  menuButton.addEventListener("click", toggleAppMenu)

  // Add tooltip
  const tooltip = document.createElement("div")
  tooltip.className =
    "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
  tooltip.textContent = "Applications"
  menuButton.appendChild(tooltip)

  dock.appendChild(menuButton)

  return dock
}

// Create Ubuntu-style app menu
function createAppMenu() {
  const overlay = document.createElement("div")
  overlay.className = "fixed inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center hidden"
  overlay.id = "app-menu-overlay"

  const appMenu = document.createElement("div")
  appMenu.className = "bg-gray-900/90 rounded-lg p-6 w-3/4 max-w-4xl max-h-[80vh] overflow-y-auto"

  // Search bar
  const searchContainer = document.createElement("div")
  searchContainer.className = "relative mb-6"

  const searchInput = document.createElement("input")
  searchInput.type = "text"
  searchInput.placeholder = "Search applications..."
  searchInput.className = "w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 outline-none"

  const searchIcon = document.createElement("div")
  searchIcon.className = "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
  searchIcon.innerHTML = createIconSVG("search", 18)

  searchContainer.appendChild(searchInput)
  searchContainer.appendChild(searchIcon)

  // Categories
  const categories = {
    Favorites: [],
    Utilities: [],
    Productivity: [],
    Graphics: [],
    System: [],
  }

  // Populate categories
  Object.keys(APPS).forEach((appId) => {
    const app = APPS[appId]
    if (app.category) {
      categories[app.category] = categories[app.category] || []
      categories[app.category].push({ id: appId, ...app })
    } else {
      categories["Utilities"].push({ id: appId, ...app })
    }
  })

  Object.keys(STORE_APPS).forEach((appId) => {
    if (appState.installedApps && appState.installedApps.includes(appId)) {
      const app = STORE_APPS[appId]
      if (app.category) {
        categories[app.category] = categories[app.category] || []
        categories[app.category].push({ id: appId, ...app })
      } else {
        categories["Utilities"].push({ id: appId, ...app })
      }
    }
  })

  // Add frequent apps to favorites
  categories["Favorites"] = [
    ...Object.keys(APPS)
      .slice(0, 4)
      .map((id) => ({ id, ...APPS[id] })),
  ]

  // Create category sections
  Object.keys(categories).forEach((category) => {
    if (categories[category].length === 0) return

    const section = document.createElement("div")
    section.className = "mb-6"

    const sectionTitle = document.createElement("h3")
    sectionTitle.className = "text-lg font-medium text-gray-300 mb-3"
    sectionTitle.textContent = category

    const appGrid = document.createElement("div")
    appGrid.className = "grid grid-cols-4 gap-4"

    // Add apps to grid
    categories[category].forEach((app) => {
      const appItem = document.createElement("div")
      appItem.className =
        "bg-gray-800/50 hover:bg-gray-700/50 rounded-lg p-3 text-center cursor-pointer transition-colors"

      const appIcon = document.createElement("div")
      appIcon.className = "text-cyan-400 mb-2 flex justify-center"
      appIcon.innerHTML = createIconSVG(app.icon, 32)

      const appName = document.createElement("div")
      appName.className = "text-sm text-gray-300"
      appName.textContent = app.title

      appItem.appendChild(appIcon)
      appItem.appendChild(appName)

      appItem.addEventListener("click", () => {
        openWindow(app.id)
        toggleAppMenu() // Close menu after opening app
      })

      appGrid.appendChild(appItem)
    })

    section.appendChild(sectionTitle)
    section.appendChild(appGrid)
    appMenu.appendChild(section)
  })

  // Add search functionality
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase()

    // Clear existing content
    appMenu.innerHTML = ""
    appMenu.appendChild(searchContainer)

    if (searchTerm === "") {
      // Show all categories if search is empty
      Object.keys(categories).forEach((category) => {
        if (categories[category].length === 0) return

        const section = document.createElement("div")
        section.className = "mb-6"

        const sectionTitle = document.createElement("h3")
        sectionTitle.className = "text-lg font-medium text-gray-300 mb-3"
        sectionTitle.textContent = category

        const appGrid = document.createElement("div")
        appGrid.className = "grid grid-cols-4 gap-4"

        categories[category].forEach((app) => {
          const appItem = document.createElement("div")
          appItem.className =
            "bg-gray-800/50 hover:bg-gray-700/50 rounded-lg p-3 text-center cursor-pointer transition-colors"

          const appIcon = document.createElement("div")
          appIcon.className = "text-cyan-400 mb-2 flex justify-center"
          appIcon.innerHTML = createIconSVG(app.icon, 32)

          const appName = document.createElement("div")
          appName.className = "text-sm text-gray-300"
          appName.textContent = app.title

          appItem.appendChild(appIcon)
          appItem.appendChild(appName)

          appItem.addEventListener("click", () => {
            openWindow(app.id)
            toggleAppMenu()
          })

          appGrid.appendChild(appItem)
        })

        section.appendChild(sectionTitle)
        section.appendChild(appGrid)
        appMenu.appendChild(section)
      })
    } else {
      // Show search results
      const results = []

      // Search all apps
      Object.keys(categories).forEach((category) => {
        categories[category].forEach((app) => {
          if (
            app.title.toLowerCase().includes(searchTerm) ||
            (app.description && app.description.toLowerCase().includes(searchTerm))
          ) {
            results.push(app)
          }
        })
      })

      // Create results section
      const resultsSection = document.createElement("div")
      resultsSection.className = "mb-6"

      const resultsTitle = document.createElement("h3")
      resultsTitle.className = "text-lg font-medium text-gray-300 mb-3"
      resultsTitle.textContent = `Search Results (${results.length})`

      const resultsGrid = document.createElement("div")
      resultsGrid.className = "grid grid-cols-4 gap-4"

      if (results.length === 0) {
        const noResults = document.createElement("div")
        noResults.className = "col-span-4 text-center text-gray-400 py-10"
        noResults.textContent = "No matching applications found"
        resultsGrid.appendChild(noResults)
      } else {
        results.forEach((app) => {
          const appItem = document.createElement("div")
          appItem.className =
            "bg-gray-800/50 hover:bg-gray-700/50 rounded-lg p-3 text-center cursor-pointer transition-colors"

          const appIcon = document.createElement("div")
          appIcon.className = "text-cyan-400 mb-2 flex justify-center"
          appIcon.innerHTML = createIconSVG(app.icon, 32)

          const appName = document.createElement("div")
          appName.className = "text-sm text-gray-300"
          appName.textContent = app.title

          appItem.appendChild(appIcon)
          appItem.appendChild(appName)

          appItem.addEventListener("click", () => {
            openWindow(app.id)
            toggleAppMenu()
          })

          resultsGrid.appendChild(appItem)
        })
      }

      resultsSection.appendChild(resultsTitle)
      resultsSection.appendChild(resultsGrid)
      appMenu.appendChild(resultsSection)
    }
  })

  appMenu.appendChild(searchContainer)

  // Close when clicking outside
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      toggleAppMenu()
    }
  })

  overlay.appendChild(appMenu)
  return overlay
}

// Toggle app menu
function toggleAppMenu() {
  const overlay = document.getElementById("app-menu-overlay")
  if (overlay) {
    overlay.classList.toggle("hidden")

    // Focus search when opening
    if (!overlay.classList.contains("hidden")) {
      const searchInput = overlay.querySelector("input")
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 100)
      }
    }
  }
}

// Update dock with open windows
function updateDock() {
  const dock = document.getElementById("app-dock")
  if (!dock) return

  // Clear indicators
  const indicators = dock.querySelectorAll(".window-indicator")
  indicators.forEach((indicator) => indicator.remove())

  // Add indicators for open windows
  appState.openWindows.forEach((appId) => {
    const button = dock.querySelector(`button:nth-child(${Object.keys(APPS).indexOf(appId) + 1})`)
    if (button) {
      if (!button.querySelector(".window-indicator")) {
        const indicator = document.createElement("div")
        indicator.className =
          "window-indicator absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full"
        button.appendChild(indicator)
      }
    }
  })
}

/**
 * Open a new window or bring existing window to front
 * @param {string} appId - The ID of the app to open
 */
function openWindow(appId) {
  // Check if window is already open
  if (appState.openWindows.includes(appId)) {
    bringWindowToFront(appId)
    restoreWindow(appId)
    return
  }

  // Add to open windows list
  appState.openWindows.push(appId)
  appState.windowOrder.push(appId)

  // Get app info from either built-in or installed apps
  const appInfo = APPS[appId] || STORE_APPS[appId]
  if (!appInfo) {
    console.error(`App ${appId} not found`)
    return
  }

  // Create window
  const windowElement = createWindowElement(appId, appInfo.title, appInfo.icon)

  // Add window content
  const contentElement = windowElement.querySelector(".window-content")
  appInfo.component(contentElement)

  // Add to DOM
  document.getElementById("content-area").appendChild(windowElement)

  // Bring to front
  bringWindowToFront(appId)

  // Load window position if saved
  loadWindowPosition(appId, windowElement)
}

/**
 * Load window position from IndexedDB
 * @param {string} appId - The ID of the app
 * @param {HTMLElement} windowElement - The window element
 */
async function loadWindowPosition(appId, windowElement) {
  try {
    const windowData = await getFromDb("windows", appId)
    if (windowData) {
      windowElement.style.left = windowData.position.left
      windowElement.style.top = windowData.position.top
      if (windowData.position.width) {
        windowElement.style.width = windowData.position.width
      }
      if (windowData.position.height) {
        windowElement.style.height = windowData.position.height
      }
    }
  } catch (error) {
    console.error("Error loading window position:", error)
  }
}

/**
 * Save window position to IndexedDB
 * @param {string} appId - The ID of the app
 * @param {HTMLElement} windowElement - The window element
 */
async function saveWindowPosition(appId, windowElement) {
  try {
    const position = {
      left: windowElement.style.left,
      top: windowElement.style.top,
    }

    // Save width and height if they are set
    if (windowElement.style.width) {
      position.width = windowElement.style.width
    }
    if (windowElement.style.height) {
      position.height = windowElement.style.height
    }

    await saveToDb("windows", { id: appId, position })
  } catch (error) {
    console.error("Error saving window position:", error)
  }
}

/**
 * Make an element draggable by dragging its header
 * @param {HTMLElement} element - The element to make draggable
 * @param {HTMLElement} handle - The element to use as drag handle
 */
function makeDraggable(element, handle) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0

  handle.onmousedown = dragMouseDown

  function dragMouseDown(e) {
    e.preventDefault()
    // Get the mouse cursor position at startup
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // Call a function whenever the cursor moves
    document.onmousemove = elementDrag
  }

  function elementDrag(e) {
    e.preventDefault()
    // Calculate the new cursor position
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    // Set the element's new position
    element.style.top = element.offsetTop - pos2 + "px"
    element.style.left = element.offsetLeft - pos1 + "px"
  }

  function closeDragElement() {
    // Stop moving when mouse button is released
    document.onmouseup = null
    document.onmousemove = null

    // Save window position
    const appId = element.id.replace("window-", "")
    saveWindowPosition(appId, element)
  }
}

/**
 * Bring a window to the front
 * @param {string} appId - The ID of the app
 */
function bringWindowToFront(appId) {
  // Update window order
  appState.windowOrder = appState.windowOrder.filter((id) => id !== appId)
  appState.windowOrder.push(appId)

  // Update z-index of all windows
  appState.openWindows.forEach((id) => {
    const windowElement = document.getElementById(`window-${id}`)
    if (windowElement) {
      const zIndex = 10 + appState.windowOrder.indexOf(id)
      windowElement.style.zIndex = zIndex
    }
  })
}

/**
 * Close a window
 * @param {string} appId - The ID of the app to close
 */
function closeWindow(appId) {
  // Remove from open windows and window order
  appState.openWindows = appState.openWindows.filter((id) => id !== appId)
  appState.windowOrder = appState.windowOrder.filter((id) => id !== appId)

  // Remove window element
  const windowElement = document.getElementById(`window-${appId}`)
  if (windowElement) {
    windowElement.remove()
  }
}

/**
 * Create terminal app content
 * @param {HTMLElement} container - The container element
 */
function createTerminal(container) {
  container.className = "font-mono text-sm"

  // Terminal output
  const output = document.createElement("div")
  output.className = "text-cyan-400 whitespace-pre-wrap"

  // Command input area
  const inputArea = document.createElement("div")
  inputArea.className = "flex items-center text-cyan-400 mt-2"

  const prompt = document.createElement("span")
  prompt.className = "mr-2"
  prompt.textContent = ">"

  const input = document.createElement("input")
  input.type = "text"
  input.className = "bg-transparent border-none outline-none text-cyan-400 w-full"
  input.autofocus = true

  // Handle command execution
  const history = []
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = input.value.trim().toLowerCase()

      // Add command to output
      const commandLine = document.createElement("div")
      commandLine.textContent = `> ${input.value}`
      output.appendChild(commandLine)

      // Process command
      if (command === "neofetch") {
        const neofetchOutput = document.createElement("div")
        neofetchOutput.innerHTML = `
			<br>yuki@archlinux
			--------------
			OS: Arch Linux x86_64
			Host: MS-7788 3.0
			Kernel: 6.13.2-arch1-1
			Uptime: 1 day, 18 hours, 4 mins
			Packages: 1024 (pacman)
			Shell: fish 3.7.1
			Resolution: 1440x900
			WM: dwm
			Theme: Catppuccin-Mocha-Standard
			Icons: Breeze-Round-Chameleon Dark
			Terminal: st
			CPU: Intel i7-4770K (8) @ 4.000GHz
			Memory: 1.56GiB / 7.65GiB (20%)
		  `
        output.appendChild(neofetchOutput)
      } else if (command === "clear") {
        // Clear output
        output.innerHTML = ""
      } else if (command === "ls") {
        const lsOutput = document.createElement("div")
        lsOutput.innerHTML = `
			Documents  Downloads  Pictures  Music  Videos
		  `
        output.appendChild(lsOutput)
      } else if (command === "help") {
        const helpOutput = document.createElement("div")
        helpOutput.innerHTML = `
			Available commands:
			- neofetch: Display system information
			- clear: Clear the terminal
			- ls: List files and directories
			- help: Display this help message
		  `
        output.appendChild(helpOutput)
      } else if (command) {
        // Unknown command
        const errorLine = document.createElement("div")
        errorLine.textContent = `Command not found: ${command}`
        output.appendChild(errorLine)
      }

      // Clear input
      input.value = ""
    }
  })

  // Assemble terminal
  inputArea.appendChild(prompt)
  inputArea.appendChild(input)
  container.appendChild(output)
  container.appendChild(inputArea)

  // Focus input
  setTimeout(() => input.focus(), 0)
}

/**
 * Create audio player app content
 * @param {HTMLElement} container - The container element
 */
function createAudioPlayer(container) {
  container.className = "w-full max-w-md mx-auto text-gray-300"

  // Create audio element
  const audio = document.createElement("audio")
  audio.src = AUDIO_TRACK.url
  audio.loop = true

  // Track info
  const trackInfo = document.createElement("div")
  trackInfo.className = "mb-4"
  trackInfo.innerHTML = `
	  <h3 class="text-lg font-semibold">${AUDIO_TRACK.title}</h3>
	  <p class="text-sm text-gray-400">${AUDIO_TRACK.artist}</p>
	`

  // Controls
  const controls = document.createElement("div")
  controls.className = "flex items-center justify-center space-x-4 mb-4"

  const playButton = document.createElement("button")
  playButton.className = "p-3 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-full"
  playButton.innerHTML = createIconSVG("play", 24)

  let isPlaying = false
  playButton.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause()
      playButton.innerHTML = createIconSVG("play", 24)
    } else {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error)
      })
      playButton.innerHTML = createIconSVG("pause", 24)
    }
    isPlaying = !isPlaying
  })

  controls.appendChild(playButton)

  // Progress and volume controls
  const progressContainer = document.createElement("div")
  progressContainer.className = "space-y-2"

  // Time display and progress bar
  const timeDisplay = document.createElement("div")
  timeDisplay.className = "flex items-center space-x-2"

  const currentTime = document.createElement("span")
  currentTime.className = "text-xs"
  currentTime.textContent = "0:00"

  const progressBar = document.createElement("input")
  progressBar.type = "range"
  progressBar.min = "0"
  progressBar.max = "100"
  progressBar.value = "0"
  progressBar.className = "w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"

  const duration = document.createElement("span")
  duration.className = "text-xs"
  duration.textContent = "0:00"

  timeDisplay.appendChild(currentTime)
  timeDisplay.appendChild(progressBar)
  timeDisplay.appendChild(duration)

  // Volume control
  const volumeControl = document.createElement("div")
  volumeControl.className = "flex items-center space-x-2"

  volumeControl.innerHTML = createIconSVG("volume-2", 16)

  const volumeSlider = document.createElement("input")
  volumeSlider.type = "range"
  volumeSlider.min = "0"
  volumeSlider.max = "1"
  volumeSlider.step = "0.01"
  volumeSlider.value = "0.5"
  volumeSlider.className = "w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"

  volumeControl.appendChild(volumeSlider)

  // Update volume when slider changes
  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value
  })

  progressContainer.appendChild(timeDisplay)
  progressContainer.appendChild(volumeControl)

  // Update progress bar and time display
  audio.addEventListener("timeupdate", () => {
    const currentMinutes = Math.floor(audio.currentTime / 60)
    const currentSeconds = Math.floor(audio.currentTime % 60)
      .toString()
      .padStart(2, "0")
    currentTime.textContent = `${currentMinutes}:${currentSeconds}`

    progressBar.value = (audio.currentTime / audio.duration) * 100 || 0
  })

  audio.addEventListener("loadedmetadata", () => {
    const durationMinutes = Math.floor(audio.duration / 60)
    const durationSeconds = Math.floor(audio.duration % 60)
      .toString()
      .padStart(2, "0")
    duration.textContent = `${durationMinutes}:${durationSeconds}`
  })

  // Allow seeking
  progressBar.addEventListener("input", () => {
    const seekTime = (progressBar.value / 100) * audio.duration
    audio.currentTime = seekTime
  })

  // Assemble audio player
  container.appendChild(audio)
  container.appendChild(trackInfo)
  container.appendChild(controls)
  container.appendChild(progressContainer)
}

// Create settings app content
function createSettings(container) {
  container.className = "w-[800px] h-[600px] flex"

  // Sidebar
  const sidebar = document.createElement("div")
  sidebar.className = "w-64 bg-gray-800/50 border-r border-gray-700/50 overflow-y-auto"

  const settingsSections = [
    { id: "wifi", title: "Wi-Fi", icon: "wifi" },
    { id: "network", title: "Network", icon: "activity" },
    { id: "bluetooth", title: "Bluetooth", icon: "bluetooth" },
    { id: "background", title: "Background", icon: "grid-4x4" },
    { id: "appearance", title: "Appearance", icon: "grid-3x3" },
    { id: "notifications", title: "Notifications", icon: "bell-off" },
    { id: "search", title: "Search", icon: "search" },
    { id: "applications", title: "Applications", icon: "grid-3x3" },
    { id: "privacy", title: "Privacy", icon: "lock" },
    { id: "online", title: "Online Accounts", icon: "globe" },
    { id: "sharing", title: "Sharing", icon: "share-2" },
    { id: "sound", title: "Sound", icon: "volume-2" },
    { id: "power", title: "Power", icon: "battery" },
    { id: "displays", title: "Displays", icon: "monitor" },
    { id: "mouse", title: "Mouse & Touchpad", icon: "mouse" },
    { id: "keyboard", title: "Keyboard Shortcuts", icon: "keyboard" },
  ]

  // Add sections to sidebar
  settingsSections.forEach((section) => {
    const sectionItem = document.createElement("div")
    sectionItem.className = "flex items-center px-4 py-3 cursor-pointer hover:bg-gray-700/50 transition-colors"
    sectionItem.dataset.section = section.id

    const iconContainer = document.createElement("div")
    iconContainer.className = "w-6 h-6 flex items-center justify-center text-gray-400 mr-3"
    iconContainer.innerHTML = createIconSVG(section.icon, 18)

    const title = document.createElement("span")
    title.className = "text-gray-300"
    title.textContent = section.title

    sectionItem.appendChild(iconContainer)
    sectionItem.appendChild(title)
    sidebar.appendChild(sectionItem)

    // Add click event
    sectionItem.addEventListener("click", () => {
      // Remove active class from all items
      sidebar.querySelectorAll("div[data-section]").forEach((item) => {
        item.classList.remove("bg-gray-700")
      })

      // Add active class to clicked item
      sectionItem.classList.add("bg-gray-700")

      // Show corresponding content
      showSettingsContent(section.id, contentContainer)
    })
  })

  // Content area
  const contentContainer = document.createElement("div")
  contentContainer.className = "flex-1 bg-gray-900/80 overflow-y-auto"

  // Header
  const header = document.createElement("div")
  header.className = "flex items-center justify-between px-6 py-3 bg-gray-800/70 border-b border-gray-700/50"

  const headerTitle = document.createElement("h2")
  headerTitle.className = "text-xl font-semibold text-gray-300"
  headerTitle.id = "settings-header-title"
  headerTitle.textContent = "Settings"

  const headerActions = document.createElement("div")
  headerActions.className = "flex items-center space-x-2"

  // Window controls (just for visual consistency, functionality handled by window)
  const minimizeBtn = document.createElement("button")
  minimizeBtn.className = "w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-200"
  minimizeBtn.innerHTML = createIconSVG("minus", 14)

  const maximizeBtn = document.createElement("button")
  maximizeBtn.className = "w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-200"
  maximizeBtn.innerHTML = createIconSVG("square", 14)

  headerActions.appendChild(minimizeBtn)
  headerActions.appendChild(maximizeBtn)

  header.appendChild(headerTitle)
  header.appendChild(headerActions)

  contentContainer.appendChild(header)

  // Assemble settings app
  container.appendChild(sidebar)
  container.appendChild(contentContainer)

  // Show default section (Wi-Fi)
  sidebar.querySelector("div[data-section='wifi']").classList.add("bg-gray-700")
  showSettingsContent("wifi", contentContainer)
}

// Show settings content for a specific section
function showSettingsContent(sectionId, container) {
  // Update header title
  const headerTitle = document.getElementById("settings-header-title")
  if (headerTitle) {
    const section =
      container.querySelector(`[data-section="${sectionId}"]`) ||
      document.querySelector(`[data-section="${sectionId}"]`)
    if (section) {
      headerTitle.textContent = section.querySelector("span").textContent
    }
  }

  // Clear existing content (except header)
  const header = container.querySelector("div:first-child")
  container.innerHTML = ""
  container.appendChild(header)

  // Content container
  const content = document.createElement("div")
  content.className = "p-6"

  // Generate section content
  switch (sectionId) {
    case "wifi":
      generateWifiSection(content)
      break
    case "bluetooth":
      generateBluetoothSection(content)
      break
    case "displays":
      generateDisplaysSection(content)
      break
    case "appearance":
      generateAppearanceSection(content)
      break
    case "sound":
      generateSoundSection(content)
      break
    case "power":
      generatePowerSection(content)
      break
    default:
      // Generic placeholder for other sections
      const placeholderText = document.createElement("div")
      placeholderText.className = "text-gray-400 text-center py-10"
      placeholderText.textContent = `${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} settings panel`
      content.appendChild(placeholderText)
  }

  container.appendChild(content)
}

// Generate Wi-Fi section
function generateWifiSection(container) {
  // Wi-Fi toggle
  const toggleContainer = document.createElement("div")
  toggleContainer.className = "flex items-center justify-between mb-6"

  const toggleLabel = document.createElement("h3")
  toggleLabel.className = "text-lg font-medium text-gray-300"
  toggleLabel.textContent = "Wi-Fi"

  const toggle = document.createElement("div")
  toggle.className = "relative inline-block w-12 h-6 transition duration-200 ease-in-out"

  const toggleInput = document.createElement("input")
  toggleInput.type = "checkbox"
  toggleInput.className = "opacity-0 w-0 h-0"
  toggleInput.checked = true

  const toggleSlider = document.createElement("span")
  toggleSlider.className =
    "absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-600 transition duration-200 rounded-full before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:transition before:duration-200 before:rounded-full"

  toggleInput.addEventListener("change", () => {
    if (toggleInput.checked) {
      toggleSlider.classList.add("bg-cyan-500")
      toggleSlider.classList.remove("bg-gray-600")
      toggleSlider.style.setProperty("--tw-translate-x", "1.5rem")
      networksContainer.style.display = "block"
      loadingNetworks.style.display = "block"
      setTimeout(() => {
        loadingNetworks.style.display = "none"
        networksList.style.display = "block"
      }, 1500)
    } else {
      toggleSlider.classList.remove("bg-cyan-500")
      toggleSlider.classList.add("bg-gray-600")
      toggleSlider.style.setProperty("--tw-translate-x", "0")
      networksContainer.style.display = "none"
    }
  })

  if (toggleInput.checked) {
    toggleSlider.classList.add("bg-cyan-500")
    toggleSlider.style.setProperty("--tw-translate-x", "1.5rem")
  }

  toggle.appendChild(toggleInput)
  toggle.appendChild(toggleSlider)
  toggleContainer.appendChild(toggleLabel)
  toggleContainer.appendChild(toggle)

  // Networks list
  const networksContainer = document.createElement("div")
  networksContainer.className = "border border-gray-700 rounded-lg overflow-hidden"

  const networksHeader = document.createElement("div")
  networksHeader.className = "px-4 py-3 bg-gray-800/70 border-b border-gray-700"
  networksHeader.textContent = "Wireless Networks"

  const loadingNetworks = document.createElement("div")
  loadingNetworks.className = "p-4 text-center"

  const loadingSpinner = document.createElement("div")
  loadingSpinner.className =
    "inline-block w-6 h-6 border-2 border-gray-200 border-t-cyan-500 rounded-full animate-spin mb-2"

  const loadingText = document.createElement("div")
  loadingText.className = "text-gray-400"
  loadingText.textContent = "Searching for networks..."

  loadingNetworks.appendChild(loadingSpinner)
  loadingNetworks.appendChild(loadingText)

  const networksList = document.createElement("div")
  networksList.className = "divide-y divide-gray-700"
  networksList.style.display = "none"

  // Sample networks
  const networks = [
    { name: "Home Network", signal: 90, secured: true, connected: true },
    { name: "Neighbor's Wi-Fi", signal: 70, secured: true },
    { name: "Guest Network", signal: 50, secured: true },
    { name: "Public Hotspot", signal: 30, secured: false },
    { name: "Office Network", signal: 20, secured: true },
  ]

  networks.forEach((network) => {
    const networkItem = document.createElement("div")
    networkItem.className = "px-4 py-3 hover:bg-gray-800/50 flex items-center justify-between"

    const networkInfo = document.createElement("div")
    networkInfo.className = "flex items-center"

    const signalIcon = document.createElement("div")
    signalIcon.className = "mr-3 text-gray-400"

    // Signal strength icon
    if (network.signal > 70) {
      signalIcon.innerHTML = createIconSVG("wifi", 18)
    } else if (network.signal > 40) {
      // Medium signal icon
      signalIcon.innerHTML = createIconSVG("wifi", 18)
    } else {
      // Weak signal icon
      signalIcon.innerHTML = createIconSVG("wifi", 18)
    }

    const nameContainer = document.createElement("div")

    const networkName = document.createElement("div")
    networkName.className = "text-gray-300"
    networkName.textContent = network.name

    const networkStatus = document.createElement("div")
    networkStatus.className = "text-xs text-gray-400"
    if (network.connected) {
      networkStatus.textContent = "Connected"
    } else if (network.secured) {
      networkStatus.textContent = "Secured"
    } else {
      networkStatus.textContent = "Open network"
    }

    nameContainer.appendChild(networkName)
    nameContainer.appendChild(networkStatus)

    networkInfo.appendChild(signalIcon)
    networkInfo.appendChild(nameContainer)

    const connectButton = document.createElement("button")

    if (network.connected) {
      connectButton.className = "text-cyan-400 text-sm"
      connectButton.textContent = "Disconnect"
    } else {
      connectButton.className = "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-3 py-1 rounded-lg text-sm"
      connectButton.textContent = "Connect"
    }

    networkItem.appendChild(networkInfo)
    networkItem.appendChild(connectButton)
    networksList.appendChild(networkItem)
  })

  networksContainer.appendChild(networksHeader)
  networksContainer.appendChild(loadingNetworks)
  networksContainer.appendChild(networksList)

  container.appendChild(toggleContainer)
  container.appendChild(networksContainer)
}

// Generate Bluetooth section
function generateBluetoothSection(container) {
  // Bluetooth toggle
  const toggleContainer = document.createElement("div")
  toggleContainer.className = "flex items-center justify-between mb-6"

  const toggleLabel = document.createElement("h3")
  toggleLabel.className = "text-lg font-medium text-gray-300"
  toggleLabel.textContent = "Bluetooth"

  const toggle = document.createElement("div")
  toggle.className = "relative inline-block w-12 h-6 transition duration-200 ease-in-out"

  const toggleInput = document.createElement("input")
  toggleInput.type = "checkbox"
  toggleInput.className = "opacity-0 w-0 h-0"
  toggleInput.checked = false

  const toggleSlider = document.createElement("span")
  toggleSlider.className =
    "absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-600 transition duration-200 rounded-full before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:transition before:duration-200 before:rounded-full"

  toggleInput.addEventListener("change", () => {
    if (toggleInput.checked) {
      toggleSlider.classList.add("bg-cyan-500")
      toggleSlider.classList.remove("bg-gray-600")
      toggleSlider.style.setProperty("--tw-translate-x", "1.5rem")
      devicesContainer.style.display = "block"
      loadingDevices.style.display = "block"
      setTimeout(() => {
        loadingDevices.style.display = "none"
        noDevicesFound.style.display = "block"
      }, 2000)
    } else {
      toggleSlider.classList.remove("bg-cyan-500")
      toggleSlider.classList.add("bg-gray-600")
      toggleSlider.style.setProperty("--tw-translate-x", "0")
      devicesContainer.style.display = "none"
    }
  })

  toggle.appendChild(toggleInput)
  toggle.appendChild(toggleSlider)
  toggleContainer.appendChild(toggleLabel)
  toggleContainer.appendChild(toggle)

  // Visible to others
  const visibilityContainer = document.createElement("div")
  visibilityContainer.className = "flex items-center justify-between mb-6"

  const visibilityLabel = document.createElement("div")
  visibilityLabel.className = "text-gray-300"
  visibilityLabel.textContent = "Visible to others"

  const visibilityToggle = document.createElement("div")
  visibilityToggle.className = "relative inline-block w-12 h-6 transition duration-200 ease-in-out"

  const visibilityInput = document.createElement("input")
  visibilityInput.type = "checkbox"
  visibilityInput.className = "opacity-0 w-0 h-0"
  visibilityInput.checked = false
  visibilityInput.disabled = !toggleInput.checked

  const visibilitySlider = document.createElement("span")
  visibilitySlider.className =
    "absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-600 transition duration-200 rounded-full before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:transition before:duration-200 before:rounded-full"

  visibilityInput.addEventListener("change", () => {
    if (visibilityInput.checked) {
      visibilitySlider.classList.add("bg-cyan-500")
      visibilitySlider.classList.remove("bg-gray-600")
      visibilitySlider.style.setProperty("--tw-translate-x", "1.5rem")
    } else {
      visibilitySlider.classList.remove("bg-cyan-500")
      visibilitySlider.classList.add("bg-gray-600")
      visibilitySlider.style.setProperty("--tw-translate-x", "0")
    }
  })

  // Update visibility toggle based on Bluetooth toggle
  toggleInput.addEventListener("change", () => {
    visibilityInput.disabled = !toggleInput.checked
    if (!toggleInput.checked) {
      visibilityInput.checked = false
      visibilitySlider.classList.remove("bg-cyan-500")
      visibilitySlider.classList.add("bg-gray-600")
      visibilitySlider.style.setProperty("--tw-translate-x", "0")
    }
  })

  visibilityToggle.appendChild(visibilityInput)
  visibilityToggle.appendChild(visibilitySlider)
  visibilityContainer.appendChild(visibilityLabel)
  visibilityContainer.appendChild(visibilityToggle)

  // Devices list
  const devicesContainer = document.createElement("div")
  devicesContainer.className = "border border-gray-700 rounded-lg overflow-hidden"
  devicesContainer.style.display = "none"

  const devicesHeader = document.createElement("div")
  devicesHeader.className = "px-4 py-3 bg-gray-800/70 border-b border-gray-700"
  devicesHeader.textContent = "Bluetooth Devices"

  const loadingDevices = document.createElement("div")
  loadingDevices.className = "p-4 text-center"

  const loadingSpinner = document.createElement("div")
  loadingSpinner.className =
    "inline-block w-6 h-6 border-2 border-gray-200 border-t-cyan-500 rounded-full animate-spin mb-2"

  const loadingText = document.createElement("div")
  loadingText.className = "text-gray-400"
  loadingText.textContent = "Searching for devices..."

  loadingDevices.appendChild(loadingSpinner)
  loadingDevices.appendChild(loadingText)

  const noDevicesFound = document.createElement("div")
  noDevicesFound.className = "p-10 text-center text-gray-400"
  noDevicesFound.textContent = "No Bluetooth devices found nearby"
  noDevicesFound.style.display = "none"

  devicesContainer.appendChild(devicesHeader)
  devicesContainer.appendChild(loadingDevices)
  devicesContainer.appendChild(noDevicesFound)

  container.appendChild(toggleContainer)
  container.appendChild(visibilityContainer)
  container.appendChild(devicesContainer)
}

// Generate Displays section
function generateDisplaysSection(container) {
  // Header
  const header = document.createElement("div")
  header.className = "mb-6"
  
  const title = document.createElement("h3")
  title.className = "text-lg font-medium text-gray-300 mb-2"
  title.textContent = "Displays"
  
  const description = document.createElement("p")
  description.className = "text-gray-400"
  description.textContent = "Drag displays to match your physical display setup. Select a display to change its settings."
  
  header.appendChild(title)
  header.appendChild(description)
  
  // Display layout
  const displayLayout = document.createElement("div")
  displayLayout.className = "bg-gray-800/70 rounded-lg p-6 mb-6"
  
  const displaysPreview = document.createElement("div")
  displaysPreview.className = "bg-gray-900/80 rounded-lg p-4 h-48 flex items-center justify-center gap-4"
  
  const displayPreview1 = document.createElement("div")
  displayPreview1.className = "w-40 h-32 bg-orange-500 rounded border-2 border-white flex items-center justify-center relative"
  displayPreview1.innerHTML = "<span class='text-white font-bold'>1</span>"
  
  const displayPreview2 = document.createElement("div")
  displayPreview2.className = "w-40 h-32 bg-gray-700 rounded border-2 border-transparent flex items-center justify-center relative"
  displayPreview2.innerHTML = "<span class='text-white font-bold'>2</span>"
  
  const displayPreview3 = document.createElement("div")
  displayPreview3.className = "w-40 h-32 bg-gray-700 rounded border-2 border-transparent flex items-center justify-center relative"
  displayPreview3.innerHTML = "<span class='text-white font-bold'>3</span>"
  
  displaysPreview.appendChild(displayPreview1)
  displaysPreview.appendChild(displayPreview2)
  displaysPreview.appendChild(displayPreview3)
  
  displayLayout.appendChild(displaysPreview)
  
  // Primary display settings
  const primaryDisplay = document.createElement("div")
  primaryDisplay.className = "bg-gray-800/70 rounded-lg p-4 mb-6"
  
  const primaryHeader = document.createElement("div")
  primaryHeader.className = "flex justify-between items-center mb-4"
  
  const primaryTitle = document.createElement("h4")
  primaryTitle.className = "font-medium text-gray-300"
  primaryTitle.textContent = "Primary Display"
  
  const primaryInfo = document.createElement("div")
  primaryInfo.className = "text-sm text-gray-400"
  primaryInfo.textContent = "Contains your dock and Activities"
  
  const primarySubheader = document.createElement("div")
  primarySubheader.appendChild(primaryTitle)
  primarySubheader.appendChild(primaryInfo)
  
  const primarySelector = document.createElement("div")
  primarySelector.className = "flex items-center space-x-2"
  
  const displayNumber = document.createElement("span")
  displayNumber.className = "text-gray-300"
  displayNumber.textContent = "1"
  
  const displaySelector = document.createElement("select")
  displaySelector.className = "bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-300"
  
  const displayOption = document.createElement("option")
  displayOption.textContent = "Built-in display"
  displayOption.value = "builtin"
  displayOption.selected = true
  
  displaySelector.appendChild(displayOption)
  
  primarySelector.appendChild(displayNumber)
  primarySelector.appendChild(displaySelector)
  
  primaryHeader.appendChild(primarySubheader)
  primaryHeader.appendChild(primarySelector)
  
  primaryDisplay.appendChild(primaryHeader)
  
  // Display settings
  const displaySettings = document.createElement("div")
  displaySettings.className = "space-y-4"
  
  // Function to create a setting row
  function createSettingRow(label, control) {
    const row = document.createElement("div")
    row.className = "flex justify-between items-center"
    
    const labelEl = document.createElement("div")
    labelEl.className = "text-gray-300"
    labelEl.textContent = label
    
    row.appendChild(labelEl)
    row.appendChild(control)
    
    return row
  }
  
  // Display type
  const displayTypeSelect = document.createElement("select")
  displayTypeSelect.className = "bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-300"
  
  const builtinOption = document.createElement("option")
  builtinOption.textContent = "Built-in display"
  builtinOption.value = "builtin"
  builtinOption.selected = true
  
  displayTypeSelect.appendChild(builtinOption)
  
  const displayTypeRow = createSettingRow("1    Built-in display", displayTypeSelect)
  
  // Orientation
  const orientationSelect = document.createElement("select")
  orientationSelect.className = "bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-300"
  
  const landscapeOption = document.createElement("option")
  landscapeOption.textContent = "Landscape"
  landscapeOption.value = "landscape"
  landscapeOption.selected = true
  
  const portraitOption = document.createElement("option")
  portraitOption.textContent = "Portrait"
  portraitOption.value = "portrait"
  
  orientationSelect.appendChild(landscapeOption)
  orientationSelect.appendChild(portraitOption)
  
  const orientationRow = createSettingRow("Orientation", orientationSelect)
  
  // Resolution
  const resolutionSelect = document.createElement("select")
  resolutionSelect.className = "bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-300"
  
  const resolution1Option = document.createElement("option")
  resolution1Option.textContent = "3840 × 2400 (16:10)"
  resolution1Option.value = "3840x2400"
  resolution1Option.selected = true
  
  const resolution2Option = document.createElement("option")
  resolution2Option.textContent = "2560 × 1600 (16:10)"
  resolution2Option.value = "2560x1600"
  
  resolutionSelect.appendChild(resolution1Option)
  resolutionSelect.appendChild(resolution2Option)
  
  const resolutionRow = createSettingRow("Resolution", resolutionSelect)
  
  // Refresh rate
  const refreshRateSelect = document.createElement("select")
  refreshRateSelect.className = "bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-300"
  
  const rate60Option = document.createElement("option")
  rate60Option.textContent = "59.99 Hz"
  rate60Option.value = "59.99"
  rate60Option.selected = true
  
  const rate120Option = document.createElement("option")
  rate120Option.textContent = "120 Hz"
  rate120Option.value = "120"
  
  refreshRateSelect.appendChild(rate60Option)
  refreshRateSelect.appendChild(rate120Option)
  
  const refreshRateRow = createSettingRow("Refresh Rate", refreshRateSelect)
  
  // Scale options
  const scaleOptions = document.createElement("div")
  scaleOptions.className = "flex justify-between items-center"
  
  const scaleLabel = document.createElement("div")
  scaleLabel.className = "text-gray-300"
  scaleLabel.textContent = "Scale"
  
  const scaleButtonsContainer = document.createElement("div")
  scaleButtonsContainer.className = "flex"
  
  const scales = ["100 %", "125 %", "150 %", "175 %", "200 %"]
  scales.forEach((scale, index) => {
    const scaleButton = document.createElement("button")
    scaleButton.className = `px-2 py-1 ${index === 0 ? 'bg-gray-700' : 'bg-gray-800'} border border-gray-600 hover:bg-gray-700 ${index === 0 ? 'text-white' : 'text-gray-300'} ${index === 0 ? '' : index === scales.length - 1 ? 'rounded-r' : ''} ${index === 0 ? 'rounded-l' : ''}`
    scaleButton.textContent = scale
    
    scaleButtonsContainer.appendChild(scaleButton)
  })
  
  scaleOptions.appendChild(scaleLabel)
  scaleOptions.appendChild(scaleButtonsContainer)
  
  // Fractional scaling toggle
  const fractionalContainer = document.createElement("div")
  fractionalContainer.className = "flex justify-between items-center"
  
  const fractionalInfo = document.createElement("div")
  
  const fractionalLabel = document.createElement("div")
  fractionalLabel.className = "text-gray-300"
  fractionalLabel.textContent = "Fractional Scaling"
  
  const fractionalDesc = document.createElement("div")
  fractionalDesc.className = "text-xs text-gray-400"
  fractionalDesc.textContent = "May increase power usage, lower speed, or reduce display sharpness."
  
  fractionalInfo.appendChild(fractionalLabel)
  fractionalInfo.appendChild(fractionalDesc)
  
  const fractionalToggle = document.createElement("div")
  fractionalToggle.className = "relative inline-block w-12 h-6 transition duration-200 ease-in-out"
  
  const fractionalInput = document.createElement("input")
  fractionalInput.type = "checkbox"
  fractionalInput.className = "opacity-0 w-0 h-0"
  fractionalInput.checked = true
  
  const fractionalSlider = document.createElement("span")
  fractionalSlider.className = "absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-cyan-500 transition duration-200 rounded-full before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:transition before:duration-200 before:rounded-full before:transform before:translate-x-6"
  
  fractionalInput.addEventListener("change", () => {
    if (fractionalInput.checked) {
      fractionalSlider.classList.add("bg-cyan-500")
      fractionalSlider.classList.remove("bg-gray-600")
      fractionalSlider.style.setProperty("--tw-translate-x", "1.5rem")
    } else {
      fractionalSlider.classList.remove("bg-cyan-500")
      fractionalSlider.classList.add("bg-gray-6\

