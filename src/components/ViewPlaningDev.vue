<template>
  <div v-if="isLoggedin">
    <br />

    <b-container>
      <b-row>
        <b-col>
          <b-card class="card">Scrum Poker</b-card>
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
        <b-col cols="3">Active Story</b-col>
      </b-row>
      <br />
      <b-row>
        <b-col cols="6">
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
        <b-col cols="3" class="active-story">
          Story {{ Session.storyName }}
          <!-- Story {{ ActiveStory.storyName }} -->
          <br />
          <button
            v-for="num in voteNumbers"
            :key="num.id"
            @click="voterPoint = num"
            class="box"
            :class="{ clicked: voterPoint == num }"
            :disabled="currentVoter.voterPoint > 0"
          >
            {{ num }}
          </button>
          <br />
          <b-button
            class="vote-button"
            variant="primary"
            @click="Vote"
            v-if="currentVoter.voterPoint == 0"
            >Please Vote</b-button
          ><br />
        </b-col>
        <b-col
          v-if="ActiveStory != null && isAllVoted"
          cols="3"
          class="scrum-master-panel"
        >
          <p>Story {{ ActiveStory.storyName }} is active</p>
          <p>Scrum Master : {{ ActiveStory.scrumMasterScore }}</p>
          <p v-for="voterName in Session.voterNames" :key="voterName.id">
            {{ voterName }}:
            {{ GetDeveloperPoint(voterName) }}
          </p>
        </b-col>
      </b-row>
    </b-container>
  </div>
  <div v-else>
    <b-container>
      <b-row>
        <b-col class="center" md="6" offset-md="3">
          <b-form-input
            v-model="name"
            placeholder="Enter your name"
          ></b-form-input>
          <br />
          <b-button variant="outline-primary" @click="Login" class="login"
            >GİRİŞ YAP</b-button
          >
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
      isLoggedin: false,
      explanation: "açıklama",
      fields: [
        { key: "storyName", label: "Story Name" },
        { key: "storyPoint", label: "Story Point" },
        { key: "status", label: "Status" }
      ],
      name: "",
      voterPoint: 0,
      counter: 5
    };
  },
  methods: {
    Login() {
      if (this.Session.voterNames.find(n => n === this.name)) {
        this.isLoggedin = true;
        this.voterPoint = this.currentVoter.voterPoint;
      } else {
        alert("Böyle bir kullanıcı yok!!!");
      }
    },
    Vote() {
      this.currentVoter.voterPoint = this.voterPoint;

      this.$store.dispatch("UPDATE_SESSION", this.Session).then(() => {
        alert(this.voterPoint + " voted");
      });
    }
  },
  computed: {
    ...mapGetters(["Session", "ActiveStory"]),
    currentVoter() {
      return this.ActiveStory.voters.find(x => x.voterName === this.name);
    }
  },
  watch: {
    "ActiveStory.storyName"(val) {
      this.voterPoint = 0;
    }
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
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 40%;
}
.center {
  margin-top: 20%;
}
.vote-button {
  margin-left: 6rem;
}
</style>
