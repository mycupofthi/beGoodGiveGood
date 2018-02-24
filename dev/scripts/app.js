import React from 'react';
import ReactDOM from 'react-dom';
import UserSignIn from './UserSignIn.js';

var config = {
  apiKey: "AIzaSyDv3uV7RjBfNfCLpuQ-2t15ivgXCyuvSNg",
  authDomain: "person-log.firebaseapp.com",
  databaseURL: "https://person-log.firebaseio.com",
  projectId: "person-log",
  storageBucket: "person-log.appspot.com",
  messagingSenderId: "370922809098"
};
firebase.initializeApp(config);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      people: [],
      name: '',
      birthday: '',
      interests: '',
      loggedIn: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.addPerson = this.addPerson.bind(this);
    this.removePerson = this.removePerson.bind(this);
  }
  componentDidMount() {
    
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const dbRef = firebase.database().ref(`/users/${user.uid}/people`);
        dbRef.on('value', (firebaseData) => {
          const peopleArray = [];
          const data = firebaseData.val();
    
          for (let personKey in data) {
            data[personKey].key = personKey;
            peopleArray.push(data[personKey])
          }
          this.setState({
            people: peopleArray,
            loggedIn: true
          });
        });
      } else {
        this.setState({
          people: [],
          loggedIn: false
        })
      }
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }
  addPerson(e) {
    e.preventDefault();
    const person = {
      name: this.state.name,
      birthday:this.state.birthday,
      interests:this.state.interests
    };
    const userId = firebase.auth().currentUser.uid;
    const dbRef = firebase.database().ref(`/users/${userId}/people`)
    dbRef.push(person);
    this.setState({
      name: '',
      birthday: '',
      interests: ''
    })
  }
  removePerson(peopleKey) {
    const userId = firebase.auth().currentUser.uid;    
    const dbRef = firebase.database().ref(`/users/${userId}/people/${peopleKey}`);
    dbRef.remove();
  }
  render() {

    let inputForm = '';
    if (this.state.loggedIn) {
      inputForm = (
        <form onSubmit={this.addPerson}>
          <label htmlFor="name">Name:</label>
          <input type="text" value={this.state.name} onChange={this.handleChange} id="name" />
          <label htmlFor="birthday">Birthday:</label>
          <input type="text" value={this.state.birthday} id="birthday" onChange={this.handleChange} />
          <label htmlFor="interests">Interests:</label>
          <input type="text" value={this.state.interests} onChange={this.handleChange} id="interests" />
          <input type="submit" value="Add Person" />
        </form>
      );
    } else {
      inputForm = (
        <h2>Be Good & Gift Good</h2>
      );  
    }

    return (
      <div>
        <div className="wrapper">
          <UserSignIn />
          {inputForm}
          <section className="peopleCards">
            {this.state.people.map((person) => {
              return <PersonCard data={person} key={person.key} remove={this.removePerson} personIndex={person.key} />
            })}
          </section>
        </div>
      </div>
    )
  }
}

// Simple component for each person card
const PersonCard = (props) => {
  return (
    <div>
      <article className="personCard">
        <h2>{props.data.name}</h2>
        <ul>
          <li>Birthday: {props.data.birthday}</li>
          <li>Interests:{props.data.interests}</li>
        </ul>
        <button onClick={() => props.remove(props.personIndex)}>Remove</button>
      </article>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'));
