import { navigateTo } from '../app.js'
import { isAuthenticated, getCurrentUser, logout } from '../utils/auth.js'

export function renderNavbar() {
  // Create navbar element
  const navbar = document.createElement('nav')
  navbar.className = 'bg-blue-900 dark:bg-neutral-900 text-white shadow-md'
  
  // Create navbar content
  navbar.innerHTML = `
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-1">
          <a href="/" data-link class="flex items-center">
            <!-- Inline SVG allows Tailwind to control the color via currentColor -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-10 w-10 mr-3 text-yellow-400 dark:text-blue-500">
              <path d="M12 3L1 7.14286V9.45828L12 13.6011L21 10.208V17H23V7.14286L12 3ZM12 11.2393L3.8961 8.18182L12 5.12437L20.1039 8.18182L12 11.2393ZM4 11.8385V16.8926C4 16.8926 7.5 20 12 20C16.5 20 20 16.8926 20 16.8926V11.8385L12 14.8541L4 11.8385Z"/>
            </svg>
            <span class="text-xl font-semibold">OpenCourse UI</span>
          </a>
        </div>
        
        <div class="hidden md:flex items-center space-x-6">
          <a href="/" data-link class="nav-link">Home</a>
          <a href="/courses" data-link class="nav-link">Courses</a>
          ${isAuthenticated() 
            ? `
              <a href="/dashboard" data-link class="nav-link">Dashboard</a>
              <div class="relative group">
                <button class="nav-link flex items-center">
                  <span id="user-name">${getCurrentUser()?.name || 'User'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <a href="/profile" data-link class="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700">Profile</a>
                  <a href="/settings" data-link class="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700">Settings</a>
                  <button id="theme-toggle" class="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                    <span class="dark:hidden">Dark Mode</span>
                    <span class="hidden dark:inline">Light Mode</span>
                  </button>
                  <button id="logout-btn" class="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700">Logout</button>
                </div>
              </div>
              `
            : `
              <button id="theme-toggle" class="nav-link flex items-center">
                <span class="dark:hidden">🌙</span>
                <span class="hidden dark:inline">☀️</span>
              </button>
              <a href="/login" data-link class="btn btn-primary">Login</a>
              <a href="/register" data-link class="btn btn-secondary">Sign Up</a>
              `
          }
        </div>
        
        <div class="md:hidden flex items-center space-x-4">
          <button id="theme-toggle-mobile" class="text-white">
            <span class="dark:hidden">🌙</span>
            <span class="hidden dark:inline">☀️</span>
          </button>
          <button id="mobile-menu-btn" class="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div id="mobile-menu" class="md:hidden hidden pt-4 pb-3 border-t border-blue-800 dark:border-neutral-700">
        <div class="flex flex-col space-y-3">
          <a href="/" data-link class="nav-link">Home</a>
          <a href="/courses" data-link class="nav-link">Courses</a>
          ${isAuthenticated() 
            ? `
              <a href="/dashboard" data-link class="nav-link">Dashboard</a>
              <a href="/profile" data-link class="nav-link">Profile</a>
              <a href="/settings" data-link class="nav-link">Settings</a>
              <button id="mobile-logout-btn" class="text-left nav-link">Logout</button>
              `
            : `
              <a href="/login" data-link class="nav-link">Login</a>
              <a href="/register" data-link class="nav-link">Sign Up</a>
              `
          }
        </div>
      </div>
    </div>
  `
  
  // Insert navbar at the beginning of the body
  document.body.insertBefore(navbar, document.body.firstChild)
  
  // Theme toggle functionality
  function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  }
  
  // Check for saved theme preference or system preference
  if (localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  }
  
  // Add event listeners for theme toggle buttons
  const themeToggle = document.getElementById('theme-toggle')
  const mobileThemeToggle = document.getElementById('theme-toggle-mobile')
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme)
  }
  
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme)
  }
  
  // Mobile menu functionality
  const mobileMenuBtn = document.getElementById('mobile-menu-btn')
  const mobileMenu = document.getElementById('mobile-menu')
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden')
    })
  }
  
  // Logout functionality
  const logoutBtn = document.getElementById('logout-btn')
  const mobileLogoutBtn = document.getElementById('mobile-logout-btn')
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault()
      logout()
    })
  }
  
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener('click', (e) => {
      e.preventDefault()
      logout()
    })
  }
  
  // Close mobile menu when a link is clicked
  const mobileLinks = mobileMenu?.querySelectorAll('[data-link]')
  
  if (mobileLinks) {
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden')
      })
    })
  }
}