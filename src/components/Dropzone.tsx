import { Box, styled, Typography } from "@mui/material";
import { FileWithPath, useDropzone } from "react-dropzone";

interface DropzoneProps {
  onDrop: (files: FileWithPath[]) => void
}

const DropzoneBox = styled(Box)(({ theme }) => ({
  border: `1px dashed ${theme.palette.grey[700]}`,
  color: theme.palette.grey[700],
  borderRadius: theme.spacing(1),
  padding: theme.spacing(4),
}))

const Dropzone = (props: DropzoneProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop: acceptedFiles => {
      props?.onDrop(acceptedFiles)
    }
  })

  return (
    <>
      <DropzoneBox {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <Typography>
          Ziehe einige Dateien hierher oder klicke, um Dateien auszuwählen.
        </Typography>
      </DropzoneBox>
    </>
  )
}

export default Dropzone
