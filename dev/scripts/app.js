import React from 'react';
import ReactDOM from 'react-dom';
import UserSignIn from './UserSignIn';
import PersonCard from './PersonCard';
import PhotoUpload from './PhotoUpload';

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
      loggedIn: false,
      isButtonDisabled: false,
      user: {},
      name: '',
      interests: '',
      birthday: '',
      photos: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.addPerson = this.addPerson.bind(this);
    this.removePerson = this.removePerson.bind(this);
    this.showAddPerson = this.showAddPerson.bind(this);
    this.removeOverlay = this.removeOverlay.bind(this);
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
            loggedIn: true,
            user: user
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

  showAddPerson(e) {
    e.preventDefault();
    this.addPersonCard.classList.toggle("show");
    this.addOverlay.classList.add("show");
  }

  removeOverlay() {
    this.addPersonCard.classList.remove("show");
    this.addOverlay.classList.remove("show");    
  }

  addPerson(e) {
    e.preventDefault();
    const person = {
      name: this.state.name,
      birthday:this.state.birthday,
      interests:this.state.interests,
    };

    const userId = firebase.auth().currentUser.uid;
    const dbRef = firebase.database().ref(`/users/${userId}/people`)

    dbRef.push(person);
    this.addPersonCard.classList.remove("show");
    this.addOverlay.classList.remove("show");        
    
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
        <section className="form-addPersonCard" ref={ref => this.addPersonCard = ref}>
          <button className="form-addPersonCard_exit" onClick={this.removeOverlay}>
            <i className="fas fa-times"></i>
          </button>
          <h3>Cool, you want to add someone! Let's make their gifts as great as they are.</h3>
          <form onSubmit={this.addPerson}>
            <div className="inputGroup">
              <label htmlFor="name">Name *</label>
              <input type="text" value={this.state.name} onChange={this.handleChange} id="name" placeholder="Enter Name" required />
            </div>
            <div className="inputGroup">
              <label htmlFor="birthday">Birthday (Don't worry about the year)</label>
              <input type="date" value={this.state.birthday} id="birthday" onChange={this.handleChange} />
            </div>
            <div className="inputGroup">
              <label htmlFor="interests">Interests or Special Notes</label>
              <textarea name="interests" value={this.state.interests} id="interests" cols="10" rows="2" onChange={this.handleChange} id="interests" placeholder="What Do They Like?"></textarea>
            </div>
            <button className="submit" disabled={!this.state.name || !this.state.birthday && !this.state.interests}><i className="fas fa-check-circle"></i></button>
          </form>
        </section>
      );
    } else {
      inputForm = (
        <div className="background">
          <div className="splashPage">
            <h1>Be Good,</h1>
            <h1>Gift Good</h1>
            <div className="splashCaption">
              <p>Make gifts as great as the people in your life are.</p>
              <p>Make notes when the special gift idea comes up!</p>
            </div>
          </div>
        </div>
      );  
    }
    return (
      <div>
          <header>
              <UserSignIn />
              <div className="wrapper">
              
                { this.state.loggedIn 
                ? <div>
                    <a href="" onClick={this.showAddPerson} className="icon-add"><i className="fas fa-plus-circle"></i></a>
                  </div>
                : null}
                  <div className="overlay" ref={ref => this.addOverlay = ref}>
                    <button onClick={this.removeOverlay}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  {inputForm}
              </div>
          </header>
          <main>
            <div className="wrapper">
              { this.state.loggedIn 
              ? <section className="peopleCards">
                  { (this.state.people.length > 0)
                    ? <React.Fragment>
                        {this.state.people.map((person) => {
                          return <PersonCard data={person} key={person.key} remove={this.removePerson} personIndex={person.key}/>
                        })}
                      </React.Fragment>
                    : 
                      <div className="noPeople">
                        <h2>Let's Create Your First Person,</h2><h2> {this.state.user.displayName}!</h2>
                        <h3>Here's an example of what a card looks like!</h3>
                        <div className="noPeople-img">
                          <img src="../../public/assets/personCard-ex.jpg" alt="An example of a person card."/>
                        </div>
                      </div>
                  }
                </section>
              : null}
            </div>
          </main>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
