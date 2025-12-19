# Student Attendance System

A modern, responsive student attendance management system with separate portals for administrators and students.

## 🚀 Features

### Admin Portal
- **Student Management**: Add, edit, and delete student records
- **Real-time Statistics**: View total students, average GPA, high achievers, and unique courses
- **Search & Filter**: Quickly find students by name, email, or course
- **GPA Calculation**: Automatic GPA and grade calculation from marks
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Student Portal
- **Attendance Overview**: View attendance records and statistics
- **Performance Tracking**: Monitor GPA and academic progress
- **Upcoming Classes**: See scheduled classes and assignments
- **Personal Dashboard**: Personalized view of academic information

## 📁 Project Structure

```
attendance/
├── index.html                      # Main landing page with role selection
├── student-management.html         # Admin dashboard (protected)
├── pages/
│   ├── admin-login.html           # Admin login page
│   ├── student-login.html         # Student login page
│   └── student-dashboard.html     # Student dashboard (protected)
└── README.md                      # This file
```

## 🔐 Authentication

The system uses session-based authentication with the following demo credentials:

### Admin Login
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Full student management dashboard

### Student Login
- **Student ID**: `student123`
- **Password**: `student123`
- **Access**: Personal dashboard with attendance and performance data

## 🎨 Design Features

- **Modern UI**: Clean, professional interface with smooth animations
- **Dark Theme**: Eye-friendly dark color scheme
- **Gradient Accents**: Beautiful gradient effects and glassmorphism
- **Micro-interactions**: Hover effects and transitions for better UX
- **Responsive Layout**: Adapts to all screen sizes
- **Google Fonts**: Uses Inter font family for modern typography

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript**: Vanilla JS for interactivity and authentication
- **Session Storage**: Client-side session management
- **Local Storage**: Remember me functionality

## 📖 How to Use

### Getting Started

1. **Open the Application**
   - Open `index.html` in your web browser
   - You'll see the landing page with two login options

2. **Admin Access**
   - Click on "Admin Portal"
   - Login with admin credentials
   - Manage students, view statistics, and generate reports

3. **Student Access**
   - Click on "Student Portal"
   - Login with student credentials
   - View attendance, grades, and upcoming classes

### Admin Dashboard Features

1. **Add Students**
   - Fill in the form with student details
   - Marks are automatically converted to GPA and grades
   - Click "Add Student" to save

2. **Edit Students**
   - Click the edit button on any student card
   - Modify the details in the form
   - Click "Update Student" to save changes

3. **Delete Students**
   - Click the delete button on any student card
   - Confirm the deletion

4. **Search Students**
   - Use the search bar to filter by name, email, or course
   - Results update in real-time

### Student Dashboard Features

1. **View Attendance**
   - See recent attendance records
   - Check attendance percentage
   - View present/absent status

2. **Track Performance**
   - Monitor current GPA
   - View classes attended
   - Check pending assignments

3. **Upcoming Events**
   - See scheduled classes
   - View assignment deadlines
   - Check exam dates

## 🔒 Security Features

- **Protected Routes**: Dashboards require authentication
- **Session Management**: Automatic logout on session expiry
- **Role-Based Access**: Separate admin and student portals
- **Remember Me**: Optional persistent login

## 🎯 Future Enhancements

- [ ] Backend integration with database
- [ ] Real-time face recognition attendance
- [ ] Email notifications
- [ ] Export reports to Excel/PDF
- [ ] Multi-language support
- [ ] Advanced analytics and charts
- [ ] Mobile app version
- [ ] Bulk student import
- [ ] Attendance calendar view
- [ ] Parent portal

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## 💡 Tips

- Use the demo credentials provided on login pages
- Click on the demo credentials box to auto-fill the form
- The "Remember me" checkbox saves your username
- All data is stored in-memory and will reset on page refresh
- For production use, integrate with a backend database

## 📝 Notes

- This is a frontend-only implementation
- Data is stored in browser memory (not persistent)
- For production, implement proper backend authentication
- Consider adding HTTPS for secure communication
- Implement proper password hashing for security

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📄 License

This project is open source and available for educational purposes.

---

**Developed with ❤️ for efficient student management**
