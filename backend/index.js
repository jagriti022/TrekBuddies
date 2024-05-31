//beckend//
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const userRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');
const groupRoutes = require('./routes/group');
const profileRoutes = require('./routes/profile');
const bodyParser = require('body-parser');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const mongoURI = 'mongodb+srv://JagritiChandra:FecsQtjRMrwx2hLt@cluster0.914pazo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});
// Use routes
app.use('/api/users', userRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/profile', profileRoutes);

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('createGroup', async (groupData) => {
        try {
            const createdGroup = await Group.create(groupData);
            console.log('Group created:', createdGroup);
            socket.emit('groupCreated', createdGroup);
        } catch (err) {
            console.error('Error creating group:', err);
            socket.emit('error', { message: 'Failed to create group.' });
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});