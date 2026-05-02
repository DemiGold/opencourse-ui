import { createCourseCard } from '../components/CourseCard.js'
import { api } from '../utils/api.js'
import { navigateTo } from '../app.js'

// FIX: Removed 'async' from the main function signature
export function renderHomePage(container) {
  // 1. Synchronously render the loading state
  container.innerHTML = `
    <div class="container mx-auto px-4 py-8">
      <div class="animate-pulse">
        <div class="h-64 bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-8"></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${Array(3).fill(0).map(() => `
            <div class="bg-neutral-200 dark:bg-neutral-700 h-64 rounded-lg"></div>
          `).join('')}
        </div>
      </div>
    </div>
  `
  
  // 2. Fetch data asynchronously without blocking the UI thread
  ;(async () => {
    try {
      // Fetch courses
      const courses = await api.getCourses()
      
      // 3. Render the actual UI once data arrives
      container.innerHTML = `
        <section class="bg-gradient-to-r from-blue-900 to-blue-700 dark:from-neutral-900 dark:to-neutral-800 text-white py-16">
          <div class="container mx-auto px-4">
            <div class="md:flex md:items-center md:justify-between">
              <div class="md:w-1/2 mb-8 md:mb-0 animate-slideInUp">
                <h1 class="text-4xl md:text-5xl font-bold mb-4">Where Wisdom Fuels Revolutionary Innovation and Excellence</h1>
                <p class="text-xl text-gold-100 dark:text-yellow-400 mb-6">Expert-led courses to help you master the skills of tomorrow.</p>
                <div class="flex flex-wrap gap-4">
                  <button id="explore-courses-btn" class="btn btn-primary">Explore Courses</button>
                  <button class="btn btn-secondary dark:bg-neutral-700 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-600">Learn More</button>
                </div>
              </div>
              <div class="md:w-1/2 flex justify-center animate-fadeIn">
                <img src="https://images.pexels.com/photos/5905700/pexels-photo-5905700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Learning" class="rounded-lg shadow-xl max-w-full h-auto" style="max-height: 400px">
              </div>
            </div>
          </div>
        </section>
        
        <section class="py-12 bg-neutral-50 dark:bg-neutral-900 transition-colors duration-200">
          <div class="container mx-auto px-4">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-2">Featured Courses</h2>
              <p class="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">Discover our most popular courses and start your learning journey today.</p>
            </div>
            
            <div id="featured-courses" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"></div>
            
            <div class="mt-12 text-center">
              <button id="view-all-courses-btn" class="btn btn-secondary dark:bg-neutral-700 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-600">View All Courses</button>
            </div>
          </div>
        </section>
        
        <section class="py-12 bg-white dark:bg-neutral-800 transition-colors duration-200">
          <div class="container mx-auto px-4">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-2">Why Choose OpenCourse UI?</h2>
              <p class="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">Join thousands of learners who have transformed their careers with us.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="text-center p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-gold-300 dark:hover:border-gold-500 transition-colors">
                <div class="bg-blue-100 dark:bg-blue-900/40 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-900 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-blue-900 dark:text-white mb-2">Expert Instructors</h3>
                <p class="text-neutral-600 dark:text-neutral-400">Learn from industry professionals with years of experience in their fields.</p>
              </div>
              
              <div class="text-center p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-gold-300 dark:hover:border-gold-500 transition-colors">
                <div class="bg-green-100 dark:bg-green-900/40 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-blue-900 dark:text-white mb-2">Certification</h3>
                <p class="text-neutral-600 dark:text-neutral-400">Earn recognized certificates that you can add to your resume and LinkedIn profile.</p>
              </div>
              
              <div class="text-center p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-gold-300 dark:hover:border-gold-500 transition-colors">
                <div class="bg-gold-100 dark:bg-yellow-900/40 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gold-300 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-blue-900 dark:text-white mb-2">Self-Paced Learning</h3>
                <p class="text-neutral-600 dark:text-neutral-400">Study at your own pace and access course content anytime, anywhere.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section class="py-12 bg-blue-900 dark:bg-black text-white transition-colors duration-200">
          <div class="container mx-auto px-4 text-center">
            <h2 class="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
            <p class="text-xl max-w-xl mx-auto mb-8 text-blue-100 dark:text-neutral-300">Join thousands of students already learning on OpenCourse UI.</p>
            <button id="cta-btn" class="btn btn-primary text-lg px-8 py-3">Get Started Today</button>
          </div>
        </section>
      `
      
      // Fill the featured courses section
      const featuredCoursesContainer = document.getElementById('featured-courses')
      
      // Display first 3 courses
      courses.slice(0, 3).forEach(course => {
        const courseCard = createCourseCard(course)
        featuredCoursesContainer.appendChild(courseCard)
      })
      
      // Add event listeners
      document.getElementById('explore-courses-btn').addEventListener('click', () => {
        // Smooth scroll to courses section
        document.querySelector('#featured-courses').scrollIntoView({ behavior: 'smooth' })
      })
      
      document.getElementById('view-all-courses-btn').addEventListener('click', () => {
        navigateTo('/courses')
      })
      
      document.getElementById('cta-btn').addEventListener('click', () => {
        navigateTo('/register')
      })
      
    } catch (error) {
      console.error('Failed to load home page:', error)
      container.innerHTML = `
        <div class="container mx-auto px-4 py-16 text-center dark:bg-neutral-900">
          <h2 class="text-2xl font-bold text-neutral-800 dark:text-white mb-4">Oops! Something went wrong.</h2>
          <p class="text-neutral-600 dark:text-neutral-400 mb-6">We couldn't load the home page content. Please try again later.</p>
          <button id="retry-btn" class="btn btn-primary">Retry</button>
        </div>
      `
      
      document.getElementById('retry-btn').addEventListener('click', () => {
        renderHomePage(container)
      })
    }
  })() // Execute IIAFE
}