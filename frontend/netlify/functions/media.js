exports.handler = async (event, context) => {
  const { path, httpMethod } = event;
  
  // Handle CORS preflight
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    };
  }
  
  // Extract media path after /.netlify/functions/media
  const mediaPath = path.replace('/.netlify/functions/media', '') || '/';
  const backendUrl = `http://16.171.30.43:8080${mediaPath}`;
  
  try {
    const response = await fetch(backendUrl, {
      method: httpMethod,
    });
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: 'Media not found',
      };
    }
    
    const buffer = await response.arrayBuffer();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
      body: Buffer.from(buffer).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Media proxy error', details: error.message }),
    };
  }
};
