import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

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
          <TableRow sx={{ background: 'linear-gradient(135deg, #1E3932 0%, #2E8B57 100%)' }}>
            <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', textAlign: 'center', width: '100px' }}>Hely</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Játékos</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', textAlign: 'right', paddingRight: '40px' }}>Pontok</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaderboard.map((player, index) => (
            <TableRow
              key={index}
              onClick={() => onUserClick(player.user)} // ÚJ: Kattintás esemény
              sx={{
                background: index % 2 === 0 ? '#f5f5f5' : '#fff',
                borderLeft: `5px solid ${getMedalColor(player.rank)}`,
                cursor: 'pointer', // ÚJ: kurzor változtatása
                '&:hover': { background: '#e8f5e9', transform: 'scale(1.005)' }, // ÚJ: Látványos hover
                transition: 'all 0.2s ease',
              }}
            >
              <TableCell sx={{ fontWeight: 800, fontSize: '1.2rem', textAlign: 'center', color: '#1E3932' }}>
                {getMedalEmoji(player.rank)} {player.rank}.
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#1E3932' }}>
                {player.user}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '1.3rem', textAlign: 'right', paddingRight: '40px', color: '#2E8B57' }}>
                {player.score}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default LeaderboardDesktop