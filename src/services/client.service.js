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
