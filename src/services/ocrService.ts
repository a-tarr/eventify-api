var Tesseract = require('tesseract.js');

export function getPins(filenames: Array<string>): Promise<Array<string>> {
  let result = [];
  return new Promise<Array<string>>(async resolve => {
    let actions = filenames.map(ocrPin);
    Promise.all(actions).then(data => {
      resolve(data);
    });
  });
}

function ocrPin(filename: string): Promise<string> {
  return new Promise<string>(resolve => {
    Tesseract.recognize(`./barcodes/${filename}`)
             .progress(function  (p) { console.log('progress', p)  })
             .catch(err => console.error(err))
             .then(function (result) {
                let trimmed = result.text.trim();
                let substring = trimmed.substring(trimmed.length - 4);
                console.log(substring);
                resolve(substring);
             });
  })
}  