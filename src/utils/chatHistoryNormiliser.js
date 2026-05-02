export const historyNormalizer = (history) => {
  const newHistory = history.map((item) => {
    return {
      role: item.role,
      parts: [{ text: item.content }],
    };
  });
  return newHistory;
};
