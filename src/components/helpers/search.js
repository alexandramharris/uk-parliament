export const filterMembers = (members, selectedParty, searchTerm) => {
  return members.filter(member => {
    const matchesParty = selectedParty === 'All' || (member['latestParty.name'] && member['latestParty.name'] === selectedParty);
    const matchesSearchTerm = member.nameDisplayAs && member.nameDisplayAs.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesParty && matchesSearchTerm;
  });
};
