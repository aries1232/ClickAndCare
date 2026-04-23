export const formatAddress = (address) => {
  if (!address) return 'Not provided';
  if (typeof address === 'string') return address;
  if (typeof address === 'object') {
    const parts = [];
    if (address.line1) parts.push(address.line1);
    if (address.line2) parts.push(address.line2);
    if (address.address) parts.push(address.address);
    return parts.length > 0 ? parts.join(', ') : 'Not provided';
  }
  return 'Not provided';
};

export const parseAddress = (address) => {
  if (!address) return { line1: '', line2: '' };
  if (typeof address === 'string') {
    try {
      const parsed = JSON.parse(address);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch {
      return { line1: address, line2: '' };
    }
  }
  return address;
};
