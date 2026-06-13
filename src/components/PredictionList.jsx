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
  useTheme,
  useMediaQuery,
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
        width: '100%',
        margin: '20px auto',
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1E3932', display: 'flex', alignItems: 'center', gap: 1 }}>
          <ListIcon /> Hozzáadott Tippek ({predictions.length})
        </Typography>

        {isMobile ? (
          // Mobile view
          <Grid container spacing={2}>
            {predictions.map((prediction, index) => {
              const gameDetails = getGameDetails(prediction.matchId)
              const gameDisplay = gameDetails 
                ? `${gameDetails.home_team_name_en} vs ${gameDetails.away_team_name_en}`
                : `Meccs #${prediction.matchId}`
              
              return (
                <Grid item xs={12} key={index}>
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
                          onClick={() => onRemovePrediction(index)}
                          sx={{ color: '#d32f2f' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Chip
                        label={`${prediction.scoreA} - ${prediction.scoreB}`}
                        sx={{
                          background: '#2E8B57',
                          color: '#fff',
                          fontWeight: 700,
                          alignSelf: 'flex-start',
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        ) : (
          // Desktop view
          <TableContainer component={Paper} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(135deg, #1E3932 0%, #2E8B57 100%)' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#fff' }}>👤 Játékos</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#fff' }}>⚽ Meccs</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#fff' }}>🎯 Tipett Eredmény</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#fff' }}>
                    ❌ Törlés
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {predictions.map((prediction, index) => {
                  const gameDetails = getGameDetails(prediction.matchId)
                  const gameDisplay = gameDetails 
                    ? `${gameDetails.home_team_name_en} vs ${gameDetails.away_team_name_en}`
                    : `Meccs #${prediction.matchId}`
                  
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        background: index % 2 === 0 ? '#f5f5f5' : '#fff',
                        '&:hover': { background: '#e8f5e9' },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600 }}>{prediction.user}</TableCell>
                      <TableCell sx={{ fontWeight: 500, color: '#2E8B57' }}>{gameDisplay}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${prediction.scoreA} - ${prediction.scoreB}`}
                          sx={{
                            background: '#2E8B57',
                            color: '#fff',
                            fontWeight: 700,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => onRemovePrediction(index)}
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
