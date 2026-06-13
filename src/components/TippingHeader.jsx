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
        (Ahol nem jelenik meg csapatnév, ott a mérkőzés még nem került kiírásra, így a tippelés sem kötelező.)
      </Typography>
    </Box>
  )
}

export default TippingHeader
