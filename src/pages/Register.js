import { register } from '../utils/auth.js'
import { navigateTo } from '../app.js'

export function renderRegisterPage(container) {
  container.innerHTML = `
    <div class="min-h-screen py-12 bg-neutral-50 dark:bg-neutral-900">
      <div class="container mx-auto px-4">
        <div class="max-w-md mx-auto bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
          <div class="bg-blue-900 dark:bg-blue-950 py-4 px-6">
            <h2 class="text-2xl font-bold text-white">Create Your Account</h2>
          </div>
          
          <div class="p-6">
            <form id="register-form" class="space-y-4">
              <div id="register-error" class="hidden bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md text-sm"></div>
              
              <div>
                <label for="name" class="form-label dark:text-neutral-200">Full Name</label>
                <input type="text" id="name" class="form-input dark:bg-neutral-700 dark:border-neutral-600 dark:text-white" placeholder="John Doe" required>
              </div>
              
              <div>
                <label for="email" class="form-label dark:text-neutral-200">Email</label>
                <input type="email" id="email" class="form-input dark:bg-neutral-700 dark:border-neutral-600 dark:text-white" placeholder="your@email.com" required>
              </div>
              
              <div>
                <label for="password" class="form-label dark:text-neutral-200">Password</label>
                <input type="password" id="password" class="form-input dark:bg-neutral-700 dark:border-neutral-600 dark:text-white" placeholder="••••••••" required>
              </div>
              
              <div>
                <label for="confirm-password" class="form-label dark:text-neutral-200">Confirm Password</label>
                <input type="password" id="confirm-password" class="form-input dark:bg-neutral-700 dark:border-neutral-600 dark:text-white" placeholder="••••••••" required>
              </div>
              
              <div>
                <label class="form-label dark:text-neutral-200">Register as</label>
                <div class="flex space-x-4 mt-1">
                  <label class="flex items-center">
                    <input type="radio" name="role" value="student" class="mr-2 border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 text-blue-900 dark:text-blue-500" checked>
                    <span class="dark:text-neutral-300">Student</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" name="role" value="instructor" class="mr-2 border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 text-blue-900 dark:text-blue-500">
                    <span class="dark:text-neutral-300">Instructor</span>
                  </label>
                </div>
              </div>
              
              <div class="flex items-center">
                <input type="checkbox" id="terms" class="h-4 w-4 text-blue-900 dark:text-blue-500 rounded border-gray-300 dark:border-neutral-600 dark:bg-neutral-700" required>
                <label for="terms" class="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                  I agree to the <a href="#" class="text-blue-900 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">Terms of Service</a> and <a href="#" class="text-blue-900 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">Privacy Policy</a>
                </label>
              </div>
              
              <button type="submit" id="register-submit" class="btn btn-primary w-full">
                Create Account
              </button>
              
              <div class="text-center mt-4">
                <p class="text-sm text-neutral-600 dark:text-neutral-400">
                  Already have an account? 
                  <a href="/login" data-link class="text-blue-900 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">Login</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
  
  // Add event listener to register form
  const registerForm = document.getElementById('register-form')
  const registerError = document.getElementById('register-error')
  const registerSubmit = document.getElementById('register-submit')
  
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    // Clear previous errors
    registerError.classList.add('hidden')
    registerError.textContent = ''
    
    // Get form values
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirm-password').value
    const role = document.querySelector('input[name="role"]:checked').value
    const terms = document.getElementById('terms').checked
    
    // Validation
    if (password !== confirmPassword) {
      registerError.textContent = 'Passwords do not match'
      registerError.classList.remove('hidden')
      return
    }
    
    if (!terms) {
      registerError.textContent = 'You must agree to the Terms of Service and Privacy Policy'
      registerError.classList.remove('hidden')
      return
    }
    
    // Disable submit button and show loading state
    registerSubmit.disabled = true
    registerSubmit.innerHTML = `
      <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    `
    
    try {
      // Attempt registration
      await register(name, email, password, role)
      
      // Redirect to dashboard on success
      navigateTo('/dashboard')
    } catch (error) {
      // Show error message
      registerError.textContent = error.message
      registerError.classList.remove('hidden')
      
      // Re-enable submit button
      registerSubmit.disabled = false
      registerSubmit.innerHTML = 'Create Account'
    }
  })
}