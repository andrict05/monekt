import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import globalErrorHandler from './controllers/errorController.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRouter.js';
import postRouter from './routes/postRouter.js';
import viewRouter from './routes/viewRouter.js';
import morgan from 'morgan';
import livereload from 'livereload';
import connectLiveReload from 'connect-livereload';
import { watch } from 'fs';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express();

if (process.env.NODE_ENV.trim() === 'development') {
  const extensionsToWatch = ['ejs', 'js', 'css', 'html', 'json'];
  const liveReloadServer = livereload.createServer({
    port: 35729,
    debug: false,
    exts: extensionsToWatch,
  });
  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/');
    }, 10);
  });
  watch(path.join(__dirname), { recursive: true }, (type, file) => {
    if (!extensionsToWatch.includes(file.split('.')[1])) return;
    liveReloadServer.refresh('/');
  });
  app.use(morgan('dev'));
}

app.use(connectLiveReload());
/**************************************************/
// MIDDLEWARES
/**************************************************/
// Define templating engine and template directory.
app.set('views', './views');
app.set('view engine', 'ejs');
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
// Parse body
app.use(express.json({ limit: '10KB' }));
// Parse query parameters
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// Parse cookies
app.use(cookieParser());
// Allow CORS
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost', 'http://127.0.0.1:5500'],
  }),
);

/**************************************************/
// ENDPOINTS
/**************************************************/
app.use('/', viewRouter);

/**************************************************/
// API ENDPOINTS
/**************************************************/
app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/posts`, postRouter);

/**************************************************/
// HANDLING NON-EXISTENT ENDPOINTS
/**************************************************/
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
  next();
});

/**************************************************/
// HANDLING ERRORS
/**************************************************/
app.use(globalErrorHandler);

export default app;
