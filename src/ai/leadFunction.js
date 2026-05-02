export const leadFunction = {
  name: "handleLead",
  parametersJsonSchema: {
    type: "object",
    properties: {
      responseToUser: { type: "string" },
      name: { type: "string", nullable: true },
      interest: { type: "string", nullable: true },
      extractedFact: { type: "string", nullable: true },
      stage: {
        type: "string",
        enum: ["NEW", "INTERESTED", "HOT", "CLOSED"],
      },
      goalReached: { type: "boolean" },
      dealHotSendEmailToClient: { type: "boolean" },
      dealClosedSendEmailToClient: { type: "boolean" },
    },
    required: ["responseToUser", "stage"],
  },
};