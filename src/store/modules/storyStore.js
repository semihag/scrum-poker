import axios from "axios";



const state = {
    session: null


}


const getters = {
    Session(state) {
        return state.session;
    },
    ActiveStory(state) {

        return state.session != null ? state.session.stories.find(s => s.status == "Active") : null;

    }

}



const mutations = {
    updateSession(state, session) {
        state.session = session;
    }
}



const actions = {
    UPDATE_SESSION({ commit }, session) {

        return new Promise((resolve, reject) => {
            axios.put("https://scrum-poker-d1cfd-default-rtdb.firebaseio.com/session.json", session)
                .then(response => {
                    
                    console.log(response);
                    if (response.status == 200) {
                        commit("updateSession", session);
                        resolve(response)
                    }

                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })

        });


    },
    GET_SESSION({ commit }) {
        axios.get("https://scrum-poker-d1cfd-default-rtdb.firebaseio.com/session.json")
            .then(response => {

                commit("updateSession", response.data);

            })
    }

}

export default {
    state,
    getters,
    mutations,
    actions
}


