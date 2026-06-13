import { Card, CardContent, Typography } from '@mui/material'

const RuleCard = ({ title, points, description, icon }) => {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        borderTop: (theme) => `5px solid ${theme.palette.success.main}`, // Zöld felső sáv
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 3 }}>
        <Typography sx={{ fontSize: '3rem', mb: 2 }}>
          {icon}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'secondary.main', mb: 2 }}>
          {points}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6, fontWeight: 500 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default RuleCard