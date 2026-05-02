import { login } from '../utils/auth.js'
import { navigateTo } from '../app.js'

export function renderLoginPage(container) {
  container.innerHTML = `
    <div class="min-h-screen py-12 bg-neutral-50 dark:bg-neutral-900">
      <div class="container mx-auto px-4">
        <div class="max-w-md mx-auto bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
          <div class="bg-blue-900 dark:bg-blue-950 py-4 px-6">
            <h2 class="text-2xl font-bold text-white">Login to Your Account</h2>
          </div>
          
          <div class="p-6">
            <form id="login-form" class="space-y-4">
              <div id="login-error" class="hidden bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md text-sm"></div>
              
              <div>
                <label for="email" class="form-label dark:text-neutral-200">Email</label>
                <input type="email" id="email" class="form-input dark:bg-neutral-700 dark:border-neutral-600 dark:text-white" placeholder="your@email.com" required>
              </div>
              
              <div>
                <label for="password" class="form-label dark:text-neutral-200">Password</label>
                <input type="password" id="password" class="form-input dark:bg-neutral-700 dark:border-neutral-600 dark:text-white" placeholder="••••••••" required>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input type="checkbox" id="remember" class="h-4 w-4 text-blue-900 dark:text-blue-500 rounded border-gray-300 dark:border-neutral-600 dark:bg-neutral-700">
                  <label for="remember" class="ml-2 text-sm text-neutral-700 dark:text-neutral-300">Remember me</label>
                </div>
                <a href="#" class="text-sm text-blue-900 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">Forgot password?</a>
              </div>
              
              <button type="submit" id="login-submit" class="btn btn-primary w-full">
                Login
              </button>
              
              <div class="text-center mt-4">
                <p class="text-sm text-neutral-600 dark:text-neutral-400">
                  Don't have an account? 
                  <a href="/register" data-link class="text-blue-900 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">Sign up</a>
                </p>
              </div>
            </form>
            
            <div class="mt-6">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-neutral-300 dark:border-neutral-600"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">Demo accounts</span>
                </div>
              </div>
              
              <div class="mt-4 grid grid-cols-1 gap-3">
                <button type="button" class="demo-login-btn py-2 px-4 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600" data-email="student@example.com" data-password="password123">
                  Login as Demo Student
                </button>
                <button type="button" class="demo-login-btn py-2 px-4 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600" data-email="instructor@example.com" data-password="password123">
                  Login as Demo Instructor
                </button>
                <button type="button" class="demo-login-btn py-2 px-4 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600" data-email="admin@example.com" data-password="password123">
                  Login as Demo Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
  
  // Add event listener to login form
  const loginForm = document.getElementById('login-form')
  const loginError = document.getElementById('login-error')
  const loginSubmit = document.getElementById('login-submit')
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    // Get form values
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    
    // Disable submit button and show loading state
    loginSubmit.disabled = true
    loginSubmit.innerHTML = `
      <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    `
    
    try {
      // Attempt login
      await login(email, password)
      
      // Redirect to dashboard on success
      navigateTo('/dashboard')
    } catch (error) {
      // Show error message
      loginError.textContent = error.message
      loginError.classList.remove('hidden')
      
      // Re-enable submit button
      loginSubmit.disabled = false
      loginSubmit.innerHTML = 'Login'
    }
  })
  
  // Add event listeners to demo login buttons
  const demoLoginButtons = document.querySelectorAll('.demo-login-btn')
  
  demoLoginButtons.forEach(button => {
    button.addEventListener('click', async () => {
      // Get demo credentials from button data attributes
      const email = button.getAttribute('data-email')
      const password = button.getAttribute('data-password')
      
      // Fill the form with demo credentials
      document.getElementById('email').value = email
      document.getElementById('password').value = password
      
      // Disable all demo buttons and show loading state
      demoLoginButtons.forEach(btn => {
        btn.disabled = true
      })
      
      button.innerHTML = `
        <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      `
      
      try {
        // Attempt login with demo credentials
        await login(email, password)
        
        // Redirect to dashboard on success
        navigateTo('/dashboard')
      } catch (error) {
        // Show error message
        loginError.textContent = error.message
        loginError.classList.remove('hidden')
        
        // Re-enable demo buttons
        demoLoginButtons.forEach(btn => {
          btn.disabled = false
          btn.innerHTML = btn.textContent
        })
      }
    })
  })
}