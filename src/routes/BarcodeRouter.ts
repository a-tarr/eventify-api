import { scrapePins, scrapeBarcodes } from '../services/websiteScraperService';
import { Router, Request, Response, NextFunction} from 'express';

export class BarcodeRouter {
  router: Router

  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    this.router.post('/codes', this.scrapeBarcodes);
    this.router.post('/pins', this.parseAllPins);
  }

  public async scrapeBarcodes(req: Request, res: Response) {
    let result = await scrapeBarcodes(req.body.barcodes);
    res.json(result);
  }

  public async parseAllPins(req: Request, res: Response, next: NextFunction) {
    let barcodes = req.body.barcodes;
    await scrapePins(barcodes);
    res.json("Barcode image parsing complete!");
  }
}

const barcodeRoutes = new BarcodeRouter();
barcodeRoutes.init();

export default barcodeRoutes.router;
