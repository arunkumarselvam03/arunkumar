import React, { useEffect, useState } from 'react';

const App = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch Users
  useEffect(() => {
    fetch('https://randomuser.me/api/?results=50')
      .then(res => res.json())
      .then(data => {
        const users = data.results;
        setUsers(users);
        setFilteredUsers(users);
        const uniqueCountries = [...new Set(users.map(user => user.location.country))];
        setCountries(uniqueCountries);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch users.');
        setLoading(false);
      });
  }, []);

  // Filter users by name and country
  useEffect(() => {
    const filtered = users.filter(user => {
      const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
      const matchesName = fullName.includes(search.toLowerCase());
      const matchesCountry = selectedCountry ? user.location.country === selectedCountry : true;
      return matchesName && matchesCountry;
    });
    setFilteredUsers(filtered);
  }, [search, selectedCountry, users]);

  if (loading) return <div className="spinner">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>User Directory</h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by full name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px', flex: '1 1 200px' }}
        />
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          style={{ padding: '10px', flex: '1 1 200px' }}
        >
          <option value="">All Countries</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>{country}</option>
          ))}
        </select>
      </div>

      {/* Grid Display */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}
      >
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              background: '#fff'
            }}
          >
            <img
              src={user.picture.large}
              alt={user.name.first}
              style={{ borderRadius: '50%', width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <h3>{user.name.first} {user.name.last}</h3>
            <p>{user.email}</p>
            <p><strong>{user.location.country}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
