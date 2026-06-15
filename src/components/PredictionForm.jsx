import {
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PersonIcon from '@mui/icons-material/Person'

const PredictionForm = ({
  games,
  userName,
  setUserName,
  selectedMatch,
  setSelectedMatch,
  scoreA,
  setScoreA,
  scoreB,
  setScoreB,
  advancer,
  setAdvancer,
  selectedGameInfo,
  onAddPrediction,
  getGameDetails,
}) => {

  const upcomingGames = games.filter((game) => {
    const isFinished = game.finished === true || String(game.finished).toUpperCase() === 'TRUE'
    return !isFinished
  }).sort((a, b) => a.id - b.id)

  const isKnockout = selectedMatch && parseInt(selectedMatch) > 72
  const selectedGameDetails = selectedMatch ? getGameDetails(parseInt(selectedMatch)) : null

  return (
    <Card
      sx={{
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        margin: '20px auto',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1E3932', display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon /> Új Tipp
        </Typography>

        <TextField
          label="Játékos neve"
          fullWidth
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          sx={{ mb: 2 }}
          variant="outlined"
          size="small"
          placeholder="pl. Sanyi"
        />

        <FormControl fullWidth sx={{ mb: 2 }} size="small">
          <Select
            native
            labelId="match-select-label"
            id="match-select"
            value={selectedMatch}
            label="Meccs kiválasztása"
            onChange={(e) => {
              setSelectedMatch(e.target.value)
              setAdvancer('')
            }}
          >
            <option value="">
              -- Válassz egy meccset --
            </option>
            
            {upcomingGames.length === 0 ? (
              <option disabled value="none">Nincs elérhető, nyitott meccs</option>
            ) : (
              upcomingGames.map((game) => {
                const homeName = game.home_team_name_en || game.home_team_label || 'Ismeretlen'
                const awayName = game.away_team_name_en || game.away_team_label || 'Ismeretlen'
                return (
                  <option key={game.id} value={game.id}>
                    {`#${game.id} - ${homeName} vs ${awayName}`}
                  </option>
                )
              })
            )}
          </Select>
        </FormControl>

        {selectedGameInfo && (
          <Typography
            variant="caption"
            sx={{ display: 'block', mb: 2, color: '#2E8B57', fontStyle: 'italic', fontWeight: 600, px: 1 }}
          >
            📅 {selectedGameInfo}
          </Typography>
        )}

        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1E3932', mb: 1 }}>
          🎯 Tipped eredmény
        </Typography>

        {/* Grid kicserélve Box-ra a DOM hiba megelőzése érdekében */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Gólok A"
            type="number"
            fullWidth
            value={scoreA}
            onChange={(e) => setScoreA(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            label="Gólok B"
            type="number"
            fullWidth
            value={scoreB}
            onChange={(e) => setScoreB(e.target.value)}
            variant="outlined"
            size="small"
          />
        </Box>

        {isKnockout && selectedGameDetails && (
          <FormControl fullWidth sx={{ mb: 3 }} size="small">
            <InputLabel id="advancer-select-label">Továbbjutó (Knockout Bónusz)</InputLabel>
            <Select
              labelId="advancer-select-label"
              id="advancer-select"
              value={advancer}
              label="Továbbjutó (Knockout Bónusz)"
              onChange={(e) => setAdvancer(e.target.value)}
            >
              <MenuItem value="A">{selectedGameDetails.home_team_name_en || selectedGameDetails.home_team_label} (Hazai - A)</MenuItem>
              <MenuItem value="B">{selectedGameDetails.away_team_name_en || selectedGameDetails.away_team_label} (Vendég - B)</MenuItem>
            </Select>
          </FormControl>
        )}

        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={onAddPrediction}
          sx={{
            background: 'linear-gradient(135deg, #1E3932 0%, #2E8B57 100%)',
            color: '#fff',
            fontWeight: 700,
            padding: '12px',
            fontSize: '1rem',
            '&:hover': { opacity: 0.9 },
            '&:active': { transform: 'scale(0.98)' },
          }}
        >
          Tipp Hozzáadása
        </Button>
      </CardContent>
    </Card>
  )
}

export default PredictionForm