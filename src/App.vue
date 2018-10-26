<template>
  <div id="app">
    <div class="row" v-if="!hasSpeechApi">
      <h1>Your browser doesn't support the webkitSpeechRecognition API.</h1>
    </div>
    <HelloWorld v-else />
  </div>
</template>

<script>
  import HelloWorld from './components/HelloWorld.vue'

  export default {
    name: 'app',
    components: {
      HelloWorld
    },
    data() {
      return {
        hasSpeechApi: false
      }
    },
    mounted() {
      this.hasSpeechApi = ("webkitSpeechRecognition" in window);
    }
  }
</script>

<style>
  #app {
    margin-top: 60px;
  }
</style>