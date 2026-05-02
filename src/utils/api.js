// Mock Database
const coursesDB = [
  {
    id: 1,
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites from scratch. Perfect for absolute beginners.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    instructor: 'Jane Smith',
    duration: '8 weeks',
    level: 'Beginner',
    rating: 4.7,
    enrolledCount: 1243,
    price: 49.99,
    lessons: [
      { id: 1, title: 'HTML Fundamentals', duration: '45 mins' },
      { id: 2, title: 'CSS Styling', duration: '60 mins' },
      { id: 3, title: 'JavaScript Basics', duration: '90 mins' },
      { id: 4, title: 'Building a Simple Website', duration: '120 mins' }
    ]
  },
  {
    id: 2,
    title: 'Advanced JavaScript Patterns',
    description: 'Master advanced JavaScript concepts including closures, prototypes, async programming, and design patterns.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    instructor: 'Michael Johnson',
    duration: '6 weeks',
    level: 'Advanced',
    rating: 4.9,
    enrolledCount: 856,
    price: 79.99,
    lessons: [
      { id: 1, title: 'Closures & Scope', duration: '50 mins' },
      { id: 2, title: 'Prototypal Inheritance', duration: '65 mins' },
      { id: 3, title: 'Asynchronous JavaScript', duration: '80 mins' },
      { id: 4, title: 'Modern ES6+ Features', duration: '55 mins' }
    ]
  },
  {
    id: 3,
    title: 'Data Science Fundamentals',
    description: 'Introduction to data analysis, visualization, and machine learning concepts using Python and Pandas.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    instructor: 'Sarah Williams',
    duration: '10 weeks',
    level: 'Intermediate',
    rating: 4.6,
    enrolledCount: 1876,
    price: 99.99,
    lessons: [
      { id: 1, title: 'Intro to Python for Data', duration: '60 mins' },
      { id: 2, title: 'Data Manipulation with Pandas', duration: '90 mins' },
      { id: 3, title: 'Data Visualization', duration: '75 mins' },
      { id: 4, title: 'Basic Machine Learning', duration: '120 mins' }
    ]
  },
  {
    id: 4,
    title: 'UI/UX Design Masterclass',
    description: 'Learn how to design beautiful, intuitive, and accessible user interfaces using Figma and design thinking principles.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
    instructor: 'Alex Rivera',
    duration: '6 weeks',
    level: 'Beginner',
    rating: 4.8,
    enrolledCount: 2104,
    price: 59.99,
    lessons: [
      { id: 1, title: 'Design Thinking 101', duration: '40 mins' },
      { id: 2, title: 'Wireframing in Figma', duration: '80 mins' },
      { id: 3, title: 'Color Theory & Typography', duration: '60 mins' },
      { id: 4, title: 'Prototyping & Handoff', duration: '90 mins' }
    ]
  },
  {
    id: 5,
    title: 'Full-Stack React & Node.js',
    description: 'Build complete web applications by connecting a dynamic React frontend to a robust Node.js and Express backend.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    instructor: 'David Chen',
    duration: '12 weeks',
    level: 'Intermediate',
    rating: 4.9,
    enrolledCount: 3420,
    price: 129.99,
    lessons: [
      { id: 1, title: 'React Hooks Deep Dive', duration: '70 mins' },
      { id: 2, title: 'State Management', duration: '85 mins' },
      { id: 3, title: 'Building REST APIs with Node', duration: '110 mins' },
      { id: 4, title: 'Database Integration', duration: '130 mins' }
    ]
  },
  {
    id: 6,
    title: 'Mobile App Dev with React Native',
    description: 'Deploy native iOS and Android applications using a single codebase with React Native and Expo.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    instructor: 'Emily Taylor',
    duration: '8 weeks',
    level: 'Intermediate',
    rating: 4.5,
    enrolledCount: 945,
    price: 89.99,
    lessons: [
      { id: 1, title: 'React Native Basics', duration: '50 mins' },
      { id: 2, title: 'Navigation & Routing', duration: '65 mins' },
      { id: 3, title: 'Device APIs (Camera, Location)', duration: '90 mins' },
      { id: 4, title: 'App Store Deployment', duration: '100 mins' }
    ]
  }
]

// Mock User Enrollments State (in-memory persistence)
let userEnrollments = JSON.parse(localStorage.getItem('openCourseEnrollments')) || [
  {
    userId: 'student@example.com',
    course: coursesDB[0],
    progress: 25,
    completedLessons: [1]
  }
]

// Helper to simulate network delay so skeleton loaders appear
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// API Object Export
export const api = {
  // Get all courses
  getCourses: async () => {
    await delay(800) // Simulate network request
    return coursesDB
  },
  
  // Get a single course by ID
  getCourse: async (id) => {
    await delay(600)
    const course = coursesDB.find(c => c.id === parseInt(id))
    if (!course) throw new Error('Course not found')
    return course
  },

  // Get enrollments for a specific user
  getEnrollments: async (userId) => {
    await delay(500)
    return userEnrollments.filter(e => e.userId === userId)
  },

  // Enroll a user in a course
  enrollInCourse: async (userId, courseId) => {
    await delay(1000)
    const course = coursesDB.find(c => c.id === parseInt(courseId))
    if (!course) throw new Error('Course not found')
    
    // Check if already enrolled
    const existing = userEnrollments.find(e => e.userId === userId && e.course.id === parseInt(courseId))
    if (existing) return existing

    const newEnrollment = {
      userId,
      course,
      progress: 0,
      completedLessons: []
    }
    
    userEnrollments.push(newEnrollment)
    localStorage.setItem('openCourseEnrollments', JSON.stringify(userEnrollments))
    return newEnrollment
  },

  // Update progress for a specific lesson
  updateProgress: async (userId, courseId, lessonId, isCompleted) => {
    await delay(400)
    const enrollmentIndex = userEnrollments.findIndex(e => e.userId === userId && e.course.id === parseInt(courseId))
    
    if (enrollmentIndex === -1) throw new Error('Enrollment not found')
    
    let enrollment = userEnrollments[enrollmentIndex]
    
    if (isCompleted) {
      if (!enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId)
      }
    } else {
      enrollment.completedLessons = enrollment.completedLessons.filter(id => id !== lessonId)
    }
    
    // Calculate new progress percentage
    const totalLessons = enrollment.course.lessons.length
    const completedCount = enrollment.completedLessons.length
    enrollment.progress = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100)
    
    // Save to local storage
    localStorage.setItem('openCourseEnrollments', JSON.stringify(userEnrollments))
    
    return enrollment
  }
}