import {
  clientCreationService,
  getAllClients,
  getClientService,
  updateClientBlock,
  updateClientService,
} from "../services/client.service.js";
import { responseBody } from "../utils/responseBody.js";
import { isMissing } from "../utils/fieldValidation.js";

export const createClient = async (req, res) => {
  try {
    const {
      ownerName,
      email,
      businessName,
      industry,
      businessContext,
      businessDetails,
      services,
      tone,
      language,
      responseStyle,
      conversionGoal,
      numberID,
      googleSheetID,
      notifyOwner,
    } = req.body;

    if (
      isMissing(ownerName) ||
      isMissing(email) ||
      isMissing(businessName) ||
      isMissing(industry) ||
      isMissing(businessContext) ||
      isMissing(businessDetails) ||
      isMissing(services) ||
      isMissing(tone) ||
      isMissing(language) ||
      isMissing(responseStyle) ||
      isMissing(conversionGoal) ||
      isMissing(numberID) ||
      isMissing(googleSheetID) ||
      isMissing(notifyOwner) //
    ) {
      return res
        .status(400)
        .send(responseBody(400, false, false, "Payload not satisfied", {}));
    }

    //Create the account of client
    const payload = {
      email,
      businessName,
      industry,
      businessContext,
      businessDetails,
      services,
      tone,
      language,
      responseStyle,
      conversionGoal,
      numberID,
      googleSheetID,
      notifyOwner,
    };

    const isSuccess = await clientCreationService(payload);

    if (isSuccess) {
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

export const getClient = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .send(responseBody(400, false, false, "Payload not satisfied", {}));
    }
    const isSuccess = await getClientService(email);
    if (isSuccess) {
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

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ownerName,
      email,
      businessName,
      industry,
      businessContext,
      businessDetails,
      services,
      tone,
      language,
      responseStyle,
      conversionGoal,
      numberID,
      googleSheetID,
      notifyOwner,
      active,
    } = req.body;

    if (!id) {
      return res
        .status(400)
        .send(responseBody(400, false, false, "Client ID not found", {}));
    }
    if (
      isMissing(ownerName) &&
      isMissing(email) &&
      isMissing(businessName) &&
      isMissing(industry) &&
      isMissing(businessContext) &&
      isMissing(businessDetails) &&
      isMissing(services) &&
      isMissing(tone) &&
      isMissing(language) &&
      isMissing(responseStyle) &&
      isMissing(conversionGoal) &&
      isMissing(numberID) &&
      isMissing(googleSheetID) &&
      isMissing(active) &&
      isMissing(notifyOwner)
    ) {
      return res
        .status(400)
        .send(responseBody(400, false, false, "Payload not satisfied", {}));
    }
    const updateData = {};

    // 1. Simple Fields
    if (ownerName) updateData.ownerName = ownerName;
    if (email) updateData.email = email;
    if (businessName) updateData.businessName = businessName;
    if (industry) updateData.industry = industry;
    if (businessContext) updateData.businessContext = businessContext;
    if (businessDetails) updateData.businessDetails = businessDetails;
    if (services) updateData.services = services;
    if (conversionGoal) updateData.conversionGoal = conversionGoal;
    if (active !== undefined) updateData.active = active;

    // 2. AI Settings (FLATTENED KEYS - NO OBJECT OVERWRITE)
    if (tone) updateData["aiSettings.tone"] = tone;
    if (language) updateData["aiSettings.language"] = language;
    if (responseStyle) updateData["aiSettings.responseStyle"] = responseStyle;

    // 3. WhatsApp (FLATTENED KEYS)
    if (numberID) updateData["whatsapp.numberID"] = numberID;

    // 4. Automation (FLATTENED KEYS)
    if (googleSheetID) updateData["automation.googleSheetID"] = googleSheetID;
    if (notifyOwner !== undefined)
      updateData["automation.notifyOwner"] = notifyOwner;

    const isSuccess = await updateClientService(id, payload);
    if (isSuccess) {
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

export const blockClient = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .send(responseBody(400, false, false, "Client ID not found", {}));
    }
    const isSuccess = await updateClientBlock(id);
    if (isSuccess) {
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

export const getClients = async (req, res) => {
  try {
    // Query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Optional filters
    const filter = {};

    if (req.query.active !== undefined) {
      filter.active = req.query.active === "true";
    }

    if (req.query.industry) {
      filter.industry = req.query.industry;
    }

    if (req.query.search) {
      filter.businessName = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    // Service call
    const result = await getAllClients({ page, limit, filter });

    // Success
    if (result.success) {
      return res
        .status(200)
        .send(
          responseBody(200, false, true, result.message, result.data)
        );
    }

    // Service failure
    return res
      .status(400)
      .send(
        responseBody(400, true, false, result.message, {})
      );

  } catch (e) {
    return res
      .status(500)
      .send(
        responseBody(500, true, false, e.message || "Server Error", {})
      );
  }
};


