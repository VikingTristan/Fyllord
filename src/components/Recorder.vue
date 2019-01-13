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
            <span class="full-transcript">{{ fullTranscript.text }}</span>
            <span class="interim-transcript">{{ interimTranscript }}</span>
          </h2>
        </div>
      </div>
    </div>
    <div class="col-6">
      <div class="row justify-content-center mt-5">
        <button
          v-show="!recording"
          class="btn btn-lg btn-primary"
          type="button"
          @click="startRecording">
        <i class="material-icons">mic</i> <span>Start recording</span></button>
        <button
          v-show="recording"
          class="btn btn-lg btn-outline-danger"
          type="button"
          @click="stopRecording">
          <i class="material-icons">mic_off</i> <span>Stop</span>
        </button>
      </div>
    </div>
    <div
      v-if="historicTranscripts && historicTranscripts.length"
      class="col-12">
      <div class="panel panel-brand panel-dark">
        <header>
          <h2 class="panel-title">Transcript history</h2>
        </header>
        <div
          v-for="(transcript, index) in historicTranscripts"
          :key="index"
          class="panel-body"
          style="border: 1px solid #f7f7f7;">
          <blockquote>{{ transcript.text }}</blockquote>
          <ul class="settings-list mt-5">
            <h3 style="color: #fff;">Filler words summary:</h3>
            <li
              v-for="(word, index) in transcript.fillerWords"
              :key="index">
              <i
                v-if="word.count == 0 && transcript.showAllWords"
                class="material-icons color-success">check</i>
              <i
                v-if="word.count >= 1 && word.count <= 5"
                class="material-icons color-warning">remove</i>
              <i
                v-if="word.count >= 6"
                class="material-icons color-danger">clear</i>
              <span v-if="transcript.showAllWords || word.count >= 1">{{ word.count }} "{{ word.word }}"</span>
            </li>
          </ul>
          <div class="row justify-content-center">
            <button
              v-if="!transcript.showAllWords"
              class="btn btn-xs btn-outline-secondary"
              @click="transcript.toggleWords()">
              <i class="material-icons">keyboard_arrow_down</i> <span>Show all words</span>
            </button>
            <button
              v-else
              class="btn btn-xs btn-outline-secondary"
              @click="transcript.toggleWords()">
              <i class="material-icons">keyboard_arrow_up</i> <span>Hide</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Transcript from "../transcript.js";

export default {
	name: "HelloWorld",
	data() {
		return {
			recording: false,
			recordingEnded: false,
			fullTranscript: new Transcript,
			interimTranscript: "",
			historicTranscripts: [],
		};
	},
	mounted() {
		this.initiate();
	},
	methods: {
		startRecording() {
			this.fullTranscript = new Transcript;
			this.recording = true;
			this.recognition.start();
		},
		stopRecording() {
			this.recording = false;
			this.recordingEnded = true;
			this.recognition.stop();
		},
		initiate() {
			// eslint-disable-next-line no-undef
			this.recognition = new webkitSpeechRecognition();
			this.recognition.continuous = true;
			this.recognition.interimResults = true;
			this.recognition.lang = "no";

			this.recognition.onstart = () => {
				// console.log("Onstart");
			};

			this.recognition.onresult = event => {

				this.interimTranscript = "";

				for (let i = event.resultIndex; i < event.results.length; ++i) {
					if (event.results[i].isFinal) {
						this.fullTranscript.text += event.results[i][0].transcript;
					} else {
						this.interimTranscript += event.results[i][0].transcript;
					}
				}

			};

			// this.recognition.onerror = event => {
			// 	console.log("onerror", event);
			// };

			this.recognition.onend = () => {
				if (!this.fullTranscript.text.length)
					return;

				const transcriptWords = this.fullTranscript.text.split(" ");

				transcriptWords.forEach((transcriptWord, transcriptWordIndex) => {
					this.fullTranscript.fillerWords.forEach((fillerWord, fillerWordIndex) => {
						if (transcriptWord == fillerWord.word) {
							fillerWord.count++;
						} else {
							const fillerWordSplits = fillerWord.word.split(" ");
							if (fillerWordSplits.length > 1) {

								let currentIndexFound;

								//Check if the first word of our multi word fillerword is the same first, otherwise there's no need to continue
								if (transcriptWord == fillerWordSplits[0]) {
									// console.log("Word matched the beginning of a multi word fillerword: " + transcriptWord);

									let itMatches = true;
									let tempIndex = transcriptWordIndex;
									tempIndex++;
									fillerWordSplits.shift();

									fillerWordSplits.forEach(fillerWordSplit => {
										// console.log(`Comparing ${transcriptWords[tempIndex]} with ${fillerWordSplit}`);
										if (transcriptWords[tempIndex] == fillerWordSplit) {
											currentIndexFound = fillerWordIndex;
											tempIndex++;
										} else {
											itMatches = false;
										}
									});

									if (itMatches) {
										// console.log("Found a complete match for the following multi word fillerword: " + this.fullTranscript
										// 	.fillerWords[currentIndexFound].word);
										this.fullTranscript.fillerWords[currentIndexFound].count++;
									}

								}
							}
						}
					});
				});

				this.historicTranscripts.push(this.fullTranscript);
				this.fullTranscript = new Transcript;
			};
		}
	}
};
</script>

<style>
  .full-transcript {
    font-weight: bold;
    color: #272727;
  }

  .interim-transcript {
    color: #797979;
  }
</style>