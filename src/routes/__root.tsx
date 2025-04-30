import { Box, Button, ButtonGroup, Container, CssBaseline, Link, ThemeProvider, Typography } from '@mui/material'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

//@ts-ignore
import theme from "../theme.js";
//@ts-ignore
import Logo from "../images/progeek-logo.svg?react"

export const Route = createRootRoute({
  component: () => (

    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container sx={{ display: "flex", alignItems: "center", flexDirection: "column" }} maxWidth="sm">
          <Box sx={{ width: 300, display: "flex", alignItems: "center" }}>
            <Logo />
            <p>PDF Optimizer</p>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h4">Sicherheit und Datenschutz</Typography>
            <Typography>
              Ihre Dokumente <Typography component="span" sx={{ color: "#ED6B1C" }}>verlassen niemals Ihr
                Gerät</Typography>. Wir verwenden keine Cloud-Speicherung oder Server-basierte Verarbeitung.
              Alle Optimierungen werden <Typography component="span" sx={{ color: "#8CB8C9 " }}>lokal in Ihrem
                Browser</Typography> durchgeführt, um maximale <Typography component="span" sx={{ color: "#8CB8C9 " }}>Sicherheit
                  und Datenschutz</Typography> zu gewährleisten.
            </Typography>
          </Box>


          <Box sx={{ mb: 2 }}>
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <Typography>Wählen Sie die Funktion</Typography>
            </Box>
            <Box>
              <ButtonGroup variant="contained" color="info">
                <Button href="/">Optimizer</Button>
                <Button href="/merge">Merger</Button>
              </ButtonGroup>
            </Box>
          </Box>

          <Outlet />

          <Box sx={{ my: 2 }}>
            <Typography>
              Hinweis: Dieser Webservice dient nur zu Demonstrationszwecken und es wird keine Gewähr für die
              Richtigkeit der Ergebnisse übernommen. Bitte gehen Sie verantwortungsvoll damit um und
              überprüfen Sie die Daten gegebenenfalls selbst.
            </Typography>
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography>
              Copyright by PROGEEK GmbH (C) 2025
              <Box sx={{ display: "flex", gap: 1, justifyContent: "center", width: "100%" }}>
                <Link href="https://github.com/progeek-de/pdf-optimizer">GitHub</Link>
                <Link href="https://progeek.de/imprint">Impressum</Link>
                <Link href="https://progeek.de/privacy">Datenschutz</Link>
              </Box>
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
      <TanStackRouterDevtools />
    </>
  ),
})
