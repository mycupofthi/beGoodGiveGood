import React from 'react'; 

class UserSignIn extends React.Component {
    constructor() {
        super();
        this.state = {
            users: [],
            createEmail: '',
            createPassword: '',
            loginEmail: '',
            loginPassword: '',
            loggedIn: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.createUser = this.createUser.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({loggedIn: true});
            } else {
                this.setState({loggedIn:false});
            }
        })
    }
    handleChange(e, field) {
        const newState = Object.assign({}, this.state);
        newState[field] = e.target.value;
        this.setState(newState);
    }
    createUser(e) {
        e.preventDefault();
        const email = this.state.createEmail;
        const password = this.state.createPassword;

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch((error) => console.log(error.code, error.message));
    }
    signIn(e) {
        e.preventDefault();
        const email = this.state.loginEmail;
        const password = this.state.loginPassword;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((success) => {
                console.log(`Logged in as ${success.email}`);
            }), (error) => {
                console.log(error);   
        }
    }
    signOut() {
        firebase.auth().signOut().then(function(success) {
            console.log('Signed Out!')
        }), function(error) {
            console.log(error);
        };
    }
    render() {
        return (
            <div>
                <div className="create-user">
                    <form onSubmit={(e) => this.createUser(e)}>
                        <input type="text" placeholder="Please enter your email address" onChange={(e) => this.handleChange(e, "createEmail")}/>
                        <input type="password" placeholder="Please enter your desired password" onChange={(e) => this.handleChange(e, "createPassword")}/>
                        <input type="submit" value="Create User" />
                    </form>
                </div>

                <div className="sign-in">
                    <form onSubmit={(e) => this.signIn(e)}>
                        <input type="text" placeholder="Please enter your email address" onChange={(e) => this.handleChange(e, "loginEmail")} />
                        <input type="password" placeholder="Please enter your password" onChange={(e) => this.handleChange(e, "loginPassword")} />
                        <input type="submit" value="Login" />
                    </form>
                </div>

                <div className='sign-out'>
                    <button onClick={this.signOut}>Sign Out</button>
                </div>
            </div>
        )
    }
}

export default UserSignIn;