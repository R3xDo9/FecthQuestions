/* eslint-disable react-hooks/exhaustive-deps */
import { useState,useEffect } from "react"

export function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
  
      setLoading(true);
  
      try {
        fetch(url, {})
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
          })
          .then((data) => setData(data))
          .catch((error) => setError(error))
          .finally(() => setLoading(false));
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }, []);
  
    // Verificar si error es un objeto y mostrar un mensaje de error apropiado
    if (error instanceof Error) {
      return { data, loading, error: error.message }; // Mostrar el mensaje de error
    }
  
    return { data, loading, error };
  }