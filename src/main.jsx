import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Box, Container, CssBaseline, ThemeProvider, Typography} from "@mui/material";

import theme from "./theme.js";

import Logo from "./images/progeek-logo.svg?react"

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Container sx={{display: "flex", alignItems: "center", flexDirection: "column"}} maxWidth="sm">
                <Box sx={{width: 300, display: "flex", alignItems: "center"}}>
                    <Logo/>
                    <p>PDF Optimizer</p>
                </Box>
                <Box sx={{mb: 2}}>
                    <Typography variant="h4">Schnelle PDF-Größenreduzierung</Typography>
                    <Typography>
                        Unser Webservice ermöglicht es Ihnen, die <Typography as="span"
                                                                              sx={{color: "#8CB8C9 "}}>Größe</Typography> Ihrer
                        PDF-Dateien in <Typography as="span" sx={{color: "#8CB8C9 "}}>Sekundenschnelle</Typography> zu
                        reduzieren, ohne lange Wartezeiten oder Datei-Uploads.
                    </Typography>
                </Box>
                <Box sx={{mb: 2}}>
                    <Typography variant="h4">Sicherheit und Datenschutz</Typography>
                    <Typography>
                        Ihre Dokumente <Typography as="span" sx={{color: "#ED6B1C"}}>verlassen niemals Ihr
                        Gerät</Typography>. Wir verwenden keine Cloud-Speicherung oder Server-basierte Verarbeitung.
                        Alle Optimierungen werden <Typography as="span" sx={{color: "#8CB8C9 "}}>lokal in Ihrem
                        Browser</Typography> durchgeführt, um maximale <Typography as="span" sx={{color: "#8CB8C9 "}}>Sicherheit
                        und Datenschutz</Typography> zu gewährleisten.
                    </Typography>
                </Box>
                <App/>
                <Box sx={{my: 2}}>
                    <Typography>
                        Hinweis: Dieser Webservice dient nur zu Demonstrationszwecken und es wird keine Gewähr für die
                        Richtigkeit der Ergebnisse übernommen. Bitte gehen Sie verantwortungsvoll damit um und
                        überprüfen Sie die Daten gegebenenfalls selbst.
                    </Typography>
                </Box>
                <Box sx={{my: 2}}>
                    <Typography>
                        Copyright by PROGEEK GmbH (C) 2023
                    </Typography>
                </Box>
            </Container>
        </ThemeProvider>
    </React.StrictMode>
)
