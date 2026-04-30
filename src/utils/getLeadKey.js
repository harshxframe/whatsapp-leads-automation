export const getLeadKey = (clientId, phone) => {
  return `lead:${clientId}:${phone}`;
};