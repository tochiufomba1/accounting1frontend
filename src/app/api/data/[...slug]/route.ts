// app/api/data/route.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: Request, { params }: { params: { slug: string[] } }) {
  const { slug } = await params
  const endpointIdentifier = slug.join('/');

  // Retrieve bearer token
  const secret = process.env.AUTH_SECRET;
  // console.log(process.env.EXTERNAL_API_BASE_URL)
  const token = await getToken({ req: request, secret });

  if (!token) {
    // Unauthorized: if no token is found, respond with a 401.
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Use the endpointIdentifier to determine which external API to call.
  // For example, map it to an external URL:
  //let externalURL = '';
  // switch (endpointIdentifier) {
  //   case 'twitter':
  //     externalURL = 'https://api.twitter.com/2/tweets';
  //     break;
  //   case 'github':
  //     externalURL = 'https://api.github.com/user';
  //     break;
  //   // Add more cases as needed.
  //   default:
  //     return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
  // }


  try {
    const incomingCookie = request.headers.get('cookie') || ''
    // TODO: Consider file download case (may need to use a switch statement or check the endpointIdentifier)
    // Use the token to call the external API.
    // console.log(`${process.env.EXTERNAL_API_BASE_URL}/api/${endpointIdentifier}`)
    const externalRes = await fetch(`${process.env.EXTERNAL_API_BASE_URL}/api/${endpointIdentifier}`, {
      headers: {
        'Authorization': `Bearer ${token.accessToken || token}`,
        Cookie: incomingCookie,
      },
    });

    if (!externalRes.ok) {
      throw new Error('External API error');
    }

    const externalResCT = externalRes.headers.get('content-type') || '';

    const setCookie = externalRes.headers.get('set-cookie')

    if (externalResCT.includes('text/csv')) {
      // you can tweak filename, attachment vs inline, etc.
      const headers = {
        'Content-Type': externalResCT,
        'Content-Disposition': 'attachment; filename="export.csv"',
      };
      return new NextResponse(externalRes.body, {
        status: externalRes.status,
        headers,
      });
    }

    const data = await externalRes.json();
    const response = NextResponse.json(data, { status: externalRes.status })
    if (setCookie) {
      // preserve path/domain/samesite attributes if you need to tweak them
      response.headers.set('set-cookie', setCookie)
    }
    return response;

  } catch (error: any) {
    // If the external API call fails, return an error response.
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string[] } }) {
  const { slug } = await params
  const endpointIdentifier = slug.join('/');

  // Retrieve bearer token
  const secret = process.env.AUTH_SECRET;
  const token = await getToken({ req: request, secret });

  if (!token) {
    // Unauthorized: if no token is found, respond with a 403.
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const incomingCookie = request.headers.get('cookie') || ''
    // TODO: Consider file download case (may need to use a switch statement or check the endpointIdentifier)
    // Use the token to call the external API.
    
    // const body: BodyInit;
    const jsonData = await request.json();
    const body = JSON.stringify(jsonData);

    const externalRes = await fetch(`${process.env.EXTERNAL_API_BASE_URL}/api/${endpointIdentifier}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.accessToken || token}`,
        'Content-Type': "application/json",
        Cookie: incomingCookie,
      },
      body,
    });

    if (!externalRes.ok) {
      throw new Error('External API error');
    }

    const externalResCT = externalRes.headers.get('content-type') || '';

    const setCookie = externalRes.headers.get('set-cookie')

    if (externalResCT.includes('text/csv')) {
      const headers = {
        'Content-Type': externalResCT,
        'Content-Disposition': 'attachment; filename="export.csv"',
      };
      return new NextResponse(externalRes.body, {
        status: externalRes.status,
        headers,
      });
    }

    const data = await externalRes.json();
    const response = NextResponse.json(data, { status: externalRes.status })
    if (setCookie) {
      response.headers.set('set-cookie', setCookie)
    }
    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { slug: string[] } }) {
  const { slug } = await params
  const endpointIdentifier = slug.join('/');

  // Retrieve bearer token
  const secret = process.env.AUTH_SECRET;
  const token = await getToken({ req: request, secret });

  if (!token) {
    // Unauthorized: if no token is found, respond with a 401.
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token.accessToken}`,
      'Accept': 'application/json'
    };

    let body: BodyInit;
    const incomingContentType = request.headers.get("content-type") || "";

    if (incomingContentType.includes("application/json")) {
      // For JSON requests, parse and re-stringify the JSON body
      const jsonData = await request.json();
      body = JSON.stringify(jsonData);
      headers["Content-Type"] = "application/json";
    } else {
      // For FormData requests, get the form data object directly
      const formData = await request.formData();
      body = formData;
    }

    // Use the token to call the external API.
    const externalRes = await fetch(`${process.env.EXTERNAL_API_BASE_URL}/api/${endpointIdentifier}`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body,
    });

    if (!externalRes.ok) {
      throw new Error('External API error');
    }

    const setCookieHeader = externalRes.headers.get('set-cookie');

    const data = await externalRes.json();

    // Return the data as JSON to the client.
    const res = NextResponse.json(data);
    if (setCookieHeader) {
      // You can set it directly or process it if needed to adjust domain/path.
      res.headers.set('set-cookie', setCookieHeader);
    }

    return res;

  } catch (error: any) {
    // If the external API call fails, return an error response.
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
