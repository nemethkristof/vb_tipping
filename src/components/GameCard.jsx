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
        display: 'flex',
        flexDirection: 'column',
        width: '100%', // Kötelezően kitölti a szülő elem (GameList Grid) szélességét
        overflow: 'hidden', // Megakadályozza, hogy bármi kitolja a doboz szélét
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 6px 16px rgba(46, 139, 87, 0.2)' }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5 }, display: 'flex', flexDirection: 'column' }}>
        
        {/* Fejléc */}
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

        {/* Dátum és Helyszín */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
          <Typography variant="caption" sx={{ color: '#444', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarTodayIcon sx={{ fontSize: '0.85rem' }} /> {game.local_date}
          </Typography>
          <Typography variant="caption" sx={{ color: '#444', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PlaceIcon sx={{ fontSize: '0.85rem' }} /> Stadion ID: {game.stadium_id}
          </Typography>
        </Box>

        {/* CSAPATOK ÉS EREDMÉNY (Grid elrendezés a garantált kiférésért) */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr auto 1fr', 
            gap: 1, 
            alignItems: 'center', 
            mb: 1,
            width: '100%'
          }}
        >
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 700, 
              textAlign: 'right', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              fontSize: { xs: '0.9rem', sm: '1rem' } 
            }}
          >
            {homeName}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {isFinished ? (
              <Chip 
                label={`${game.home_score} - ${game.away_score}`} 
                sx={{ background: '#1E3932', color: '#fff', fontWeight: 900, fontSize: { xs: '0.9rem', sm: '1rem' } }} 
              />
            ) : (
              <Chip 
                label="VS" 
                sx={{ background: '#f0f0f0', color: '#888', fontWeight: 900, fontSize: { xs: '0.8rem', sm: '0.9rem' } }} 
              />
            )}
          </Box>

          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 700, 
              textAlign: 'left', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              fontSize: { xs: '0.9rem', sm: '1rem' } 
            }}
          >
            {awayName}
          </Typography>
        </Box>
        
        <Typography variant="caption" sx={{ textAlign: 'center', display: 'block', color: isFinished ? '#2E8B57' : '#FF8C00', fontWeight: 'bold', mb: 1, fontSize: '0.7rem' }}>
          {isFinished ? 'Végeredmény' : 'Hamarosan'}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ my: 1, opacity: 0.6 }} />
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#888', mb: 0.5, fontSize: '0.65rem', textTransform: 'uppercase' }}>
            Gólszerzők
          </Typography>
          
          {/* GÓLSZERZŐK (Grid elrendezés a garantált kiférésért) */}
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 10px 1fr', 
              minHeight: '40px',
              width: '100%'
            }}
          >
            <Box sx={{ textAlign: 'right', overflow: 'hidden' }}>
              {homeScorers.length > 0 ? (
                homeScorers.map((scorer, idx) => (
                  <Typography key={idx} variant="caption" sx={{ display: 'block', color: '#555', fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {scorer} ⚽
                  </Typography>
                ))
              ) : (
                <Typography variant="caption" sx={{ color: '#ccc', fontStyle: 'italic' }}>-</Typography>
              )}
            </Box>
            
            <Box /> {/* Ez a 10px-es üres sáv középen */}
            
            <Box sx={{ textAlign: 'left', overflow: 'hidden' }}>
              {awayScorers.length > 0 ? (
                awayScorers.map((scorer, idx) => (
                  <Typography key={idx} variant="caption" sx={{ display: 'block', color: '#555', fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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