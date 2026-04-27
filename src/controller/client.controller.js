import { clientCreationService, getClientService } from "../services/client.service.js";
import { responseBody } from "../utils/responseBody.js";

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
            accessToken,
            verifyToken,
            googleSheetID,
            notifyOwner
        } = req.body;


        if (!ownerName
            || !email
            || !businessName
            || !industry
            || !businessContext
            || !businessDetails
            || !services
            || !tone
            || !language
            || !responseStyle
            || !conversionGoal
            || !numberID
            || !accessToken
            || !verifyToken
            || !googleSheetID
            || !notifyOwner.toString()
        ) {
            return res.status(400).send(responseBody(400, false, false, "Payload not satisfied", {}));
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
            accessToken,
            verifyToken,
            googleSheetID,
            notifyOwner
        };

        const isSuccess = await clientCreationService(payload);

        if (isSuccess) {
            return res.status(200).send(responseBody(200, false, true, isSuccess.message, isSuccess.data));

        }
        return res.status(500).send(responseBody(500, true, false, "Payload not satisfied", {}));

    } catch (e) {
        res.status(500).send(responseBody(500, true, false, e.message || "Server Error", {}));
    }
}

export const getClient = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send(responseBody(400, false, false, "Payload not satisfied", {}));
        }
        const isSuccess = await getClientService(email);
        if (isSuccess) {
            return res.status(200).send(responseBody(200, false, true, isSuccess.message, isSuccess.data));
        }
        return res.status(500).send(responseBody(500, true, false, "Payload not satisfied", {}));
    } catch (e) {
        res.status(500).send(responseBody(500, true, false, e.message || "Server Error", {}));
    }
}

export const updateClient = async (req, res) => {
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
            accessToken,
            verifyToken,
            googleSheetID,
            notifyOwner //Optional
        } = req.body;


        if (!ownerName
            && !email
            && !businessName
            && !industry
            && !businessContext
            && !businessDetails
            && !services
            && !tone
            && !language
            && !responseStyle
            && !conversionGoal
            && !numberID
            && !accessToken
            && !verifyToken
            && !googleSheetID) {
            return res.status(400).send(responseBody(400, false, false, "Payload not satisfied", {}));
        }





        



    } catch (e) {
        res.status(500).send(responseBody(500, true, false, e.message || "Server Error", {}));
    }
}