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
  
  // Store apps that can be installed from the app store
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
  }
  
  // Audio track data
  const AUDIO_TRACK = {
	title: "Alone",
	artist: "BoDleasons",
	url: "https://cdn.pixabay.com/audio/2025/02/03/audio_502e27ab2b.mp3",
  }
  
  // Featured apps for the app store
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
	  name: "Spotify",
	  description: "Music for everyone.",
	  icon: "🎵",
	  category: "Music",
	  id: "spotify",
	},
	{
	  name: "Discord",
	  description: "Talk, chat, hang out.",
	  icon: "💬",
	  category: "Social",
	  id: "discord",
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
  
  /**
   * Set up the main application structure
   */
  function initializeApp() {
	const root = document.getElementById("root")
  
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
  
	// Assemble the DOM structure
	innerContainer.appendChild(topBar)
	innerContainer.appendChild(contentArea)
	mainContainer.appendChild(innerContainer)
	root.appendChild(mainContainer)
  
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
  
  /**
   * Create SVG icon from icon name
   * @param {string} iconName - The name of the icon
   * @param {number} size - The size of the icon
   * @param {string} extraClasses - Additional CSS classes
   * @returns {string} SVG markup for the icon
   */
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
		'<line x1="22" x2="2" y1="12" y2="12"></line><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" x2="6.01" y1="16" y2="16"></line><line x1="10" x2="10.01" y1="16" y2="16"></line>',
	  download:
		'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line>',
	  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>',
	  "edit-3": '<path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>',
	}
  
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${extraClasses}">${iconPaths[iconName] || ""}</svg>`
  }
  
  /**
   * Open a new window or bring existing window to front
   * @param {string} appId - The ID of the app to open
   */
  function openWindow(appId) {
	// Check if window is already open
	if (appState.openWindows.includes(appId)) {
	  bringWindowToFront(appId)
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
   * Create a window element
   * @param {string} appId - The ID of the app
   * @param {string} title - The window title
   * @param {string} iconName - The icon name
   * @returns {HTMLElement} The window element
   */
  function createWindowElement(appId, title, iconName) {
	const window = document.createElement("div")
	window.className =
	  "absolute bg-gray-900/80 backdrop-blur-md rounded-lg overflow-hidden border border-gray-700/50 shadow-lg"
	window.id = `window-${appId}`
	window.style.left = `${50 + Math.random() * 100}px`
	window.style.top = `${50 + Math.random() * 100}px`
	window.style.minWidth = "400px"
  
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
  
	// Close button
	const closeButton = document.createElement("button")
	closeButton.className = "text-gray-400 hover:text-gray-200 cursor-pointer"
	closeButton.innerHTML = createIconSVG("x", 18)
	closeButton.addEventListener("click", () => closeWindow(appId))
  
	// Window content
	const content = document.createElement("div")
	content.className = "p-4 window-content"
  
	// Assemble window
	header.appendChild(titleArea)
	header.appendChild(closeButton)
	window.appendChild(header)
	window.appendChild(content)
  
	// Make window draggable
	makeDraggable(window, header)
  
	// Add click event to bring window to front
	window.addEventListener("mousedown", () => bringWindowToFront(appId))
  
	return window
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
  
  /**
   * Create settings app content
   * @param {HTMLElement} container - The container element
   */
  function createSettings(container) {
	container.className = "text-gray-300 w-[500px]"
  
	const settingsContainer = document.createElement("div")
	settingsContainer.className = "grid grid-cols-2 gap-4"
  
	// Header
	const header = document.createElement("div")
	header.className = "col-span-2 mb-4"
	header.innerHTML = `
	  <h2 class="text-xl font-semibold mb-2">System Settings</h2>
	  <div class="h-px bg-gray-700 w-full"></div>
	`
  
	// Left column
	const leftColumn = document.createElement("div")
	leftColumn.className = "space-y-4"
  
	// Appearance section
	const appearanceSection = document.createElement("div")
	appearanceSection.className = "bg-gray-800/50 p-4 rounded-lg"
  
	const darkModeCheckbox = document.createElement("input")
	darkModeCheckbox.type = "checkbox"
	darkModeCheckbox.checked = appState.settings.appearance.darkMode
	darkModeCheckbox.className = "form-checkbox"
	darkModeCheckbox.addEventListener("change", (e) => {
	  appState.settings.appearance.darkMode = e.target.checked
	  saveAppState()
	  applySettings()
	})
  
	const transparencyCheckbox = document.createElement("input")
	transparencyCheckbox.type = "checkbox"
	transparencyCheckbox.checked = appState.settings.appearance.transparency
	transparencyCheckbox.className = "form-checkbox"
	transparencyCheckbox.addEventListener("change", (e) => {
	  appState.settings.appearance.transparency = e.target.checked
	  saveAppState()
	  applySettings()
	})
  
	appearanceSection.innerHTML = `
	  <h3 class="font-medium mb-2">Appearance</h3>
	  <div class="space-y-2">
		<label class="flex items-center justify-between">
		  <span>Dark Mode</span>
		</label>
		<label class="flex items-center justify-between">
		  <span>Transparency</span>
		</label>
	  </div>
	`
  
	// Insert checkboxes
	const labels = appearanceSection.querySelectorAll("label")
	labels[0].appendChild(darkModeCheckbox)
	labels[1].appendChild(transparencyCheckbox)
  
	// Sound section
	const soundSection = document.createElement("div")
	soundSection.className = "bg-gray-800/50 p-4 rounded-lg"
  
	const systemSoundsCheckbox = document.createElement("input")
	systemSoundsCheckbox.type = "checkbox"
	systemSoundsCheckbox.checked = appState.settings.sound.systemSounds
	systemSoundsCheckbox.className = "form-checkbox"
	systemSoundsCheckbox.addEventListener("change", (e) => {
	  appState.settings.sound.systemSounds = e.target.checked
	  saveAppState()
	})
  
	const volumeSlider = document.createElement("input")
	volumeSlider.type = "range"
	volumeSlider.min = "0"
	volumeSlider.max = "100"
	volumeSlider.value = appState.settings.sound.volume
	volumeSlider.className = "w-32"
	volumeSlider.addEventListener("input", (e) => {
	  appState.settings.sound.volume = e.target.value
	  saveAppState()
	})
  
	soundSection.innerHTML = `
	  <h3 class="font-medium mb-2">Sound</h3>
	  <div class="space-y-2">
		<label class="flex items-center justify-between">
		  <span>System Sounds</span>
		</label>
		<div class="flex items-center justify-between">
		  <span>Volume</span>
		</div>
	  </div>
	`
  
	// Insert controls
	soundSection.querySelector("label").appendChild(systemSoundsCheckbox)
	soundSection.querySelector("div > div").appendChild(volumeSlider)
  
	leftColumn.appendChild(appearanceSection)
	leftColumn.appendChild(soundSection)
  
	// Right column
	const rightColumn = document.createElement("div")
	rightColumn.className = "space-y-4"
  
	// Display section
	const displaySection = document.createElement("div")
	displaySection.className = "bg-gray-800/50 p-4 rounded-lg"
  
	const brightnessSlider = document.createElement("input")
	brightnessSlider.type = "range"
	brightnessSlider.min = "0"
	brightnessSlider.max = "100"
	brightnessSlider.value = appState.settings.display.brightness
	brightnessSlider.className = "w-32"
	brightnessSlider.addEventListener("input", (e) => {
	  appState.settings.display.brightness = e.target.value
	  saveAppState()
	  applySettings()
	})
  
	displaySection.innerHTML = `
	  <h3 class="font-medium mb-2">Display</h3>
	  <div class="space-y-2">
		<div class="flex items-center justify-between">
		  <span>Brightness</span>
		</div>
	  </div>
	`
  
	// Insert controls
	displaySection.querySelector("div > div").appendChild(brightnessSlider)
  
	// Power section
	const powerSection = document.createElement("div")
	powerSection.className = "bg-gray-800/50 p-4 rounded-lg"
  
	const autoSleepSelect = document.createElement("select")
	autoSleepSelect.className = "bg-gray-700 rounded px-2 py-1"
  
	const options = ["Never", "5 minutes", "15 minutes", "30 minutes"]
	options.forEach((option) => {
	  const optionElement = document.createElement("option")
	  optionElement.value = option
	  optionElement.textContent = option
	  if (option === appState.settings.power.autoSleep) {
		optionElement.selected = true
	  }
	  autoSleepSelect.appendChild(optionElement)
	})
  
	autoSleepSelect.addEventListener("change", (e) => {
	  appState.settings.power.autoSleep = e.target.value
	  saveAppState()
	})
  
	powerSection.innerHTML = `
	  <h3 class="font-medium mb-2">Power</h3>
	  <div class="space-y-2">
		<label class="flex items-center justify-between">
		  <span>Auto Sleep</span>
		</label>
	  </div>
	`
  
	// Insert controls
	powerSection.querySelector("label").appendChild(autoSleepSelect)
  
	rightColumn.appendChild(displaySection)
	rightColumn.appendChild(powerSection)
  
	// Assemble settings
	settingsContainer.appendChild(header)
	settingsContainer.appendChild(leftColumn)
	settingsContainer.appendChild(rightColumn)
	container.appendChild(settingsContainer)
  }
  
  /**
   * Create calculator app content
   * @param {HTMLElement} container - The container element
   */
  function createCalculator(container) {
	container.className = "w-[300px] bg-gray-900/50 rounded-lg p-4"
  
	// Calculator state
	const calculatorState = {
	  display: "0",
	  equation: "",
	  lastResult: "",
	}
  
	// Display area
	const displayArea = document.createElement("div")
	displayArea.className = "bg-gray-800/50 rounded-lg p-3 mb-4"
  
	const equationDisplay = document.createElement("div")
	equationDisplay.className = "text-gray-400 text-sm h-6"
  
	const mainDisplay = document.createElement("div")
	mainDisplay.className = "text-gray-200 text-2xl text-right"
	mainDisplay.textContent = calculatorState.display
  
	displayArea.appendChild(equationDisplay)
	displayArea.appendChild(mainDisplay)
  
	// Buttons grid
	const buttonsGrid = document.createElement("div")
	buttonsGrid.className = "grid grid-cols-4 gap-2"
  
	// Button handlers
	const handleNumber = (num) => {
	  if (calculatorState.display === "0") {
		calculatorState.display = num
	  } else {
		calculatorState.display += num
	  }
	  calculatorState.equation += num
	  mainDisplay.textContent = calculatorState.display
	}
  
	const handleOperator = (op) => {
	  calculatorState.display = "0"
	  calculatorState.equation += ` ${op} `
	  equationDisplay.textContent = calculatorState.equation
	}
  
	const handleEqual = () => {
	  try {
		// Using Function instead of eval for better security
		const result = new Function("return " + calculatorState.equation)()
		calculatorState.display = result.toString()
		calculatorState.lastResult = `${calculatorState.equation} = ${result}`
		calculatorState.equation = result.toString()
  
		mainDisplay.textContent = calculatorState.display
		equationDisplay.textContent = calculatorState.lastResult
	  } catch (error) {
		calculatorState.display = "Error"
		calculatorState.equation = ""
		mainDisplay.textContent = "Error"
	  }
	}
  
	const handleClear = () => {
	  calculatorState.display = "0"
	  calculatorState.equation = ""
	  mainDisplay.textContent = "0"
	  equationDisplay.textContent = calculatorState.lastResult
	}
  
	// Create buttons
	const createButton = (text, className, handler) => {
	  const button = document.createElement("button")
	  button.textContent = text
	  button.className = className
	  button.addEventListener("click", handler)
	  return button
	}
  
	// Clear and operator buttons
	buttonsGrid.appendChild(
	  createButton("Clear", "col-span-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 p-3 rounded-lg", handleClear),
	)
	buttonsGrid.appendChild(
	  createButton("÷", "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 p-3 rounded-lg", () => handleOperator("/")),
	)
	buttonsGrid.appendChild(
	  createButton("×", "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 p-3 rounded-lg", () => handleOperator("*")),
	)
  
	// Number buttons
	;[7, 8, 9, 4, 5, 6, 1, 2, 3].forEach((num) => {
	  buttonsGrid.appendChild(
		createButton(num.toString(), "bg-gray-700/50 hover:bg-gray-700/70 text-gray-200 p-3 rounded-lg", () =>
		  handleNumber(num.toString()),
		),
	  )
	})
  
	// More operator buttons
	buttonsGrid.appendChild(
	  createButton("-", "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 p-3 rounded-lg", () => handleOperator("-")),
	)
	buttonsGrid.appendChild(
	  createButton("+", "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 p-3 rounded-lg", () => handleOperator("+")),
	)
  
	// Zero, decimal, and equals
	buttonsGrid.appendChild(
	  createButton("0", "bg-gray-700/50 hover:bg-gray-700/70 text-gray-200 p-3 rounded-lg", () => handleNumber("0")),
	)
	buttonsGrid.appendChild(
	  createButton(".", "bg-gray-700/50 hover:bg-gray-700/70 text-gray-200 p-3 rounded-lg", () => handleNumber(".")),
	)
	buttonsGrid.appendChild(
	  createButton("=", "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 p-3 rounded-lg col-span-2", handleEqual),
	)
  
	// Assemble calculator
	container.appendChild(displayArea)
	container.appendChild(buttonsGrid)
  }
  
  /**
   * Create app store content
   * @param {HTMLElement} container - The container element
   */
  function createAppStore(container) {
	container.className = "w-[600px] text-gray-300"
  
	// Featured apps section
	const featuredSection = document.createElement("div")
	featuredSection.className = "mb-6"
  
	const featuredTitle = document.createElement("h2")
	featuredTitle.className = "text-xl font-semibold mb-4"
	featuredTitle.textContent = "Featured Apps"
  
	const featuredGrid = document.createElement("div")
	featuredGrid.className = "grid grid-cols-2 gap-4"
  
	// Create app cards
	FEATURED_APPS.forEach((app) => {
	  const card = document.createElement("div")
	  card.className = "bg-gray-800/50 rounded-lg p-4 flex items-start space-x-4"
  
	  // Check if app is already installed
	  const isInstalled = appState.installedApps.includes(app.id)
  
	  card.innerHTML = `
		<div class="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center text-2xl">
		  ${app.icon}
		</div>
		<div class="flex-1">
		  <h3 class="font-medium">${app.name}</h3>
		  <p class="text-sm text-gray-400 mb-2">${app.description}</p>
		  <div class="flex items-center justify-between">
			<span class="text-xs bg-gray-700/50 px-2 py-1 rounded">${app.category}</span>
			<button class="app-action-btn text-cyan-400 hover:text-cyan-300 flex items-center space-x-1" data-app-id="${app.id}">
			  ${
				isInstalled
				  ? `${createIconSVG("x", 16)}<span>Uninstall</span>`
				  : `${createIconSVG("download", 16)}<span>Install</span>`
			  }
			</button>
		  </div>
		</div>
	  `
  
	  featuredGrid.appendChild(card)
	})
  
	featuredSection.appendChild(featuredTitle)
	featuredSection.appendChild(featuredGrid)
  
	// Categories section
	const categoriesSection = document.createElement("div")
  
	const categoriesTitle = document.createElement("h2")
	categoriesTitle.className = "text-xl font-semibold mb-4"
	categoriesTitle.textContent = "Categories"
  
	const categoriesGrid = document.createElement("div")
	categoriesGrid.className = "grid grid-cols-3 gap-4"
  
	// Create category buttons
	;["Games", "Productivity", "Development", "Graphics", "Music", "Video"].forEach((category) => {
	  const button = document.createElement("button")
	  button.className = "bg-gray-800/50 hover:bg-gray-700/50 rounded-lg p-4 text-left"
	  button.textContent = category
	  categoriesGrid.appendChild(button)
	})
  
	categoriesSection.appendChild(categoriesTitle)
	categoriesSection.appendChild(categoriesGrid)
  
	// Assemble app store
	container.appendChild(featuredSection)
	container.appendChild(categoriesSection)
  
	// Add event listeners for install/uninstall buttons
	container.querySelectorAll(".app-action-btn").forEach((button) => {
	  const appId = button.getAttribute("data-app-id")
	  button.addEventListener("click", () => {
		if (appState.installedApps.includes(appId)) {
		  // Uninstall app
		  appState.installedApps = appState.installedApps.filter((id) => id !== appId)
		  button.innerHTML = `${createIconSVG("download", 16)}<span>Install</span>`
		} else {
		  // Install app
		  appState.installedApps.push(appId)
		  button.innerHTML = `${createIconSVG("x", 16)}<span>Uninstall</span>`
		}
  
		// Save app state
		saveAppState()
  
		// Update top bar
		updateTopBar()
	  })
	})
  }
  
  /**
   * Update the top bar to reflect installed apps
   */
  function updateTopBar() {
	// Remove existing top bar
	const oldTopBar = document.querySelector(".fixed.top-0")
	if (oldTopBar) {
	  const parent = oldTopBar.parentNode
	  const newTopBar = createTopBar()
	  parent.replaceChild(newTopBar, oldTopBar)
	}
  }
  
  /**
   * Create system monitor content
   * @param {HTMLElement} container - The container element
   */
  function createSystemMonitor(container) {
	container.className = "w-[500px] text-gray-300"
  
	const monitorContainer = document.createElement("div")
	monitorContainer.className = "space-y-6"
  
	// CPU section
	const cpuSection = document.createElement("div")
  
	const cpuHeader = document.createElement("div")
	cpuHeader.className = "flex items-center justify-between mb-2"
	cpuHeader.innerHTML = `
	  <div class="flex items-center space-x-2">
		${createIconSVG("cpu", 16, "text-cyan-400")}
		<span>CPU Usage</span>
	  </div>
	  <span id="cpu-percentage">0%</span>
	`
  
	const cpuBar = document.createElement("div")
	cpuBar.className = "h-2 bg-gray-700 rounded-full overflow-hidden"
  
	const cpuFill = document.createElement("div")
	cpuFill.className = "h-full bg-cyan-400 transition-all duration-500"
	cpuFill.id = "cpu-bar"
	cpuFill.style.width = "0%"
  
	cpuBar.appendChild(cpuFill)
  
	const cpuCores = document.createElement("div")
	cpuCores.className = "mt-2 grid grid-cols-4 gap-2"
  
	// Create core displays
	for (let i = 0; i < 4; i++) {
	  const core = document.createElement("div")
	  core.className = "bg-gray-800/50 p-2 rounded-lg"
	  core.innerHTML = `
		<div class="text-xs text-gray-400">Core ${i + 1}</div>
		<div class="text-sm" id="core-${i}">0%</div>
	  `
	  cpuCores.appendChild(core)
	}
  
	cpuSection.appendChild(cpuHeader)
	cpuSection.appendChild(cpuBar)
	cpuSection.appendChild(cpuCores)
  
	// Memory section
	const memorySection = document.createElement("div")
  
	const memoryHeader = document.createElement("div")
	memoryHeader.className = "flex items-center justify-between mb-2"
	memoryHeader.innerHTML = `
	  <div class="flex items-center space-x-2">
		${createIconSVG("memory-stick", 16, "text-green-400")}
		<span>Memory Usage</span>
	  </div>
	  <span id="memory-percentage">0  16, 'text-green-400')}
		<span>Memory Usage</span>
	  </div>
	  <span id="memory-percentage">0%</span>
	`
  
	const memoryBar = document.createElement("div")
	memoryBar.className = "h-2 bg-gray-700 rounded-full overflow-hidden"
  
	const memoryFill = document.createElement("div")
	memoryFill.className = "h-full bg-green-400 transition-all duration-500"
	memoryFill.id = "memory-bar"
	memoryFill.style.width = "0%"
  
	memoryBar.appendChild(memoryFill)
  
	const memoryText = document.createElement("div")
	memoryText.className = "mt-2 text-sm text-gray-400"
	memoryText.id = "memory-text"
	memoryText.textContent = "0 GB / 16 GB"
  
	memorySection.appendChild(memoryHeader)
	memorySection.appendChild(memoryBar)
	memorySection.appendChild(memoryText)
  
	// Disk section
	const diskSection = document.createElement("div")
  
	const diskHeader = document.createElement("div")
	diskHeader.className = "flex items-center justify-between mb-2"
	diskHeader.innerHTML = `
	  <div class="flex items-center space-x-2">
		${createIconSVG("hard-drive", 16, "text-purple-400")}
		<span>Disk Usage</span>
	  </div>
	  <span id="disk-percentage">75%</span>
	`
  
	const diskBar = document.createElement("div")
	diskBar.className = "h-2 bg-gray-700 rounded-full overflow-hidden"
  
	const diskFill = document.createElement("div")
	diskFill.className = "h-full bg-purple-400"
	diskFill.style.width = "75%"
  
	diskBar.appendChild(diskFill)
  
	const diskText = document.createElement("div")
	diskText.className = "mt-2 text-sm text-gray-400"
	diskText.textContent = "750 GB / 1 TB"
  
	diskSection.appendChild(diskHeader)
	diskSection.appendChild(diskBar)
	diskSection.appendChild(diskText)
  
	// Processes section
	const processesSection = document.createElement("div")
	processesSection.className = "bg-gray-800/50 rounded-lg p-4"
  
	const processesTitle = document.createElement("h3")
	processesTitle.className = "text-sm font-medium mb-2"
	processesTitle.textContent = "Running Processes"
  
	const processesList = document.createElement("div")
	processesList.className = "space-y-2"
  
	// Create process items
	;[
	  { name: "System", cpu: 2.5, memory: 156 },
	  { name: "Browser", cpu: 15.2, memory: 1240 },
	  { name: "Terminal", cpu: 0.5, memory: 45 },
	  { name: "Music Player", cpu: 1.2, memory: 85 },
	].forEach((process) => {
	  const processItem = document.createElement("div")
	  processItem.className = "flex items-center justify-between text-sm"
	  processItem.innerHTML = `
		<span>${process.name}</span>
		<div class="flex space-x-4 text-gray-400">
		  <span>${process.cpu}%</span>
		  <span>${process.memory} MB</span>
		</div>
	  `
	  processesList.appendChild(processItem)
	})
  
	processesSection.appendChild(processesTitle)
	processesSection.appendChild(processesList)
  
	// Assemble monitor
	monitorContainer.appendChild(cpuSection)
	monitorContainer.appendChild(memorySection)
	monitorContainer.appendChild(diskSection)
	monitorContainer.appendChild(processesSection)
	container.appendChild(monitorContainer)
  
	// Assemble monitor
	monitorContainer.appendChild(cpuSection)
	monitorContainer.appendChild(memorySection)
	monitorContainer.appendChild(diskSection)
	monitorContainer.appendChild(processesSection)
	container.appendChild(monitorContainer)
  
	// Simulate changing values
	function updateMonitor() {
	  // Update CPU
	  const cpuUsage = Math.random() * 100
	  document.getElementById("cpu-percentage").textContent = `${Math.round(cpuUsage)}%`
	  document.getElementById("cpu-bar").style.width = `${cpuUsage}%`
  
	  // Update cores
	  for (let i = 0; i < 4; i++) {
		const coreUsage = Math.random() * 100
		document.getElementById(`core-${i}`).textContent = `${Math.round(coreUsage)}%`
	  }
  
	  // Update memory
	  const memoryUsage = Math.random() * 100
	  document.getElementById("memory-percentage").textContent = `${Math.round(memoryUsage)}%`
	  document.getElementById("memory-bar").style.width = `${memoryUsage}%`
	  document.getElementById("memory-text").textContent = `${Math.round(0.16 * memoryUsage)} GB / 16 GB`
	}
  
	// Initial update
	updateMonitor()
  
	// Set interval for updates
	const monitorInterval = setInterval(updateMonitor, 2000)
  
	// Clean up interval when window is closed
	container.addEventListener("remove", () => {
	  clearInterval(monitorInterval)
	})
  }
  
  /**
   * Create text editor content
   * @param {HTMLElement} container - The container element
   */
  function createTextEditor(container) {
	container.className = "w-[600px] h-[400px] flex flex-col"
  
	// Editor state
	const editorState = {
	  filename: "untitled.txt",
	  content: "",
	}
  
	// Toolbar
	const toolbar = document.createElement("div")
	toolbar.className = "flex items-center justify-between p-2 bg-gray-800/50 border-b border-gray-700/50"
  
	const fileInfo = document.createElement("div")
	fileInfo.className = "flex items-center space-x-2"
  
	fileInfo.innerHTML = createIconSVG("file-text", 16, "text-gray-400")
  
	const filenameInput = document.createElement("input")
	filenameInput.type = "text"
	filenameInput.value = editorState.filename
	filenameInput.className = "bg-transparent border-none outline-none text-gray-300 text-sm selectable"
  
	filenameInput.addEventListener("input", (e) => {
	  editorState.filename = e.target.value
	})
  
	fileInfo.appendChild(filenameInput)
  
	const saveButton = document.createElement("button")
	saveButton.className = "flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm px-2 py-1 rounded"
	saveButton.innerHTML = `
	  ${createIconSVG("save", 16)}
	  <span>Save</span>
	`
  
	saveButton.addEventListener("click", () => {
	  // Save file to IndexedDB
	  saveToDb("files", {
		id: editorState.filename,
		content: editorState.content,
		lastModified: new Date().toISOString(),
	  })
		.then(() => {
		  alert(`File ${editorState.filename} saved successfully!`)
		})
		.catch((error) => {
		  console.error("Error saving file:", error)
		  alert("Error saving file. Please try again.")
		})
	})
  
	toolbar.appendChild(fileInfo)
	toolbar.appendChild(saveButton)
  
	// Editor area
	const textarea = document.createElement("textarea")
	textarea.className = "flex-1 bg-transparent text-gray-300 p-4 outline-none resize-none font-mono text-sm selectable"
	textarea.placeholder = "Start typing..."
  
	textarea.addEventListener("input", (e) => {
	  editorState.content = e.target.value
	})
  
	// Assemble editor
	container.appendChild(toolbar)
	container.appendChild(textarea)
  
	// Focus textarea
	setTimeout(() => textarea.focus(), 0)
  }
  
  /**
   * Create canvas drawing app content
   * @param {HTMLElement} container - The container element
   */
  function createCanvasApp(container) {
	container.className = "w-[600px] h-[400px] flex flex-col"
  
	// Toolbar
	const toolbar = document.createElement("div")
	toolbar.className = "flex items-center justify-between p-2 bg-gray-800/50 border-b border-gray-700/50"
  
	// Color picker
	const colorPicker = document.createElement("input")
	colorPicker.type = "color"
	colorPicker.value = "#ffffff"
	colorPicker.className = "w-8 h-8 bg-transparent border-none cursor-pointer"
  
	// Brush size
	const brushSizeContainer = document.createElement("div")
	brushSizeContainer.className = "flex items-center space-x-2"
  
	const brushSizeLabel = document.createElement("span")
	brushSizeLabel.className = "text-gray-300 text-sm"
	brushSizeLabel.textContent = "Size:"
  
	const brushSizeInput = document.createElement("input")
	brushSizeInput.type = "range"
	brushSizeInput.min = "1"
	brushSizeInput.max = "20"
	brushSizeInput.value = "5"
	brushSizeInput.className = "w-32"
  
	brushSizeContainer.appendChild(brushSizeLabel)
	brushSizeContainer.appendChild(brushSizeInput)
  
	// Clear button
	const clearButton = document.createElement("button")
	clearButton.className = "bg-red-500/20 hover:bg-red-500/30 text-red-300 px-2 py-1 rounded text-sm"
	clearButton.textContent = "Clear"
  
	// Save button
	const saveButton = document.createElement("button")
	saveButton.className = "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded text-sm"
	saveButton.textContent = "Save"
  
	// Add elements to toolbar
	toolbar.appendChild(colorPicker)
	toolbar.appendChild(brushSizeContainer)
	toolbar.appendChild(clearButton)
	toolbar.appendChild(saveButton)
  
	// Canvas
	const canvasContainer = document.createElement("div")
	canvasContainer.className = "flex-1 relative"
  
	const canvas = document.createElement("canvas")
	canvas.className = "absolute top-0 left-0 w-full h-full"
	canvas.width = 600
	canvas.height = 350
  
	canvasContainer.appendChild(canvas)
  
	// Assemble canvas app
	container.appendChild(toolbar)
	container.appendChild(canvasContainer)
  
	// Canvas drawing functionality
	const ctx = canvas.getContext("2d")
	ctx.fillStyle = "#2d3748"
	ctx.fillRect(0, 0, canvas.width, canvas.height)
  
	let isDrawing = false
	let lastX = 0
	let lastY = 0
  
	// Drawing functions
	function startDrawing(e) {
	  isDrawing = true
	  ;[lastX, lastY] = [e.offsetX, e.offsetY]
	}
  
	function draw(e) {
	  if (!isDrawing) return
  
	  ctx.strokeStyle = colorPicker.value
	  ctx.lineWidth = brushSizeInput.value
	  ctx.lineCap = "round"
  
	  ctx.beginPath()
	  ctx.moveTo(lastX, lastY)
	  ctx.lineTo(e.offsetX, e.offsetY)
	  ctx.stroke()
	  ;[lastX, lastY] = [e.offsetX, e.offsetY]
	}
  
	function stopDrawing() {
	  isDrawing = false
	}
  
	// Event listeners
	canvas.addEventListener("mousedown", startDrawing)
	canvas.addEventListener("mousemove", draw)
	canvas.addEventListener("mouseup", stopDrawing)
	canvas.addEventListener("mouseout", stopDrawing)
  
	// Clear canvas
	clearButton.addEventListener("click", () => {
	  ctx.fillStyle = "#2d3748"
	  ctx.fillRect(0, 0, canvas.width, canvas.height)
	})
  
	// Save canvas
	saveButton.addEventListener("click", () => {
	  try {
		const dataURL = canvas.toDataURL("image/png")
		const link = document.createElement("a")
		link.download = "canvas-drawing.png"
		link.href = dataURL
		link.click()
	  } catch (error) {
		console.error("Error saving canvas:", error)
		alert("Error saving canvas. Please try again.")
	  }
	})
  }
  
  // Fix the duplicate content in createWindowElement function
  function fixWindowElementFunction() {
	const script = document.querySelector("script")
	if (script) {
	  const content = script.textContent
	  const fixedContent = content.replace(
		`const content =  () => closeWindow(appId));
	
	// Window content	
	const content = document.createElement('div');`,
		`const content = document.createElement('div');`,
	  )
  
	  // Create a new script element with the fixed content
	  const newScript = document.createElement("script")
	  newScript.textContent = fixedContent
  
	  // Replace the old script with the new one
	  script.parentNode.replaceChild(newScript, script)
	}
	
  }
  
  // Call the fix function after the page loads
  document.addEventListener("DOMContentLoaded", fixWindowElementFunction)