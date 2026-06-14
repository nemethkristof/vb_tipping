import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ListIcon from '@mui/icons-material/List'

const PredictionList = ({ predictions, onRemovePrediction, isMobile, getGameDetails }) => {
  if (!predictions.length) return null

  return (
    <Card
      sx={{
        mt: 4,
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderTop: '4px solid #2E8B57',
        minWidth: '100%',
        margin: '20px auto',
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1E3932', display: 'flex', alignItems: 'center', gap: 1 }}>
          <ListIcon /> Hozzáadott Tippek ({predictions.length})
        </Typography>

        {isMobile ? (
          <Grid container spacing={2}>
            {predictions.map((prediction) => {
              const gameDetails = getGameDetails(prediction.matchId)
              const homeName = gameDetails ? (gameDetails.home_team_name_en || gameDetails.home_team_label) : '?'
              const awayName = gameDetails ? (gameDetails.away_team_name_en || gameDetails.away_team_label) : '?'
              const gameDisplay = gameDetails 
                ? `#${gameDetails.id} - ${homeName} vs ${awayName}`
                : `Meccs #${prediction.matchId}`
              
              return (
                <Grid item xs={12} key={`mobile-${prediction.matchId}`}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #f5f5f5 0%, #fff 100%)',
                      borderLeft: '4px solid #2E8B57',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(46, 139, 87, 0.2)',
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        pb: 1,
                        '&:last-child': { pb: 1 },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E3932' }}>
                            👤 {prediction.user}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#2E8B57', fontWeight: 600, mt: 0.5 }}>
                            ⚽ {gameDisplay}
                          </Typography>
                        </div>
                        <IconButton
                          size="small"
                          onClick={() => onRemovePrediction(prediction.matchId)}
                          sx={{ color: '#d32f2f' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Chip
                          label={`${prediction.scoreA} - ${prediction.scoreB}`}
                          sx={{
                            background: '#2E8B57',
                            color: '#fff',
                            fontWeight: 700,
                            alignSelf: 'flex-start',
                          }}
                        />
                        {prediction.advancer && gameDetails && (
                          <Typography variant="caption" sx={{ fontWeight: 600, color: '#FF8C00' }}>
                            Továbbjutó: {prediction.advancer === 'A' ? homeName : awayName}
                          </Typography>
                        )}
                      </Box>
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
                <TableRow sx={{ background: 'linear-gradient(135deg, #1E3932 0%, #2E8B57 100%)' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#fff' }}>👤 Játékos</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#fff' }}>⚽ Meccs</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#fff' }}>🎯 Tippelt Eredmény</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#fff' }}>
                    ❌ Törlés
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {predictions.map((prediction, index) => {
                  const gameDetails = getGameDetails(prediction.matchId)
                  const homeName = gameDetails ? (gameDetails.home_team_name_en || gameDetails.home_team_label) : '?'
                  const awayName = gameDetails ? (gameDetails.away_team_name_en || gameDetails.away_team_label) : '?'
                  const gameDisplay = gameDetails 
                    ? `#${gameDetails.id} - ${homeName} vs ${awayName}`
                    : `Meccs #${prediction.matchId}`
                  
                  return (
                    <TableRow
                      key={`desktop-${prediction.matchId}`}
                      sx={{
                        background: index % 2 === 0 ? '#f5f5f5' : '#fff',
                        '&:hover': { background: '#e8f5e9' },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600 }}>{prediction.user}</TableCell>
                      <TableCell sx={{ fontWeight: 500, color: '#2E8B57' }}>{gameDisplay}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
                          <Chip
                            label={`${prediction.scoreA} - ${prediction.scoreB}`}
                            sx={{
                              background: '#2E8B57',
                              color: '#fff',
                              fontWeight: 700,
                            }}
                          />
                          {prediction.advancer && gameDetails && (
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#FF8C00' }}>
                              Továbbjutó: {prediction.advancer === 'A' ? homeName : awayName}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => onRemovePrediction(prediction.matchId)}
                          sx={{ color: '#d32f2f', '&:hover': { background: '#ffebee' } }}
                        >
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