import { TIMEOUT } from 'dns';
import * as scrape from 'website-scraper';
import * as rimraf from 'rimraf';
import * as fs from 'fs-extra';
import * as Jimp from 'jimp';
import * as osmosis from 'osmosis';

// Gets the barcode number
export function scrapeBarcodes(sites): Promise<Array<string>> {
	let result = [];
	return new Promise<Array<string>>(async resolve => {
		let actions = sites.map(scrapeWebsite);
		Promise.all<any, Array<string>>(actions).then(data => {
			resolve(data);
		})
	});
}

// Grabs the image from the website and processes it into PNG.
// This is necessary as we can't directly grab the image
export function scrapePins(sites: Array<string>): Promise<void> {
	rimraf.sync('./barcodes/');
	return new Promise<void>(async resolve => {
		let j = -1;
		let actions = sites.map((site) => {
			j++;
			return scrapeFullWebsite(site, j);
		});

		Promise.all(actions).then(() => {
			for (let i in sites) {
				fs.copySync(`./barcodes/${i}`, './barcodes', { overwrite: true });
				rimraf.sync(`./barcodes/${i}`);
			}

			rimraf.sync('./barcodes/images');
			rimraf.sync('./barcodes/*.html');

			let filenames = fs.readdirSync('./barcodes/');
			filenames.sort(function (a, b) {
				return fs.statSync('./barcodes/' + a).mtime.getTime() -
					fs.statSync('./barcodes/' + b).mtime.getTime();
			});

			for (let index in filenames) {
				fs.renameSync(`./barcodes/${filenames[index]}`, `./barcodes/barcode${index}.gif`);
			}

			let totalImagesParsed = 0;
			for (let i = 0; i < filenames.length; i++) {
				Jimp.read(`./barcodes/barcode${i}.gif`, function (err, img) {
					img.rotate(90)
						.scale(3)
						.write(`./barcodes/barcode${i}.png`);
					console.log(`rotated ${i}, deleting related gif`);
					fs.unlinkSync(`./barcodes/barcode${i}.gif`)
					totalImagesParsed++;
					if (totalImagesParsed === filenames.length) {
						resolve();
					}
				});
			}
		})
		});	
}

function scrapeFullWebsite(site, iteration): Promise<void> {
	return new Promise<void>(resolve => {
		scrape({
			urls: site,
			directory: `./barcodes/${iteration}`,
			sources: [
				{selector: 'img', attr: 'src'}
			]
		}, (error, result) => {
			resolve();
		});
	});
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





