import { scrapePins, scrapeBarcodes } from '../services/websiteScraperService';
import { Router, Request, Response, NextFunction } from 'express';
import { getPins } from '../services/ocrService';
const fs = require("fs-extra");

export class BarcodeAndPinRouter {
  router: Router

  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    this.router.post('/', this.getBarcodesAndPins);
  }

  public async getBarcodesAndPins(req: Request, res: Response) {
    let barcodes: Array<string> = req.body.barcodes;
    const randomHash: string = `./barcodes/${Math.random().toString(36).substring(8)}`;
    Promise.all([scrapePins(barcodes, randomHash), scrapeBarcodes(barcodes, randomHash)]).then(async data => {
      let filenames = [];
      for(let i in barcodes) {
        filenames.push(`barcode${i}.png`)
      };         
      let pins = await getPins(filenames, randomHash);
      let codes = data[1];
      let objList = [];
      for (let i = 0; i < barcodes.length; i++) {
        let obj = {};
        obj['barcode'] = codes[i];
        obj['pin'] = pins[i];
        objList.push(obj);
      }
      res.json(objList);
    });
  }
}

const barcodeAndPinRoutes = new BarcodeAndPinRouter();
barcodeAndPinRoutes.init();

export default barcodeAndPinRoutes.router;
