// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
//
//@ts-ignore
import { createInitAction, createProcessAction } from "../vendor/worker-utils";
//@ts-ignore
import BackgroundWorker from "../vendor/worker?worker"

Object.defineProperty(Number.prototype, 'fileSize', {
  value: function (a, b, c, d) {
    return (a = a ? [1e3, 'k', 'B'] : [1024, 'K', 'iB'], b = Math, c = b.log,
      d = c(this) / c(a[0]) | 0, this / b.pow(a[0], d)).toFixed(2)
      + ' ' + (d ? (a[1] + 'MGTPEZY')[--d] + a[2] : 'Bytes');
  }, writable: false, enumerable: false
});

function loadPDFData(response: any) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", response.pdfDataURL);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
      window.URL.revokeObjectURL(response.pdfDataURL);
      const blob = new Blob([xhr.response], { type: "application/pdf" });
      const pdfURL = window.URL.createObjectURL(blob);
      resolve({ pdfURL, size: blob.size })
    };
    xhr.send();
  })

}

function getFileSizeColor(size: number) {
  if (size === 0) {
    return "white"
  }

  if (size > 5 * 1024 * 1024) {
    return "red"
  } else if (size > 2 * 1024 * 1024) {
    return "orange"
  }

  return "green"
}

const SizeComponent = ({ source, target }: { source: number, target: number }) => {
  if (source == 0) {
    return <div />
  }

  return (
    <Box sx={{ mb: 1 }}>
      <Typography component="span" sx={{
        fontSize: "200%",
        color: getFileSizeColor(source)
      }}>{source > 0 ? source.fileSize() : "?"}</Typography>
      <ArrowForwardIosIcon sx={{ fontSize: "140%", mx: 2 }} />
      <Typography component="span" sx={{
        fontSize: "200%",
        color: getFileSizeColor(target)
      }}>{target > 0 ? target.fileSize() : "?"}</Typography>
    </Box>
  )
}

function App() {
  const [state, setState] = useState("init")
  const [file, setFile] = useState(undefined)
  const [downloadLink, setDownloadLink] = useState(undefined)
  const [sourceSize, setSourceSize] = useState(0)
  const [targetSize, setTargetSize] = useState(0)
  const [status, setStatus] = useState("Wird geladen ...")
  const workerRef = useRef<Worker>(null)

  useEffect(() => {
    workerRef.current = new BackgroundWorker()
    workerRef.current?.addEventListener("message", (msg) => {
      // console.log("Worker ->", msg.data)

      if (msg.data.type === "RESULT") {
        setState("toBeDownloaded")
        loadPDFData(msg.data.payload).then(({ pdfURL, size }) => {
          setTargetSize(size)
          setDownloadLink(pdfURL)
        });
      }
    })

    workerRef.current?.postMessage(createInitAction())

  }, [])

  const compressPDF = useCallback((pdf: string, filename: string) => {
    const dataObject = { psDataURL: pdf }
    workerRef.current?.postMessage(createProcessAction(dataObject))
  }, [])

  const changeHandler = (event) => {
    const file: any = event.target.files[0]
    const url = window.URL.createObjectURL(file);
    setFile({ filename: file.name, url })
    setSourceSize(file.size)
    setState('selected')
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const { filename, url } = file;
    compressPDF(url, filename)
    setState("loading")
    return false;
  }

  let minFileName = file && file.filename && file.filename.replace('.pdf', '-min.pdf');
  return (
    <>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h4">Schnelle PDF-Größenreduzierung</Typography>
        <Typography>
          Unser Webservice ermöglicht es Ihnen, die <Typography component="span"
            sx={{ color: "#8CB8C9 " }}>Größe</Typography> Ihrer
          PDF-Dateien in <Typography component="span" sx={{ color: "#8CB8C9 " }}>Sekundenschnelle</Typography> zu
          reduzieren, ohne lange Wartezeiten oder Datei-Uploads.
        </Typography>
      </Box>

      <SizeComponent source={sourceSize} target={targetSize} />

      <Box sx={{
        backgroundColor: "#0F1A21",
        p: 5,
        mt: 2,
        width: "100%",
        boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);"
      }}>
        {state !== "loading" && state !== "toBeDownloaded" &&
          <Box component="form" onSubmit={onSubmit}>
            <input type="file" accept={"application/pdf"} name="file"
              onChange={changeHandler} id={"file"} style={{ display: "none" }} />
            <Box>
              <label htmlFor={"file"}>
                <Button fullWidth variant="contained" component="span"
                  color={state == "selected" ? "warning" : "primary"}>
                  <>
                    {file && file.filename && <DescriptionIcon sx={{ mr: 1 }} />}
                    {!file || !file.filename ? `Die PDF-Datei auswählen` : file.filename}
                  </>
                </Button>
              </label>
            </Box>
            {state === 'selected' &&
              <Box sx={{ mt: 1 }}>
                <Button variant="contained" type="submit" fullWidth>Optimierung starten!</Button>
              </Box>
            }

          </Box>}
        {state === "loading" && <LinearProgress color="secondary" />}
        {state === "toBeDownloaded" &&
          <>
            <Box>
              <Button variant="contained" color="success" href={downloadLink} download={minFileName}
                fullWidth>
                <DownloadIcon sx={{ mr: 1 }} /> {`${minFileName} herunterladen`}
              </Button>
            </Box>
            <Box sx={{ mt: 1 }}>
              <Button variant="contained" href={'./'} fullWidth>
                {`Weitere PDF-Datei optimieren`}
              </Button>
            </Box>
          </>
        }
      </Box>

    </>
  )
}

export default App

export const Route = createFileRoute('/')({
  component: App,
})

