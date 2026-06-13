import { Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Box } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ListIcon from '@mui/icons-material/List'

const PredictionList = ({ predictions, onRemovePrediction, isMobile, getGameDetails }) => {
  if (!predictions.length) return null

  return (
    <Card sx={{ mt: 4, borderRadius: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderTop: (theme) => `4px solid ${theme.palette.secondary.main}`, minWidth: '100%', margin: '20px auto' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <ListIcon /> Hozzáadott Tippek ({predictions.length})
        </Typography>

        {isMobile ? (
          <Grid container spacing={2}>
            {predictions.map((prediction) => {
              const gameDetails = getGameDetails(prediction.matchId)
              const gameDisplay = gameDetails ? `#${gameDetails.id} - ${gameDetails.home_team_name_en} vs ${gameDetails.away_team_name_en}` : `Meccs #${prediction.matchId}`
              return (
                <Grid item xs={12} key={`mobile-${prediction.matchId}`}>
                  <Card sx={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #fff 100%)', borderLeft: (theme) => `4px solid ${theme.palette.secondary.main}` }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, pb: 1, '&:last-child': { pb: 1 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            👤 {prediction.user}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 600, mt: 0.5 }}>
                            ⚽ {gameDisplay}
                          </Typography>
                        </div>
                        <IconButton size="small" onClick={() => onRemovePrediction(prediction.matchId)} sx={{ color: '#d32f2f' }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Chip label={`${prediction.scoreA} - ${prediction.scoreB}`} color="secondary" sx={{ fontWeight: 700, alignSelf: 'flex-start' }} />
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        ) : (
          <TableContainer component={Paper} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 100%)` }}>
                  <TableCell sx={{ fontWeight: 700, color: '#fff' }}>👤 Játékos</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#fff' }}>⚽ Meccs</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#fff' }}>🎯 Tippelt Eredmény</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#fff' }}>❌ Törlés</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {predictions.map((prediction, index) => {
                  const gameDetails = getGameDetails(prediction.matchId)
                  const gameDisplay = gameDetails ? `#${gameDetails.id} - ${gameDetails.home_team_name_en} vs ${gameDetails.away_team_name_en}` : `Meccs #${prediction.matchId}`
                  
                  return (
                    <TableRow key={`desktop-${prediction.matchId}`} sx={{ background: index % 2 === 0 ? '#f5f5f5' : '#fff', '&:hover': { background: '#fce4ec' } }}>
                      <TableCell sx={{ fontWeight: 600 }}>{prediction.user}</TableCell>
                      <TableCell sx={{ fontWeight: 500, color: 'secondary.main' }}>{gameDisplay}</TableCell>
                      <TableCell>
                        <Chip label={`${prediction.scoreA} - ${prediction.scoreB}`} color="secondary" sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => onRemovePrediction(prediction.matchId)} sx={{ color: '#d32f2f', '&:hover': { background: '#ffebee' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  )
}

export default PredictionList