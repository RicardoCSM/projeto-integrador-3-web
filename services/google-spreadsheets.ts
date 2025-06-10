import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join("\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const doc1 = new GoogleSpreadsheet(
  process.env.BIMESTRE_1_GOOGLE_SHEET_ID ?? "",
  serviceAccountAuth
);
const doc2 = new GoogleSpreadsheet(
  process.env.BIMESTRE_2_GOOGLE_SHEET_ID ?? "",
  serviceAccountAuth
);
const doc3 = new GoogleSpreadsheet(
  process.env.BIMESTRE_3_GOOGLE_SHEET_ID ?? "",
  serviceAccountAuth
);
const doc4 = new GoogleSpreadsheet(
  process.env.BIMESTRE_4_GOOGLE_SHEET_ID ?? "",
  serviceAccountAuth
);

/**
 * Returns the Google Spreadsheet document for the specified bimestre.
 * @param {number} bimestre - The bimestre number (1 to 4).
 * @returns {GoogleSpreadsheet} The corresponding Google Spreadsheet document.
 */
export const getDoc = (bimestre: number): GoogleSpreadsheet => {
  switch (bimestre) {
    case 1:
      return doc1;
    case 2:
      return doc2;
    case 3:
      return doc3;
    case 4:
      return doc4;
    default:
      return doc1;
  }
};
