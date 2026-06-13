import { Card, CardContent, Typography, CardActionArea } from '@mui/material'

const StatCard = ({ value, label, icon, isAction, onClick }) => {
  const innerContent = (
    <CardContent sx={{ textAlign: 'center', p: 3 }}>
      {icon && (
        <Typography sx={{ fontSize: '2.5rem', mb: 1, color: isAction ? '#fff' : 'secondary.main' }}>
          {icon}
        </Typography>
      )}
      {value && (
        <Typography sx={{ fontSize: '3rem', fontWeight: 800, color: 'primary.main', lineHeight: 1 }}>
          {value}
        </Typography>
      )}
      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: isAction ? '#fff' : '#666', mt: 1, textTransform: 'uppercase' }}>
        {label}
      </Typography>
    </CardContent>
  )

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        // Ha akciógomb, akkor kap egy menő vibráló hátteret
        background: isAction ? (theme) => `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.warning.main} 100%)` : '#fff',
        color: isAction ? '#fff' : 'inherit',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      {isAction ? (
        <CardActionArea onClick={onClick} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {innerContent}
        </CardActionArea>
      ) : (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {innerContent}
        </Box>
      )}
    </Card>
  )
}

// Ideiglenes Box import, ha csak az 'else' ágat használnánk
import { Box } from '@mui/material'

export default StatCard