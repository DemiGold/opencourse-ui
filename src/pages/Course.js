import { getCurrentUser } from '../utils/auth.js'
import { api } from '../utils/api.js'
import { navigateTo } from '../app.js'
import { createLessonCard } from '../components/LessonCard.js'

export async function renderCoursePage(container) {
  // Get course ID from URL parameters
  const params = new URLSearchParams(window.location.search)
  const courseId = params.get('id')
  const enrollAction = params.get('enroll') === 'true'
  
  if (!courseId) {
    container.innerHTML = `
      <div class="min-h-screen bg-neutral-50 py-16">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-2xl font-bold text-neutral-800 mb-4">Course Not Found</h2>
          <p class="text-neutral-600 mb-6">The course you're looking for doesn't exist or was removed.</p>
          <button id="back-btn" class="btn btn-primary">Back to Courses</button>
        </div>
      </div>
    `
    
    document.getElementById('back-btn').addEventListener('click', () => {
      navigateTo('/courses')
    })
    
    return
  }
  
  // Create a loading state first
  container.innerHTML = `
    <div class="min-h-screen bg-neutral-50 py-8">
      <div class="container mx-auto px-4">
        <div class="animate-pulse">
          <div class="h-64 bg-neutral-200 rounded-lg mb-8"></div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
              <div class="bg-neutral-200 h-32 rounded-lg mb-8"></div>
              <div class="space-y-4">
                ${Array(4).fill(0).map(() => `
                  <div class="bg-neutral-200 h-24 rounded-lg"></div>
                `).join('')}
              </div>
            </div>
            <div>
              <div class="bg-neutral-200 h-64 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
  
  try {
    // Fetch course details
    const course = await api.getCourse(courseId)
    
    // Get current user
    const user = getCurrentUser()
    
    // Check if user is enrolled
    let enrollment = null
    let isEnrolled = false
    
    try {
      const enrollments = await api.getEnrollments(user.id)
      enrollment = enrollments.find(e => e.course.id === parseInt(courseId))
      isEnrolled = !!enrollment
    } catch (error) {
      console.error('Failed to check enrollment status:', error)
    }
    
    // Auto-enroll if requested
    if (enrollAction && !isEnrolled) {
      try {
        enrollment = await api.enrollInCourse(user.id, courseId)
        isEnrolled = true
      } catch (error) {
        console.error('Failed to enroll in course:', error)
      }
    }
    
    container.innerHTML = `
      <div class="min-h-screen bg-neutral-50 py-8">
        <div class="container mx-auto px-4">
          <!-- Course Header -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div class="relative">
              <img src="${course.image}" alt="${course.title}" class="w-full h-64 object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div class="p-6 text-white">
                  <h1 class="text-3xl font-bold mb-2">${course.title}</h1>
                  <div class="flex flex-wrap items-center text-sm">
                    <span class="mr-4">Instructor: ${course.instructor}</span>
                    <span class="mr-4">Duration: ${course.duration}</span>
                    <span class="mr-4">Level: ${course.level}</span>
                    <div class="flex items-center">
                      <div class="flex items-center text-gold-300">
                        ${Array(5).fill(0).map((_, i) => `
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ${i < Math.floor(course.rating) ? 'text-gold-300' : 'text-neutral-300'}" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        `).join('')}
                        <span class="ml-1">${course.rating}</span>
                      </div>
                      <span class="mx-2">|</span>
                      <span>${course.enrolledCount} students</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Content -->
            <div class="lg:col-span-2">
              <!-- Course Description -->
              <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 class="text-xl font-semibold text-blue-900 mb-4">About This Course</h2>
                <p class="text-neutral-700 mb-6">${course.description}</p>
                
                <div class="border-t border-neutral-200 pt-6">
                  <h3 class="text-lg font-semibold text-blue-900 mb-4">What You'll Learn</h3>
                  <ul class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <li class="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span>Core principles and fundamentals</span>
                    </li>
                    <li class="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span>Practical, real-world applications</span>
                    </li>
                    <li class="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span>Advanced techniques and strategies</span>
                    </li>
                    <li class="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span>Industry best practices</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <!-- Course Content -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-xl font-semibold text-blue-900">Course Content</h2>
                  ${isEnrolled ? `
                    <div class="flex items-center">
                      <span class="text-sm mr-2">Your Progress: </span>
                      <span class="text-sm font-medium progress-percentage">${enrollment.progress || 0}%</span>
                    </div>
                  ` : ''}
                </div>
                
                ${isEnrolled ? `
                  <div class="mb-6">
                    <div class="progress-bar">
                      <div class="progress-bar-fill" style="width: ${enrollment.progress || 0}%"></div>
                    </div>
                  </div>
                ` : ''}
                
                <div id="course-lessons" class="space-y-4">
                  ${!isEnrolled ? `
                    <div class="text-center py-8">
                      <div class="bg-neutral-50 rounded-lg p-6">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-900 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <h3 class="text-lg font-semibold text-blue-900 mb-2">Content Locked</h3>
                        <p class="text-neutral-600 mb-4">Enroll in this course to access all lessons and materials.</p>
                        <button id="enroll-btn" class="btn btn-primary">Enroll Now for $${course.price}</button>
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
            
            <!-- Sidebar -->
            <div>
              <div class="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
                <img src="${course.image}" alt="${course.title}" class="w-full h-48 object-cover">
                
                <div class="p-6">
                  <div class="flex justify-between items-center mb-4">
                    <span class="text-2xl font-bold text-blue-900">$${course.price}</span>
                    ${isEnrolled ? `
                      <span class="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Enrolled</span>
                    ` : ''}
                  </div>
                  
                  ${isEnrolled ? `
                    <button id="continue-btn" class="btn btn-primary w-full mb-4">Continue Learning</button>
                  ` : `
                    <button id="sidebar-enroll-btn" class="btn btn-primary w-full mb-4">Enroll Now</button>
                  `}
                  
                  <div class="space-y-4">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="text-neutral-700">${course.duration}</span>
                    </div>
                    
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span class="text-neutral-700">${course.lessons.length} lessons</span>
                    </div>
                    
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="text-neutral-700">Certificate of completion</span>
                    </div>
                    
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      <span class="text-neutral-700">Full lifetime access</span>
                    </div>
                  </div>
                  
                  <div class="mt-6 pt-6 border-t border-neutral-200">
                    <h3 class="font-semibold text-neutral-800 mb-4">Share this course</h3>
                    <div class="flex space-x-4">
                      <a href="#" class="text-blue-900 hover:text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                      </a>
                      <a href="#" class="text-blue-900 hover:text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                      <a href="#" class="text-blue-900 hover:text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                        </svg>
                      </a>
                      <a href="#" class="text-blue-900 hover:text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    
    // If user is enrolled, display lessons
    if (isEnrolled) {
      const lessonsContainer = document.getElementById('course-lessons')
      lessonsContainer.innerHTML = ''
      
      // Get user's completed lessons
      const completedLessons = enrollment?.completedLessons || []
      
      // Render each lesson card
      course.lessons.forEach((lesson, index) => {
        const isCompleted = completedLessons.includes(lesson.id)
        const lessonCard = createLessonCard(lesson, course.id, index, isCompleted)
        lessonsContainer.appendChild(lessonCard)
      })
      
      // Add event listener to continue button
      const continueBtn = document.getElementById('continue-btn')
      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          // Scroll to course content section
          document.querySelector('#course-lessons').scrollIntoView({ behavior: 'smooth' })
        })
      }
    } else {
      // Add event listeners to enroll buttons
      const enrollBtn = document.getElementById('enroll-btn')
      const sidebarEnrollBtn = document.getElementById('sidebar-enroll-btn')
      
      const handleEnroll = async () => {
        try {
          // Disable buttons and show loading state
          enrollBtn.disabled = true
          sidebarEnrollBtn.disabled = true
          enrollBtn.innerHTML = `
            <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          `
          sidebarEnrollBtn.innerHTML = enrollBtn.innerHTML
          
          // Enroll user in course
          await api.enrollInCourse(user.id, courseId)
          
          // Reload the page to show enrolled content
          window.location.href = `/course?id=${courseId}`
        } catch (error) {
          console.error('Failed to enroll in course:', error)
          
          // Show error message
          alert('Failed to enroll in this course. Please try again later.')
          
          // Reset buttons
          enrollBtn.disabled = false
          sidebarEnrollBtn.disabled = false
          enrollBtn.innerHTML = 'Enroll Now'
          sidebarEnrollBtn.innerHTML = 'Enroll Now'
        }
      }
      
      if (enrollBtn) {
        enrollBtn.addEventListener('click', handleEnroll)
      }
      
      if (sidebarEnrollBtn) {
        sidebarEnrollBtn.addEventListener('click', handleEnroll)
      }
    }
    
  } catch (error) {
    console.error('Failed to load course:', error)
    container.innerHTML = `
      <div class="min-h-screen bg-neutral-50 py-16">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-2xl font-bold text-neutral-800 mb-4">Course Not Found</h2>
          <p class="text-neutral-600 mb-6">The course you're looking for doesn't exist or was removed.</p>
          <button id="back-btn" class="btn btn-primary">Back to Courses</button>
        </div>
      </div>
    `
    
    document.getElementById('back-btn').addEventListener('click', () => {
      navigateTo('/courses')
    })
  }
}