import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
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
  CircularProgress,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DownloadIcon from '@mui/icons-material/Download'
import AddIcon from '@mui/icons-material/Add'

const Tipping = () => {
  const [games, setGames] = useState([])
  const [predictions, setPredictions] = useState([])
  const [userName, setUserName] = useState('')
  const [selectedMatch, setSelectedMatch] = useState('')
  const [scoreA, setScoreA] = useState('')
  const [scoreB, setScoreB] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [existingTips, setExistingTips] = useState([])
  const [loading, setLoading] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Meccsek lekérése
        const gamesResponse = await fetch('https://worldcup26.ir/get/games')
        const gamesData = await gamesResponse.json()
        setGames(gamesData.games)

        // Meglévő tippek lekérése
        const tipsResponse = await fetch('/tipps.json')
        const tipsData = await tipsResponse.json()
        setExistingTips(tipsData.predictions)

        setLoading(false)
      } catch (err) {
        console.error('Hiba az adatok lekérésekor:', err)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddPrediction = () => {
    if (!userName || !selectedMatch || scoreA === '' || scoreB === '') {
      alert('Kérlek, töltsd ki az összes mezőt!')
      return
    }

    const newPrediction = {
      user: userName,
      matchId: parseInt(selectedMatch),
      scoreA: parseInt(scoreA),
      scoreB: parseInt(scoreB),
    }

    setPredictions([...predictions, newPrediction])
    setSelectedMatch('')
    setScoreA('')
    setScoreB('')
  }

  const handleRemovePrediction = (index) => {
    const newPredictions = predictions.filter((_, i) => i !== index)
    setPredictions(newPredictions)
  }

  const handleDownload = () => {
    const allPredictions = [...existingTips, ...predictions]
    const json = JSON.stringify({ predictions: allPredictions }, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tipps_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyToClipboard = () => {
    const allPredictions = [...existingTips, ...predictions]
    const json = JSON.stringify({ predictions: allPredictions }, null, 2)
    navigator.clipboard.writeText(json).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  const getGameInfo = (matchId) => {
    const game = games.find((g) => parseInt(g.id) === matchId)
    if (game) {
      return `${game.home_team_name_en} vs ${game.away_team_name_en} (${game.local_date})`
    }
    return `Meccs #${matchId}`
  }

  const selectedGameInfo = selectedMatch ? getGameInfo(parseInt(selectedMatch)) : ''

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#2E8B57' }} />
      </Container>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: isMobile ? '2rem' : '3rem',
              fontWeight: 800,
              color: '#1E3932',
              mb: 2,
            }}
          >
            <AddIcon sx={{ fontSize: '2.5em', marginRight: '15px', verticalAlign: 'middle' }} />
            Tippek Megadása
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', fontSize: '1.1rem' }}>
            Tippelj az előttünk álló meccseire!
          </Typography>
        </Box>

        {copySuccess && <Alert severity="success" sx={{ mb: 2 }}>Másolva a vágólapra!</Alert>}

        <Grid container spacing={3}>
          {/* Tipp megadása */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1E3932' }}>
                  Új Tipp
                </Typography>

                <TextField
                  label="Játékos neve"
                  fullWidth
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  sx={{ mb: 2 }}
                  variant="outlined"
                  size="small"
                />

                <TextField
                  label="Meccs kiválasztása"
                  select
                  fullWidth
                  value={selectedMatch}
                  onChange={(e) => setSelectedMatch(e.target.value)}
                  SelectProps={{ native: true }}
                  sx={{ mb: 2 }}
                  variant="outlined"
                  size="small"
                >
                  <option value="">-- Válassz egy meccset --</option>
                  {games.slice(0, 10).map((game) => (
                    <option key={game.id} value={game.id}>
                      {`#${game.id} - ${game.home_team_name_en} vs ${game.away_team_name_en}`}
                    </option>
                  ))}
                </TextField>

                {selectedGameInfo && (
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', mb: 2, color: '#666', fontStyle: 'italic' }}
                  >
                    📅 {selectedGameInfo}
                  </Typography>
                )}

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      label="Gólok A"
                      type="number"
                      fullWidth
                      value={scoreA}
                      onChange={(e) => setScoreA(e.target.value)}
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Gólok B"
                      type="number"
                      fullWidth
                      value={scoreB}
                      onChange={(e) => setScoreB(e.target.value)}
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleAddPrediction}
                  sx={{
                    background: 'linear-gradient(135deg, #1E3932 0%, #2E8B57 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    padding: '12px',
                    fontSize: '1rem',
                    '&:hover': {
                      opacity: 0.9,
                    },
                  }}
                >
                  Tipp Hozzáadása
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Letöltés / Másolás */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1E3932' }}>
                  Tippek Kezelése
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    fullWidth
                    onClick={handleDownload}
                    sx={{
                      background: '#2E8B57',
                      color: '#fff',
                      fontWeight: 700,
                      padding: '12px',
                      fontSize: '1rem',
                    }}
                  >
                    JSON Letöltése
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<ContentCopyIcon />}
                    fullWidth
                    onClick={handleCopyToClipboard}
                    sx={{
                      borderColor: '#2E8B57',
                      color: '#2E8B57',
                      fontWeight: 700,
                      padding: '12px',
                      fontSize: '1rem',
                    }}
                  >
                    Másolás vágólapra
                  </Button>

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="caption">
                      💡 <strong>Tipp:</strong> Letöltsd a JSON-t, majd küldd el nekem, és
                      hozzáadom a tipps.json fájlhoz!
                    </Typography>
                  </Alert>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Az adott tippek listája */}
        {predictions.length > 0 && (
          <Card
            sx={{
              mt: 4,
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1E3932' }}>
                Hozzáadott Tippek ({predictions.length})
              </Typography>

              {isMobile ? (
                // Mobile view
                <Grid container spacing={2}>
                  {predictions.map((prediction, index) => (
                    <Grid item xs={12} key={index}>
                      <Card
                        sx={{
                          background: '#f5f5f5',
                          borderLeft: '4px solid #2E8B57',
                        }}
                      >
                        <CardContent
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            pb: 1,
                            '&:last-child': { pb: 1 },
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                              {prediction.user}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666' }}>
                              Meccs #{prediction.matchId}
                            </Typography>
                            <Chip
                              label={`${prediction.scoreA} - ${prediction.scoreB}`}
                              sx={{
                                ml: 1,
                                background: '#2E8B57',
                                color: '#fff',
                                fontWeight: 700,
                              }}
                            />
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleRemovePrediction(index)}
                            sx={{ color: '#d32f2f' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                // Desktop view
                <TableContainer component={Paper} sx={{ background: 'transparent' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 700 }}>Játékos</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Meccs</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Tipett Eredmény</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }}>
                          Törlés
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {predictions.map((prediction, index) => (
                        <TableRow key={index} sx={{ '&:hover': { background: '#f5f5f5' } }}>
                          <TableCell sx={{ fontWeight: 600 }}>{prediction.user}</TableCell>
                          <TableCell>#{prediction.matchId}</TableCell>
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
                              onClick={() => handleRemovePrediction(index)}
                              sx={{ color: '#d32f2f' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="body2">
            ℹ️ <strong>Megjegyzés:</strong> Az itt megadott tippeket a JSON-ben találod. Letöltsd vagy másold le, és
            küldd el az alkalmazás rendszergazdájának. Az összes tipp automatikusan összeadódik a tipps.json
            fájlban!
          </Typography>
        </Alert>
      </Container>
    </Box>
  )
}

export default Tipping
