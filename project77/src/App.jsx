
import './App.css';
import Tutorial from './components/Tutorial';
import { useFrontContext } from './providers/frontContext';
import {FormField} from '@frontapp/ui-kit';
import React, { useState, useEffect } from 'react';


function App() {
  const context = useFrontContext();

  if (!context)
    return (
      <div className="App">
        <p>Waiting to connect to the Front context.</p>
      </div>
    )

  switch(context.type) {
    case 'noConversation':
      return (
        <div className="bg-black p-4 rounded-3">
          <p>No conversation selected. Select a conversation to use this plugin.</p>
        </div>
      );
    case 'singleConversation':
      return (
        <div>
          <Tutorial />
        </div>
      );
    case 'multiConversations':
      return (
        <div className="bg-black p-4 rounded-3">
          <p>Multiple conversations selected. Select only one conversation to use this plugin.</p>
        </div>
      );
    default:
      console.error(`Unsupported context type: ${context.type}`);
      break;
  };

  
}

export default App;