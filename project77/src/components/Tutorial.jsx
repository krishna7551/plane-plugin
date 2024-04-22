import { useFrontContext } from '../providers/frontContext';
import React, { useState } from 'react';
// import axios from 'axios'; // Import axios library

function Tutorial() {

  const context = useFrontContext();

  const user = (context.teammate && context.teammate.name) ? context.teammate.name : 'world';

  const [title, setTitle] = useState(''); 
  const [description, setDescription] = useState('');
  const [conversationLink, setConversationLink] = useState(''); // New state for conversation link

  const handleSubmit = async (event) => {
    event.preventDefault();

    const issue_create_url = 'https://cors-anywhere.herokuapp.com/https://api.plane.so/api/v1/workspaces/{slug}/projects/{project_id}/issues/'; // Replace with your Autocode function URL
    const issue_link_create_url = 'https://cors-anywhere.herokuapp.com/https://api.plane.so/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/links/'

    const apiKey = 'plane_api_ec84770dda1042afaf1da59da9f71b7b'; 
    const frontConversationLink = context.conversation &&  context.conversation.url; // Assuming conversation URL is available
    console.log(context, "context")
    console.log(window.location.href,"location ")
    console.log(context.conversation.link, "conversation")
    console.log(frontConversationLink, "frontConversationLink")



    const response = await fetch(issue_create_url.replace('{slug}', 'kc-demo').replace('{project_id}', 'cb26d5ed-5c05-49b3-a3c6-58952f763a82'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        // issue: {
          name: title,
          description_html: description,
        // },
        // conversation_link: frontConversationLink,
      }),
    //  mode: 'no-cors',
    });

    
    if (!response.ok) {
      throw new Error(`Error sending data : ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Success:', data);

    const link_response = await fetch(issue_link_create_url.replace('{slug}', 'kc-demo').replace('{project_id}', 'cb26d5ed-5c05-49b3-a3c6-58952f763a82').replace('{issue_id}', data.id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
          title: title,
          url: conversationLink,
        // conversation_link: frontConversationLink,
      }),
    //  mode: 'no-cors',
    });

  }

  

  return (
    <div className="App">
      <p>Hello {user}!</p>
      <p>Create Issue</p>
      <div className="input-container">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter a concise issue title"
        />
      </div>
      <div className="input-container">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the issue in detail (optional)"
          rows={5}
          cols={40} // Adjust rows as needed
        />
      </div>
      {/* <div className="input-container">
        <label htmlFor="conversationLink">Conversation Link:</label>
        <input
          type="text"
          id="conversationLink"
          value={ context.conversation && context.conversation.url} // Display from Front context
          readOnly={true}
        />
      </div> */}
      <button onClick={handleSubmit} className="submit-button">
        Submit
      </button>
    </div>
  );
}


export default Tutorial;

// import React, { useState, createContext, useEffect } from 'react';

// const ParameterContext = createContext({
//   title: '',
//   description: '',
//   setTitle: () => {},
//   setDescription: () => {},
// });

// const ParameterProvider = ({ children }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');

//   const handleTitleChange = (event) => setTitle(event.target.value);
//   const handleDescriptionChange = (event) => setDescription(event.target.value);

//   const handleSubmit = async () => {
//     try {
//       const response = await fetch('https://api.autocode.com/v1/your-project/your-function', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ title, description }),
//       });

//       if (!response.ok) {
//         throw new Error(`Autocode request failed with status ${response.status}`);
//       }

//       const data = await response.json();
//       console.log('Autocode response:', data);
//       // Handle success or error messages as needed
//     } catch (error) {
//       console.error('Error sending data to Autocode:', error);
//       // Handle error gracefully
//     }
//   };

//   return (
//     <ParameterContext.Provider
//       value={{ title, description, setTitle: handleTitleChange, setDescription: handleDescriptionChange }}
//     >
//       {children}
//     </ParameterContext.Provider>
//   );
// };

// const ParameterInput = () => {
//   const { title, description, setTitle, setDescription } = useContext(ParameterContext);

//   return (
//     <div>
//       <label htmlFor="title">Title:</label>
//       <input type="text" id="title" value={title} onChange={setTitle} />
//       <br />
//       <label htmlFor="description">Description:</label>
//       <textarea id="description" value={description} onChange={setDescription} />
//     </div>
//   );
// };

// const SubmitButton = () => {
//   const { title, description } = useContext(ParameterContext);

//   return <button type="button" onClick={handleSubmit}>Submit</button>;
// };

// const App = () => {
//   return (
//     <ParameterProvider>
//       <div>
//         <h1>Enter Parameters</h1>
//         <ParameterInput />
//         <SubmitButton />
//       </div>
//     </ParameterProvider>
//   );
// };

// export default App;
