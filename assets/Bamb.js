  fractionalInput.addEventListener("change", () => {
    if (fractionalInput.checked) {
      fractionalSlider.classList.add("bg-cyan-500")
      fractionalSlider.classList.remove("bg-gray-600")
      fractionalSlider.style.setProperty("--tw-translate-x", "1.5rem")
    } else {
      fractionalSlider.classList.remove("bg-cyan-500")
      fractionalSlider.classList.add("bg-gray-600")
      fractionalSlider.style.setProperty("--tw-translate-x", "0")
    }
  })
  
  fractionalToggle.appendChild(fractionalInput)
  fractionalToggle.appendChild(fractionalSlider)
  
  fractionalContainer.appendChild(fractionalInfo)
  fractionalContainer.appendChild(fractionalToggle)
  
  // Add all settings to the display settings container
  displaySettings.appendChild(displayTypeRow)
  displaySettings.appendChild(orientationRow)
  displaySettings.appendChild(resolutionRow)
  displaySettings.appendChild(refreshRateRow)
  displaySettings.appendChild(scaleOptions)
  displaySettings.appendChild(fractionalContainer)
  
  primaryDisplay.appendChild(displaySettings)
  
  // Assemble displays section
  container.appendChild(header)
  container.appendChild(displayLayout)
  container.appendChild(primaryDisplay)
}

