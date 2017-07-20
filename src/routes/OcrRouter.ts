import { Router, Request, Response, NextFunction} from 'express';
var Tesseract = require('tesseract.js');
import * as fs from 'fs';

export class OcrRouter {
  router: Router

  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    this.router.get('/', this.getAll);
  }

  public getAll(req: Request, res: Response, next: NextFunction) {
    let filenames = fs.readdirSync('./barcodes/')
		let response = [];
		filenames.forEach(filename => {
			Tesseract.recognize(`./barcodes/${filename}`)
				.progress(function  (p) { console.log('progress', p)  })
				.catch(err => console.error(err))
				.then(function (result) {
					let trimmed = result.text.trim();
					response.push(trimmed.substring(trimmed.length - 4));
					if (response.length === filenames.length) {
						console.log(response);
						res.json(response);
					}
				});
		});
  }
}

const ocrRoutes = new OcrRouter();
ocrRoutes.init();

export default ocrRoutes.router;
