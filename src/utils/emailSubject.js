/**
 * Clean Subject for Hot Leads
 * Focus: Project Type + Urgency
 */
export const getLeadSubjectOnHot = (interest) => {
  const interestSnippet = (interest && interest.trim().length > 5)
    ? interest.trim().split(/\s+/).slice(0, 4).join(" ") + (interest.trim().split(/\s+/).length > 4 ? "..." : "")
    : "New Opportunity";

  return `🔥 High-Intent Lead: ${interestSnippet}`;
};

/**
 * Clean Subject for Closed Deals
 * Focus: Success + Project Type
 */
export const getClosedLeadSubject = (interest) => {
  const interestSnippet = (interest && interest.trim().length > 5)
    ? interest.trim().split(/\s+/).slice(0, 4).join(" ") + (interest.trim().split(/\s+/).length > 4 ? "..." : "")
    : "Project Finalized";

  return `✅ Deal Secured: ${interestSnippet}`;
};