import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/authOptions";

export async function PATCH(req: Request) {
//   const session = await getServerSession(authOptions);
//   if (!session || !session.googleAccessToken) {
//     return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
//   }

  const data = await req.json();
  const fileId = data.fileId;
  const newContent = data.body; // New content to append

  if (!fileId || !newContent) {
    return new Response(JSON.stringify({ error: 'File ID and new content are required' }), { status: 400 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: "ya29.a0AcM612zOldin1W8URTQ-7sg-xxC0q-fRSatHGzSoFnO5XN1gB8WtGmtyEFm9xZMRvn5uJ-sMbAx-cop52Z-_TrP-rVKgVBke6YqtA-wZXb6tUYmW8Gex0QoozPfshUzJc1D454W_8LPVxd1rrskkjJtv7tbH4sg-VohYDsf8aCgYKAaYSARISFQHGX2MivRbNwMbFYJ9CQauutja0zw0175" });

  const drive = google.drive({ version: 'v3', auth });

  try {
    // Step 1: Retrieve the existing content of the file
    const existingFile = await drive.files.get({
      fileId: fileId,
      alt: 'media',
    });

    // Step 2: Append new content to the existing content
    const existingContent = existingFile.data;
    const updatedContent = existingContent + '\n' + newContent; 

    const media = {
      mimeType: 'text/plain',
      body: updatedContent,
    };

    await drive.files.update({
      fileId: fileId,
      media: media,
      fields: 'id',
    });

    return new Response(JSON.stringify({ message: 'File updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating file:');
    return new Response(JSON.stringify({ error: 'Failed to update file' }), { status: 500 });
  }
}
