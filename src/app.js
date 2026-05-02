import { renderFooter } from './components/Footer.js'
import { renderDeveloperBadge } from './components/DeveloperBadge.js'
import { renderCoursesPage } from './pages/Courses.js'
import { renderNavbar } from './components/Navbar.js'
import { renderHomePage } from './pages/Home.js'
import { renderLoginPage } from './pages/Login.js'
import { renderRegisterPage } from './pages/Register.js'
import { renderDashboardPage } from './pages/Dashboard.js'
import { renderCoursePage } from './pages/Course.js'
import { renderNotFoundPage } from './pages/NotFound.js'
import { getAuthToken, isAuthenticated } from './utils/auth.js'

// Simple router implementation
const routes = {
  '/': renderHomePage,
  '/login': renderLoginPage,
  '/register': renderRegisterPage,
  '/dashboard': renderDashboardPage,
  '/course': renderCoursePage, // Singular (detail page)
  '/courses': renderCoursesPage, // Plural (the new catalog page)
}

export function initApp() {
  const app = document.querySelector('#app')
  
  // Initialize navbar
  renderNavbar()
  renderFooter()          // <--- Add this
  renderDeveloperBadge()  // <--- Add this
  // Handle navigation
  function navigateTo(path) {
    window.history.pushState({}, '', path)
    renderContent()
  }
  
  // Handle browser back/forward buttons
  window.addEventListener('popstate', renderContent)
  
  // Render current page based on URL
  function renderContent() {
    const path = window.location.pathname
    
    // Check if the route exists
    const renderer = routes[path] || renderNotFoundPage
    
    // Check if route requires authentication
    if ((path === '/dashboard' || path === '/course') && !isAuthenticated()) {
      navigateTo('/login')
      return
    }
    
    // If authenticated and trying to access login/register, redirect to dashboard
    if ((path === '/login' || path === '/register') && isAuthenticated()) {
      navigateTo('/dashboard')
      return
    }
    
    // Clear previous content
    app.innerHTML = ''
    
    // Render the page content
    renderer(app)
  }
  
  // Add click event listeners to all navigation links
  document.addEventListener('click', (e) => {
    const { target } = e
    
    // Check if the clicked element is a link with data-link attribute
    if (target.matches('[data-link]')) {
      e.preventDefault()
      navigateTo(target.getAttribute('href'))
    }
  })
  
  // Initialize by rendering current route
  renderContent()
}

// Export a navigation function that can be used from components
export function navigateTo(path) {
  window.history.pushState({}, '', path)
  const event = new PopStateEvent('popstate')
  window.dispatchEvent(event)
}