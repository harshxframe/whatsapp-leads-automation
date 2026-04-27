import Clients from "../models/Clients.js";
import { serviceResponse } from "../utils/serviceResponseBody.js";


export const clientCreationService = async (payload) => {
    try {
        const isUserExist = await Clients.findOne({ email: payload.email });
        if (isUserExist) {
            return serviceResponse(false, "Client already exist", {});
        }
        const saveClient = await Clients.create({
            ownerName: payload.ownerName,
            email: payload.email,
            businessName: payload.businessName,
            industry: payload.industry,
            businessContext: payload.businessContext,
            businessDetails: payload.businessDetails,
            services: payload.services,

            aiSettings: {
                tone: payload.tone,
                language: payload.language,
                responseStyle: payload.responseStyle
            },

            conversionGoal: payload.conversionGoal,

            whatsapp: {
                numberID: payload.numberID,
                accessToken: payload.accessToken,
                verifyToken: payload.verifyToken
            },

            automation: {
                googleSheetID: payload.googleSheetID,
                notifyOwner: payload.notifyOwner
            }
        });
        if (!saveClient) {
            return serviceResponse(false, "Client creation failed", {});
        }
        return serviceResponse(true, "Client creation successfully", saveClient);
    } catch (e) {
        return serviceResponse(false, e.message || "DB ERROR", {});
    }
}


export const getClientService = async (email) => {
    try {
        const client = await Clients.findOne({ email: email });
        if (!client) {
            return serviceResponse(false, "Client not found", {});
        }
        return serviceResponse(true, "Client found", client);
    } catch (e) {
        return serviceResponse(false, e.message || "DB ERROR", {});
    }
}

export const updateClientService = async (id, payload) => {
    try {
        const isClientUpdated = await Clients.findByIdAndUpdate({ id }, { $set: payload }, { new: true, runValidators: true });
        if (!isClientUpdated) {
            return serviceResponse(false, "Client failed to upload", {});
        }
        return serviceResponse(true, "Client updated successfully", isClientUpdated);
    } catch (e) {
        return serviceResponse(false, e.message || "DB ERROR", {});
    }
}

export const incrementClientLead = async (id) => {
    try {
        if (!id) {
            return serviceResponse(false, "Id not found", {});
        }
        const incremented = await Clients.findByIdAndUpdate(id, { $inc: { "analytics.leadsGenerated": 1 } }, { new: true, runValidators: true });
        if (!incremented) {
            return serviceResponse(false, "Failed to increment", {});
        }
        return serviceResponse(true, "Increment successfull", incremented);
    } catch (e) {
        return serviceResponse(false, e.message || "DB ERROR", {});
    }
}

export const incrementClientMessage = async (id) => {
    try {
        if (!id) {
            return serviceResponse(false, "Id not found", {});
        }
        const incremented = await Clients.findByIdAndUpdate(id, { $inc: { "analytics.totalMessages": 1 } }, { new: true, runValidators: true });
        if (!incremented) {
            return serviceResponse(false, "Failed to increment", {});
        }
        return serviceResponse(true, "Increment successfull", incremented);
    } catch (e) {
        return serviceResponse(false, e.message || "DB ERROR", {});
    }
}

export const incrementClientConversation = async (id) => {
    try {
        if (!id) {
            return serviceResponse(false, "Id not found", {});
        }
        const incremented = await Clients.findByIdAndUpdate(id, { $inc: { "analytics.conversions": 1 } }, { new: true, runValidators: true });
        if (!incremented) {
            return serviceResponse(false, "Failed to increment", {});
        }
        return serviceResponse(true, "Increment successfull", incremented);
    } catch (e) {
        return serviceResponse(false, e.message || "DB ERROR", {});
    }
}

export const updateClientBlock = async (id) => {
    try {
        const updateStatus = await Clients.findByIdAndUpdate(id, [{ $set: { adminAllowed: { $not: "$adminAllowed" } } }]);
        if (!updateStatus) {
            return serviceResponse(false, "Failed to update", {});
        }
        return serviceResponse(true, "Update successfull", updateStatus);
    } catch (e) {
        return serviceResponse(false, e.message || "DB ERROR", {});
    }
}