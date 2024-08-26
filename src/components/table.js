import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapPin, faGlobe, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { format } from 'date-fns';
import { filterMembers } from './helpers/search.js';
import { partyColors } from './helpers/party-colors.js';
import '../styles/table.css';
import '../styles/helpers/filters.css';
import data from '../data/members.json';

const Table = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedParty, setSelectedParty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 15;

  useEffect(() => {
    try {
      const membersData = data.map(member => ({
        ...member,
        contactInfo: {
          email: member.email || '',
          phone: member.phone || '',
          postcode: member.postcode || '',
          website: member.website || '',
          twitter: member.twitter || ''
        }
      }));

      setMembers(membersData);
      setFilteredMembers(membersData);
      setLoading(false);
    } catch (error) {
      setError('Error loading JSON data');
      console.error('Error loading JSON data:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const filtered = filterMembers(members, selectedParty, searchTerm);
    setFilteredMembers(filtered);
    setCurrentPage(1);
  }, [selectedParty, searchTerm, members]);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredMembers.length / membersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleResetFilters = () => {
    setSelectedParty('All');
    setSearchTerm('');
  };

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);

  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  return (
    <div className="table-container">
      <div className="filter-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
        <select id="party-filter" value={selectedParty} onChange={(e) => setSelectedParty(e.target.value)}>
          <option value="All">Filter by party</option>
          {Object.keys(partyColors).map((party) => (
            <option key={party} value={party}>{party}</option>
          ))}
        </select>
        <button className="reset-button" onClick={handleResetFilters}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="table">
        <table>
          <tbody>
            {currentMembers.map((member) => (
              <tr key={member.id} className="member-row">
                <td className="img-cell" style={{ backgroundColor: partyColors[member['latestParty.name']] }}>
                  <div className="img-container">
                    <img className="img-member" src={member.thumbnailUrl} alt={`${member.nameDisplayAs || 'Member'}'s thumbnail`} />
                  </div>
                </td>
                <td className="details-cell">
                  <div id="member-name">{member.nameDisplayAs}</div>
                  <div id="member-party">
                    <span className="party-circle" style={{ backgroundColor: partyColors[member['latestParty.name']] }}></span>
                    {member['latestParty.name']}
                    <span className="dash">—</span>
                    {member['latestHouseMembership.membershipStartDate'] && (
                      <span id="member-start-date">{format(new Date(member['latestHouseMembership.membershipStartDate']), 'd MMMM yyyy')}</span>
                    )}
                  </div>
                  <div className="contacts">
                    {member.contactInfo.email &&
                      <div className="member-text"><a href={`mailto:${member.contactInfo.email}`}><span className="icon-wrapper"><span className="icon-container"><FontAwesomeIcon icon={faEnvelope} /></span><span className="icon-text">{member.contactInfo.email}</span></span></a></div>
                    }
                    {member.contactInfo.phone &&
                      <div className="member-text"><a href={`tel:${member.contactInfo.phone}`}><span className="icon-wrapper"><span className="icon-container"><FontAwesomeIcon icon={faPhone} /></span><span className="icon-text">{member.contactInfo.phone}</span></span></a></div>
                    }
                    {member.contactInfo.postcode &&
                      <div className="member-text"><a href={`https://maps.google.com/?q=${member.contactInfo.postcode}`} target="_blank" rel="noopener noreferrer"><span className="icon-wrapper"><span className="icon-container"><FontAwesomeIcon icon={faMapPin} /></span><span className="icon-text">{member.contactInfo.postcode}</span></span></a></div>
                    }
                    {member.contactInfo.website &&
                      <div className="member-text"><a href={member.contactInfo.website} target="_blank" rel="noopener noreferrer"><span className="icon-wrapper"><span className="icon-container"><FontAwesomeIcon icon={faGlobe} /></span><span className="icon-text">{member.contactInfo.website}</span></span></a></div>
                    }
                    {member.contactInfo.twitter &&
                      <div className="member-text"><a href={member.contactInfo.twitter} target="_blank" rel="noopener noreferrer"><span className="icon-wrapper"><span className="icon-container"><FontAwesomeIcon icon={faXTwitter} /></span><span className="icon-text">{member.contactInfo.twitter}</span></span></a></div>
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button className="page-item" disabled={currentPage === 1} onClick={handlePreviousPage}>Previous</button>
          <span className="page-info">Page {currentPage} of {totalPages}</span>
          <button className="page-item" disabled={currentPage === totalPages} onClick={handleNextPage}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Table;


