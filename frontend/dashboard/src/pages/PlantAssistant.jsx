import React from 'react';
import ChatHeader from '../components/ChatHeader';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import ScanContextBanner from '../components/ScanContextBanner';
import { useChat } from '../hooks/useChat';
import '../styles/chatbot.css';

const PlantAssistant = ({ setActiveTab }) => {
  const {
    messages,
    isLoading,
    error,
    healthInfo,
    activeScanContext,
    clearScanContext,
    sendMessage,
    retryLastMessage,
    startNewChat,
    clearChat,
  } = useChat();

  return (
    <div className="pg-chat-page">
      <ChatHeader
        onNewChat={startNewChat}
        onClearChat={clearChat}
        messagesCount={messages.length}
        healthInfo={healthInfo}
      />

      {activeScanContext && (
        <ScanContextBanner
          context={activeScanContext}
          onClearContext={clearScanContext}
          onSelectQuestion={sendMessage}
        />
      )}

      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        error={error}
        onSelectSuggestion={sendMessage}
        onRetry={retryLastMessage}
      />

      <ChatInput
        onSendMessage={sendMessage}
        isLoading={isLoading}
        disabled={false}
      />
    </div>
  );
};

export default PlantAssistant;
