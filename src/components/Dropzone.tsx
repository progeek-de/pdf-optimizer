import { Box, styled, Typography } from "@mui/material"
import { useState } from "react"
import { FileWithPath, useDropzone } from "react-dropzone"
import { formatSize } from "../utils"

interface DropzoneProps {
  onChange: (files: FileWithPath[]) => void
}

const DropzoneBox = styled(Box)(({ theme }) => ({
  border: `1px dashed ${theme.palette.grey[400]}`,
  padding: theme.spacing(4),
}))

const Dropzone = (props: DropzoneProps) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => props?.onChange(acceptedFiles)
  })

  const filesList = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.name} - {formatSize(file.size)}
    </li>
  ));

  return (
    <DropzoneBox {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      {acceptedFiles.length == 0 && <Typography>
        Ziehe einige Dateien hierher oder klicke, um Dateien auszuwählen.
      </Typography>}
      <Box>
        {filesList}
      </Box>
    </DropzoneBox>
  )
}

export default Dropzone
