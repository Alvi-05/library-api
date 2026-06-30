import { app } from './app.ts';
import { AppDataSource } from './data-source.ts';
import type {Request, Response} from 'express';
import  { Logger } from './utils/Logger.ts';

// Display on the entry page
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Library Management API! Use /books to see the data.');
});

const PORT = 3000;

// Initialize the server
AppDataSource.initialize()
  .then(async () => {
    Logger.info("Database connected.");
    
    // RUN MIGRATIONS AUTOMATICALLY ON STARTUP
    await AppDataSource.runMigrations();
    Logger.info("Migrations executed successfully.");

    app.listen(PORT, () => {
      Logger.info(`Server running on http://localhost:${PORT}`);
      Logger.info(`Swagger Docs available at http://localhost:${PORT}/docs`);
    });
  })
  .catch((err) => Logger.error('Database connection failed:', err));

