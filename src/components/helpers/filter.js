export const filterMembers = (members, selectedParty, searchTerm) => {
    return members.filter(member => 
      (selectedParty === 'All' || member.value.latestParty.name === selectedParty) &&
      member.value.nameDisplayAs.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  