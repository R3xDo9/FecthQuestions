import { useFetch } from './useFetch';
import './App.css';
import { useState, useEffect } from 'react';

const initialAreaCounts = {
  "Arte y Creatividad": 0,
  "Ciencias Sociales": 0,
  "Economía, Administración y Finanzas": 0,
  "Ciencia y Tecnologia": 0,
  "Ciencias de la Salud": 0,
  "Ciencias Ecológicas y Ambientales": 0
};

const App = () => {
  const { data, loading, error } = useFetch('http://localhost:3000/questions');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [areaCounts, setAreaCounts] = useState(initialAreaCounts);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

  useEffect(() => {
    const allAnswered = data?.every((question) => selectedAnswers[question.id] !== undefined);
    setAllQuestionsAnswered(allAnswered);
  }, [data, selectedAnswers]);

  const handleRadioChange = (questionId, answer, area) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));

    setAreaCounts((prevCounts) => ({
      ...prevCounts,
      [area]: answer ? prevCounts[area] + 1 : Math.max(prevCounts[area] - 1, 0),
    }));
  };

  const handleSaveAnswers = () => {
    if (allQuestionsAnswered) {
      console.log('Respuestas subidas con éxito.');
      // Realizar la solicitud POST al servidor
      fetch('http://localhost:3000/respuestas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(areaCounts),
      })
        .then((response) => response.json())
        .then((data) => {
          // Aquí puedes manejar la respuesta del servidor si es necesario
          console.log('Respuesta del servidor:', data);
        })
        .catch((error) => {
          console.error('Error al enviar respuestas:', error);
        });
    } else {
      alert('Aún falta responder preguntas.');
    }
  };

  const responseAll = () => {
    data?.forEach((question) => {
      handleRadioChange(question.id, true, 'Arte y Creatividad');
    });
  };

  return (
    <>
      <h1>Test vocacional</h1>
      <div className='questions'>
        <button onClick={responseAll}>Responder todo</button>
        {error && <div className="error"><h2>X..Error:{error}..X</h2></div>}
        {loading && <div className="question-header"><h2>Loading...</h2></div>}
        {data?.map((question) => (
          <div
            className={`question-header ${
              selectedAnswers[question.id] === true
                ? 'green-background'
                : selectedAnswers[question.id] === false
                ? 'red-background'
                : ''
            }`}
            key={question.id}
          >
            <div className='p-header'>
              <p><b>{question.id}. </b>{question.question}</p>
            </div>
            <form className='answers'>
              <div className='radiobutton'>
                <input
                  type="radio"
                  id={`yes-${question.id}`}
                  name={`yesno-${question.id}`}
                  value={true}
                  onChange={() => handleRadioChange(question.id, true, question.area)}
                />
                <label htmlFor={`yes-${question.id}`}>SI</label>
              </div>
              <div className='radiobutton'>
                <input
                  type="radio"
                  id={`no-${question.id}`}
                  name={`yesno-${question.id}`}
                  value={false}
                  onChange={() => handleRadioChange(question.id, false, question.area)}
                />
                <label htmlFor={`no-${question.id}`}>NO</label>
              </div>
            </form>
          </div>
        ))}
        <button onClick={handleSaveAnswers} disabled={!allQuestionsAnswered}>
          Subir Respuestas
        </button>
        <div>
          {Object.entries(areaCounts).map(([area, count]) => (
            <p key={area}>
              {area}: {count}
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
