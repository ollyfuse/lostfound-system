exports.handler = async (event, context) => {
  const { path, httpMethod, headers, body, queryStringParameters } = event;
  
  // Extract the API path after /.netlify/functions/api
  const apiPath = path.replace('/.netlify/functions/api', '') || '/';
  
  // Build query string if present
  const queryString = queryStringParameters 
    ? '?' + new URLSearchParams(queryStringParameters).toString()
    : '';
  
  const backendUrl = `http://16.171.30.43:8001/api${apiPath}${queryString}`;
  
  try {
    const response = await fetch(backendUrl, {
      method: httpMethod,
      headers: {
        ...headers,
        host: undefined,
        'user-agent': undefined,
      },
      body: httpMethod !== 'GET' && httpMethod !== 'HEAD' ? body : undefined,
    });
    
    const responseBody = await response.text();
    
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
      body: responseBody,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Proxy error', details: error.message }),
    };
  }
};
