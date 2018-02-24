import React from 'react'; 

class UserSignIn extends React.Component {
    constructor() {
        super();
        this.state = {
            formToShow: '',
            createEmail: '',
            createPassword: '',
            loginEmail: '',
            loginPassword: '',
            loggedIn: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.formToShow = this.formToShow.bind(this);
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

    formToShow(e) {
        e.preventDefault();
        this.setState({
            formToShow: e.target.className
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
        };
    }

    signOut() {
        firebase.auth().signOut()
            .then(function(success) {
                console.log('Signed Out!')
        }), (error) => {
            console.log(error);
        };
    }
    
    render() {
        let loginForm = '';
        if (this.state.formToShow === 'createUser') {
            loginForm = (
                <form onSubmit={(e) => this.createUser(e)}>
                    <label htmlFor="email">Email:</label>
                    <input type="text" placeholder="Please enter your email address" name="email "onChange={(e) => this.handleChange(e, "createEmail")} />
                    <label htmlFor="password">Password:</label>
                    <input type="password" placeholder="Please enter your desired password" name="password" onChange={(e) => this.handleChange(e, "createPassword")} />
                    <input type="submit" value="Create User" />
                </form>
            );
        } else if (this.state.formToShow === 'signIn') {
            loginForm = (
                <form onSubmit={(e) => this.signIn(e)}>
                    <label htmlFor="loginEmail">Login Email:</label>
                    <input type="text" placeholder="Please enter your email address" name="loginEmail" onChange={(e) => this.handleChange(e, "loginEmail")} />
                    <label htmlFor="loginPassword">Login Password:</label>
                    <input type="password" placeholder="Please enter your password" name="loginPassword" onChange={(e) => this.handleChange(e, "loginPassword")} />
                    <input type="submit" value="Login" />
                </form>
            )
        }

        return (
            <div>
                <header>
                    <nav>
                        { this.state.loggedIn ?
                            <div className='signOut'>
                                <button onClick={this.signOut}>Sign Out</button>
                            </div>
                        : 
                            <ul>
                                <li><a href="" className="createUser" onClick={this.formToShow}>Sign Up</a></li>
                                <li><a href="" className="signIn" onClick={this.formToShow}>Log In</a></li>
                                {loginForm}
                            </ul>
                        }

                    
                    </nav>
                </header>
            </div>
        )
    }
}

export default UserSignIn;