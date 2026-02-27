import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import { generateUIDNumber } from "../../utils/generate-UID.js";

export const storeStageOneData = async (req, res) => {
  try {
    const {
      MACAddress,
      GPONSN,
      SerialNumber,
      location,
      invoiceNumber,
      modelNumber,
    } = req.body;

    //  Basic validation
    if (!MACAddress || !GPONSN || !SerialNumber) {
      return res.status(400).json({
        success: false,
        message: "MACAddress, GPONSN and SerialNumber are required",
      });
    }

    const dbDir = path.join(process.cwd(), "database");
    const filePath = path.join(dbDir, "demo.xlsx");

    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    let worksheet;

    if (fs.existsSync(filePath)) {
      await workbook.xlsx.readFile(filePath);
      worksheet = workbook.getWorksheet("Devices");
    }

    if (!worksheet) {
      worksheet = workbook.addWorksheet("Devices");
    }

    worksheet.columns = [
      { header: "MAC Address", key: "MACAddress", width: 20 },
      { header: "GPON SN", key: "GPONSN", width: 20 },
      { header: "Serial Number", key: "SerialNumber", width: 20 },
      { header: "Location", key: "location", width: 20 },
      { header: "Invoice Number", key: "invoiceNumber", width: 20 },
      { header: "Model Number", key: "modelNumber", width: 20 },
      { header: "Entry Date", key: "entryDate", width: 25 },
      { header: "History", key: "history", width: 15 },
      {
        header: "UIDNumber",
        key: "UIDNumber",
        width: 20,
        style: { numFmt: "@" },
      },
    ];

    if (worksheet.rowCount === 0) {
      worksheet.getRow(1).font = { bold: true };
    }

    let existingRow = null;
    let lastUID = null;

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const existingSerial = row.getCell("SerialNumber").value;

        if (existingSerial === SerialNumber) {
          existingRow = row;
        }

        const uidValue = row.getCell("UIDNumber").value;
        if (uidValue) {
          const uidNum =
            typeof uidValue === "string" ? parseInt(uidValue) : uidValue;
          if (!lastUID || uidNum > lastUID) {
            lastUID = uidNum;
          }
        }
      }
    });

    let historyValue;
    let isUpdate = false;
    let generatedUID = null; 

    //  UPDATE EXISTING DEVICE
    if (existingRow) {
      isUpdate = true;

      generatedUID = existingRow.getCell("UIDNumber").value;

      const currentHistory = existingRow.getCell("history").value || "R0";
      const currentNumber = parseInt(currentHistory.replace("R", ""));
      historyValue = `R${currentNumber + 1}`;

      existingRow.getCell("MACAddress").value = MACAddress;
      existingRow.getCell("GPONSN").value = GPONSN;
      existingRow.getCell("location").value = location;
      existingRow.getCell("invoiceNumber").value = invoiceNumber;
      existingRow.getCell("modelNumber").value = modelNumber;
      existingRow.getCell("entryDate").value = new Date().toISOString();
      existingRow.getCell("history").value = historyValue;

      existingRow.commit();
    }
    // CREATE NEW DEVICE
    else {
      generatedUID = generateUIDNumber(lastUID);
      historyValue = "R0";

      worksheet.addRow({
        MACAddress,
        GPONSN,
        SerialNumber,
        location,
        invoiceNumber,
        modelNumber,
        UIDNumber: generatedUID,
        entryDate: new Date().toISOString(),
        history: historyValue,
      });
    }

    await workbook.xlsx.writeFile(filePath);

    //  RETURN UID TO FRONTEND
    return res.status(isUpdate ? 200 : 201).json({
      success: true,
      message: isUpdate
        ? "Device data updated successfully"
        : "Device data stored successfully",
      history: historyValue,
      action: isUpdate ? "updated" : "created",
      UIDNumber: generatedUID, 
    });
  } catch (error) {
    console.error(" Excel Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
