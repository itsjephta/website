# Server Setup Guide

## ✅ Server Status
The server has been configured and tested. It's ready to run!

## 🚀 Quick Start

1. **Install Dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   - Create a `.env` file in the project root
   - Add your configuration:
     ```
     # Email Configuration
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     
     # MongoDB Configuration
     MONGODB_URI=mongodb://localhost:27017/jephta-portfolio
     # OR for MongoDB Atlas (cloud):
     # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jephta-portfolio?retryWrites=true&w=majority
     
     # Server Configuration
     PORT=5000
     ```
   
   **MongoDB Setup Options**:
   - **Local MongoDB**: Install MongoDB locally and use `mongodb://localhost:27017/jephta-portfolio`
   - **MongoDB Atlas** (Recommended): Free cloud database at https://www.mongodb.com/cloud/atlas
     - Create a free account
     - Create a cluster
     - Get your connection string
     - Replace username, password, and cluster name in the connection string
   
   **Gmail Setup**:
   - Enable 2-Factor Authentication
   - Generate an "App Password" (not your regular password)
   - Use the app password in `EMAIL_PASS`

3. **Start the Server**:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## 📋 Server Features

✅ **Static File Serving**: Serves HTML, CSS, and JavaScript files  
✅ **Contact Form API**: `/send-email` endpoint for form submissions  
✅ **MongoDB Database**: Stores all contact form submissions  
✅ **REST API**: Full CRUD operations for contact management  
✅ **Health Check**: `/health` endpoint to verify server status  
✅ **Error Handling**: Comprehensive error handling middleware  
✅ **CORS Enabled**: Allows cross-origin requests  
✅ **Input Validation**: Validates contact form data  

## 🔍 Testing the Server

1. **Health Check**:
   ```bash
   curl http://localhost:5000/health
   ```
   Or visit: http://localhost:5000/health

2. **Test Contact Form**:
   - Open http://localhost:5000 in your browser
   - Fill out the contact form
   - Check server logs for email sending status

## 🌐 Endpoints

### Public Endpoints
- `GET /` - Serves index.html
- `GET /health` - Health check endpoint
- `POST /send-email` - Contact form submission (saves to MongoDB + sends email)

### API Endpoints (Contact Management)
- `GET /api/contacts` - Get all contacts (with pagination)
  - Query params: `?status=new&limit=50&page=1`
- `GET /api/contacts/:id` - Get single contact by ID
- `PATCH /api/contacts/:id` - Update contact status
  - Body: `{ "status": "read" | "replied" | "archived" }`
- `DELETE /api/contacts/:id` - Delete contact
- `GET /api/contacts/stats` - Get contact statistics

## ⚠️ Troubleshooting

**Server won't start:**
- Check if port 5000 is already in use
- Verify Node.js is installed: `node --version`
- Ensure dependencies are installed: `npm install`

**Email not sending:**
- Verify `.env` file exists and has correct credentials
- Check Gmail app password is correct
- Review server logs for error messages

**Contact form not working:**
- Check browser console for errors
- Verify server is running
- Check API URL in `script.js` matches server URL

**MongoDB connection issues:**
- Verify MongoDB is running (if using local MongoDB)
- Check connection string in `.env` file
- For MongoDB Atlas, ensure IP whitelist includes your IP (or 0.0.0.0/0 for all)
- Verify database user credentials are correct

## 📝 Notes

- The server runs on port 5000 by default
- For production, consider using environment variables for sensitive data
- The contact form currently uses the deployed backend URL: `https://jephta-backend.onrender.com/send-email`
- For local development, update `script.js` to use `http://localhost:5000/send-email`

