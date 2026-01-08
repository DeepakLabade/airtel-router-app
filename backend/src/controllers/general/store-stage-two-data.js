import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";

export const storeStageTwoData = async (req, res) => {
  try {
    const { UIDNumber, Defect_symptom, repair_contents } = req.body;

    if (!UIDNumber) {
      return res.status(400).json({
        success: false,
        message: "UIDNumber is required",
      });
    }

    const dbDir = path.join(process.cwd(), "database");
    const filePath = path.join(dbDir, "demo.xlsx");

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Database file not found. Please add devices first.",
      });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet("Devices");

    if (!worksheet) {
      return res.status(404).json({
        success: false,
        message: "Devices worksheet not found",
      });
    }

    const columns = worksheet.columns || [];
    const columnKeys = columns.map((col) => col.key).filter(Boolean);

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
      { header: "Repair Contents", key: "repair_contents", width: 30 },
    ];

    worksheet.columns = requiredColumns;

    let foundRow = null;
    let foundRowNumber = null;

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const cellValue = row.getCell("UIDNumber").value;
        const cellValueStr = cellValue ? cellValue.toString() : "";
        const uidStr = UIDNumber.toString();

        if (cellValueStr === uidStr) {
          foundRow = row;
          foundRowNumber = rowNumber;
        }
      }
    });

    if (!foundRow) {
      return res.status(404).json({
        success: false,
        message: `UID ${UIDNumber} not present in database`,
      });
    }

    const currentRWRecord = foundRow.getCell("RW_Record").value || "";
    let newRWRecord;

    if (!currentRWRecord || currentRWRecord === "") {
      newRWRecord = "RW0";
    } else {
      const currentNumber = parseInt(currentRWRecord.replace("RW", ""));
      const newNumber = currentNumber + 1;
      newRWRecord = `RW${newNumber}`;
    }

    foundRow.getCell("RW_Record").value = newRWRecord;
    foundRow.getCell("Defect_symptom").value = Defect_symptom || "";
    foundRow.getCell("repair_contents").value = repair_contents || "";
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
