import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";

export const storeStageTwoData = async (req, res) => {
  try {
    const {
      UIDNumber,
      Defect_symptom,
      repair_contents_01,
      repair_contents_02,
      repair_contents_03,
      repair_contents_04,
      repair_contents_05,
    } = req.body;

    if (!UIDNumber) {
      return res
        .status(400)
        .json({ success: false, message: "UIDNumber is required" });
    }

    const dbDir = path.join(process.cwd(), "database");
    const filePath = path.join(dbDir, "demo.xlsx");

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ success: false, message: "Database file not found." });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet("Devices");

    if (!worksheet) {
      return res
        .status(404)
        .json({ success: false, message: "Devices worksheet not found" });
    }

    // FIX: Ensure these keys EXACTLY match the keys used in foundRow.getCell()
    const requiredColumns = [
      { header: "MAC Address", key: "MACAddress", width: 20 },
      { header: "GPON SN", key: "GPONSN", width: 20 },
      { header: "Serial Number", key: "SerialNumber", width: 20 },
      { header: "Location", key: "location", width: 20 },
      { header: "Invoice Number", key: "invoiceNumber", width: 20 },
      { header: "Model Number", key: "modelNumber", width: 20 },
      { header: "Entry Date", key: "entryDate", width: 20 },
      { header: "History", key: "history", width: 15 },
      {
        header: "UIDNumber",
        key: "UIDNumber",
        width: 15,
        style: { numFmt: "@" },
      },
      { header: "RW Record", key: "RW_Record", width: 15 },
      { header: "Defect Symptom", key: "Defect_symptom", width: 30 },
      // Added the leading '0' to the keys to match your logic below
      { header: "Repair Contents 01", key: "repair_contents_01", width: 30 },
      { header: "Repair Contents 02", key: "repair_contents_02", width: 30 },
      { header: "Repair Contents 03", key: "repair_contents_03", width: 30 },
      { header: "Repair Contents 04", key: "repair_contents_04", width: 30 },
      { header: "Repair Contents 05", key: "repair_contents_05", width: 30 },
    ];

    worksheet.columns = requiredColumns;

    let foundRow = null;
    let foundRowNumber = null;
    const uidStr = UIDNumber.toString().trim();

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const cellValue = row.getCell("UIDNumber").value;
        const cellValueStr = cellValue ? cellValue.toString().trim() : "";

        if (cellValueStr === uidStr) {
          foundRow = row;
          foundRowNumber = rowNumber;
        }
      }
    });

    if (!foundRow) {
      return res
        .status(404)
        .json({
          success: false,
          message: `UID ${UIDNumber} not present in database`,
        });
    }

    // Logic for RW Record
    const currentRWRecord = foundRow.getCell("RW_Record").value;
    let newRWRecord;

    if (!currentRWRecord) {
      newRWRecord = "RW0";
    } else {
      // Ensure we treat the value as string before replacing
      const currentStr = currentRWRecord.toString();
      const currentNumber = parseInt(currentStr.replace("RW", "")) || 0;
      newRWRecord = `RW${currentNumber + 1}`;
    }

    // Updating data
    foundRow.getCell("RW_Record").value = newRWRecord;
    foundRow.getCell("Defect_symptom").value = Defect_symptom || "";
    foundRow.getCell("repair_contents_01").value = repair_contents_01 || "";
    foundRow.getCell("repair_contents_02").value = repair_contents_02 || "";
    foundRow.getCell("repair_contents_03").value = repair_contents_03 || "";
    foundRow.getCell("repair_contents_04").value = repair_contents_04 || "";
    foundRow.getCell("repair_contents_05").value = repair_contents_05 || "";

    foundRow.commit();
    await workbook.xlsx.writeFile(filePath);

    return res.status(200).json({
      success: true,
      message: "Stage two data added successfully",
      UIDNumber,
      RW_Record: newRWRecord,
      rowNumber: foundRowNumber,
    });
  } catch (error) {
    console.error("Excel Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
