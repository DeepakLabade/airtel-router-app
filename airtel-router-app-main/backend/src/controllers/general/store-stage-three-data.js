import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";

export const storeStageThreeData = async (req, res) => {
  try {
    const {
      SerialNumber,
      ChipID,
      UIDDishTV,
      location,
      userName
    } = req.body;

    if (!SerialNumber) {
      return res.status(400).json({
        success:false,
        message:"SerialNumber required"
      });
    }

    const filePath = path.join(process.cwd(),"database","demo.xlsx");

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.getWorksheet("Devices");

    sheet.columns = [
      {header:"Serial Number", key:"SerialNumber"},
      {header:"Chip ID", key:"ChipID"},
      {header:"UID Dish TV", key:"UIDDishTV"},
      {header:"Stage3 Date", key:"stage3Date"},
      {header:"Stage3 Location", key:"stage3Location"},
      {header:"Stage3 User", key:"stage3User"}
    ];

    let foundRow=null;

    sheet.eachRow((row,num)=>{
      if(num>1){
        if(row.getCell("SerialNumber").value==SerialNumber){
          foundRow=row;
        }
      }
    });

    if(!foundRow){
      return res.status(404).json({
        success:false,
        message:"Serial not found"
      });
    }

    foundRow.getCell("ChipID").value=ChipID;
    foundRow.getCell("UIDDishTV").value=UIDDishTV;
    foundRow.getCell("stage3Date").value=new Date().toISOString();
    foundRow.getCell("stage3Location").value=location;
    foundRow.getCell("stage3User").value=userName;

    await workbook.xlsx.writeFile(filePath);

    res.json({
      success:true,
      message:"Stage 3 Saved"
    });

  } catch(err){
    res.status(500).json({success:false,message:err.message});
  }
};
