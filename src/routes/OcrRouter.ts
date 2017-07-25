import { Router, Request, Response, NextFunction} from 'express';
var Tesseract = require('tesseract.js');
import { getPins } from '../services/ocrService';
import * as fs from 'fs-extra';

export class OcrRouter {
  router: Router

  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    this.router.get('/', this.getAll);
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    let filenames = fs.readdirSync('./barcodes/')
		let response = await getPins(filenames);
		res.json(response);
  }
}

const ocrRoutes = new OcrRouter();
ocrRoutes.init();

export default ocrRoutes.router;
