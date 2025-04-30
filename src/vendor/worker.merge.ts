//@ts-ignore
import GS from "./gs";
import { ACTION_PROCESS, createErrorAction, createMessageAction, createResultAction } from "./worker-utils";

postMessage(createMessageAction("Background worker initialized"))

async function mergePDF(objectUrls: string[]) {
    const files = await Promise.all(
        objectUrls.map(
            url => fetch(url)
                .then(res => res.arrayBuffer())
        )
    )

    const filesWithNames = files.map((f, i) => ({ filename: `input${i}.pdf`, content: f }))

    console.log("mergePDF", files)

    const args = [
        "-sDEVICE=pdfwrite",
        "-dNOPAUSE",
        "-sOUTPUTFILE=combined.pdf",
        "-dBATCH",
        ...(filesWithNames.map(f => f.filename))
    ]

    console.log(args)

    GS({
        preRun: [({ FS }: { FS: any }) => {
            filesWithNames.forEach(({ filename, content }) => {
                FS.writeFile(filename, new Uint8Array(content));
            })
        }],
        postRun: [({ FS }: { FS: any }) => {
            var uarray = FS.readFile('combined.pdf', { encoding: 'binary' })
            var blob = new Blob([uarray], { type: "application/octet-stream" })
            var pdfDataURL = URL.createObjectURL(blob)

            postMessage(createResultAction(pdfDataURL));
        }],
        arguments: args
    })
}

onmessage = (event) => {
    if (event.data.type === ACTION_PROCESS) {
        mergePDF(event.data.payload)
            .catch((e) => postMessage(createErrorAction(e)))
    }
}

