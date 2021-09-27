<template>
  <div>
    <b-container v-if="Session != null">
      <b-row>
        <b-col>
          <b-card class="card">Scrum Poker</b-card>
        </b-col>
        <b-col class="link"
          >please share link of developers to teammates:
          <br />
          <span id="dev-link"
            >{{ baseUrl }}/poker-planing-view-as-developer</span
          >
          <span @click="copyLink" id="copy" class="material-icons">
            content_copy
          </span>
        </b-col>
      </b-row>

      <b-row>
        <b-col> Session Name : {{ Session.sessionName }} </b-col>
        <b-col style="text-align: right">
          <p>{{ counter }} saniye içinde yenilenecektir</p>
        </b-col>
      </b-row>
      <br />

      <b-row>
        <b-col cols="6">Story List</b-col>
        <b-col v-if="ActiveStory != null" cols="6">Active Story</b-col>
        <b-col v-else>OYLAMA SONA ERMİŞTİR</b-col>
      </b-row>
      <br />

      <b-row>
        <b-col cols="6" class="storyList">
          <b-table
            striped
            bordered
            :items="Session.stories"
            :fields="fields"
            :tbody-tr-class="
              (item, type) => {
                if (!item || type !== 'row') return;
                if (item.status === 'Active') return 'table-success';
              }
            "
          >
          </b-table>
        </b-col>

        <b-col v-if="ActiveStory != null" cols="3" class="active-story">
          Story {{ ActiveStory.storyName }}
          <br />
          <button
            v-for="num in voteNumbers"
            :key="num.id"
            @click="scrumMasterScore = num"
            class="box"
            :class="{ clicked: ActiveStory.scrumMasterScore == num }"
            :disabled="ActiveStory.scrumMasterScore > 0"
          >
            {{ num }}
          </button>
          <b-button
            class="vote-button"
            v-if="ActiveStory.scrumMasterScore == 0"
            variant="primary"
            @click="Vote"
            >Please Vote</b-button
          >
        </b-col>
        <b-col v-if="ActiveStory != null" cols="3" class="scrum-master-panel">
          <p>Story {{ ActiveStory.storyName }} is active</p>
          <p>Scrum Master : {{ ActiveStory.scrumMasterScore }}</p>
          <p v-for="voterName in Session.voterNames" :key="voterName.id">
            {{ voterName }}:
            {{ GetDeveloperPoint(voterName) }}
          </p>

          <div v-if="isAllVoted">
            <p v-if="anyDifferentPointExists" class="exp">{{ explanation }}</p>
            <b-row>
              <b-col><p class="final-score">Final Score:</p></b-col>
              <b-col>
                <input type="number" v-model="finalScore" name="finalscore" />
              </b-col>
            </b-row>
          </div>
          <b-button
            @click="EndVoting"
            :disabled="!isAllVoted || finalScore <= 0"
            class="endvoting"
            variant="success"
            >End Voting For {{ ActiveStory.storyName }} Story
          </b-button>
          <p v-if="!isAllVoted" class="exp">
            You can not end voting till each teammate voted.
          </p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      explanation:
        "Seems has different votes.Please discuss and finalize the score below textbox.",
      fields: [
        { key: "storyName", label: "Story Name" },
        { key: "storyPoint", label: "Story Point" },
        { key: "status", label: "Status" }
      ],
      scrumMasterScore: 0,
      finalScore: 0,
      counter: 5
    };
  },
  methods: {
    Vote() {
      this.ActiveStory.scrumMasterScore = this.scrumMasterScore;
      this.$store.dispatch("UPDATE_SESSION", this.Session).then(() => {
        alert(this.scrumMasterScore + " voted");
      });
    },
    copyLink() {
      let copyText = document.getElementById("dev-link");
      var textArea = document.createElement("textarea");
      textArea.value = copyText.textContent;
      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, 400);
      document.execCommand("copy");
      alert("Developer Link Copied : " + textArea.value);
      textArea.remove();
    },
    EndVoting() {
      this.ActiveStory.storyPoint = this.finalScore;

      this.finalScore = 0;
      let storyCount = this.Session.stories.length;
      let currentStoryIndex = this.Session.stories.findIndex(
        s => s.storyName == this.ActiveStory.storyName
      );
      if (currentStoryIndex + 1 < storyCount) {
        this.Session.stories[currentStoryIndex + 1].status = "Active";
      }
      this.ActiveStory.status = "Voted";

      this.$store.dispatch("UPDATE_SESSION", this.Session).then(() => {
        alert(this.ActiveStory.storyName + " voted");
      });
    },

  },
  computed: {
    ...mapGetters(["Session", "ActiveStory"]),
    baseUrl() {
      return window.location.origin;
    },
    anyDifferentPointExists() {
      return this.ActiveStory.voters.every(
        x => x.voterPoint != this.ActiveStory.scrumMasterScore
      );
    },
    
  },
  created() {
    this.$store.dispatch("GET_SESSION");
    setInterval(() => {
      this.$store.dispatch("GET_SESSION");

    }, 5000);
   
    setInterval(() => {
      this.counter--;
      if (this.counter == 0) {
        this.counter = 5;
      }
    }, 1000);
  }
};
</script>

<style scoped>


#copy {
  cursor: pointer;
}

.final-score {
  margin-bottom: 0px;
}
.endvoting {
  margin: 1rem;
}
.exp {
  font-size: x-small;
}
</style>
