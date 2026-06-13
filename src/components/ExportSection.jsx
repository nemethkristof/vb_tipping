import { Card, CardContent, Box, Button, Alert, Typography } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InfoIcon from '@mui/icons-material/Info'

const ExportSection = ({ onDownload, onCopyToClipboard }) => {
  return (
    <Card
      sx={{
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        margin: '20px auto',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1E3932', display: 'flex', alignItems: 'center', gap: 1 }}>
          Tippek Kezelése
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            fullWidth
            onClick={onDownload}
            sx={{
              background: '#2E8B57',
              color: '#fff',
              fontWeight: 700,
              padding: '12px',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              '&:hover': {
                background: '#1E3932',
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
            }}
          >
            JSON Letöltése
          </Button>

          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            fullWidth
            onClick={onCopyToClipboard}
            sx={{
              borderColor: '#2E8B57',
              color: '#2E8B57',
              fontWeight: 700,
              padding: '12px',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              '&:hover': {
                background: '#f0f0f0',
                borderColor: '#1E3932',
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
            }}
          >
            Másolás vágólapra
          </Button>

          <Alert
            severity="info"
            icon={<InfoIcon />}
            sx={{ mt: 2 }}
          >
            <Typography variant="caption" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              <strong>Fontos:</strong> Töltsd le a json fájl vagy másold vágólapra és küld el nekem a <strong>n.kristof99@gmail.com</strong> e-mail címre <strong>VB2026 Tippverseny</strong> tárggyal!
            </Typography>
          </Alert>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ExportSection
