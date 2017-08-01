import { scrapePins, scrapeBarcodes } from '../services/websiteScraperService';
import { Router, Request, Response, NextFunction } from 'express';
import { getPins } from '../services/ocrService';

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
    await scrapePins(barcodes);
    await scrapeBarcodes(barcodes);
    await getPins(barcodes);
    res.json("Barcode image parsing complete!");
  }
}

const barcodeAndPinRoutes = new BarcodeAndPinRouter();
barcodeAndPinRoutes.init();

export default barcodeAndPinRoutes.router;