// Generate Appearance section
function generateAppearanceSection(container) {
  // Header
  const header = document.createElement("div")
  header.className = "mb-6"
  
  const title = document.createElement("h3")
  title.className = "text-lg font-medium text-gray-300 mb-2"
  title.textContent = "Appearance"
  
  const description = document.createElement("p")
  description.className = "text-gray-400"
  description.textContent = "Change the look and feel of your desktop"
  
  header.appendChild(title)
  header.appendChild(description)
  
  // Style section
  const styleSection = document.createElement("div")
  styleSection.className = "bg-gray-800/70 rounded-lg p-4 mb-6"
  
  const styleTitle = document.createElement("h4")
  styleTitle.className = "font-medium text-gray-300 mb-4"
  styleTitle.textContent = "Style"
  
  // Theme options
  const themeContainer = document.createElement("div")
  themeContainer.className = "grid grid-cols-2 gap-4 mb-4"
  
  // Light theme option
  const lightTheme = document.createElement("div")
  lightTheme.className = "bg-gray-100 rounded-lg p-3 cursor-pointer border-2 border-transparent hover:border-gray-500"
  
  const lightPreview = document.createElement("div")
  lightPreview.className = "h-24 bg-white rounded mb-2 flex items-center justify-center"
  lightPreview.innerHTML = `
    <div class="w-3/4 h-4/5 flex flex-col">
      <div class="h-4 bg-gray-200 mb-2 rounded"></div>
      <div class="flex-1 flex">
        <div class="w-1/4 bg-gray-100 mr-2 rounded"></div>
        <div class="flex-1 bg-gray-50 rounded"></div>
      </div>
    </div>
  `
  
  const lightLabel = document.createElement("div")
  lightLabel.className = "text-center text-gray-800 text-sm"
  lightLabel.textContent = "Light"
  
  lightTheme.appendChild(lightPreview)
  lightTheme.appendChild(lightLabel)
  
  // Dark theme option
  const darkTheme = document.createElement("div")
  darkTheme.className = "bg-gray-900 rounded-lg p-3 cursor-pointer border-2 border-cyan-500 hover:border-cyan-400"
  
  const darkPreview = document.createElement("div")
  darkPreview.className = "h-24 bg-gray-800 rounded mb-2 flex items-center justify-center"
  darkPreview.innerHTML = `
    <div class="w-3/4 h-4/5 flex flex-col">
      <div class="h-4 bg-gray-700 mb-2 rounded"></div>
      <div class="flex-1 flex">
        <div class="w-1/4 bg-gray-800 mr-2 rounded"></div>
        <div class="flex-1 bg-gray-700 rounded"></div>
      </div>
    </div>
  `
  
  const darkLabel = document.createElement("div")
  darkLabel.className = "text-center text-gray-300 text-sm"
  darkLabel.textContent = "Dark"
  
  darkTheme.appendChild(darkPreview)
  darkTheme.appendChild(darkLabel)
  
  themeContainer.appendChild(lightTheme)
  themeContainer.appendChild(darkTheme)
  
  // Add click events for theme selection
  lightTheme.addEventListener("click", () => {
    lightTheme.classList.add("border-cyan-500")
    lightTheme.classList.remove("border-transparent")
    darkTheme.classList.add("border-transparent")
    darkTheme.classList.remove("border-cyan-500")
    
    // Update app state
    appState.settings.appearance.darkMode = false
    applySettings()
    saveAppState()
  })
  
  darkTheme.addEventListener("click", () => {
    darkTheme.classList.add("border-cyan-500")
    darkTheme.classList.remove("border-transparent")
    lightTheme.classList.add("border-transparent")
    lightTheme.classList.remove("border-cyan-500")
    
    // Update app state
    appState.settings.appearance.darkMode = true
    applySettings()
    saveAppState()
  })
  
  // Accent color options
  const accentTitle = document.createElement("h5")
  accentTitle.className = "font-medium text-gray-300 mb-2 mt-4"
  accentTitle.textContent = "Accent Color"
  
  const accentContainer = document.createElement("div")
  accentContainer.className = "flex space-x-2"
  
  const colors = [
    { name: "Cyan", class: "bg-cyan-500" },
    { name: "Blue", class: "bg-blue-500" },
    { name: "Purple", class: "bg-purple-500" },
    { name: "Pink", class: "bg-pink-500" },
    { name: "Red", class: "bg-red-500" },
    { name: "Orange", class: "bg-orange-500" },
    { name: "Green", class: "bg-green-500" },
  ]
  
  colors.forEach((color, index) => {
    const colorOption = document.createElement("div")
    colorOption.className = `w-8 h-8 rounded-full ${color.class} cursor-pointer ${index === 0 ? 'ring-2 ring-white' : ''}`
    colorOption.title = color.name
    
    colorOption.addEventListener("click", () => {
      // Remove ring from all colors
      accentContainer.querySelectorAll("div").forEach(el => {
        el.classList.remove("ring-2", "ring-white")
      })
      
      // Add ring to selected color
      colorOption.classList.add("ring-2", "ring-white")
      
      // In a real app, this would update the accent color
    })
    
    accentContainer.appendChild(colorOption)
  })
  
  // Transparency toggle
  const transparencyContainer = document.createElement("div")
  transparencyContainer.className = "flex items-center justify-between mt-6"
  
  const transparencyLabel = document.createElement("div")
  transparencyLabel.className = "text-gray-300"
  transparencyLabel.textContent = "Window Transparency"
  
  const transparencyToggle = document.createElement("div")
  transparencyToggle.className = "relative inline-block w-12 h-6 transition duration-200 ease-in-out"
  
  const transparencyInput = document.createElement("input")
  transparencyInput.type = "checkbox"
  transparencyInput.className = "opacity-0 w-0 h-0"
  transparencyInput.checked = appState.settings.appearance.transparency
  
  const transparencySlider = document.createElement("span")
  transparencySlider.className = `absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${appState.settings.appearance.transparency ? 'bg-cyan-500' : 'bg-gray-600'} transition duration-200 rounded-full before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:transition before:duration-200 before:rounded-full ${appState.settings.appearance.transparency ? 'before:transform before:translate-x-6' : ''}`
  
  transparencyInput.addEventListener("change", () => {
    if (transparencyInput.checked) {
      transparencySlider.classList.add("bg-cyan-500")
      transparencySlider.classList.remove("bg-gray-600")
      transparencySlider.style.setProperty("--tw-translate-x", "1.5rem")
      
      // Update app state
      appState.settings.appearance.transparency = true
    } else {
      transparencySlider.classList.remove("bg-cyan-500")
      transparencySlider.classList.add("bg-gray-600")
      transparencySlider.style.setProperty("--tw-translate-x", "0")
      
      // Update app state
      appState.settings.appearance.transparency = false
    }
    
    applySettings()
    saveAppState()
  })
  
  transparencyToggle.appendChild(transparencyInput)
  transparencyToggle.appendChild(transparencySlider)
  
  transparencyContainer.appendChild(transparencyLabel)
  transparencyContainer.appendChild(transparencyToggle)
  
  // Assemble style section
  styleSection.appendChild(styleTitle)
  styleSection.appendChild(themeContainer)
  styleSection.appendChild(accentTitle)
  styleSection.appendChild(accentContainer)
  styleSection.appendChild(transparencyContainer)
  
  // Background section
  const backgroundSection = document.createElement("div")
  backgroundSection.className = "bg-gray-800/70 rounded-lg p-4"
  
  const backgroundTitle = document.createElement("h4")
  backgroundTitle.className = "font-medium text-gray-300 mb-4"
  backgroundTitle.textContent = "Background"
  
  const backgroundPreview = document.createElement("div")
  backgroundPreview.className = "h-32 rounded-lg bg-cover bg-center mb-4"
  backgroundPreview.style.backgroundImage = "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986')"
  
  const backgroundControls = document.createElement("div")
  backgroundControls.className = "flex justify-between"
  
  const backgroundSelect = document.createElement("button")
  backgroundSelect.className = "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-3 py-1 rounded-lg text-sm"
  backgroundSelect.textContent = "Change Background"
  
  backgroundControls.appendChild(backgroundSelect)
  
  // Assemble background section
  backgroundSection.appendChild(backgroundTitle)
  backgroundSection.appendChild(backgroundPreview)
  backgroundSection.appendChild(backgroundControls)
  
  // Assemble appearance section
  container.appendChild(header)
  container.appendChild(styleSection)
  container.appendChild(backgroundSection)
}

