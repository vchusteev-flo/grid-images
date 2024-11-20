import { createApi } from 'unsplash-js';

const client = createApi({
  accessKey: '3ntNjyPlDiYG5Fd0rOtlFDNfNLHz1x6Q_vW0uP2Wjdo',
  fetch,
});

exports.getPhotos = async (event: any) => {
  const {
    query = 'cat',
    page = 1,
    limit = 10,
  } = event.queryStringParameters || {};

  try {
    const response = await client.search.getPhotos({
      query: query,
      orientation: 'landscape',
      page: Number(page),
      perPage: Number(limit),
    });
    const data = response.response?.results;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
      },
      body: JSON.stringify({
        data: data
      })
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        data: [],
        error: err.message
      })
    };
  }
};
