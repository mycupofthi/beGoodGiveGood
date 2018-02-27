import React from 'react'; 

class UserSignIn extends React.Component {
    constructor() {
        super();
        this.state = {
            createEmail: '',
            createPassword: '',
            loginEmail: '',
            loginPassword: '',
            loggedIn: false,
            user: {}
        }
        this.handleChange = this.handleChange.bind(this);
        this.createShow = this.createShow.bind(this);
        this.signInShow = this.signInShow.bind(this);        
        this.createUser = this.createUser.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
        this.signInGoogle = this.signInGoogle.bind(this);
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    loggedIn: true,
                    user: user
                });
            } else {
                this.setState({
                    loggedIn:false,
                });
            }
        })
    }

    createShow(e) {
        e.preventDefault();
        this.createPopup.classList.toggle("show");

    }

    signInShow(e) {
        e.preventDefault();
        this.signinPopup.classList.toggle("show");
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
        
            this.createPopup.classList.remove("show");
    
    }

    signIn(e) {
        e.preventDefault();
        const email = this.state.loginEmail;
        const password = this.state.loginPassword;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((success) => {
                console.log(`Logged in as ${success.email}`);
                this.signinPopup.classList.toggle("show");
                
            }), (error) => {
                console.log(error);   
        };
        this.signinPopup.classList.toggle("show");

    }

    signInGoogle(e) {
        const provider = new firebase.auth.GoogleAuthProvider();

        provider.setCustomParameters({
            prompt: 'select_account'
        });
        firebase.auth().signInWithPopup(provider)
            .then((user) => {
                console.log(user);
            })

    }

    signOut() {
        firebase.auth().signOut()
            .then((success)  => {
                console.log('Signed Out!')
        }), (error) => {
            console.log(error);
        };
        this.setState({
            loggedIn: false,
            user: {}
        })
    }
    
    render() {

        return (
            <div>
                <nav>
                    { this.state.loggedIn ?
                        <div className="splashPage-header">
                            <div className="header-title">
                                <h2>Be Good, Gift Good</h2>
                            </div>
                            <div className='signOut'>
                                <button className="btn-signOut" onClick={this.signOut}>Sign Out</button>
                            </div>
                        </div>
                    : 
                        <ul>
                            <li><a href="" className="createUser" onClick={this.createShow}>Sign Up</a></li>
                            <li><a href="" className="signIn" onClick={this.signInShow}>Log In</a></li>
                        </ul>
                    }       
                </nav>

                
                <form className="form-createUser" onSubmit={(e) => this.createUser(e)} ref={ref => this.createPopup = ref}>
                    <button onClick={this.createShow} className="exit-form"><i className="far fa-times-circle"></i></button>
                    <h2>Create Your User</h2>
                    <div className="inputGroup">
                        <label htmlFor="email">Email</label>
                        <input type="text" placeholder="Email Address" name="email " onChange={(e) => this.handleChange(e, "createEmail")} />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="password">Password</label>
                        <input type="password" placeholder="Desired Password" name="password" onChange={(e) => this.handleChange(e, "createPassword")} />
                    </div>
                    <div className="logGroup">
                        <input type="submit" value="Create User" />
                    </div>
                </form>

                <form className="form-signIn" onSubmit={(e) => this.signIn(e)} ref={ref => this.signinPopup = ref}>
                    <button onClick={this.signinShow} className="exit-form"><i className="far fa-times-circle"></i></button>
                    <h2>Let's Sign In</h2>
                    <div className="inputGroup">
                        <label htmlFor="loginEmail">Email</label>
                        <input type="text" placeholder="Email Address" name="loginEmail" onChange={(e) => this.handleChange(e, "loginEmail")} />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="loginPassword">Password</label>
                        <input type="password" placeholder="Password" name="loginPassword" onChange={(e) => this.handleChange(e, "loginPassword")} />
                    </div>
                    <div className="logGroup">
                        <input type="submit" value="Login" />
                        <button className="btn-google" onClick={this.signInGoogle}><i className="fab fa-google"></i></button>
                    </div>
                </form>
            </div>
        )
    }
}

export default UserSignIn;