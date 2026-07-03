import { Box, Typography, Card, Chip, CardActionArea } from '@mui/material'

const getMedalColor = (rank) => {
  switch (rank) {
    case 1: return '#FFD700'
    case 2: return '#C0C0C0'
    case 3: return '#CD7F32'
    default: return '#1E3932'
  }
}

const getMedalEmoji = (rank) => {
  switch (rank) {
    case 1: return '🥇'
    case 2: return '🥈'
    case 3: return '🥉'
    default: return '🏅'
  }
}

const LeaderboardMobile = ({ leaderboard, onUserClick, nameDayUser }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {leaderboard.map((player, index) => {
        const medalColor = getMedalColor(player.rank)
        const isTop3 = player.rank <= 3

        return (
          <Card
            key={index}
            sx={{
              borderRadius: '12px',
              background: isTop3 ? `rgba(${medalColor === '#FFD700' ? '255,215,0' : medalColor === '#C0C0C0' ? '192,192,192' : '205,127,50'}, 0.1)` : '#fff',
              borderLeft: `6px solid ${medalColor}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s',
              '&:active': { transform: 'scale(0.98)' }
            }}
          >
            {/* ÚJ: CardActionArea használata a mobilbarát kattintási effektért */}
            <CardActionArea onClick={() => onUserClick(player.user)} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <Typography sx={{ fontSize: '1.5rem', minWidth: '45px', textAlign: 'center' }}>
                {getMedalEmoji(player.rank)}
              </Typography>
              
              <Box sx={{ flexGrow: 1, ml: 1 }}>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E3932' }}>
                  {player.user}
                  {player.user === nameDayUser && ' 🎂'}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>
                  {player.rank}. helyezett
                </Typography>
              </Box>

              <Chip
                label={`${player.score} pont`}
                sx={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  background: '#2E8B57',
                  color: '#fff',
                  height: '32px',
                }}
              />
            </CardActionArea>
          </Card>
        )
      })}
    </Box>
  )
}

export default LeaderboardMobile