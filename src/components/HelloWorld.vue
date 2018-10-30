<template>
  <div class="row">
    <div class="col-6">
      <div class="panel panel-default">
        <header>
          <h2 class="panel-title">
            <span v-if="recording">Live transcript</span>
            <span v-else>Hit record and watch results</span>
          </h2>
        </header>
        <div class="panel-body">
          <h2>
            <span class="full-transcript">{{fullTranscript}}</span>
            <span class="interim-transcript">{{interimTranscript}}</span>
          </h2>
        </div>
      </div>
    </div>
    <div class="col-6 justify-content-center">
      <div class="panel panel-default">
        <div class="panel-body">
          <button class="btn btn-lg btn-primary" type="button" v-show="!recording" v-on:click="startRecording">Start
            recording</button>
          <button class="btn btn-lg btn-outline-danger" type="button" v-show="recording" v-on:click="stopRecording">
            Stop
          </button>
        </div>
      </div>
    </div>
    <div class="col-12" v-if="historicTranscripts && historicTranscripts.length">
      <div class="panel panel-brand panel-dark">
        <header>
          <h2 class="panel-title">Transcript history</h2>
        </header>
        <div class="panel-body" v-for="(transcript, index) in historicTranscripts" v-bind:key="index" style="border: 1px solid #f7f7f7;">
          <blockquote>{{transcript.text}}</blockquote>
          <ul class="settings-list">
            <li v-for="(word, index) in transcript.fillerWords" v-bind:key="index">
              <i class="material-icons color-warning" v-if="word.count >= 1 && word.count <= 5">remove</i>
              <i class="material-icons color-success" v-if="word.count == 0">check</i>
              <i class="material-icons color-danger" v-if="word.count >= 6">clear</i>
                {{word.count}} "{{word.word}}"
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import fillerWords from "../fillerWords.js";

  export default {
    name: 'HelloWorld',
    data() {
      return {
        recording: false,
        recordingEnded: false,
        fullTranscript: "",
        interimTranscript: "",
        historicTranscripts: [],
        fillerWords: [...fillerWords.words]
      }
    },
    mounted() {
      this.initiate();
    },
    methods: {
      startRecording() {
        this.fullTranscript = "";
        this.recording = true;
        this.recognition.start();
        console.log("Clicked start!");
      },
      stopRecording() {
        this.recording = false;
        this.recordingEnded = true;
        this.recognition.stop();
        console.log("Stop recording");
      },
      initiate() {
        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = "no";

        console.log("", this.recognition);

        this.recognition.onstart = () => {
          console.log("Onstart");
        };

        this.recognition.onresult = event => {

          this.interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              this.fullTranscript += event.results[i][0].transcript;
            } else {
              this.interimTranscript += event.results[i][0].transcript;
            }
          }

          for (let i = 0; i < this.fillerWords.length; i++) {
            if (this.fillerWords[i].word.includes(this.interimTranscript) > 0) {
              this.fillerWords[i].count++;
              console.log("WE FOUND A FILLERWORD?", this.fillerWords[i])
            }
          }

          console.log("Can we check here for filler?", this.interimTranscript);

        };

        this.recognition.onerror = event => {
          console.log("onerror", event);
        };

        this.recognition.onend = () => {
          if (!this.fullTranscript.length)
            return;

          let transcript = {};
          transcript.text = this.fullTranscript;
          transcript.fillerWords = [...this.fillerWords];

          for (let i = 0; i < this.fillerWords.length; i++) {
            this.fillerWords[i].count = 0;
          }

          this.historicTranscripts.push(transcript);
        };
      }
    }
  }
</script>

<style>
  .full-transcript {
    font-weight: bold;
  }

  .interim-transcript {
    color: #797979;
  }
</style>