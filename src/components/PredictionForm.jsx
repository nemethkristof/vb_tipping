import { Card, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, Button, Grid, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PersonIcon from '@mui/icons-material/Person'

const PredictionForm = ({
  games, userName, setUserName, selectedMatch, setSelectedMatch,
  scoreA, setScoreA, scoreB, setScoreB, selectedGameInfo, onAddPrediction
}) => {
  return (
    <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', width: '100%', margin: '20px auto' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
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
          placeholder="pl. Peti"
          inputProps={{ maxLength: 50 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }} size="small">
          <InputLabel id="match-select-label">Meccs kiválasztása</InputLabel>
          <Select
            labelId="match-select-label"
            id="match-select"
            value={selectedMatch}
            label="Meccs kiválasztása"
            onChange={(e) => setSelectedMatch(e.target.value)}
          >
            <MenuItem value="">-- Válassz egy meccset --</MenuItem>
            {games.length === 0 ? (
              <MenuItem disabled>Nincs elérhető meccs</MenuItem>
            ) : (
              games.map((game) => (
                <MenuItem key={game.id} value={game.id}>
                  {`#${game.id} - ${game.home_team_name_en} vs ${game.away_team_name_en}`}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        {selectedGameInfo && (
          <Typography variant="caption" sx={{ display: 'block', mb: 2, color: 'secondary.main', fontStyle: 'italic', fontWeight: 600, px: 1 }}>
            📅 {selectedGameInfo}
          </Typography>
        )}

        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
          🎯 Tipped eredmény
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField label="Gólok A" type="number" fullWidth value={scoreA} onChange={(e) => setScoreA(e.target.value)} variant="outlined" size="small" inputProps={{ min: 0, max: 99 }} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Gólok B" type="number" fullWidth value={scoreB} onChange={(e) => setScoreB(e.target.value)} variant="outlined" size="small" inputProps={{ min: 0, max: 99 }} />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={onAddPrediction}
          sx={{
            background: (theme) => `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.warning.main} 100%)`,
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