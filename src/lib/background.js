import GS from "./gs.js"

function getHeaderFromHeaders(headers, headerName) {
    for (var i = 0; i < headers.length; ++i) {
        var header = headers[i];
        if (header.name.toLowerCase() === headerName) {
            return header;
        }
    }
}


export function optimizePDF(dataStruct, responseCallback) {
    // first download the ps data
    var xhr = new XMLHttpRequest();
    xhr.open("GET", dataStruct.psDataURL);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
        // release the URL
        window.URL.revokeObjectURL(dataStruct.psDataURL);
        //set up EMScripten environment
        GS({
            preRun: [function ({FS}) {
                var data = FS.writeFile('input.pdf', new Uint8Array(xhr.response));
            }],
            postRun: [function ({FS}) {
                var uarray = FS.readFile('output.pdf', {encoding: 'binary'}); //Uint8Array
                var blob = new Blob([uarray], {type: "application/octet-stream"});
                var pdfDataURL = window.URL.createObjectURL(blob);
                responseCallback({pdfDataURL: pdfDataURL, url: dataStruct.url});
            }],
            arguments: [
                '-sDEVICE=pdfwrite',
                '-dCompatibilityLevel=1.4',
                // '-dPDFACompatibilityPolicy=1',
                // '-sProcessColorModel=DeviceRGB',
                // '-dPDFA=1',
                '-dPDFSETTINGS=/ebook',
                '-DNOPAUSE', '-dBATCH', '-dQUIET', '-dNOOUTERSAVE',
                '-sOutputFile=output.pdf', 'input.pdf'],
            print: function (text) {
                console.log("-> ", text);
            },
            printErr: function (text) {
                console.error(text);
            },
            setStatus: function (text) {
                console.log("Status", text)
            },
            totalDependencies: 0
        });
    };
    xhr.send();
}
