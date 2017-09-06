import OcrRouter from './routes/OcrRouter';
import BarcodeRouter from './routes/BarcodeRouter';
import BarcodeAndPinRouter from './routes/BarcodeAndPinRouter';
import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as flash from 'connect-flash';
import DatabaseConfig from './config/config';
import * as AuthenticationController from './routes/Authentication';
const passportService = require('./config/passport');

class App {
  public express: express.Application;
  public database: DatabaseConfig;

  constructor() {
    this.express = express();
    this.database = new DatabaseConfig();
    mongoose.connect(this.database.database);
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(session({ secret: 'secretkey'}));
    this.express.use(passport.initalize());
    this.express.use(passport.session());
    this.express.use(flash());
  }

  private routes(): void {
    let router = express.Router();
    router.get('/', (req, res, next) => { 
      res.json({ 
        message: 'Response from Eventify!' 
      }); 
    }); 
    this.express.use('/', router); 
    this.express.use('/api/barcodes', BarcodeRouter);
    this.express.use('/api/ocr', OcrRouter);
    this.express.use('/api/barcodes-and-pins', BarcodeAndPinRouter);
  }
}

export default new App().express;
