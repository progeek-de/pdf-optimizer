import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Typography,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FileWithPath } from 'react-dropzone';

// Interface für die Drag-Item Typisierung
interface DragItem {
  index: number;
  id: string;
  type: string;
}

// Props für das DraggableListItem
interface DraggableListItemProps {
  file: FileWithPath;
  index: number;
  moveFile: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (id: string) => void;
  fileId: string;
}

// Konstante für den Drag-Typ
const ItemTypes = {
  FILE: 'file'
};

// Umrechnung der Dateigröße in lesbare Form
const formatFileSize = (bytes: number | undefined): string => {
  if (bytes === undefined) return 'Unbekannte Größe';

  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Draggable List Item Komponente
const DraggableListItem: React.FC<DraggableListItemProps> = ({ file, fileId, index, moveFile, onDelete }) => {
  // Wir referenzieren hier ein li-Element statt einem div-Element
  const ref = useRef<HTMLLIElement>(null);

  // Drag-Hook Setup
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.FILE,
    item: { index, id: fileId, type: ItemTypes.FILE } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop-Hook Setup
  const [, drop] = useDrop({
    accept: ItemTypes.FILE,
    hover: (item: DragItem, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Nicht weitermachen, wenn wir über dem gleichen Item schweben
      if (dragIndex === hoverIndex) {
        return;
      }

      // Bestimme Rechteck auf dem Bildschirm
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Hole den vertikalen Mittelpunkt
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Position des Mauszeigers bestimmen
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        return;
      }

      // Hole die Position des Mauszeigers
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Nur ausführen, wenn die Maus über die Hälfte der Höhe des Items bewegt wurde
      if (
        (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
        (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
      ) {
        return;
      }

      // Führe die Umordnung durch
      moveFile(dragIndex, hoverIndex);

      // Aktualisiere den Index des aktuell gezogenen Items
      item.index = hoverIndex;
    },
  });

  // Drag und Drop-Refs kombinieren
  drag(drop(ref));

  // Löschbutton für secondaryAction
  const deleteButton = (
    <IconButton
      edge="end"
      aria-label="delete"
      onClick={() => onDelete(fileId)}
    >
      <DeleteIcon />
    </IconButton>
  );

  return (
    <ListItem
      ref={ref}
      sx={{
        // opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        // bgcolor: isDragging ? '#f5f5f5' : 'main.background',
        mb: 1,
        // border: '1px solid #e0e0e0',
      }}
      secondaryAction={deleteButton}
    >
      <DragHandleIcon sx={{ mr: 1 }} />

      <ListItemText
        primary={file.name}
        secondary={
          <>
            {/* {file.type && `Typ: ${file.type}`} */}
            {/* {file.size !== undefined && file.type && ' | '} */}
            {file.size !== undefined && `Größe: ${formatFileSize(file.size)}`}
            {/* {file.path && file.path !== file.name && ( */}
            {/*   <span style={{ display: 'block' }}>Pfad: {file.path}</span> */}
            {/* )} */}
          </>
        }
      />
    </ListItem>
  );
};

// Haupt-FileList Komponente
interface FileListProps {
  initialFiles?: FileWithPath[];
  onFilesChange?: (files: FileWithPath[]) => void;
}

// Map zur Speicherung der generierten IDs für die Dateien
const fileIdMap = new WeakMap<FileWithPath, string>();

// Funktion zum Abrufen oder Erstellen einer ID für eine Datei
const getFileId = (file: FileWithPath): string => {
  if (!fileIdMap.has(file)) {
    // Ersetzen von .substr() durch .slice(), das nicht veraltet ist
    fileIdMap.set(file, `file_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`);
  }
  return fileIdMap.get(file)!;
};

const FileList: React.FC<FileListProps> = ({ initialFiles = [], onFilesChange }) => {
  const [files, setFiles] = useState<FileWithPath[]>(initialFiles);

  // Handler für das Löschen von Dateien
  const handleDelete = useCallback((id: string) => {
    const newFiles = files.filter(file => getFileId(file) !== id);
    setFiles(newFiles);
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  }, [files, onFilesChange]);

  // Handler für das Verschieben von Dateien
  const moveFile = useCallback((dragIndex: number, hoverIndex: number) => {
    const draggedFile = files[dragIndex];
    const newFiles = [...files];

    // Entferne das Element aus dem Array
    newFiles.splice(dragIndex, 1);

    // Füge das Element an der neuen Position ein
    newFiles.splice(hoverIndex, 0, draggedFile);

    setFiles(newFiles);
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  }, [files, onFilesChange]);

  // Aktualisiere die Files, wenn initialFiles sich ändert
  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <DndProvider backend={HTML5Backend}>
        <List>
          {files.length > 0 && (

            files.map((file, index) => (
              <DraggableListItem
                key={getFileId(file)}
                fileId={getFileId(file)}
                file={file}
                index={index}
                moveFile={moveFile}
                onDelete={handleDelete}
              />
            ))
          )}
        </List>
      </DndProvider>
    </Box>
  );
};

export default FileList;
