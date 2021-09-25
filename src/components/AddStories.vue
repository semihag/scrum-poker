<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <b-card class="card">Scrum Poker</b-card>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          Session Name :

          <b-form-input
            :state="isSessionNameValid"
            v-model="session.sessionName"
            type="text"
            maxlength="200"
            id="SessionName"
        /></b-col>
        <b-col>
          <!-- Voter Names: -->

          <label class="tags-pills" for="tags-pills"
            >Enter developer names</label
          >
          <b-form-tags
            input-id="tags-pills"
            v-model="voterNames"
            tag-variant="primary"
            tag-pills
            size="md"
            separator=" "
          ></b-form-tags>

          <!-- <b-form-tags
            class="tag"
            
            input-id="tags-basic"
            v-model="session.voterNames"
          ></b-form-tags> -->
        </b-col>
      </b-row>
      <br />
      Post your story List (Each Line will be converted as a story)

      <b-row>
        <b-form-textarea
          :state="isStoryNameTextValid"
          rows="10"
          v-model="storyNamesText"
          class="textArea"
        >
        </b-form-textarea>
      </b-row>

      <b-row>
        <b-button
          variant="success"
          :disabled="isButtonDisabled"
          @click="StartSession"
          class="startButton"
          >Start Session</b-button
        >
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      session: {
        sessionName: null,
        stories: [],
        numberOfVoters: 0
      },
      storyNamesText: "",
      voterNames: []
    };
  },

  methods: {
    StartSession() {
      this.session.stories = [];
      let storyNames = this.storyNamesText.split("\n");

      for (let storyName of storyNames) {
        if (storyName.trim() == "") continue;
        if (this.session.stories.some(s => s.storyName == storyName.trim()))
          continue;
        let story = {
          storyName: storyName.trim(),
          storyPoint: 0,
          status: "Not Voted",
          scrumMasterScore: 0,
          voters: []
        };

        for (let voterName of this.voterNames) {
          story.voters.push({
            voterName: voterName,
            voterPoint: 0
          });
        }

        this.session.stories.push(story);
      }
      this.session.numberOfVoters = this.voterNames.length;
      this.session.voterNames = this.voterNames;
      this.session.stories[0].status = "Active";

      this.$store.dispatch("UPDATE_SESSION", this.session).then(res => {
        console.log(res);
        this.$router.push("poker-planing-view-as-a-scrum-master");
      });
    }
  },
  computed: {
    ...mapGetters(["getStories"]),
    isSessionNameValid() {
      return (
        this.session.sessionName != null &&
        this.session.sessionName.length <= 200 &&
        this.session.sessionName.trim().length > 0
      );
    },
    isStoryNameTextValid() {
      return (
        this.storyNamesText != null && this.storyNamesText.trim().length > 0
      );
    },
    isButtonDisabled() {
      return !(
        this.isSessionNameValid &&
        this.isStoryNameTextValid &&
        this.voterNames.length > 0
      );
    }
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
.textArea {
  margin-top: 20px;
  margin-left: 0px;
}
.startButton {
  margin-top: 3rem;
  width: 20rem;
}
.tag {
  background-color: lightgrey;
}
.tags-pills {
  margin: 0px;
}
</style>
