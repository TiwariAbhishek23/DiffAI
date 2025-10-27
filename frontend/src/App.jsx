import { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState(new Date('2022-04-01'));
  const [endDate, setEndDate] = useState(new Date('2022-04-30'));
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a .pst or .ost file');
      return;
    }

    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/read_pst_ost', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const allMessages = response.data.messages_preview;
      const filteredMessages = allMessages.filter(msg => {
        const msgDate = new Date(msg.date);
        return msgDate >= startDate && msgDate <= endDate;
      });
      setResults(filteredMessages);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>📧 Email Search App</h1>
        <p>Search emails in .PST/.OST files by date range</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>📁 Select .PST or .OST File</label>
          <input
            type="file"
            accept=".pst,.ost"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file && <p style={{fontSize: '0.875rem', color: '#64748b'}}>Selected: {file.name}</p>}
        </div>

        <div className="form-group date-pickers">
          <div>
            <label>📅 Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              dateFormat="MMMM d, yyyy"
              className="form-control"
            />
          </div>
          <div>
            <label>📅 End Date</label>
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              dateFormat="MMMM d, yyyy"
              className="form-control"
            />
          </div>
        </div>

        <button type="submit" disabled={loading || !file}>
          {loading ? 'Searching...' : '🔍 Search Emails'}
        </button>
      </form>

      {error && <div className="error">❌ {error}</div>}

      {results.length > 0 && (
        <div className="results">
          <div className="results-header">
            <h3>📊 Results ({results.length} emails found)</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Sender</th>
                <th>Subject</th>
              </tr>
            </thead>
            <tbody>
              {results.map((email, index) => (
                <tr key={index}>
                  <td>{email.date}</td>
                  <td>{email.sender}</td>
                  <td>{email.subject}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;