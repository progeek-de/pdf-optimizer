import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Dropzone from '../components/Dropzone'
import { Box, Button, Link } from '@mui/material'
import { FileWithPath } from 'react-dropzone/.'
import { useEffect, useRef, useState } from 'react'
import { ACTION_RESULT, createInitAction, createProcessAction } from '../vendor/worker-utils'

//@ts-ignore
import BackgroundWorker from "../vendor/worker.merge?worker"

export const Route = createFileRoute('/merge')({
  component: Merge,
})

function Merge() {
  const [files, setFiles] = useState<FileWithPath[]>([])
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const workerRef = useRef<Worker>(null)

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

  const handleOnChange = (files: FileWithPath[]) => {
    setFiles(files)
  }

  const handleSubmit = () => {
    const objectUrls = files.map(file => window.URL.createObjectURL(file));
    setIsLoading(true)
    workerRef.current?.postMessage(createProcessAction(objectUrls))
  }

  return (
    <>
      <Dropzone onChange={handleOnChange} />

      <Box sx={{ mt: 1, width: "100%" }}>
        <Button disabled={files.length < 2} variant="contained" type="submit" fullWidth onClick={handleSubmit}>Dateien zussamenführen</Button>
      </Box>
      {result && !isLoading && <Box sx={{ mt: 1, width: "100%" }}>
        <Button variant="contained" fullWidth color="success" href={result} download="combined.pdf">Ergebniss herunterladen</Button>
      </Box>}

    </>
  )
}
