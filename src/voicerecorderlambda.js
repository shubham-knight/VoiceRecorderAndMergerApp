import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
    console.log("Full event received:", event); // Log the full event for debugging

    let body;

    // Check if event.body exists and parse it; otherwise, use the event as-is
    if (event.body) {
      body = JSON.parse(event.body);
    } else {
      body = event; // Assume the event itself is the payload
    }

    console.log("Parsed body:", body); // Log the parsed body for debugging

    // Validate required fields
    if (!body.audio) {
      throw new Error("Missing 'audio' field in the request body");
    }

    if (!body.owner) {
      throw new Error("Missing 'owner' field in the request body");
    }

    // Decode base64 audio data
    const audioChunk = Buffer.from(body.audio, "base64");
    const audioOwner = body.owner;

    // Generate a unique filename using timestamp
    const timestamp = Date.now();
    const fileKey = `${audioOwner}_chunks/audio_${timestamp}.wav`; // Update to .wav

    // Upload the audio chunk to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: audioChunk,
        ContentType: "audio/wav", // Update to WAV MIME type
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type", // Allow specific headers
        "Access-Control-Allow-Methods": "OPTIONS,POST", // Allow methods
      },
      body: JSON.stringify({
        message: "Audio chunk uploaded successfully",
        key: fileKey,
      }),
    };
  } catch (error) {
    console.error("Error uploading audio chunk:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type", // Allow specific headers
        "Access-Control-Allow-Methods": "OPTIONS,POST", // Allow methods
      },
      body: JSON.stringify({
        error: "Failed to upload audio chunk",
        details: error.message,
      }),
    };
  }
};
