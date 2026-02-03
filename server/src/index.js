import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5555;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Steer-U-Full Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
