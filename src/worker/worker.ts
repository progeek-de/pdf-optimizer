import { createErrorAction, createMessageAction, createResultAction, createSatusAction } from "./worker-utils";
import GS from "../vendor/gs";

postMessage(createMessageAction("Background worker initialized"))

function optimizePDF(dataStruct: any) {
    return new Promise((resolve, reject) => {
        // first download the ps data
        var xhr = new XMLHttpRequest();
        xhr.open("GET", dataStruct.psDataURL);
        xhr.responseType = "arraybuffer";
        xhr.onload = function () {
            // release the URL
            URL.revokeObjectURL(dataStruct.psDataURL);
            //set up EMScripten environment
            GS({
                preRun: [function ({ FS }: { FS: any }) {
                    FS.writeFile('input.pdf', new Uint8Array(xhr.response));
                }],
                postRun: [function ({ FS }: { FS: any }) {
                    var uarray = FS.readFile('output.pdf', { encoding: 'binary' }); //Uint8Array
                    var blob = new Blob([uarray], { type: "application/octet-stream" });
                    var pdfDataURL = URL.createObjectURL(blob);

                    resolve({ pdfDataURL: pdfDataURL, url: dataStruct.url });
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
                print: function (text: string) {
                    postMessage(createMessageAction(text))
                },
                printErr: function (text: string) {
                    reject(text)
                },
                setStatus: function (text: string) {
                    postMessage(createSatusAction(text))
                },
                totalDependencies: 0
            });
        };
        xhr.send();
    })

}


onmessage = (event) => {
    // console.log("Worker <-", event.data)

    if (event.data.type === "PROCESS") {
        optimizePDF(event.data.payload).then((res) => {
            postMessage(createResultAction(res))
        }).catch((e) => postMessage(createErrorAction(e)))
    }
}

