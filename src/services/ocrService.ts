var Tesseract = require('tesseract.js');

export function getPins(filenames: Array<string>, hash = 'barcodes'): Promise<Array<string>> {
  let result = [];
  return new Promise<Array<string>>(resolve => {
    let actions = filenames.map(file => {
      return ocrPin(file, hash);
    });
    Promise.all(actions).then(data => {
      resolve(data);
    });
  });
}

function ocrPin(filename: string, hash: string): Promise<string> {
  return new Promise<string>(resolve => {
    Tesseract.recognize(`${hash}/${filename}`)
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