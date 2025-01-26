import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-1" });
const bucketName = "voicerecorder-shubham";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Methods": "OPTIONS,POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

  try {
    const body = JSON.parse(event.body); // Expecting `folderName` in the request body
    const folderName = body.owner;

    if (!folderName) {
      throw new Error('Missing "folderName" in the request body');
    }

    const fileKey = `${folderName}_chunks/merged-audio.wav`;

    // Delete the file from S3
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: JSON.stringify({
        message: `File "${fileKey}" deleted successfully`,
      }),
    };
  } catch (error) {
    console.error("Error deleting the file:", error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: JSON.stringify({
        error: "Failed to delete the file",
        details: error.message,
      }),
    };
  }
};
