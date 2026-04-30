import { getClientStats } from "../services/dailyAnalytics.service.js";
import { responseBody } from "../utils/responseBody.js";

export const getAnalytics = async (req, res) => {
  try {
    const { clientId, startData, endDate } = req.body;

    if (!clientId || !startData || !endDate) {
      return res
        .status(400)
        .send(responseBody(400, false, false, "Payload not satisfied", {}));
    }

    const isSuccess = await getClientStats(clientId, startData, endDate);

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
