import { useState, useEffect, useCallback } from 'react'
import { API_URL, API_KEY } from '../../config'

export const useMovieFetch = (movieId) => {
  const [state, setState] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchData = useCallback(async () => {
    setError(false)
    setLoading(true)
    try {
      const endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}`
      const result = await (await fetch(endpoint)).json()
      console.log(result)
      const creditsEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`
      const credistResult = await (await fetch(creditsEndpoint)).json()
      //   console.log(credistResult)

      const directors = credistResult.crew.filter(
        (member) => member.job === 'Director'
      )

      setState({
        ...result,
        actors: credistResult.cast,
        directors,
      })
    } catch (error) {
      setError(error)
    }
    setLoading(false)
  })

  useEffect(() => {
    if (localStorage[movieId]) {
      setState(JSON.parse(localStorage[movieId]))
      setLoading(false)
    } else {
      fetchData()
    }
  }, [fetchData, movieId])

  useEffect(() => {
    localStorage.setItem(movieId, JSON.stringify(state))
  }, [movieId, state])

  return [state, loading, error]
}
