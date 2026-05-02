export const handleLeadActions = async (data) => {
  try {
    if (data.name) {
      console.log("Update Name:", data.name);
    }

    if (data.interest) {
      console.log("Update Interest:", data.interest);
    }

    if (data.extractedFact) {
      console.log("Save Extracted Data:", data.extractedFact);
    }

    if (data.stage) {
      console.log("Update Stage:", data.stage);
    }

    if (data.goalReached) {
      console.log("Goal Reached");
    }

    if (data.dealHotSendEmailToClient) {
      console.log("Send HOT email");
    }

    if (data.dealClosedSendEmailToClient) {
      console.log("Send CLOSED email");
    }

    return true;
  } catch (e) {
    console.error("Service Error:", e.message);
    return false;
  }
};