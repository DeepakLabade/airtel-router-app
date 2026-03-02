import { useState } from "react";
import Modal from "./Modal";
import MasterForm from "./master-form";
import landingImage from "../assets/landing-image.png";

import Stage1Form from "./Stage1Form";
import Stage2Form from "./Stage2Form";
import Stage3Form from "./Stage3Form";
import Stage4Form from "./Stage4Form"

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

  const renderStageForm = () => {
    switch (activeStage) {
      case "Ist Stage":
        return <Stage1Form onSuccess={closeStageModal} />;

      case "IInd Stage":
        return <Stage2Form onSuccess={closeStageModal} />;

      case "IIIrd Stage":
        return <Stage3Form onSuccess={closeStageModal} />;

      case "IVth Stage MultiPack Print":
        return <Stage4Form onSuccess={closeStageModal} />;

      default:
        return null;
    }
  };

  return (
    <div className="landing-container">

      {/* Top Navigation */}
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
              
            </div>
          )}
        </div>
      </div>

      {/* Landing Image */}
      <div className="landing-body">
        <img
          src={landingImage}
          alt="Landing"
          className="landing-image"
        />
      </div>

      {/* Master Form Modal */}
      <Modal isOpen={openMaster} onClose={() => setOpenMaster(false)}>
        <MasterForm />
      </Modal>

      {/* Stage Modal */}
      <Modal isOpen={!!activeStage} onClose={closeStageModal}>
        <h2>{activeStage}</h2>
        {renderStageForm()}
      </Modal>

    </div>
  );
};

export default LandingPage;
