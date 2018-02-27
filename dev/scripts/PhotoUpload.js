import React from 'react'; 
import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';
import PersonCard from './PersonCard';

var config = {
    apiKey: "AIzaSyDv3uV7RjBfNfCLpuQ-2t15ivgXCyuvSNg",
    authDomain: "person-log.firebaseapp.com",
    databaseURL: "https://person-log.firebaseio.com",
    projectId: "person-log",
    storageBucket: "person-log.appspot.com",
    messagingSenderId: "370922809098"
};
firebase.initializeApp(config);

class PhotoUpload extends React.Component {
    constructor() {
        super();
        this.state = {
            photos: [],
            photoURL: '',
            isUploading: false,
            photoProgress:0
        };
        this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
        this.handleSaveImage = this.handleSaveImage.bind(this);
    }

    handleProgress(progress) {
        this.setState({
            photoProgress: progress
        });
    }

    handleUploadSuccess(filename) {
        this.setState({
            photos: filename,
            isUploading: false,
            progress: 100,
        });

        firebase.storage().ref('images').child(filename).getDownloadURL()
            .then((url) => {
                this.setState({
                    photoURL: url
                })
            }), (error) => {
                console.log(error);
                this.setState({
                    isUploading: false
                })
            }
    }

    handleSaveImage() {
        const userId = firebase.auth().currentUser.uid; 
        const dbRef= firebase.database().ref(`/users/${userId}/people/${this.props.data.personIndex}/photos`);
        dbRef.push(this.state.photoURL);
        this.setState({
            photos: this.state.photoURL
        })
    }
    render() {
        return (
            <div>
                { this.state.photoURL !== '' 
                ? <div className="photoUploaded">
                    <img src={this.state.photoURL} />
                        <button onClick={this.handleSaveImage}><i className="fas fa-upload"></i></button>
                </div>
                : null}
                <label className="btn-uploadPhoto">Upload Idea
                <FileUploader accept ="image/*" name="photo" randomizeFilename storageRef={firebase.storage().ref('images')} onUploadSuccess={this.handleUploadSuccess} hidden /></label>

            </div>
        )
    }
}

export default PhotoUpload;

