<template>
  <div class="recorder">
    <h1>Voice Recorder</h1>
    <div>
      <Text> Please Enter your name: </Text>
      <input
        type="text"
        v-model="ownerName"
        placeholder="Enter your name"
        required
      />
    </div>
    <div>
      <button @click="startRecording" :disabled="isRecording || !ownerName">
        Start Recording
      </button>
      <button @click="stopRecording" :disabled="!isRecording">
        Stop Recording
      </button>
      <button @click="mergeRecordings" :disabled="isRecording || !ownerName">
        Merge Recordings
      </button>
      <button @click="removeRecordings" :disabled="isRecording || !ownerName">
        Remove Merged File
      </button>
    </div>
    <div>
      <p>{{ statusMessage }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecorderPage",
  data() {
    return {
      isRecording: false,
      mediaRecorder: null,
      ownerName: "",
      statusMessage: "",
    };
  },
  methods: {
    async startRecording() {
      try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        this.mediaRecorder = new MediaRecorder(stream);

        // Initialize chunk counter
        this.chunkCount = 0;

        // Handle audio chunks
        this.mediaRecorder.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            const audioBlob = event.data;
            const base64Audio = await this.convertBlobToBase64(audioBlob); // Convert to base64

            // Prepare payload
            const payload = {
              owner: this.ownerName,
              audio: base64Audio,
            };

            // Send the chunk to Lambda
            await this.sendAudioChunk(payload);

            // Increment and log the chunk count
            this.chunkCount++;
            console.log(`Chunk ${this.chunkCount} created and sent to Lambda.`);
            this.statusMessage = `Chunk ${this.chunkCount} created and sent to Lambda.`;
          }
        };

        // Start recording in 10-second intervals
        this.mediaRecorder.start(10000);
        this.isRecording = true;
        this.statusMessage = "Recording started...";
      } catch (error) {
        console.error("Error accessing microphone:", error);
        this.statusMessage = "Microphone access denied!";
      }
    },
    async mergeRecordings() {
      const mergeLambdaUrl =
        "https://rp3enmf2effb225u3rrsnqmhjq0bpgbd.lambda-url.us-east-1.on.aws/"; // Replace with your merge Lambda URL

      this.statusMessage = "Sent request to merge to server!!";
      const payload = {
        owner: this.ownerName, // Assuming the chunks are stored under a folder named after the owner
      };

      try {
        const response = await fetch(mergeLambdaUrl, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          this.statusMessage = `Recordings merged successfully and saved to S3.`;
        } else {
          const errorData = await response.json();
          console.error("Error merging recordings:", errorData);
          this.statusMessage = "Failed to merge recordings.";
        }
      } catch (error) {
        console.error("Error hitting merge Lambda URL:", error);
        this.statusMessage = "Error merging recordings!";
      }
    },
    async removeRecordings() {
      const mergeLambdaUrl =
        "https://sjfgvasiybxlkub6k4yga6ifne0jzxyb.lambda-url.us-east-1.on.aws/"; // Replace with your merge Lambda URL

      this.statusMessage = "Sent request , Please Wait!!";

      const payload = {
        owner: this.ownerName, // Assuming the chunks are stored under a folder named after the owner
      };

      try {
        const response = await fetch(mergeLambdaUrl, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          // const result = await response.json();
          this.statusMessage = `Merged file removed successfully.`;
        } else {
          const errorData = await response.json();
          console.error("Error deleting file :", errorData);
          this.statusMessage = "Error deleting file";
        }
      } catch (error) {
        console.error("Error hitting merge Lambda URL:", error);
        this.statusMessage = "Server Error!";
      }
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        this.isRecording = false;
        this.statusMessage = "Recording stopped. ";
      }
    },
    async convertBlobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]); // Remove "data:..." prefix
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
      });
    },
    async sendAudioChunk(payload) {
      const lambdaUrl =
        "https://lxuivej6bc4wc5mitpsm2vmyma0cdqxn.lambda-url.us-east-1.on.aws/";

      try {
        const response = await fetch(lambdaUrl, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          this.statusMessage = "Chunk uploaded successfully!";
        } else {
          const errorData = await response.json();
          console.error("Error uploading chunk:", errorData);
          this.statusMessage = "Failed to upload chunk!";
        }
      } catch (error) {
        console.error("Error hitting Lambda URL:", error);
        this.statusMessage = "Error uploading chunk!";
      }
    },
    async mergeAudioChunks(payload) {
      const lambdaUrl =
        "https://rp3enmf2effb225u3rrsnqmhjq0bpgbd.lambda-url.us-east-1.on.aws/";

      try {
        const response = await fetch(lambdaUrl, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          this.statusMessage = "Chunk merged successfully!";
        } else {
          const errorData = await response.json();
          console.error("Error merging chunks:", errorData);
          this.statusMessage = "Failed to merge chunks!";
        }
      } catch (error) {
        console.error("Error hitting Lambda URL:", error);
        this.statusMessage = "Error merging chunks!";
      }
    },
  },
};
</script>

<style>
.recorder {
  text-align: center;
  padding: 2rem;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  margin: 10px;
  cursor: pointer;
}
input {
  padding: 10px;
  font-size: 16px;
  margin-bottom: 20px;
}
</style>
