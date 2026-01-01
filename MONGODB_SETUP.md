# MongoDB Setup Guide

## 🗄️ Database Configuration

Your website now uses MongoDB to store contact form submissions and other data.

## 📦 What's Included

- **Contact Model**: Stores all contact form submissions with status tracking
- **Database Connection**: Automatic connection handling with error recovery
- **REST API**: Full CRUD operations for managing contacts

## 🚀 Quick Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Create Free Account**:
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free (M0 tier is free forever)

2. **Create Cluster**:
   - Click "Build a Database"
   - Choose FREE (M0) tier
   - Select a cloud provider and region
   - Click "Create"

3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IPs
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `jephta-portfolio`)

6. **Add to .env**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jephta-portfolio?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB

1. **Install MongoDB**:
   - Windows: Download from https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: Follow official installation guide

2. **Start MongoDB**:
   - Windows: MongoDB should start as a service automatically
   - Mac/Linux: `mongod --dbpath ~/data/db`

3. **Add to .env**:
   ```
   MONGODB_URI=mongodb://localhost:27017/jephta-portfolio
   ```

## 📊 Database Schema

### Contact Collection

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

## 🔍 Testing the Database

1. **Start the server**:
   ```bash
   npm start
   ```

2. **Check connection**:
   - Look for: `✅ MongoDB Connected: ...` in console
   - If you see errors, check your connection string

3. **Test contact submission**:
   - Submit the contact form on your website
   - Check server logs for: `✅ Contact saved to database`

4. **View data** (using MongoDB Compass or Atlas UI):
   - Install MongoDB Compass: https://www.mongodb.com/products/compass
   - Connect using your connection string
   - Navigate to `jephta-portfolio` database → `contacts` collection

## 📡 API Usage Examples

### Get All Contacts
```bash
curl http://localhost:5000/api/contacts
```

### Get Contacts by Status
```bash
curl http://localhost:5000/api/contacts?status=new&limit=10
```

### Get Statistics
```bash
curl http://localhost:5000/api/contacts/stats
```

### Update Contact Status
```bash
curl -X PATCH http://localhost:5000/api/contacts/ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"status":"read"}'
```

### Delete Contact
```bash
curl -X DELETE http://localhost:5000/api/contacts/ID_HERE
```

## 🛠️ Database Management Tools

- **MongoDB Compass**: Desktop GUI for managing MongoDB
- **MongoDB Atlas UI**: Web-based interface (for Atlas)
- **MongoDB Shell (mongosh)**: Command-line interface

## ⚠️ Troubleshooting

**Connection refused:**
- Verify MongoDB is running (local) or cluster is active (Atlas)
- Check connection string format
- Verify network access/IP whitelist (Atlas)

**Authentication failed:**
- Verify username and password in connection string
- Check database user has correct permissions

**Database not found:**
- MongoDB creates databases automatically on first write
- No need to create database manually

## 🔒 Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use strong passwords** for database users
3. **Restrict IP access** in production (Atlas)
4. **Use environment variables** for all sensitive data
5. **Enable MongoDB authentication** even for local development

