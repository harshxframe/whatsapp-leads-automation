export const historyNormalizer = (history) => {
  const newHistory = history.slice(-7).map((item) => {
    return {
      role: item.role,
      parts: [{ text: item.content }],
    };
  });
  return newHistory;
};
