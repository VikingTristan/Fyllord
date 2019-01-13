<template>
  <div id="app">
    <div 
      v-if="!hasSpeechApi" 
      class="row">
      <h1>Your browser doesn't support the webkitSpeechRecognition API.</h1>
    </div>
    <Recorder v-else />
  </div>
</template>

<script>
import Recorder from "./components/Recorder.vue";

export default {
	name: "App",
	components: {
		Recorder
	},
	data() {
		return {
			hasSpeechApi: false
		};
	},
	mounted() {
		this.hasSpeechApi = ("webkitSpeechRecognition" in window);
	}
};
</script>

<style>
  #app {
    margin-top: 60px;
  }
</style>