import React from 'react';
import PhotoUpload from './PhotoUpload';
import moment from 'moment';


const PersonCard = (props) => {
    return (
        <div className="personCard">
            <div className="personCard-general">
                <div className="personCard-photo">
                    <img src="https://api.adorable.io/avatars/100/hello@mycupofthi.com.png" alt=""/>
                </div>
                <div className="personCard-bg">
                    <h2 className="personCard-name">{props.data.name}</h2>
                    <ul>
                        <li><h3>Birthday</h3></li>
                        { props.data.birthday !== ''
                        ? <li className="personCard-info">{moment(new Date(props.data.birthday)).utc().format('MMMM D')}</li>
                        : <p>TBA</p>}
                    </ul>
                </div>
            </div>
            <ul>
                <li><h3>Birthday</h3></li>
                {props.data.birthday !== ''
                    ? <li className="personCard-info">{moment(new Date(props.data.birthday)).utc().format('MMMM D')}</li>
                    : <p>TBA</p>}

                <li><h3>Interests</h3></li>
                {props.data.interests !== ''
                    ? <li className="personCard-info">{props.data.interests}</li>
                    : <p>TBA</p>}
                <PhotoUpload data={props} />
            </ul>
            <button className="remove-btn" onClick={() => props.remove(props.personIndex)}><i className="far fa-times-circle"></i></button>
        </div>
    )
}


export default PersonCard;