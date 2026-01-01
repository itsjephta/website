# Jephta Mutashi - Analytical Chemistry Portfolio

A modern, responsive portfolio website showcasing expertise in analytical chemistry, featuring contact form integration with MongoDB database and email notifications.

## 🚀 Features

- **Responsive Design**: Modern, mobile-first design with smooth animations
- **Portfolio Sections**: 
  - About Me
  - Education Timeline
  - Core Expertise
  - Certifications
  - Lab Experience & Projects
  - Publications
  - Testimonials
  - Contact Form
- **Backend API**: Express.js server with MongoDB integration
- **Contact Management**: Full CRUD API for managing contact submissions
- **Email Notifications**: Automatic email notifications for new contacts

## 📋 Tech Stack

### Frontend
- HTML5
- Tailwind CSS
- Vanilla JavaScript

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Nodemailer (Email service)

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd website1
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/jephta-portfolio
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jephta-portfolio

   # Email Configuration (Optional)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Server Port (Optional, defaults to 5000)
   PORT=5000
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

5. **Open in browser**:
   Visit `http://localhost:5000`

## 📚 Documentation

- **QUICK_START.md** - Quick setup guide
- **SERVER_SETUP.md** - Detailed server configuration
- **MONGODB_SETUP.md** - MongoDB setup instructions
- **README_DATABASE.md** - Database features overview
- **FIXES_APPLIED.md** - List of fixes and improvements

## 🌐 API Endpoints

### Public
- `GET /` - Serves the portfolio website
- `GET /health` - Health check endpoint
- `POST /send-email` - Contact form submission

### Contact Management
- `GET /api/contacts` - Get all contacts (with pagination)
- `GET /api/contacts/:id` - Get single contact
- `PATCH /api/contacts/:id` - Update contact status
- `DELETE /api/contacts/:id` - Delete contact
- `GET /api/contacts/stats` - Get contact statistics

## 🗄️ Database Schema

### Contact Model
```javascript
{
  name: String (required),
  email: String (required),
  message: String (required),
  status: String (enum: 'new', 'read', 'replied', 'archived'),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Development

For development with auto-reload:
```bash
npm run dev
```

## 📝 License

ISC

## 👤 Author

Jephta Mutashi - Analytical Chemistry Major

## 🙏 Acknowledgments

- Tailwind CSS for styling
- Express.js for backend framework
- MongoDB for database
- Nodemailer for email service

