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
          <span @click="Refresh" id="refresh" class="material-icons">
            refresh</span
          ></b-col
        >
      </b-row>
      <br />

      <b-row>
        <b-col cols="6">Story List</b-col>
        <b-col v-if="ActiveStory !=null" cols="6">Active Story</b-col>
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

        <b-col v-if="ActiveStory !=null" cols="3" class="activeStory">
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
        <b-col v-if="ActiveStory !=null" cols="3" class="scrumMasterPanel">
          <p>Story {{ ActiveStory.storyName }} is active</p>
          <p>Scrum Master : {{ ActiveStory.scrumMasterScore }}</p>
          <p v-for="voterName in Session.voterNames" :key="voterName.id">
            {{ voterName }}:
            {{ GetDeveloperPoint(voterName) }}
          </p>

          <div v-if="isAllVoted">
            <p v-if="anyDifferentPointExists" class="exp">{{ explanation }}</p>
            <b-row>
              <b-col><p class="finalscore">Final Score:</p></b-col>
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
      voteNumbers: [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, "?"],
      explanation:
        "Seems has different votes.Please discuss and finalize the score below textbox.",
      fields: [
        { key: "storyName", label: "Story Name" },
        { key: "storyPoint", label: "Story Point" },
        { key: "status", label: "Status" }
      ],
      scrumMasterScore: 0,
      finalScore: 0
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
    Refresh() {
      this.$store.dispatch("GET_SESSION");
    },
    GetDeveloperPoint(name) {
      return this.ActiveStory.voters.find(x => x.voterName === name).voterPoint;
    },
    EndVoting() {
      debugger;
      this.ActiveStory.storyPoint = this.finalScore;
    
      this.finalScore = 0;
      let storyCount = this.Session.stories.length;
      let currentStoryIndex = this.Session.stories.findIndex(s => s.storyName == this.ActiveStory.storyName);
      if(currentStoryIndex + 1 < storyCount) {
        this.Session.stories[currentStoryIndex+1].status = "Active";
      }
      this.ActiveStory.status = "Voted";

      this.$store.dispatch("UPDATE_SESSION", this.Session).then(() => {
        alert(" voted");
      });
    }
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
    isAllVoted() {
      return (
        this.ActiveStory.voters.every(x => x.voterPoint > 0) &&
        this.ActiveStory.scrumMasterScore > 0
      );
    }
  },

  created() {
    this.$store.dispatch("GET_SESSION");
    //selam2
  }
};
</script>

<style scoped>
.card {
  margin-top: 5rem;
  margin-bottom: 3rem;
  width: 10rem;
  height: 10rem;
  text-align: center;
  font-size: 30px;
  border: solid 5px;
  border-color: rgb(103, 207, 241);
  border-radius: 8px;
}
.link {
  margin-top: 100px;
  margin-left: 5px;
  text-align: left;
}
.activeStory {
  width: 320px;
  height: 400px;
  /* border: solid 2px; */
  border-right: 1px;
}
.scrumMasterPanel {
  width: 320px;
  height: 400px;
  border: solid 2px;
}
.box {
  width: 3rem;
  height: 3rem;
  border: solid 3px;
  border-radius: 10px;
  margin: 13px;
  cursor: pointer;
}
.box:hover {
  border-color: chartreuse;
}
.box:focus,
.box.clicked {
  background-color: chartreuse;
}

.please {
  text-align: center;
  margin-top: 20px;
}
#copy {
  cursor: pointer;
}
#refresh {
  cursor: pointer;
  font-size: 55px;
  color: rgb(56, 197, 56);
}
.vote-button {
  margin-left: 6rem;
}
.finalscore {
  margin-bottom: 0px;
}
.endvoting {
  margin: 1rem;
}
.exp {
  font-size: x-small;
}
</style>
