import { useFrontContext } from '../providers/frontContext';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../assets/plane-logo-with-text-white.png";

function Tutorial() {

  const context = useFrontContext();

  const user = (context.teammate && context.teammate.name) ? context.teammate.name : 'world';
  

  const [title, setTitle] = useState(''); //new state for title
  const [description, setDescription] = useState('');  //New state for description 
  const [issueCreated, setIssueCreated] = useState(false); // State for issue creation
  const [externalUrls, setExternalUrls] = useState([]);
  const [loading, setLoading] = useState(false); 
  // const [error, setError] = useState(null);
  

  const conversationId = context.conversation.id;

  // Clear localStorage on component mount (optional)
  useEffect(() => {
    
    // Check if an issue is already created for the conversation
    const checkIssueStatus = async () => {
      // setLoading(() => true)
      try {
        const issueStatus = localStorage.getItem('issueCreated');
        const issueExists = issueStatus && JSON.parse(issueStatus)[context.conversation.id];
        if (issueExists) {
          setIssueCreated(true);
        }
      } catch (error) {
        console.error('Error checking issue status:', error);
      }
      // setLoading(() => false)
    };

    checkIssueStatus();
  }, [context.conversation.id]);

  useEffect(() => {
    // Fetch conversation details when component mounts
    const fetchConversationDetails = async () => {
      setLoading(() => true)
      try {
        const response = await fetch(`https://cors-anywhere.herokuapp.com/https://api2.frontapp.com/conversations/${context.conversation.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsicHJvdmlzaW9uaW5nIiwicHJpdmF0ZToqIiwic2hhcmVkOioiLCJrYiJdLCJpYXQiOjE3MTUyMzgzNjUsImlzcyI6ImZyb250Iiwic3ViIjoiMDVkYmU5MzQxMjRjOTQ0NGEzMzYiLCJqdGkiOiI4YTJmZGFlY2U5NWQyYWNmIn0.wc-ni8f_mF6qzmFxxYnphD1jddibRLCH2fEDBge_cRY', // Replace with your Front API key
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

  //on clicking submit button these 
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(() => true);
    
    console.log('Loading state set to true:', loading);

    if (externalUrls.some(url => url.includes('app.plane.so') && url.includes('issues'))) {
      console.log('Issue created successfully!');
      setIssueCreated(true);
      localStorage.setItem('issueCreated', JSON.stringify({ [context.conversation.id]: true }));
      setLoading(false); // Set loading state to false after setting issueCreated
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

    // Check if an issue already exists for the conversation
    const workspace_slug = "kc-demo"
    const project_id = "cb26d5ed-5c05-49b3-a3c6-58952f763a82"
    const conversationLink = "https://app.frontapp.com/open/{conversation_id}".replace('{conversation_id}', context.conversation.id)

    const issue_create_url = 'https://cors-anywhere.herokuapp.com/https://api.plane.so/api/v1/workspaces/{slug}/projects/{project_id}/issues/'; // Replace with your Autocode function URL
    const issue_link_create_url = 'https://cors-anywhere.herokuapp.com/https://api.plane.so/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/links/'
    const tag_creation_url ='https://cors-anywhere.herokuapp.com/https://api2.frontapp.com/links'
    const conversation_link_creation_url = 'https://cors-anywhere.herokuapp.com/https://api2.frontapp.com/conversations/{conversation_id}/links'
    const fetch_project_details_url = 'https://cors-anywhere.herokuapp.com/https://api.plane.so/api/v1/workspaces/{slug}/projects/{project_id}/'

    const apiKey = 'plane_api_02201c2623fd4e99bfc15bfe95147442'; //api key generated from the plane
    console.log(context, "context")
    
    // const conversationDetailsResponse = await fetch(`https://cors-anywhere.herokuapp.com/https://api2.frontapp.com/conversations/${context.conversation.id}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsicHJvdmlzaW9uaW5nIiwicHJpdmF0ZToqIiwic2hhcmVkOioiLCJrYiJdLCJpYXQiOjE3MTM5NTU3MDUsImlzcyI6ImZyb250Iiwic3ViIjoiYWMwMzZhZGUyZmZiY2RiNTVjMzQiLCJqdGkiOiJmNTliMjhiMDUxYjAzNWFiIn0.bPjTFWcntVXtWy1M5ELwl9LkuXWyDzm6gai8sMCHs0o', // Replace with your Front API key
    //   }
    // })

    // const conversationDetails = await conversationDetailsResponse.json();
    // console.log('convo details:', conversationDetails);
    // conversationDetails.links.forEach((link) => {
    //   console.log("External URL:", link.external_url);
    //   // You can further process each external URL here (e.g., store it in a variable)
    // });

    
    

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

      }),
    //  mode: 'no-cors',
    });

    
    if (!response.ok) {
      throw new Error(`Error sending data : ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Success:', data);


//PROJECT ID FETCH
    const project_link_response = await fetch(fetch_project_details_url.replace('{slug}', 'kc-demo').replace('{project_id}', 'cb26d5ed-5c05-49b3-a3c6-58952f763a82'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    //  mode: 'no-cors',
    });

    const projectdata = await project_link_response.json();
    console.log('project details:', projectdata);
    console.log(projectdata.identifier, "project id")

    

    const link_response = await fetch(issue_link_create_url.replace('{slug}', 'kc-demo').replace('{project_id}', 'cb26d5ed-5c05-49b3-a3c6-58952f763a82').replace('{issue_id}', data.id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
          title: "conversation link",
          url: conversationLink,
      }),
    //  mode: 'no-cors',
    });


    const tag_response = await fetch(tag_creation_url.replace('{conversation_id}', context.conversation.id),{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsicHJvdmlzaW9uaW5nIiwicHJpdmF0ZToqIiwic2hhcmVkOioiLCJrYiJdLCJpYXQiOjE3MTU4NTE1NjIsImlzcyI6ImZyb250Iiwic3ViIjoiY2E2MjkxZjZiMDVlMmJlZjEzOWMiLCJqdGkiOiJjMjBhY2U0ZDNiNzAwZTg5In0.prI-tKEEmkc1upSmQ85oQKVi5WazyM62I8bNPp7RGis',
      },
      body: JSON.stringify({
        name: `${projectdata.identifier}-${data.sequence_id}`, 
        external_url: `https://app.plane.so//${workspace_slug}/projects/${project_id}/issues/${data.id}`
      }),
    //  mode: 'no-cors',
    });

    const linkdata = await tag_response.json();
    console.log('Success:', linkdata);

    console.log(linkdata.id, "find Link")

    const tag_link_response = await fetch(conversation_link_creation_url.replace('{conversation_id}', context.conversation.id),{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsicHJvdmlzaW9uaW5nIiwicHJpdmF0ZToqIiwic2hhcmVkOioiLCJrYiJdLCJpYXQiOjE3MTU4NTE1NjIsImlzcyI6ImZyb250Iiwic3ViIjoiY2E2MjkxZjZiMDVlMmJlZjEzOWMiLCJqdGkiOiJjMjBhY2U0ZDNiNzAwZTg5In0.prI-tKEEmkc1upSmQ85oQKVi5WazyM62I8bNPp7RGis',
      },
      body: JSON.stringify({
        // link_external_urls: [`https://app.plane.so//${workspace_slug}/projects/${project_id}/issues/${data.id}`],
        link_ids: [`${linkdata.id}`],
      }),
    //  mode: 'no-cors',
    
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
  setLoading(false); // Set loading state to false when API requests are completed
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