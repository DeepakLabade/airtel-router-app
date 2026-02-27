import { useState } from "react";
import Modal from "./Modal";
import MasterForm from "./master-form";
import landingImage from "../assets/landing-image.png";
import Stage1Form from "./Stage1Form";
import Stage2Form from "./Stage2Form"; 
import Stage3Form from "./Stage3Form";
import Stage4Form from "./Stage4Form";
import Stage5Form from "./Stage5Form";


const LandingPage = () => {
  const [openMaster, setOpenMaster] = useState(false);
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [activeStage, setActiveStage] = useState("");

  const handleStageSelect = (stage) => {
    setActiveStage(stage);
    setShowStageDropdown(false);
  };

  const closeStageModal = () => {
    setActiveStage("");
  };

  return (
    <div className="landing-container">
      <div className="top-bar">

        <button
          className="top-btn"
          onClick={() => setOpenMaster(true)}
        >
          Master Form
        </button>

        <div style={{ position: "relative" }}>
          <button
            className="top-btn"
            onClick={() => setShowStageDropdown(!showStageDropdown)}
          >
            Stage
          </button>
          {showStageDropdown && (
            <div className="stage-menu">
              <div onClick={() => handleStageSelect("Ist Stage")}>Ist Stage</div>
              <div onClick={() => handleStageSelect("IInd Stage")}>IInd Stage</div>
              <div onClick={() => handleStageSelect("IIIrd Stage")}>IIIrd Stage</div>
              <div onClick={() => handleStageSelect("IVth Stage MultiPack Print")}>
                IVth Stage MultiPack Print
              </div>
              <div onClick={() => handleStageSelect("BSR File Generation and Upload")}>
                BSR File Generation and Upload
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="landing-body">
        <img
          src={landingImage}
          alt="Landing"
          className="landing-image"
        />
      </div>

      <Modal isOpen={openMaster} onClose={() => setOpenMaster(false)}>
        <MasterForm />
      </Modal>

      <Modal isOpen={!!activeStage} onClose={closeStageModal}>
  {activeStage === "Ist Stage" && (
    <>
      <h2>Stage 1</h2>
      <Stage1Form />
    </>
  )}

 {activeStage === "IInd Stage" && (
  <>
    <h2>Stage 2</h2>
    <Stage2Form onSuccess={closeStageModal} />
  </>
)}
{activeStage === "IIIrd Stage" && (
  <>
    <h2>Stage 3</h2>
    <Stage3Form onSuccess={closeStageModal} />
  </>
)}
{activeStage === "IVth Stage MultiPack Print" && (
  <>
    <h2>Stage 4</h2>
    <Stage4Form onSuccess={closeStageModal} />
  </>
)}
{activeStage === "BSR File Generation and Upload" && (
  <>
    <h2>Stage 5</h2>
    <Stage5Form onSuccess={closeStageModal} />
  </>
)}

</Modal>


    </div>
  );
};

export default LandingPage;
