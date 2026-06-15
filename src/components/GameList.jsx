import { Grid, Typography, Box } from '@mui/material'
import GameCard from './GameCard'

const GameList = ({ games }) => {
  if (!games || games.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="textSecondary">
          Jelenleg nincsenek elérhető mérkőzések.
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={3}>
      {games.map((game) => (
        <Grid item xs={12} sm={6} md={4} key={game.id}>
          <GameCard game={game} />
        </Grid>
      ))}
    </Grid>
  )
}

export default GameList