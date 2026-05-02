import { navigateTo } from '../app.js'

export function renderNotFoundPage(container) {
  container.innerHTML = `
    <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div class="max-w-md w-full text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-blue-900 dark:text-blue-400 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        
        <h2 class="text-4xl font-bold text-blue-900 dark:text-blue-400 mb-4">404</h2>
        <h3 class="text-2xl font-semibold text-neutral-800 dark:text-white mb-4">Page Not Found</h3>
        <p class="text-neutral-600 dark:text-neutral-400 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div class="space-x-4">
          <button id="go-home-btn" class="btn btn-primary">Go to Homepage</button>
          <button id="go-back-btn" class="btn btn-secondary">Go Back</button>
        </div>
      </div>
    </div>
  `
  
  // Add event listeners
  document.getElementById('go-home-btn').addEventListener('click', () => {
    navigateTo('/')
  })
  
  document.getElementById('go-back-btn').addEventListener('click', () => {
    window.history.back()
  })
}