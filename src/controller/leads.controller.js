export const getLeads = async (req, res) => {
  try {
    const { clientId, page = 1, limit = 10, days } = req.body;

    if (!clientId) {
      return res
        .status(400)
        .send(responseBody(400, false, false, "clientId is required", {}));
    }

    let isSuccess;

    // If 'days' is provided, use the date range service, otherwise use pagination
    if (days) {
      isSuccess = await getLeadsByDateRange(clientId, days);
    } else {
      isSuccess = await getLeadsPaginated(clientId, page, limit);
    }

    if (isSuccess.success) {
      return res
        .status(200)
        .send(
          responseBody(200, false, true, isSuccess.message, isSuccess.data),
        );
    }

    return res
      .status(500)
      .send(responseBody(500, true, false, isSuccess.message, {}));
  } catch (e) {
    res
      .status(500)
      .send(responseBody(500, true, false, e.message || "Server Error", {}));
  }
};

export const exportLeads = async (req, res) => {
  try {
    const { clientId, days } = req.body;

    if (!clientId || !days) {
      return res
        .status(400)
        .send(responseBody(400, false, false, "clientId is required", {}));
    }

    // Fetching all leads without pagination for export purposes
    // You can also reuse getLeadsByDateRange here if they only want to export recent data
    const isSuccess = await getLeadsByDateRange(clientId, days = 90); // Default to last year

    if (isSuccess.success) {
      return res
        .status(200)
        .send(
          responseBody(
            200,
            false,
            true,
            "Leads exported successfully",
            isSuccess.data,
          ),
        );
    }

    return res
      .status(500)
      .send(responseBody(500, true, false, isSuccess.message, {}));
  } catch (e) {
    res
      .status(500)
      .send(responseBody(500, true, false, e.message || "Server Error", {}));
  }
};
