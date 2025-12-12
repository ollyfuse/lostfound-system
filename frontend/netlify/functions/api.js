exports.handler = async (event, context) => {
  const { path, httpMethod, headers, body, queryStringParameters, isBase64Encoded } = event;
  
  // Handle CORS preflight
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
    // Prepare request body - handle binary data properly
    let requestBody = body;
    if (isBase64Encoded && body) {
      requestBody = Buffer.from(body, 'base64');
    }
    
    // Filter headers - remove problematic ones
    const filteredHeaders = {};
    Object.keys(headers || {}).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (!['host', 'user-agent', 'x-forwarded-for', 'x-forwarded-proto'].includes(lowerKey)) {
        filteredHeaders[key] = headers[key];
      }
    });
    
    const response = await fetch(backendUrl, {
      method: httpMethod,
      headers: filteredHeaders,
      body: httpMethod !== 'GET' && httpMethod !== 'HEAD' ? requestBody : undefined,
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
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Proxy error', 
        details: error.message,
        timeout: error.name === 'AbortError' 
      }),
    };
  }
};
