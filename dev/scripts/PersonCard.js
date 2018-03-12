import React from 'react';
import PhotoUpload from './PhotoUpload';
import moment from 'moment';


class PersonCard extends React.Component {
    constructor() {
        super();
        this.state = {
            photos: [],
            photoKeyArray: [],
            editBirthday: false,
            editInterests: false,
            person: {}
        }
        this.saveBirthday = this.saveBirthday.bind(this);
        this.saveInterests = this.saveInterests.bind(this);

    }

    componentDidMount() {
        this.setState({
            person: this.props.data
        })
    }

    saveBirthday(e) {
        e.preventDefault();
        const userId = firebase.auth().currentUser.uid;
        const dbRef = firebase.database().ref(`/users/${userId}/people/${this.props.data.key}`)
        dbRef.update({
            birthday: this.personBirthday.value,
        });
        this.setState({
            editBirthday: false,
        })
    }

    saveInterests(e) {
        e.preventDefault();
        const userId = firebase.auth().currentUser.uid;
        const dbRef = firebase.database().ref(`/users/${userId}/people/${this.props.data.key}`)
        dbRef.update({
            interests: this.personInterests.value,
        });
        this.setState({
            editInterests: false,
        })
    }
    render() {
        
        // Birthday Edit
        let editBirthday = (
            <div>
            { moment(new Date(this.props.data.birthday)).utc().format('MMMM D') }
            </div>
        )
        let newBirthday = (
            <div>
                <p>To Be Soon Dated</p>
            </div>
        )
        if (this.state.editBirthday) {
            editBirthday = (
                <form onSubmit={this.saveBirthday}>
                    <input type="date" defaultValue={this.props.data.birthday} id="birthday" onChange={this.handleChange} ref = {ref => this.personBirthday =ref}/>  
                    <button className="submit" ><i className="fas fa-check-circle"></i></button>
                </form>
            )
            newBirthday = (
                <form onSubmit={this.saveBirthday}>
                    <input type="date" defaultValue={this.state.birthday} id="birthday" onChange={this.handleChange} ref={ref => this.personBirthday = ref} />
                    <button className="submit" ><i className="fas fa-check-circle"></i></button>
                </form>
            )
        }

        // Interests Iedit
        let editInterests = (<div> {this.props.data.interests} </div>)
        let newInterests = (<div><p>To Be Soon Announced</p></div>)
        if (this.state.editInterests) {
            editInterests = (
                <form onSubmit={this.saveInterests}>
                    <textarea name="interests" defaultValue={this.props.data.interests} id="interests" cols="10" rows="5" onChange={this.handleChange} id="interests" placeholder="What would you like to add?" ref={ref => this.personInterests = ref}></textarea>                   
                    <button className="submit" ><i className="fas fa-check-circle"></i></button>
                </form>
            )
            newInterests = (
                <form onSubmit={this.saveInterests}>
                    <textarea name="interests" defaultValue={this.props.data.interests} id="interests" cols="10" rows="5" onChange={this.handleChange} id="interests" placeholder="What would you like to add?" ref={ref => this.personInterests = ref}></textarea>
                    <button className="submit" ><i className="fas fa-check-circle"></i></button>
                </form>
            )
        }

        return (       
            <div className="personCard">
                <img className="profile" src={'https://api.adorable.io/avatars/285/' + this.props.data.name + '.png'} alt=""/>
                <h2 className="personCard-name">{this.props.data.name}</h2>
                <ul>
                    <li><h3>Birthday</h3></li>
                    {this.props.data.birthday !== ''
                        ? <li id="editHover" className="personCard-info" onClick={() => this.setState({ editBirthday: true })}>{editBirthday}</li>
                        : <li id="editHover" onClick={() => this.setState({ editBirthday: true })}>{newBirthday}</li>}
    
                    <li><h3>Interests or Special Notes</h3></li>
                    {this.props.data.interests !== ''
                        ? <li id="editHover"className="personCard-info" onClick={() => this.setState({ editInterests: true })}>{editInterests}</li>
                        : <li id="editHover"onClick={() => this.setState({ editInterests: true })}>{newInterests}</li>}

                    <li><h3>Pictures</h3></li>
                    <PhotoUpload data={this.props} />
                </ul>
                <button className="remove-btn" onClick={() => this.props.remove(this.props.personIndex)}><i className="fas fa-times-circle"></i></button>
            </div>
        )
    }
}


export default PersonCard;