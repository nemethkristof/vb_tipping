import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'

const getMedalColor = (rank) => {
  switch (rank) {
    case 1: return '#FFD700'
    case 2: return '#C0C0C0'
    case 3: return '#CD7F32'
    default: return 'transparent'
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

const LeaderboardDesktop = ({ leaderboard, onUserClick }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 100%)` }}>
            <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', textAlign: 'center', width: '100px' }}>Hely</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Játékos</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }}>Pontok</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', textAlign: 'center', width: '180px' }}>Tippek</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaderboard.map((player, index) => (
            <TableRow
              key={index}
              hover
              onClick={() => { if (onUserClick) onUserClick(player.user) }} 
              sx={{
                background: index % 2 === 0 ? '#f5f5f5' : '#fff',
                borderLeft: `5px solid ${getMedalColor(player.rank)}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <TableCell sx={{ fontWeight: 800, fontSize: '1.2rem', textAlign: 'center', color: 'primary.main' }}>
                {getMedalEmoji(player.rank)} {player.rank}.
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '1.1rem', color: 'primary.main' }}>
                {player.user}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '1.3rem', textAlign: 'center', color: 'secondary.main' }}>
                {player.score}
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onUserClick) onUserClick(player.user)
                  }}
                  sx={{
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '8px',
                    '&:hover': {
                      background: 'primary.main',
                      color: '#fff',
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  Megtekintés
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default LeaderboardDesktop