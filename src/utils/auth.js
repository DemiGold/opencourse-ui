// Simulated authentication for frontend only
// In a real app, this would interact with a backend API

const TOKEN_KEY = 'amgold_auth_token'
const USER_KEY = 'amgold_user'

// Simulated user data - in a real app, this would come from an API
const DEMO_USERS = [
  {
    id: 1,
    email: 'student@example.com',
    password: 'password123',
    name: 'Demo Student',
    role: 'student'
  },
  {
    id: 2,
    email: 'instructor@example.com',
    password: 'password123',
    name: 'Demo Instructor',
    role: 'instructor'
  },
  {
    id: 3,
    email: 'admin@example.com',
    password: 'password123',
    name: 'Demo Admin',
    role: 'admin'
  }
]

export function login(email, password) {
  return new Promise((resolve, reject) => {
    // Simulate API request delay
    setTimeout(() => {
      const user = DEMO_USERS.find(
        (u) => u.email === email && u.password === password
      )
      
      if (user) {
        // Create a simple token (in a real app, this would be a JWT from the server)
        const token = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 3600000 }))
        
        // Store token and user info
        localStorage.setItem(TOKEN_KEY, token)
        
        // Store user data without password
        const { password: _, ...userWithoutPassword } = user
        localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword))
        
        resolve(userWithoutPassword)
      } else {
        reject(new Error('Invalid email or password'))
      }
    }, 500) // Simulate network delay
  })
}

export function register(name, email, password, role = 'student') {
  return new Promise((resolve, reject) => {
    // Simulate API request delay
    setTimeout(() => {
      // Check if user already exists
      const existingUser = DEMO_USERS.find((u) => u.email === email)
      
      if (existingUser) {
        reject(new Error('User with this email already exists'))
        return
      }
      
      // Create new user (in a real app, this would be done on the server)
      const newUser = {
        id: DEMO_USERS.length + 1,
        name,
        email,
        password,
        role
      }
      
      // Add to demo users (this is just for demo, not for a real app)
      DEMO_USERS.push(newUser)
      
      // Login the user after registration
      login(email, password)
        .then(resolve)
        .catch(reject)
    }, 500) // Simulate network delay
  })
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  window.location.href = '/'
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function isAuthenticated() {
  const token = getAuthToken()
  
  if (!token) return false
  
  try {
    // Decode token to check expiration
    const decoded = JSON.parse(atob(token))
    
    // Check if token is expired
    if (decoded.exp < Date.now()) {
      // Token expired, clear it
      logout()
      return false
    }
    
    return true
  } catch (e) {
    // Invalid token format
    logout()
    return false
  }
}

export function getCurrentUser() {
  const userJson = localStorage.getItem(USER_KEY)
  return userJson ? JSON.parse(userJson) : null
}

export function hasRole(role) {
  const user = getCurrentUser()
  return user && user.role === role
}