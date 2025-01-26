import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

const BUCKET_NAME = "voicerecorder-shubham";

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
    let body;
    if (event.body) {
      body = JSON.parse(event.body);
    } else {
      body = event; // Assume the event itself is the payload
    }

    if (!body.owner) {
      throw new Error("Missing 'owner' field in the request body");
    }

    const audioOwner = body.owner;
    const folderName = `${audioOwner}_chunks`; // Expecting folderName in the body
    if (!folderName) {
      throw new Error("Missing folderName in the request body");
    }

    console.log("Merging audio chunks from folder:", folderName);

    // List all objects in the specified folder
    const listParams = {
      Bucket: BUCKET_NAME,
      Prefix: `${folderName}/`, // Ensure the prefix includes the folder name
    };
    const listResponse = await s3.send(new ListObjectsV2Command(listParams));

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      throw new Error(`No audio chunks found in the folder: ${folderName}`);
    }

    // Filter and sort the chunks by their timestamp in the filename
    const audioKeys = listResponse.Contents.filter((item) =>
      item.Key.endsWith(".wav")
    ) // Only include .wav files
      .sort((a, b) => {
        const timestampA = parseInt(a.Key.match(/(\d+)\.wav$/)?.[1]);
        const timestampB = parseInt(b.Key.match(/(\d+)\.wav$/)?.[1]);
        return timestampA - timestampB;
      });

    console.log(
      "Sorted audio chunks:",
      audioKeys.map((item) => item.Key)
    );

    // Retrieve each chunk from S3
    const audioChunks = [];
    for (const audioKey of audioKeys) {
      const params = {
        Bucket: BUCKET_NAME,
        Key: audioKey.Key,
      };
      const data = await s3.send(new GetObjectCommand(params));
      const chunkData = await streamToBuffer(data.Body); // Convert stream to buffer
      audioChunks.push(chunkData);
    }

    // Merge the audio chunks into a single buffer
    const mergedAudio = Buffer.concat(audioChunks);

    // Upload merged audio to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: `${folderName}/merged-audio.wav`,
      Body: mergedAudio,
      ContentType: "audio/wav",
      ACL: "private",
    };
    await s3.send(new PutObjectCommand(uploadParams));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: JSON.stringify({
        message: "Audio merged and uploaded successfully",
        mergedKey: `${folderName}/merged-audio.wav`,
      }),
    };
  } catch (error) {
    console.error("Error merging audio chunks:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to merge audio",
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,POST",
        },
        error: error.message,
      }),
    };
  }
};

// Helper function to convert stream to buffer
const streamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", (err) => reject(err));
  });
};
