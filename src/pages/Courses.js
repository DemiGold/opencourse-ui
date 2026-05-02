import { api } from '../utils/api.js'
import { createCourseCard } from '../components/CourseCard.js'
import { navigateTo } from '../app.js'

export function renderCoursesPage(container) {
  // 1. Synchronously render the loading skeleton
  container.innerHTML = `
    <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 transition-colors duration-200">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-8 text-center">Explore Our Catalog</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
          ${Array(6).fill(0).map(() => `
            <div class="bg-neutral-200 dark:bg-neutral-700 h-96 rounded-lg"></div>
          `).join('')}
        </div>
      </div>
    </div>
  `

  // 2. Fetch data asynchronously
  ;(async () => {
    try {
      const courses = await api.getCourses()
      
      // 3. Render the actual UI once data arrives
      container.innerHTML = `
        <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 transition-colors duration-200">
          <div class="container mx-auto px-4">
            <div class="text-center mb-12">
              <h1 class="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-400 mb-4">Explore Our Catalog</h1>
              <p class="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Discover expert-led courses designed to help you master the skills of tomorrow. Whether you are a beginner or looking to advance your career, we have something for you.
              </p>
            </div>
            
            <div id="all-courses-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <!-- Courses will be injected here -->
            </div>
          </div>
        </div>
      `
      
      // Fill the grid with course cards
      const grid = document.getElementById('all-courses-grid')
      courses.forEach(course => {
        const card = createCourseCard(course)
        grid.appendChild(card)
      })

    } catch (error) {
      console.error('Failed to load courses:', error)
      container.innerHTML = `
        <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-16 transition-colors duration-200">
          <div class="container mx-auto px-4 text-center">
            <h2 class="text-2xl font-bold text-neutral-800 dark:text-white mb-4">Oops! Something went wrong.</h2>
            <p class="text-neutral-600 dark:text-neutral-400 mb-6">We couldn't load the course catalog. Please try again later.</p>
            <button id="retry-btn" class="btn btn-primary">Retry</button>
          </div>
        </div>
      `
      
      document.getElementById('retry-btn').addEventListener('click', () => {
        renderCoursesPage(container)
      })
    }
  })()
}