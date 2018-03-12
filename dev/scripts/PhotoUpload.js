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
            photoProgress:0,
            photoKeyArray: [],
            photosArray: []
        };
        this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
        this.removeImage = this.removeImage.bind(this);                
    }

    componentDidMount() {
        const photos = [];
        const userId = firebase.auth().currentUser.uid;
        const dbRef = firebase.database().ref(`/users/${userId}/people/${this.props.data.personIndex}/photos`);
        dbRef.on('value', (snapshot) => {
            const photos = snapshot.val();
            const photoArray = [];
            const photoKeys = [];
            for (let photoKey in photos) {
                photoArray.push(photos[photoKey])
                photoKeys.push([photoKey])
            }
            this.setState({
                photosArray: photoArray,
                photoKeyArray: photoKeys
            })
        })
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
                const userId = firebase.auth().currentUser.uid;
                const dbRef = firebase.database().ref(`/users/${userId}/people/${this.props.data.personIndex}/photos`);
                dbRef.push(url);
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
    removeImage(photoKey) {
        const userId = firebase.auth().currentUser.uid;
        const dbRef = firebase.database().ref(`/users/${userId}/people/${this.props.data.data.key}/photos/${photoKey}`);
        dbRef.remove();
    }

    render() {
        return (
            <React.Fragment>
                <div className="photoUploaded">
                    { this.state.photosArray.length > 0 ? 
                    <React.Fragment>
                            <li className="personCard-info">{this.state.photosArray.map((data,i) => {
                                return (
                                    <div className="photoSaved">
                                        <img src={data}/>
                                        <button onClick={() => this.removeImage(this.state.photoKeyArray)}>Remove</button>
                                    </div>
                                )
                            })}</li>
                       </React.Fragment>
                    : <p>Will be up soon!</p> }
                </div>
                <label className="btn-uploadPhoto">Upload Photo
                <FileUploader accept ="image/*" name="photo" randomizeFilename storageRef={firebase.storage().ref('images')} onUploadSuccess={this.handleUploadSuccess} hidden /></label>
            </React.Fragment>
        )
    }
}

export default PhotoUpload;

