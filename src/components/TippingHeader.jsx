import { Box, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

const TippingHeader = ({ isMobile }) => {
  return (
    <Box sx={{ mb: 4, textAlign: 'center', px: { xs: 1, sm: 2 } }}>
      <Typography
        variant="h1"
        sx={{
          fontSize: isMobile ? '1.8rem' : '2.5rem',
          fontWeight: 800,
          color: '#1E3932',
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <AddIcon sx={{ fontSize: isMobile ? '1.8rem' : '2.5rem' }} />
        Tippek Megadása
      </Typography>
      <Typography variant="body1" sx={{ color: '#666', fontSize: isMobile ? '0.95rem' : '1.1rem' }}>
        Tippelj az előttünk álló meccsekre!
      </Typography>
    </Box>
  )
}

export default TippingHeader
