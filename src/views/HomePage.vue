<template>
  <div class="home">
    <h1>Welcome to Voice Recorder App</h1>
    <p>This app demonstrates audio recording and AWS integration.</p>
    <p>Here are some of my previous works:</p>
    <ul>
      <li>
        Backend for Resume Parsing using AWS, utilised prompt engineering,
        GenAi, and worked on Model Training.
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "HomePage",
};
</script>

<style>
/* Home Page Container Styling */
.home {
  text-align: center;
  padding: 2rem;
  margin: 0 auto;
  max-width: 800px;
  font-family: "Roboto", Arial, sans-serif;
  color: #333;
  background: linear-gradient(
    135deg,
    #f5f7fa,
    #c3cfe2
  ); /* Modern gradient background */
  border-radius: 12px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

/* Home Page Header Styling */
.home h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #4caf50;
  font-weight: bold;
}

.home p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

/* Button Styling */
button {
  padding: 12px 25px;
  font-size: 18px;
  font-weight: 600;
  color: white;
  background-color: #4caf50; /* Primary button color */
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Button Hover Effect */
button:hover {
  background-color: #45a049; /* Slightly darker green on hover */
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Button Active Effect */
button:active {
  background-color: #3e8e41;
  transform: translateY(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .home {
    padding: 1.5rem;
  }

  .home h1 {
    font-size: 2rem;
  }

  .home p {
    font-size: 1rem;
  }

  button {
    font-size: 16px;
    width: 90%; /* Full-width buttons for smaller screens */
    padding: 10px 20px;
  }
}
</style>
