import OcrRouter from './routes/OcrRouter';
import BarcodeRouter from './routes/BarcodeRouter';
import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

class App {

  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    let router = express.Router();
    
    this.express.use('/api/barcodes', BarcodeRouter);
    this.express.use('/api/ocr', OcrRouter);

  }
}

export default new App().express;