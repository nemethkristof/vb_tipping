import { Card, CardContent, Typography, Box, Chip, Divider } from '@mui/material'
import PlaceIcon from '@mui/icons-material/Place'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

const GameCard = ({ game }) => {
  const homeName = game.home_team_name_en || game.home_team_label || 'Ismeretlen'
  const awayName = game.away_team_name_en || game.away_team_label || 'Ismeretlen'
  const isFinished = game.finished === 'TRUE' || game.finished === true

  const parseScorers = (scorersString) => {
    if (!scorersString || scorersString === 'null') return []
    return scorersString.replace(/[{""}]/g, '').split(',').map(s => s.trim())
  }

  const homeScorers = parseScorers(game.home_scorers)
  const awayScorers = parseScorers(game.away_scorers)

  return (
    <Card
      sx={{
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 6px 16px rgba(46, 139, 87, 0.2)' }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>
            {game.matchday}. Forduló
          </Typography>
          <Chip 
            label={game.type === 'group' ? `Csoport: ${game.group}` : game.type.toUpperCase()} 
            size="small" 
            sx={{ background: '#e8f5e9', color: '#2E8B57', fontWeight: 700, fontSize: '0.7rem' }} 
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
          <Typography variant="caption" sx={{ color: '#444', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarTodayIcon sx={{ fontSize: '0.9rem' }} /> {game.local_date}
          </Typography>
          <Typography variant="caption" sx={{ color: '#444', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PlaceIcon sx={{ fontSize: '0.9rem' }} /> Stadion ID: {game.stadium_id}
          </Typography>
        </Box>

        {/* Ezt a részt módosítottam a biztonságos kiférés érdekében */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, gap: 1 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 700, 
              flex: 1, 
              textAlign: 'right', 
              lineHeight: 1.2,
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}
          >
            {homeName}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            {isFinished ? (
              <Chip 
                label={`${game.home_score} - ${game.away_score}`} 
                sx={{ background: '#1E3932', color: '#fff', fontWeight: 900, fontSize: '1rem' }} 
              />
            ) : (
              <Chip 
                label="VS" 
                sx={{ background: '#f0f0f0', color: '#888', fontWeight: 900, fontSize: '0.9rem' }} 
              />
            )}
          </Box>

          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 700, 
              flex: 1, 
              textAlign: 'left', 
              lineHeight: 1.2,
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}
          >
            {awayName}
          </Typography>
        </Box>
        
        <Typography variant="caption" sx={{ textAlign: 'center', display: 'block', color: isFinished ? '#2E8B57' : '#FF8C00', fontWeight: 'bold', mb: 1 }}>
          {isFinished ? 'Végeredmény' : 'Hamarosan'}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ my: 1.5, opacity: 0.6 }} />
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#888', mb: 1, fontSize: '0.65rem', textTransform: 'uppercase' }}>
            Gólszerzők
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', minHeight: '40px' }}>
            <Box sx={{ width: '45%', textAlign: 'right' }}>
              {homeScorers.length > 0 ? (
                homeScorers.map((scorer, idx) => (
                  <Typography key={idx} variant="caption" sx={{ display: 'block', color: '#555', fontSize: '0.75rem' }}>
                    {scorer} ⚽
                  </Typography>
                ))
              ) : (
                <Typography variant="caption" sx={{ color: '#ccc', fontStyle: 'italic' }}>-</Typography>
              )}
            </Box>
            
            <Box sx={{ width: '10%' }} />
            
            <Box sx={{ width: '45%', textAlign: 'left' }}>
              {awayScorers.length > 0 ? (
                awayScorers.map((scorer, idx) => (
                  <Typography key={idx} variant="caption" sx={{ display: 'block', color: '#555', fontSize: '0.75rem' }}>
                    ⚽ {scorer}
                  </Typography>
                ))
              ) : (
                <Typography variant="caption" sx={{ color: '#ccc', fontStyle: 'italic' }}>-</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default GameCard