export function createPaymentModal(course, onSuccess, onClose) {
  const modal = document.createElement('div')
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 transition-colors duration-200'
  
  modal.innerHTML = `
    <div class="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-transparent dark:border-neutral-700">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-blue-900 dark:text-blue-400">Complete Your Enrollment</h3>
        <button class="close-modal text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="mb-6">
        <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 mb-4 border border-transparent dark:border-neutral-600">
          <h4 class="font-medium text-neutral-800 dark:text-neutral-200 mb-2">${course.title}</h4>
          <div class="flex justify-between items-center">
            <span class="text-neutral-600 dark:text-neutral-400">Course Price</span>
            <span class="text-xl font-bold text-blue-900 dark:text-blue-400">$${course.price}</span>
          </div>
        </div>
        
        <div class="space-y-4">
          <div class="form-group">
            <label for="card-number" class="form-label dark:text-neutral-300">Card Number</label>
            <input type="text" id="card-number" class="form-input dark:bg-neutral-800 dark:border-neutral-600 dark:text-white" placeholder="1234 5678 9012 3456" maxlength="19">
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label for="expiry" class="form-label dark:text-neutral-300">Expiry Date</label>
              <input type="text" id="expiry" class="form-input dark:bg-neutral-800 dark:border-neutral-600 dark:text-white" placeholder="MM/YY" maxlength="5">
            </div>
            <div class="form-group">
              <label for="cvc" class="form-label dark:text-neutral-300">CVC</label>
              <input type="text" id="cvc" class="form-input dark:bg-neutral-800 dark:border-neutral-600 dark:text-white" placeholder="123" maxlength="3">
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-4">
        <button class="cancel-payment btn btn-secondary dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600 dark:border-neutral-600">Cancel</button>
        <button class="confirm-payment btn btn-primary">
          Pay $${course.price}
        </button>
      </div>
    </div>
  `
  
  // Add event listeners
  const closeBtn = modal.querySelector('.close-modal')
  const cancelBtn = modal.querySelector('.cancel-payment')
  const confirmBtn = modal.querySelector('.confirm-payment')
  const cardNumberInput = modal.querySelector('#card-number')
  const expiryInput = modal.querySelector('#expiry')
  const cvcInput = modal.querySelector('#cvc')
  
  // Format card number input
  cardNumberInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '')
    value = value.replace(/(\d{4})/g, '$1 ').trim()
    e.target.value = value
  })
  
  // Format expiry date input
  expiryInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2)
    }
    e.target.value = value
  })
  
  // Only allow numbers in CVC
  cvcInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '')
  })
  
  // Close modal handlers
  const closeModal = () => {
    modal.remove()
    onClose?.()
  }
  
  closeBtn.addEventListener('click', closeModal)
  cancelBtn.addEventListener('click', closeModal)
  
  // Handle payment submission
  confirmBtn.addEventListener('click', async () => {
    confirmBtn.disabled = true
    confirmBtn.innerHTML = `
      <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    `
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // For demo purposes, always succeed
    onSuccess?.()
    closeModal()
  })
  
  document.body.appendChild(modal)
  
  // Focus card number input
  cardNumberInput.focus()
  
  return modal
}