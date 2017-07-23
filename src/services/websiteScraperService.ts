import { TIMEOUT } from 'dns';
import * as scrape from 'website-scraper';
import * as rimraf from 'rimraf';
import * as fs from 'fs';
import * as Jimp from 'jimp';
import * as osmosis from 'osmosis';

export function scrapePins(sites): Promise<void> {
	rimraf.sync('./barcodes/');
	return new Promise<void>(resolve => {
		scrape({
			urls: sites,
			directory: './barcodes/',
			sources: [
				{selector: 'img', attr: 'src'}
			]
		}).then(() => {
			console.log('Scraping finished, deleting un-needed');
			rimraf.sync('./barcodes/images');
			rimraf.sync('./barcodes/*.html');

			let fileNames = fs.readdirSync('./barcodes/');

			for (var index in fileNames) {
				fs.renameSync(`./barcodes/${fileNames[index]}`, `./barcodes/barcode${index}.gif`);
			}

			console.log('Rename finished');

			let totalImagesParsed = 0;
			for (let i = 0; i < fileNames.length; i++) {
				Jimp.read(`./barcodes/barcode${i}.gif`, function (err, img) {
					img.rotate(90)
						.scale(3)
						.write(`./barcodes/barcode${i}.png`);
					console.log(`rotated ${i}, deleting related gif`);
					fs.unlinkSync(`./barcodes/barcode${i}.gif`)
					totalImagesParsed++;
					if (totalImagesParsed === fileNames.length) {
						resolve();
					}
				});
			}
		})
	})
}

export function scrapeBarcodes(sites): Promise<Array<string>> {
	let result = [];
	osmosis.config('concurrency', 1);
	return new Promise<Array<string>>(async resolve => {
		for(let i = 0; i < sites.length; i++) {
			result.push(await scrapeWebsite(sites[i]).then(result => {return result}));
			if (result.length === sites.length) {
				resolve(result);
			}
		}
	})
}

function scrapeWebsite(site): Promise<string> {
	return new Promise<string>(resolve => {
		osmosis
					.get(site)
					.find('div > span')
					.set('barcode')
					.data(function(data) {
						resolve(data.barcode);
					})
					.log(console.log)
					.error(console.log)
					.debug(console.log);
	})
}





