import db from '../../../config/db.js';
import OwnerModel from '../model/owner_model.js';
import KycModel from '../model/kyc_model.js';
import ContactModel from '../model/contact_model.js';
import DocumentModel from '../model/document_model.js';

const OwnerService = {
  async createOwner(payload) {
    let { ownerData, kycData, contactData, documentData } = payload;

    // If ownerData is not provided, assume the entire payload is ownerData
    if (!ownerData) {
      ownerData = payload;
      kycData = null;
      contactData = null;
      documentData = null;
    }

    if (!ownerData || typeof ownerData !== 'object' || Object.keys(ownerData).length === 0) {
      throw new Error('ownerData is required and must be a non-empty object');
    }

    // Validate required fields for ownerData
    const requiredFields = ['owner_type', 'full_name', 'gender', 'nationality', 'type_of_field', 'owner_id', 'password_hash'];
    for (const field of requiredFields) {
      if (!ownerData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return db.transaction(async (trx) => {
        const [newOwner] = await OwnerModel.create(ownerData, trx);

        if (kycData) {
            kycData.owner_id = newOwner.id;
            await KycModel.create(kycData, trx);
        }
        if (contactData) {
            contactData.owner_id = newOwner.id;
            await ContactModel.create(contactData, trx);
        }
        if (documentData) {
            documentData.owner_id = newOwner.id;
            await DocumentModel.create(documentData, trx);
        }
        return newOwner;
    });
    },

};


export default OwnerService;


