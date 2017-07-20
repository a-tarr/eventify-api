// figure this out later

// var Tesseract = require('tesseract.js');

// export async function ocrPins(filenames: Array<string>): Promise<Array<string>> {
//     let response = new Array<string>();
//     return new Promise<Array<string>>(
//       resolve => {
//         for (let file of filenames) {
//           Tesseract.recognize(`./barcodes/${file}`)
//                     .progress(function  (p) { console.log('progress', p)  })
//                     .catch(err => console.error(err))
//                     .then(function (result) {
//                       let trimmed = result.text.trim();
//                       response.push(trimmed.substring(trimmed.length - 4));
//                       if (response.length === filenames.length) {
//                         resolve(response);
//                       }
//                     });
//       }
//     });
// }  