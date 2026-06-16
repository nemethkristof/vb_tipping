import { useQuery } from '@tanstack/react-query'

const fetchGames = async () => {
  try {
    const response = await fetch('https://worldcup26.ir/get/games')
    if (!response.ok) throw new Error('Hálózati hiba történt')
    
    const data = await response.json()
    const games = data.games || data
    
    // Sikeres lekérés esetén elmentjük egy biztonsági másolatba
    localStorage.setItem('vb2026_games_backup', JSON.stringify(games))
    
    return games
  } catch (error) {
    console.warn('API hiba, próbálkozás a helyi másolatból...', error)
    // Ha baj van a szerverrel, megnézzük, van-e korábbi mentésünk
    const backup = localStorage.getItem('vb2026_games_backup')
    if (backup) {
      return JSON.parse(backup)
    }
    // Ha nincs mentésünk sem, akkor eldobjuk a hibát
    throw error
  }
}

export const useGames = () => {
  return useQuery({
    queryKey: ['games'], // Ezzel az azonosítóval fogja a Query felismerni a cache-ben
    queryFn: fetchGames,
  })
}