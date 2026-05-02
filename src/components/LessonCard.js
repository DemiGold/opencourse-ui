import { getCurrentUser } from '../utils/auth.js'
import { api } from '../utils/api.js'

export function createLessonCard(lesson, courseId, index, isCompleted = false) {
  const card = document.createElement('div')
  // FIX: Added dark mode border, background, and hover states
  card.className = 'border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-md p-4 mb-4 hover:border-gold-300 dark:hover:border-gold-500 transition-colors'
  card.setAttribute('data-lesson-id', lesson.id)
  
  card.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <!-- FIX: Slightly adjusted the circle background for dark mode -->
        <div class="w-8 h-8 flex items-center justify-center bg-blue-900 dark:bg-blue-800 text-white rounded-full mr-3">
          ${index + 1}
        </div>
        <div>
          <!-- FIX: Title and duration text colors -->
          <h4 class="font-medium text-neutral-800 dark:text-white">${lesson.title}</h4>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">${lesson.duration}</p>
        </div>
      </div>
      <div class="flex items-center">
        <!-- FIX: Initial status text colors -->
        <span class="text-sm mr-3 ${isCompleted ? 'text-green-500 dark:text-green-400' : 'text-neutral-500 dark:text-neutral-400'}">
          ${isCompleted ? 'Completed' : 'Incomplete'}
        </span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" class="sr-only peer lesson-checkbox" ${isCompleted ? 'checked' : ''}>
          <!-- FIX: Added dark mode classes for the toggle track and borders -->
          <div class="w-11 h-6 bg-neutral-200 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold-300 dark:peer-focus:ring-gold-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 dark:after:border-neutral-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 dark:peer-checked:bg-green-500"></div>
        </label>
      </div>
    </div>
  `
  
  // Add event listener to the checkbox
  const checkbox = card.querySelector('.lesson-checkbox')
  
  checkbox.addEventListener('change', async (e) => {
    e.preventDefault()
    
    const completed = e.target.checked
    const lessonId = parseInt(card.getAttribute('data-lesson-id'))
    const user = getCurrentUser()
    
    // Update lesson completion status
    try {
      const result = await api.updateProgress(user.id, courseId, lessonId, completed)
      
      // Update the status text
      const statusText = card.querySelector('span')
      statusText.textContent = completed ? 'Completed' : 'Incomplete'
      
      // FIX: Ensure dynamic class assignment includes the dark mode variants so the theme doesn't break on click
      statusText.className = `text-sm mr-3 ${completed ? 'text-green-500 dark:text-green-400' : 'text-neutral-500 dark:text-neutral-400'}`
      
      // Update progress bar if it exists
      const progressBar = document.querySelector('.progress-bar-fill')
      if (progressBar) {
        progressBar.style.width = `${result.progress}%`
      }
      
      // Update progress percentage if it exists
      const progressPercentage = document.querySelector('.progress-percentage')
      if (progressPercentage) {
        progressPercentage.textContent = `${result.progress}%`
      }
    } catch (error) {
      console.error('Failed to update progress:', error)
      // Revert the checkbox state
      e.target.checked = !completed
    }
  })
  
  return card
}