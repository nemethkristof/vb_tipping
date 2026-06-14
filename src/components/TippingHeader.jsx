import AddIcon from '@mui/icons-material/Add'
import { Box, Typography, Alert } from '@mui/material';

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
      <Box sx={{ mt: 2, mb: 4 }}>
  {/* Kiemelt információs doboz a bevezetőnek */}
  <Alert 
    severity="info" 
    sx={{ 
      mb: 3, 
      fontSize: isMobile ? '0.9rem' : '1rem',
      '& .MuiAlert-message': { width: '100%' }
    }}
  >
    A tippjeidet elküldheted nekem bárhogyan (emailben, Messengeren, stb.), nem kötelező ezt az oldalt használnod. 
    <strong> Viszont sokat segítesz vele, ha itt állítod össze őket</strong>, mert az így kapott adatokat sokkal gyorsabban és könnyebben tudom rögzíteni!
  </Alert>

  {/* Alcím a lépésekhez */}
  <Typography 
    variant="h6" 
    sx={{ 
      mb: 2, 
      color: '#333', 
      fontWeight: 'bold',
      fontSize: isMobile ? '1.1rem' : '1.25rem' 
    }}
  >
    Hogyan használd az űrlapot?
  </Typography>

  {/* Felsorolás a lépéseknek */}
  <Box 
    component="ul" 
    sx={{ 
      color: '#666', 
      fontSize: isMobile ? '0.95rem' : '1.1rem', 
      pl: 3, // Bal oldali behúzás a pöttyöknek
      m: 0,
      display: 'flex', 
      flexDirection: 'column', 
      gap: 1.5,
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
    }}
  >
    <li>
      <strong>Válaszd ki a tippjeidet</strong> a mérkőzésekhez (ha meggondolod magad, a listában bármikor törölheted és újra felviheted őket).
    </li>
    <li>
      Ha kész vagy, kattints a <strong>"Másolás vágólapra"</strong> gombra, és egyszerűen illeszd be (Ctrl+V / Beillesztés) a nekem szánt üzenetbe vagy emailbe.
    </li>
    <li>
      Ha inkább fájlként küldenéd el, használd a <strong>"JSON letöltése"</strong> gombot, és csatold az üzenethez.
    </li>
  </Box>
</Box>
    </Box>
  )
}

export default TippingHeader
