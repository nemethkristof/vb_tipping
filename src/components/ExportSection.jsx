import { Card, CardContent, Box, Button, Alert, Typography, Divider, CircularProgress } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InfoIcon from '@mui/icons-material/Info'
import SendIcon from '@mui/icons-material/Send'

const ExportSection = ({ 
  onDownload, 
  onCopyToClipboard, 
  onSendEmail, 
  unexportedCount, 
  isSending 
}) => {
  const hasNewTips = unexportedCount > 0;

  return (
    <Card
      sx={{
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        margin: '20px auto',
        border: hasNewTips ? '2px solid #2E8B57' : 'none'
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1E3932', display: 'flex', alignItems: 'center', gap: 1 }}>
          Tippek Beküldése {hasNewTips ? `(${unexportedCount} új)` : '(Nincs új beküldendő tipp)'}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          {/* --- A TERV: Email küldés --- */}
          <Button
            variant="contained"
            startIcon={isSending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            fullWidth
            onClick={onSendEmail}
            disabled={!hasNewTips || isSending}
            sx={{
              background: 'linear-gradient(135deg, #1E3932 0%, #2E8B57 100%)',
              color: '#fff',
              fontWeight: 800,
              padding: '14px',
              fontSize: { xs: '1rem', sm: '1.1rem' },
              '&:hover': { opacity: 0.9 },
              '&:active': { transform: 'scale(0.98)' },
              '&.Mui-disabled': { background: '#ccc', color: '#666' }
            }}
          >
            {isSending ? 'Küldés folyamatban...' : `Tippek Beküldése Közvetlenül (${unexportedCount} db)`}
          </Button>

          <Alert severity="info" icon={<InfoIcon />} sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Kattints a fenti gombra, és a rendszer automatikusan elküldi nekem a tippjeidet! Csak az új/módosított tippek kerülnek elküldésre.
            </Typography>
          </Alert>

          {/* --- ELVÁLASZTÓ --- */}
          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" sx={{ color: '#888', fontWeight: 'bold' }}>
              B TERV (HA A KÜLDÉS NEM MŰKÖDIK)
            </Typography>
          </Divider>

          {/* --- B TERV: Alternatívák --- */}
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              fullWidth
              onClick={onCopyToClipboard}
              disabled={!hasNewTips || isSending}
              sx={{
                borderColor: '#2E8B57', color: '#2E8B57', fontWeight: 600, padding: '10px',
                '&:hover': { background: '#f0f0f0', borderColor: '#1E3932' }
              }}
            >
              Másolás vágólapra
            </Button>

            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              fullWidth
              onClick={onDownload}
              disabled={!hasNewTips || isSending}
              sx={{
                borderColor: '#2E8B57', color: '#2E8B57', fontWeight: 600, padding: '10px',
                '&:hover': { background: '#f0f0f0', borderColor: '#1E3932' }
              }}
            >
              JSON Letöltése
            </Button>
          </Box>

        </Box>
      </CardContent>
    </Card>
  )
}

export default ExportSection