import { useFrontContext } from '../providers/frontContext';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../assets/plane-logo-with-text-white.png";

function Tutorial() {

  const context = useFrontContext();

  const user = (context.teammate && context.teammate.name) ? context.teammate.name : 'world';
  

  const [title, setTitle] = useState(''); 
  const [description, setDescription] = useState('');  
  const [issueCreated, setIssueCreated] = useState(false); 
  const [externalUrls, setExternalUrls] = useState([]);
  const [loading, setLoading] = useState(false); 
 
  const frontApiKey = import.meta.env.VITE_FRONT_API_KEY;

 
  useEffect(() => {
    
    const checkIssueStatus = async () => {
      
      try {
        const issueStatus = localStorage.getItem('issueCreated');
        const issueExists = issueStatus && JSON.parse(issueStatus)[context.conversation.id];
        if (issueExists) {
          setIssueCreated(true);
        }
      } catch (error) {
        console.error('Error checking issue status:', error);
      }
    };

    checkIssueStatus();
  }, [context.conversation.id]);

  useEffect(() => {
    const fetchConversationDetails = async () => {
      setLoading(() => true)
      try {
        const response = await fetch(`https://cors-anywhere.herokuapp.com/https://api2.frontapp.com/conversations/${context.conversation.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${frontApiKey}`,
          }
        });

        if (!response.ok) {
          throw new Error(`Error fetching conversation details: ${response.statusText}`);
        }

        const data = await response.json();
        setExternalUrls(data.links.map(link => link.external_url));
      } catch (error) {
        console.error('Error fetching conversation details:', error);
      }setLoading(() => false)
    };

    fetchConversationDetails();
  }, [context.conversation.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(() => true);
    
    console.log('Loading state set to true:', loading);

    if (externalUrls.some(url => url.includes('app.plane.so') && url.includes('issues'))) {
      console.log('Issue created successfully!');
      setIssueCreated(true);
      localStorage.setItem('issueCreated', JSON.stringify({ [context.conversation.id]: true }));
      setLoading(false); 
    return;
    } 
    try{

      const issueStatus = localStorage.getItem('issueCreated');
      const issueExists = issueStatus && JSON.parse(issueStatus)[context.conversation.id];
      if (issueExists) {
        console.log('Issue already created for this conversation.');
        setIssueCreated(true);
        return;
      }

    const workspace_slug = import.meta.env.VITE_WORKSPACE_SLUG
    const project_id = import.meta.env.VITE_PROJECT_ID
    const conversationLink = "https://app.frontapp.com/open/{conversation_id}".replace('{conversation_id}', context.conversation.id)

    const issue_create_url = 'https://cors-anywhere.herokuapp.com/https://api.plane.so/api/v1/workspaces/{slug}/projects/{project_id}/issues/'; 
    const issue_link_create_url = 'https://cors-anywhere.herokuapp.com/https://api.plane.so/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/links/'
    const tag_creation_url ='https://cors-anywhere.herokuapp.com/https://api2.frontapp.com/links'
    const conversation_link_creation_url = 'https://cors-anywhere.herokuapp.com/https://api2.frontapp.com/conversations/{conversation_id}/links'
    const fetch_project_details_url = 'https://cors-anywhere.herokuapp.com/https://api.plane.so/api/v1/workspaces/{slug}/projects/{project_id}/'

    const apiKey = import.meta.env.VITE_PLANE_API_KEY; 
    console.log(context, "context") 

    const response = await fetch(issue_create_url.replace('{slug}', workspace_slug).replace('{project_id}', project_id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
          name: title,
          description_html: description,

      }),
    });

    
    if (!response.ok) {
      throw new Error(`Error sending data : ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Success:', data);


    const project_link_response = await fetch(fetch_project_details_url.replace('{slug}', workspace_slug).replace('{project_id}', project_id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    });

    const projectdata = await project_link_response.json();
    console.log('project details:', projectdata);
    console.log(projectdata.identifier, "project id")

    

    const link_response = await fetch(issue_link_create_url.replace('{slug}', workspace_slug).replace('{project_id}', project_id).replace('{issue_id}', data.id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
          title: "conversation link",
          url: conversationLink,
      }),
    });


    const tag_response = await fetch(tag_creation_url.replace('{conversation_id}', context.conversation.id),{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${frontApiKey}`,
      },
      body: JSON.stringify({
        name: `${projectdata.identifier}-${data.sequence_id}`, 
        external_url: `https://app.plane.so//${workspace_slug}/projects/${project_id}/issues/${data.id}`
      }),
    });

    const linkdata = await tag_response.json();
    console.log('Success:', linkdata);

    console.log(linkdata.id, "find Link")

    const tag_link_response = await fetch(conversation_link_creation_url.replace('{conversation_id}', context.conversation.id),{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${frontApiKey}`,
      },
      body: JSON.stringify({
        link_ids: [`${linkdata.id}`],
      }),
    
    });
  console.log(tag_link_response, 'tag_link_response')

  if (!response.ok) {
    throw new Error(`Error sending data : ${response.statusText}`);
  }

  setIssueCreated(true);
  localStorage.setItem('issueCreated', JSON.stringify({ [context.conversation.id]: true }));
} catch (error) {
  console.error('Error creating issue:', error);
}
finally {
  setLoading(false); 
}if (!loading) {
  console.log('Loading state set to false:', loading);
}
    
    
};

 

return (
  <div className="bg-black p-4 rounded-3">
    <div className="py-3 pb-4 d-flex">
      <img src={Logo} alt="" className='w-50' />
    </div>
    {loading ? (
      <div className="text-light">
      <p>Plane is loading...</p>
    </div>
    ) :externalUrls.some(url => url.includes('app.plane.so') && url.includes('issues')) || issueCreated ?  (
      <div className="text-light">
        <p>Issue created successfully!</p>
      </div>
    ) : (
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column justify-content-start">
          <label className='text-light fw-normal me-auto mb-2'>Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter a concise issue title"
          />
        </div>
        <div className="d-flex flex-column justify-content-start mt-3">
          <label className='text-light fw-normal me-auto mb-2'>Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the issue in detail (optional)"
            rows={5}
            cols={40}
          />
        </div>
        <div className="d-flex">
          <button className="p-2 px-3 rounded-1 border mt-3 submit-button" type="submit">
            Create Issue
          </button>
        </div>
      </form>
    )}
  </div>
);
}



export default Tutorial;