// Generate Sound section
function generateSoundSection(container) {
  // Header
  const header = document.createElement("div")
  header.className = "mb-6"
  
  const title = document.createElement("h3")
  title.className = "text-lg font-medium text-gray-300 mb-2"
  title.textContent = "Sound"
  
  const description = document.createElement("p")
  description.className = "text-gray-400"
  description.textContent = "Configure system sounds and audio devices"
  
  header.appendChild(title)
  header.appendChild(description)
  
  // Volume section
  const volumeSection = document.createElement("div")
  volumeSection.className = "bg-gray-800/70 rounded-lg p-4 mb-6"
  
  const volumeTitle = document.createElement("h4")
  volumeTitle.className = "font-medium text-gray-300 mb-4"
  volumeTitle.textContent = "Output Volume"
  
  // Volume slider
  const volumeContainer = document.createElement("div")
  volumeContainer.className = "flex items-center space-x-4 mb-6"
  
  const volumeIcon = document.createElement("div")
  volumeIcon.innerHTML = createIconSVG("volume-2", 20)
  volumeIcon.className = "text-gray-400"
  
  const volumeSlider = document.createElement("input")
  volumeSlider.type = "range"
  volumeSlider.min = "0"
  volumeSlider.max = "100"
  volumeSlider.value = appState.settings.sound.volume.toString()
  volumeSlider.className = "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
  
  const volumeValue = document.createElement("span")
  volumeValue.className = "text-gray-300 w-8 text-right"
  volumeValue.textContent = `${appState.settings.sound.volume}%`
  
  // Update volume value when slider changes
  volumeSlider.addEventListener("input", () => {
    const value = volumeSlider.value
    volumeValue.textContent = `${value}%`
    
    // Update app state
    appState.settings.sound.volume = parseInt(value)
    saveAppState()
  })
  
  volumeContainer.appendChild(volumeIcon)
  volumeContainer.appendChild(volumeSlider)
  volumeContainer.appendChild(volumeValue)
  
  // Output device selector
  const outputDeviceContainer = document.createElement("div")
  outputDeviceContainer.className = "mb-4"
  
  const outputDeviceLabel = document.createElement("div")
  outputDeviceLabel.className = "text-gray-300 mb-2"
  outputDeviceLabel.textContent = "Output Device"
  
  const outputDeviceSelect = document.createElement("select")
  outputDeviceSelect.className = "w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-300"
  
  const outputDeviceOption = document.createElement("option")
  outputDeviceOption.textContent = "Built-in Audio"
  outputDeviceOption.value = "builtin"
  outputDeviceOption.selected = true
  
  outputDeviceSelect.appendChild(outputDeviceOption)
  
  outputDeviceContainer.appendChild(outputDeviceLabel)
  outputDeviceContainer.appendChild(outputDeviceSelect)
  
  // System sounds toggle
  const systemSoundsContainer = document.createElement("div")
  systemSoundsContainer.className = "flex items-center justify-between"
  
  const systemSoundsLabel = document.createElement("div")
  systemSoundsLabel.className = "text-gray-300"
  systemSoundsLabel.textContent = "System Sounds"
  
  const systemSoundsToggle = document.createElement("div")
  systemSoundsToggle.className = "relative inline-block w-12 h-6 transition duration-200 ease-in-out"
  
  const systemSoundsInput = document.createElement("input")
  systemSoundsInput.type = "checkbox"
  systemSoundsInput.className = "opacity-0 w-0 h-0"
  systemSoundsInput.checked = appState.settings.sound.systemSounds
  
  const systemSoundsSlider = document.createElement("span")
  systemSoundsSlider.className = `absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${appState.settings.sound.systemSounds ? 'bg-cyan-500' : 'bg-gray-600'} transition duration-200 rounded-full before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:transition before:duration-200 before:rounded-full ${appState.settings.sound.systemSounds ? 'before:transform before:translate-x-6' : ''}`
  
  systemSoundsInput.addEventListener("change", () => {
    if (systemSoundsInput.checked) {
      systemSoundsSlider.classList.add("bg-cyan-500")
      systemSoundsSlider.classList.remove("bg-gray-600")
      systemSoundsSlider.style.setProperty("--tw-translate-x", "1.5rem")
      
      // Update app state
      appState.settings.sound.systemSounds = true
    } else {
      systemSoundsSlider.classList.remove("bg-cyan-500")
      systemSoundsSlider.classList.add("bg-gray-600")
      systemSoundsSlider.style.setProperty("--tw-translate-x", "0")
      
      // Update app state
      appState.settings.sound.systemSounds = false
    }
    
    saveAppState()
  })
  
  systemSoundsToggle.appendChild(systemSoundsInput)
  systemSoundsToggle.appendChild(systemSoundsSlider)
  
  systemSoundsContainer.appendChild(systemSoundsLabel)
  systemSoundsContainer.appendChild(systemSoundsToggle)
  
  // Assemble volume section
  volumeSection.appendChild(volumeTitle)
  volumeSection.appendChild(volumeContainer)
  volumeSection.appendChild(outputDeviceContainer)
  volumeSection.appendChild(systemSoundsContainer)
  
  // Input section
  const inputSection = document.createElement("div")
  inputSection.className = "bg-gray-800/70 rounded-lg p-4"
  
  const inputTitle = document.createElement("h4")
  inputTitle.className = "font-medium text-gray-300 mb-4"
  inputTitle.textContent = "Input"
  
  // Input device selector
  const inputDeviceContainer = document.createElement("div")
  inputDeviceContainer.className = "mb-4"
  
  const inputDeviceLabel = document.createElement("div")
  inputDeviceLabel.className = "text-gray-300 mb-2"
  inputDeviceLabel.textContent = "Input Device"
  
  const inputDeviceSelect = document.createElement("select")
  inputDeviceSelect.className = "w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-300"
  
  const inputDeviceOption = document.createElement("option")
  inputDeviceOption.textContent = "Built-in Microphone"
  inputDeviceOption.value = "builtin"
  inputDeviceOption.selected = true
  
  inputDeviceSelect.appendChild(inputDeviceOption)
  
  inputDeviceContainer.appendChild(inputDeviceLabel)
  inputDeviceContainer.appendChild(inputDeviceSelect)
  
  // Input level meter
  const inputLevelContainer = document.createElement("div")
  inputLevelContainer.className = "mb-4"
  
  const inputLevelLabel = document.createElement("div")
  inputLevelLabel.className = "text-gray-300 mb-2"
  inputLevelLabel.textContent = "Input Level"
  
  const inputLevelMeter = document.createElement("div")
  inputLevelMeter.className = "w-full h-2 bg-gray-700 rounded-lg overflow-hidden"
  
  const inputLevelValue = document.createElement("div")
  inputLevelValue.className = "h-full bg-cyan-500 w-1/4"
  
  inputLevelMeter.appendChild(inputLevelValue)
  
  inputLevelContainer.appendChild(inputLevelLabel)
  inputLevelContainer.appendChild(inputLevelMeter)
  
  // Assemble input section
  inputSection.appendChild(inputTitle)
  inputSection.appendChild(inputDeviceContainer)
  inputSection.appendChild(inputLevelContainer)
  
  // Assemble sound section
  container.appendChild(header)
  container.appendChild(volumeSection)
  container.appendChild(inputSection)
}

