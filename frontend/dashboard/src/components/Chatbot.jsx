import React from 'react';
import PlantAssistant from '../pages/PlantAssistant';

/**
 * PlantGuard Assistant — General Plant-Care Chatbot Component
 * Note: Automated leaf disease ML diagnosis is separated in the 'Scan Disease' tab.
 */
const Chatbot = ({ setActiveTab }) => {
  return <PlantAssistant setActiveTab={setActiveTab} />;
};

export default Chatbot;
