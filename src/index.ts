import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import userRoute from './routes/user.route';
import articleRoute from './routes/article.route';
import commentRoute from './routes/comment.route';

const app = express();
const PORT = process.env.PORT;

// Allows the data from the client
app.use(express.json());

app.use('/api/users', userRoute);
app.use('/api/articles', articleRoute);
app.use('/api/comment', commentRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
