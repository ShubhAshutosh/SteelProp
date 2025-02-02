import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    C: '',
    Si: '',
    Mn: '',
    P: '',
    S: '',
    Ni: '',
    Cr: '',
    Mo: '',
    Cu: '',
    V: '',
    Al: '',
    N: '',
    Temperature: '',
    property: 'tensile_strength',
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post('https://flask-steel-five.vercel.app', formData);
      setPrediction(response.data.predicted_value);
    } catch (err) {
      setError('An error occurred: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Material Property Prediction</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map(
          (key) =>
            key !== 'property' && (
              <div key={key} className="input-group">
                <label>{key}:</label>
                <input
                  type="number"
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  placeholder={`Enter ${key}`}
                />
              </div>
            )
        )}
        <div className="input-group">
          <label>Property to Predict:</label>
          <select name="property" value={formData.property} onChange={handleInputChange}>
            <option value="tensile_strength">Tensile Strength</option>
            <option value="elongation">Elongation</option>
            <option value="reduction_in_area">Reduction in Area</option>
            <option value="proof_stress">0.2% Proof Stress</option>
            <option value="ceq">Ceq</option>
          </select>
        </div>
        <button type="submit">Predict</button>
      </form>

      {isLoading && <div className="loading-spinner">Loading...</div>}

      {prediction && (
        <div className="prediction-result">
          <h2>
            Predicted {formData.property.replace('_', ' ')}: {prediction}{' '}
            {formData.property === 'tensile_strength' || formData.property === 'proof_stress'
              ? 'MPa'
              : formData.property === 'elongation' || formData.property === 'reduction_in_area'
              ? '%'
              : ''}
          </h2>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default App;
