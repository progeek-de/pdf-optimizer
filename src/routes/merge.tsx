import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Dropzone from '../components/Dropzone'
import { Box, Button, Link, Typography } from '@mui/material'
import { FileWithPath } from 'react-dropzone/.'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ACTION_RESULT, createInitAction, createProcessAction } from '../worker/worker-utils'

import BackgroundWorker from "../worker/worker.merge?worker"
import FileList from '../components/FilesList'

export const Route = createFileRoute('/merge')({
  component: Merge,
})

function Merge() {
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const workerRef = useRef<Worker>(null)
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  useEffect(() => {
    if (workerRef.current == null) {
      workerRef.current = new BackgroundWorker()
      workerRef.current?.addEventListener("message", (msg) => {
        if (msg.data.type === ACTION_RESULT) {
          console.log("Result", msg.data)
          setIsLoading(false)
          setResult(msg.data.payload)
        }
      })

      workerRef.current?.postMessage(createInitAction())
    }
  }, [])

  const onSubmit = () => {
    const objectUrls = files.map(file => window.URL.createObjectURL(file));
    setIsLoading(true)
    workerRef.current?.postMessage(createProcessAction(objectUrls))
  }

  return (
    <>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h4">Intelligentes PDF-Zusammenführen</Typography>
        <Typography>
          Unser Webservice ermöglicht es Ihnen, mehrere PDF-Dateien zu einem <Typography component="span"
            sx={{ color: "#8CB8C9 " }}>einzigen Dokument</Typography> zusammenzuführen. Die
          <Typography component="span" sx={{ color: "#8CB8C9 " }}> Reihenfolge</Typography> der Dateien können Sie dabei
          per Drag & Drop <Typography component="span" sx={{ color: "#8CB8C9 " }}>individuell anpassen</Typography>,
          um das Ergebnis optimal an Ihre Bedürfnisse anzupassen.
        </Typography>
      </Box>


      <Box sx={{
        backgroundColor: "#0F1A21",
        p: 5,
        mt: 2,
        width: "100%",
        boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);"
      }}>

        <Dropzone onDrop={onDrop} />
        <FileList initialFiles={files} onFilesChange={setFiles} />

        <Button disabled={files.length < 2} variant="contained" fullWidth color="primary" onClick={onSubmit}>Dateien zusammenführen</Button>

        {result && !isLoading && <Box sx={{ mt: 1, width: "100%" }}>
          <Button variant="contained" fullWidth color="success" href={result} download="combined.pdf">Ergebniss herunterladen</Button>
        </Box>}

      </Box>

    </>
  )
}