// Generate Power section
function generatePowerSection(container) {
  // Header
  const header = document.createElement("div")
  header.className = "mb-6"
  
  const title = document.createElement("h3")
  title.className = "text-lg font-medium text-gray-300 mb-2"
  title.textContent = "Power"
  
  const description = document.createElement("p")
  description.className = "text-gray-400"
  description.textContent = "Configure power settings and energy saving options"
  
  header.appendChild(title)
  header.appendChild(description)
  
  // Power mode section
  const powerModeSection = document.createElement("div")
  powerModeSection.className = "bg-gray-800/70 rounded-lg p-4 mb-6"
  
  const powerModeTitle = document.createElement("h4")
  powerModeTitle.className = "font-medium text-gray-300 mb-4"
  powerModeTitle.textContent = "Power Mode"
  
  // Power mode options
  const powerModeContainer = document.createElement("div")
  powerModeContainer.className = "grid grid-cols-3 gap-4 mb-4"
  
  const powerModes = [
    { id: "balanced", name: "Balanced", icon: "battery", description: "Balance performance and energy usage" },
    { id: "performance", name: "Performance", icon: "zap", description: "Maximum performance, higher energy usage" },
    { id: "powersaver", name: "Power Saver", icon: "battery-charging", description: "Maximize battery life" },
  ]
  
  powerModes.forEach((mode, index) => {
    const modeOption = document.createElement("div")
    modeOption.className = `bg-gray-700 rounded-lg p-3 cursor-pointer border-2 ${index === 0 ? 'border-cyan-500' : 'border-transparent'} hover:border-cyan-400`
    
    const modeIcon = document.createElement("div")
    modeIcon.className = "text-cyan-400 mb-2 flex justify-center"
    modeIcon.innerHTML = createIconSVG(mode.icon, 24)
    
    const modeName = document.createElement("div")
    modeName.className = "text-center text-gray-300 text-sm font-medium mb-1"
    modeName.textContent = mode.name
    
    const modeDesc = document.createElement("div")
    modeDesc.className = "text-center text-gray-400 text-xs"
    modeDesc.textContent = mode.description
    
    modeOption.appendChild(modeIcon)
    modeOption.appendChild(modeName)
    modeOption.appendChild(modeDesc)
    
    modeOption.addEventListener("click", () => {
      // Remove border from all options
      powerModeContainer.querySelectorAll("div[class^='bg-gray-700']").forEach(el => {
        el.classList.remove("border-cyan-500")
        el.classList.add("border-transparent")
      })
      
      // Add border to selected option
      modeOption.classList.remove("border-transparent")
      modeOption.classList.add("border-cyan-500")
      
      // In a real app, this would update the power mode
    })
    
    powerModeContainer.appendChild(modeOption)
  })
  
  // Assemble power mode section
  powerModeSection.appendChild(powerModeTitle)
  powerModeSection.appendChild(powerModeContainer)
  
  // Sleep settings section
  const sleepSection = document.createElement("div")
  sleepSection.className = "bg-gray-800/70 rounded-lg p-4"
  
  const sleepTitle = document.createElement("h4")
  sleepTitle.className = "font-medium text-gray-300 mb-4"
  sleepTitle.textContent = "Sleep & Power Off"
  
  // Screen timeout setting
  const screenTimeoutContainer = document.createElement("div")
  screenTimeoutContainer.className = "mb-4"
  
  const screenTimeoutLabel = document.createElement("div")
  screenTimeoutLabel.className = "text-gray-300 mb-2"
  screenTimeoutLabel.textContent = "Turn off screen after"
  
  const screenTimeoutSelect = document.createElement("select")
  screenTimeoutSelect.className = "w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-300"
  
  const timeoutOptions = ["1 minute", "5 minutes", "10 minutes", "15 minutes", "30 minutes", "1 hour", "Never"]
  
  timeoutOptions.forEach(option => {
    const timeoutOption = document.createElement("option")
    timeoutOption.textContent = option
    timeoutOption.value = option.toLowerCase().replace(" ", "_")
    
    if (option === "10 minutes") {
      timeoutOption.selected = true
    }
    
    screenTimeoutSelect.appendChild(timeoutOption)
  })
  
  screenTimeoutContainer.appendChild(screenTimeoutLabel)
  screenTimeoutContainer.appendChild(screenTimeoutSelect)
  
  // Auto sleep setting
  const autoSleepContainer = document.createElement("div")
  autoSleepContainer.className = "mb-4"
  
  const autoSleepLabel = document.createElement("div")
  autoSleepLabel.className = "text-gray-300 mb-2"
  autoSleepLabel.textContent = "Automatic sleep"
  
  const autoSleepSelect = document.createElement("select")
  autoSleepSelect.className = "w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-300"
  
  const sleepOptions = ["15 minutes", "30 minutes", "1 hour", "2 hours", "3 hours", "Never"]
  
  sleepOptions.forEach(option => {
    const sleepOption = document.createElement("option")
    sleepOption.textContent = option
    sleepOption.value = option.toLowerCase().replace(" ", "_")
    
    if (option === appState.settings.power.autoSleep) {
      sleepOption.selected = true
    }
    
    autoSleepSelect.appendChild(sleepOption)
  })
  
  // Update auto sleep setting when changed
  autoSleepSelect.addEventListener("change", () => {
    appState.settings.power.autoSleep = autoSleepSelect.options[autoSleepSelect.selectedIndex].textContent
    saveAppState()
  })
  
  autoSleepContainer.appendChild(autoSleepLabel)
  autoSleepContainer.appendChild(autoSleepSelect)
  
  // Power button behavior
  const powerButtonContainer = document.createElement("div")
  powerButtonContainer.className = "mb-4"
  
  const powerButtonLabel = document.createElement("div")
  powerButtonLabel.className = "text-gray-300 mb-2"
  powerButtonLabel.textContent = "Power button behavior"
  
  const powerButtonSelect = document.createElement("select")
  powerButtonSelect.className = "w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-300"
  
  const powerButtonOptions = ["Power Off", "Sleep", "Hibernate", "Do Nothing"]
  
  powerButtonOptions.forEach(option => {
    const buttonOption = document.createElement("option")
    buttonOption.textContent = option
    buttonOption.value = option.toLowerCase().replace(" ", "_")
    
    if (option === "Power Off") {
      buttonOption.selected = true
    }
    
    powerButtonSelect.appendChild(buttonOption)
  })
  
  powerButtonContainer.appendChild(powerButtonLabel)
  powerButtonContainer.appendChild(powerButtonSelect)
  
  // Show battery percentage toggle
  const batteryPercentContainer = document.createElement("div")
  batteryPercentContainer.className = "flex items-center justify-between"
  
  const batteryPercentLabel = document.createElement("div")
  batteryPercentLabel.className = "text-gray-300"
  batteryPercentLabel.textContent = "Show battery percentage"
  
  const batteryPercentToggle = document.createElement("div")
  batteryPercentToggle.className = "relative inline-block w-12 h-6 transition duration-200 ease-in-out"
  
  const batteryPercentInput = document.createElement("input")
  batteryPercentInput.type = "checkbox"
  batteryPercentInput.className = "opacity-0 w-0 h-0"
  batteryPercentInput.checked = true
  
  const batteryPercentSlider = document.createElement("span")
  batteryPercentSlider.className = "absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-cyan-500 transition duration-200 rounded-full before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:transition before:duration-200 before:rounded-full before:transform before:translate-x-6"
  
  batteryPercentInput.addEventListener("change", () => {
    if (batteryPercentInput.checked) {
      batteryPercentSlider.classList.add("bg-cyan-500")
      batteryPercentSlider.classList.remove("bg-gray-600")
      batteryPercentSlider.style.setProperty("--tw-translate-x", "1.5rem")
    } else {
      batteryPercentSlider.classList.remove("bg-cyan-500")
      batteryPercentSlider.classList.add("bg-gray-600")
      batteryPercentSlider.style.setProperty("--tw-translate-x", "0")
    }
  })
  
  batteryPercentToggle.appendChild(batteryPercentInput)
  batteryPercentToggle.appendChild(batteryPercentSlider)
  
  batteryPercentContainer.appendChild(batteryPercentLabel)
  batteryPercentContainer.appendChild(batteryPercentToggle)
  
  // Assemble sleep section
  sleepSection.appendChild(sleepTitle)
  sleepSection.appendChild(screenTimeoutContainer)
  sleepSection.appendChild(autoSleepContainer)
  sleepSection.appendChild(powerButtonContainer)
  sleepSection.appendChild(batteryPercentContainer)
  
  // Assemble power section
  container.appendChild(header)
  container.appendChild(powerModeSection)
  container.appendChild(sleepSection)
}
