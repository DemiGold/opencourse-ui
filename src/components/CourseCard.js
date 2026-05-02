import { navigateTo } from '../app.js'
import { isAuthenticated } from '../utils/auth.js'
import { createPaymentModal } from './PaymentModal.js'

export function createCourseCard(course, isEnrolled = false) {
  const card = document.createElement('div')
  // Added specific background, border, and dark mode classes to ensure it renders correctly regardless of the parent container
  card.className = 'card bg-white dark:bg-neutral-800 rounded-lg overflow-hidden border border-transparent dark:border-neutral-700 hover:shadow-lg dark:hover:shadow-blue-900/20 hover:border-gold-300 dark:hover:border-gold-500 transition-all duration-300 cursor-pointer'
  card.setAttribute('data-course-id', course.id)
  
  card.innerHTML = `
    <div class="relative">
      <img src="${course.image}" alt="${course.title}" class="w-full h-48 object-cover">
      <div class="absolute top-2 right-2 bg-blue-900 dark:bg-blue-800 text-white text-xs font-bold py-1 px-2 rounded-full shadow-md">
        ${course.level}
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-400 mb-2">${course.title}</h3>
      <p class="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2 mb-3">${course.description}</p>
      
      <div class="flex items-center mb-3">
        <div class="flex items-center text-gold-300 dark:text-yellow-400">
          ${Array(5).fill(0).map((_, i) => `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ${i < Math.floor(course.rating) ? 'text-gold-300 dark:text-yellow-400' : 'text-neutral-300 dark:text-neutral-600'}" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          `).join('')}
          <span class="ml-1 text-sm dark:text-neutral-300">${course.rating}</span>
        </div>
        <span class="mx-2 text-neutral-300 dark:text-neutral-600">|</span>
        <span class="text-sm text-neutral-600 dark:text-neutral-400">${course.enrolledCount} students</span>
      </div>
      
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">Instructor</p>
          <p class="text-neutral-800 dark:text-white">${course.instructor}</p>
        </div>
        <div>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">Duration</p>
          <p class="text-neutral-800 dark:text-white">${course.duration}</p>
        </div>
      </div>
      
      <div class="mt-4 flex items-center justify-between">
        <span class="text-xl font-bold text-blue-900 dark:text-blue-400">$${course.price}</span>
        <button class="course-action-btn btn ${isEnrolled ? 'btn-success' : 'btn-primary'}">
          ${isEnrolled ? 'Continue Learning' : 'Enroll Now'}
        </button>
      </div>
    </div>
  `
  
  // Add event listener to the button
  const actionBtn = card.querySelector('.course-action-btn')
  
  actionBtn.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      navigateTo('/login')
      return
    }
    
    if (isEnrolled) {
      // Navigate to course content
      navigateTo(`/course?id=${course.id}`)
    } else {
      // Show payment modal
      createPaymentModal(course, () => {
        // On successful payment, navigate to course
        navigateTo(`/course?id=${course.id}&enroll=true`)
      })
    }
  })
  
  // Make the card clickable to view course details
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.course-action-btn')) {
      navigateTo(`/course?id=${course.id}`)
    }
  })
  
  return card
}