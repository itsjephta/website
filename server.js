require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const connectDB = require('./config/database');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (non-blocking)
connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    // Server will continue to run even if DB connection fails
});

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files (HTML, CSS, JS)
app.use(express.static('.'));

// Health check endpoint
app.get('/health', (req, res) => {
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState;
    const dbStatusText = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    }[dbStatus] || 'unknown';

    res.status(200).json({ 
        success: true, 
        message: 'Server is running correctly',
        timestamp: new Date().toISOString(),
        database: {
            status: dbStatusText,
            connected: dbStatus === 1
        }
    });
});

// Validation Middleware
const validateContactForm = (req, res, next) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    next();
};

// Route - Send Email and Save to Database
app.post('/send-email', validateContactForm, async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Check if MongoDB is connected
        const mongoose = require('mongoose');
        const isDBConnected = mongoose.connection.readyState === 1;
        
        let contactId = null;
        
        // Save to MongoDB if connected
        if (isDBConnected) {
            try {
                const contact = new Contact({
                    name,
                    email,
                    message,
                    status: 'new'
                });
                
                await contact.save();
                contactId = contact._id;
                console.log(`✅ Contact saved to database: ${email}`);
            } catch (dbError) {
                console.error('⚠️  Database save error (continuing with email):', dbError.message);
                // Continue to send email even if DB save fails
            }
        } else {
            console.warn('⚠️  Database not connected - skipping database save');
        }

        // Send email (if email service is configured)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: `"${name}" <${email}>`,
                to: 'jephtamutashi@gmail.com',
                replyTo: email,
                subject: `New Portfolio Message from ${name}`,
                text: `
Name: ${name}
Email: ${email}
            
Message:
${message}
                `,
                html: `
                    <h3>New Portfolio Message</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <br/>
                    <p><strong>Message:</strong></p>
                    <p style="padding: 10px; background-color: #f4f4f4; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</p>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log(`📧 Email sent from ${email}`);
            } catch (emailError) {
                console.error('⚠️  Email sending failed (but saved to DB):', emailError.message);
                // Don't fail the request if email fails, data is already saved
            }
        }

        res.status(200).json({ 
            success: true, 
            message: 'Message sent successfully!',
            contactId: contactId || null,
            savedToDatabase: contactId !== null
        });
    } catch (error) {
        console.error('❌ Error processing contact form:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to process message. Please try again later.' 
        });
    }
});

// Get all contacts (for admin/dashboard)
app.get('/api/contacts', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                success: false, 
                message: 'Database not connected' 
            });
        }

        const { status, limit = 50, page = 1 } = req.query;
        const query = status ? { status } : {};
        
        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .select('-__v');

        const total = await Contact.countDocuments(query);

        res.status(200).json({
            success: true,
            data: contacts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('❌ Error fetching contacts:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch contacts',
            error: error.message
        });
    }
});

// Get single contact by ID
app.get('/api/contacts/:id', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                success: false, 
                message: 'Database not connected' 
            });
        }

        const contact = await Contact.findById(req.params.id).select('-__v');
        
        if (!contact) {
            return res.status(404).json({ 
                success: false, 
                message: 'Contact not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error('❌ Error fetching contact:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid contact ID format' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch contact' 
        });
    }
});

// Update contact status
app.patch('/api/contacts/:id', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                success: false, 
                message: 'Database not connected' 
            });
        }

        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ 
                success: false, 
                message: 'Status is required' 
            });
        }

        if (!['new', 'read', 'replied', 'archived'].includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid status. Must be: new, read, replied, or archived' 
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).select('-__v');

        if (!contact) {
            return res.status(404).json({ 
                success: false, 
                message: 'Contact not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error('❌ Error updating contact:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid contact ID format' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update contact' 
        });
    }
});

// Delete contact
app.delete('/api/contacts/:id', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                success: false, 
                message: 'Database not connected' 
            });
        }

        const contact = await Contact.findByIdAndDelete(req.params.id);
        
        if (!contact) {
            return res.status(404).json({ 
                success: false, 
                message: 'Contact not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting contact:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid contact ID format' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete contact' 
        });
    }
});

// Get contact statistics
app.get('/api/contacts/stats', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                success: false, 
                message: 'Database not connected' 
            });
        }

        const total = await Contact.countDocuments();
        const newCount = await Contact.countDocuments({ status: 'new' });
        const readCount = await Contact.countDocuments({ status: 'read' });
        const repliedCount = await Contact.countDocuments({ status: 'replied' });
        const archivedCount = await Contact.countDocuments({ status: 'archived' });

        res.status(200).json({
            success: true,
            data: {
                total,
                new: newCount,
                read: readCount,
                replied: repliedCount,
                archived: archivedCount
            }
        });
    } catch (error) {
        console.error('❌ Error fetching stats:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch statistics' 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`📧 Email service configured: ${process.env.EMAIL_USER ? 'Yes' : 'No (check .env file)'}`);
    console.log(`🗄️  MongoDB: ${process.env.MONGODB_URI || process.env.MONGO_URI ? 'Configured' : 'Not configured (check .env file)'}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`📄 Website: http://localhost:${PORT}`);
    console.log(`📊 API endpoints:`);
    console.log(`   - GET  /api/contacts - Get all contacts`);
    console.log(`   - GET  /api/contacts/:id - Get single contact`);
    console.log(`   - PATCH /api/contacts/:id - Update contact status`);
    console.log(`   - DELETE /api/contacts/:id - Delete contact`);
    console.log(`   - GET  /api/contacts/stats - Get statistics`);
});
