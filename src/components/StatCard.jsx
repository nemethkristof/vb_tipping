import { Card, Typography } from '@mui/material'

const StatCard = ({ value, label, icon, isAction, onClick }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        width: { xs: '100%', sm: 300, md: 300 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background: isAction ? 'linear-gradient(135deg, #1E3932 0%, #2E8B57 100%)' : '#f8f9fa',
        color: isAction ? '#fff' : '#1E3932',
        padding: '30px 20px',
        borderRadius: '16px',
        boxShadow: isAction ? '0 4px 12px rgba(46, 139, 87, 0.3)' : 'none',
        border: isAction ? 'none' : '1px solid #e0e0e0',
        cursor: isAction ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': isAction ? { transform: 'scale(1.03)' } : {},
      }}
    >
      {icon && <Typography sx={{ fontSize: '2.5rem', mb: 1, display: 'flex' }}>{icon}</Typography>}
      {value && (
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, color: isAction ? '#fff' : '#2E8B57' }}>
          {value}
        </Typography>
      )}
      <Typography variant={isAction ? "h6" : "body1"} sx={{ fontWeight: isAction ? 800 : 600, color: isAction ? '#fff' : '#666' }}>
        {label}
      </Typography>
    </Card>
  )
}

export default StatCard