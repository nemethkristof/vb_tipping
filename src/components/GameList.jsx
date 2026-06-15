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
    <Grid container spacing={2} alignItems="stretch">
      {games.map((game) => (
        // A display: 'flex' garantálja, hogy a kártya kitölti a rendelkezésre álló helyet
        <Grid item xs={12} sm={6} md={4} key={game.id} sx={{ display: 'flex' }}>
          <GameCard game={game} />
        </Grid>
      ))}
    </Grid>
  )
}

export default GameList