import { Card, CardContent, Typography } from '@mui/material'

const RuleCard = ({ icon, title, points, description }) => {
  return (
    <Card
      sx={{
        height: '100%',
        width: { xs: '100%', sm: 300, md: 300 },
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderTop: '6px solid #2E8B57',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 24px rgba(46, 139, 87, 0.15)',
        },
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '2.5rem', mb: 1, textAlign: 'center' }}>
          {icon}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3932', textAlign: 'center', mb: 1 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#2E8B57', textAlign: 'center', mb: 2 }}>
          {points}
        </Typography>
        <Typography sx={{ color: '#666', lineHeight: 1.5, textAlign: 'center', fontSize: '0.95rem', mt: 'auto' }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default RuleCard