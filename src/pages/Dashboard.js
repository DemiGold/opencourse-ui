import { getCurrentUser } from '../utils/auth.js'
import { api } from '../utils/api.js'
import { createCourseCard } from '../components/CourseCard.js'
import { navigateTo } from '../app.js'

// Removed 'async' to keep routing synchronous
export function renderDashboardPage(container) {
  const user = getCurrentUser()
  
  // 1. Synchronously render the loading state
  container.innerHTML = `
    <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div class="container mx-auto px-4">
        <div class="animate-pulse">
          <div class="h-24 bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-8"></div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-neutral-200 dark:bg-neutral-700 h-64 rounded-lg"></div>
            <div class="bg-neutral-200 dark:bg-neutral-700 h-64 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  `
  
  // 2. Fetch data asynchronously
  ;(async () => {
    try {
      // Fetch user enrollments
      const enrollments = await api.getEnrollments(user.id)
      
      // Calculate overall progress
      const overallProgress = enrollments.length 
        ? Math.round(enrollments.reduce((acc, curr) => acc + curr.progress, 0) / enrollments.length) 
        : 0
      
      // 3. Render the actual UI once data arrives
      container.innerHTML = `
        <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
          <div class="container mx-auto px-4">
            <!-- Welcome Banner -->
            <div class="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg shadow-md p-6 mb-8 animate-fadeIn">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 class="text-2xl font-bold mb-2">Welcome back, ${user.name}!</h1>
                  <p class="text-blue-100">Continue your learning journey today.</p>
                </div>
                <div class="mt-4 md:mt-0">
                  <button id="explore-courses-btn" class="btn btn-primary">Find New Courses</button>
                </div>
              </div>
            </div>
            
            <!-- Dashboard Content -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Main Content -->
              <div class="lg:col-span-2">
                <!-- Progress Overview -->
                <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 mb-8">
                  <h2 class="text-xl font-semibold text-blue-900 dark:text-blue-400 mb-4">Your Learning Progress</h2>
                  
                  <div class="space-y-6">
                    <div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-neutral-700 dark:text-neutral-300">Overall Progress</span>
                        <span class="text-neutral-700 dark:text-neutral-300 font-medium">${overallProgress}%</span>
                      </div>
                      <div class="progress-bar dark:bg-neutral-700">
                        <div class="progress-bar-fill" style="width: ${overallProgress}%"></div>
                      </div>
                    </div>
                    
                    ${enrollments.length === 0 ? `
                      <div class="text-center py-6">
                        <p class="text-neutral-500 dark:text-neutral-400 mb-4">You haven't enrolled in any courses yet.</p>
                        <button id="get-started-btn" class="btn btn-primary">Get Started</button>
                      </div>
                    ` : ''}
                  </div>
                </div>
                
                <!-- My Courses -->
                <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
                  <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-semibold text-blue-900 dark:text-blue-400">My Courses</h2>
                    <button id="view-all-enrollments-btn" class="text-blue-900 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                      View All
                    </button>
                  </div>
                  
                  <div id="enrolled-courses" class="space-y-6">
                    ${enrollments.length === 0 ? `
                      <div class="text-center py-8">
                        <p class="text-neutral-500 dark:text-neutral-400">You have no enrolled courses.</p>
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
              
              <!-- Sidebar -->
              <div>
                <!-- User Stats -->
                <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 mb-8">
                  <h2 class="text-xl font-semibold text-blue-900 dark:text-blue-400 mb-4">Your Stats</h2>
                  
                  <div class="space-y-4">
                    <div class="flex items-center">
                      <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-900 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <p class="text-neutral-500 dark:text-neutral-400 text-sm">Courses Enrolled</p>
                        <p class="text-neutral-800 dark:text-white font-semibold">${enrollments.length}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center">
                      <div class="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p class="text-neutral-500 dark:text-neutral-400 text-sm">Completed Courses</p>
                        <p class="text-neutral-800 dark:text-white font-semibold">${enrollments.filter(e => e.progress === 100).length}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center">
                      <div class="bg-gold-100 dark:bg-yellow-900/30 p-3 rounded-full mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gold-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p class="text-neutral-500 dark:text-neutral-400 text-sm">Hours Spent</p>
                        <p class="text-neutral-800 dark:text-white font-semibold">12.5</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Recommended Courses -->
                <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
                  <h2 class="text-xl font-semibold text-blue-900 dark:text-blue-400 mb-4">Recommended For You</h2>
                  
                  <div id="recommended-courses" class="space-y-4">
                    <p class="text-neutral-500 dark:text-neutral-400 text-center py-4">Loading recommendations...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
      
      // Fill enrolled courses section
      const enrolledCoursesContainer = document.getElementById('enrolled-courses')
      
      if (enrollments.length > 0) {
        enrolledCoursesContainer.innerHTML = ''
        
        enrollments.forEach(enrollment => {
          const course = enrollment.course
          
          const courseItem = document.createElement('div')
          courseItem.className = 'border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-gold-300 dark:hover:border-gold-500 transition-colors'
          
          courseItem.innerHTML = `
            <div class="flex flex-col md:flex-row">
              <div class="md:w-1/4">
                <img src="${course.image}" alt="${course.title}" class="w-full h-32 md:h-full object-cover rounded-t-lg md:rounded-t-none md:rounded-l-lg">
              </div>
              <div class="p-4 md:p-6 md:w-3/4">
                <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-400 mb-2">${course.title}</h3>
                <div class="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                  <span>${course.instructor}</span>
                  <span class="mx-2">•</span>
                  <span>${course.level}</span>
                </div>
                
                <div class="mb-4">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm text-neutral-600 dark:text-neutral-400">Progress</span>
                    <span class="text-sm font-medium progress-percentage dark:text-neutral-200">${enrollment.progress}%</span>
                  </div>
                  <div class="progress-bar dark:bg-neutral-700">
                    <div class="progress-bar-fill" style="width: ${enrollment.progress}%"></div>
                  </div>
                </div>
                
                <button class="continue-course-btn btn btn-primary" data-course-id="${course.id}">
                  Continue Learning
                </button>
              </div>
            </div>
          `
          
          const continueBtn = courseItem.querySelector('.continue-course-btn')
          continueBtn.addEventListener('click', () => {
            navigateTo(`/course?id=${course.id}`)
          })
          
          enrolledCoursesContainer.appendChild(courseItem)
        })
      }
      
      // Fetch and display recommended courses
      try {
        const allCourses = await api.getCourses()
        const enrolledCourseIds = enrollments.map(e => e.course.id)
        
        const recommendedCourses = allCourses
          .filter(course => !enrolledCourseIds.includes(course.id))
          .slice(0, 2)
        
        const recommendedCoursesContainer = document.getElementById('recommended-courses')
        
        if (recommendedCourses.length > 0) {
          recommendedCoursesContainer.innerHTML = ''
          
          recommendedCourses.forEach(course => {
            const courseItem = document.createElement('div')
            courseItem.className = 'border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:border-gold-300 dark:hover:border-gold-500 transition-colors cursor-pointer'
            
            courseItem.innerHTML = `
              <div class="flex items-center">
                <img src="${course.image}" alt="${course.title}" class="w-16 h-16 object-cover rounded-md mr-4">
                <div>
                  <h3 class="font-medium text-neutral-800 dark:text-white">${course.title}</h3>
                  <p class="text-sm text-neutral-500 dark:text-neutral-400">${course.instructor}</p>
                </div>
              </div>
            `
            
            courseItem.addEventListener('click', () => {
              navigateTo(`/course?id=${course.id}`)
            })
            
            recommendedCoursesContainer.appendChild(courseItem)
          })
        } else {
          recommendedCoursesContainer.innerHTML = `
            <p class="text-neutral-500 dark:text-neutral-400 text-center py-4">No recommendations available.</p>
          `
        }
      } catch (error) {
        console.error('Failed to load recommendations:', error)
        document.getElementById('recommended-courses').innerHTML = `
          <p class="text-neutral-500 dark:text-neutral-400 text-center py-4">Could not load recommendations.</p>
        `
      }
      
      // Add event listeners for static elements
      document.getElementById('explore-courses-btn').addEventListener('click', () => {
        navigateTo('/courses')
      })
      
      const getStartedBtn = document.getElementById('get-started-btn')
      if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
          navigateTo('/courses')
        })
      }
      
      document.getElementById('view-all-enrollments-btn').addEventListener('click', () => {
        // This would navigate to a full enrollments view in a real application
      })
      
    } catch (error) {
      console.error('Failed to load dashboard:', error)
      container.innerHTML = `
        <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-16">
          <div class="container mx-auto px-4 text-center">
            <h2 class="text-2xl font-bold text-neutral-800 dark:text-white mb-4">Oops! Something went wrong.</h2>
            <p class="text-neutral-600 dark:text-neutral-400 mb-6">We couldn't load your dashboard. Please try again later.</p>
            <button id="retry-btn" class="btn btn-primary">Retry</button>
          </div>
        </div>
      `
      
      document.getElementById('retry-btn').addEventListener('click', () => {
        renderDashboardPage(container)
      })
    }
  })()
}