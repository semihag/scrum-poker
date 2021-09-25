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
        <b-col cols="3" class="activeStory">
          Story {{ Session.storyName }}
          <!-- Story {{ ActiveStory.storyName }} -->
          <br />
          <button
            v-for="num in voteNumbers"
            :key="num.id"
            @click="voterPoint = num"
            class="box"
            :class="{ clicked: voterPoint == num }"
            :disabled="voterPoint > 0"
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
      voteNumbers: [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, "?"],
      explanation: "açıklama",
      fields: [
        { key: "storyName", label: "Story Name" },
        { key: "storyPoint", label: "Story Point" },
        { key: "status", label: "Status" }
      ],
      scrumMasterScore: 0,
      name: "",
      voterPoint: 0
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
      debugger;
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
  created() {
    this.$store.dispatch("GET_SESSION");
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
.activeStory {
  width: 320px;
  height: 400px;
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
