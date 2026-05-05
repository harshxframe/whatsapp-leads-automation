export const historyNormalizer = (history) => {
  const newHistory = history.slice(-5).map((item) => {
    return {
      role: item.role,
      parts: [{ text: item.content }],
    };
  });
  return newHistory;
};
