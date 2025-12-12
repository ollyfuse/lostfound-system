exports.handler = async (event, context) => {
  const { path, httpMethod, headers, body, queryStringParameters } = event;
  
  // Handle OPTIONS preflight
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
      body: '',
    };
  }
  
  const apiPath = path.replace('/.netlify/functions/api', '') || '/';
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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
