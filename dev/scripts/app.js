import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      birthday: '',
      interests: ''
    };
  }
  handleChange
    render() {
      return (
        <div>
          
          {/* create a form that will take the name, interests and birthday of the person */}
          <form action="">
            <label htmlFor="name">Name:</label>
            <input type="text" value="Enter name" onChange="handleChange" id="name" />
            <label htmlFor="birthday">Birthday:</label>
            <input type="text" value="mm-dd" id="birthday" onChange="handleChange" />
            <label htmlFor="interests">Interests:</label>
            <input type="text" value="Enter interests" onChange="handleChange" id="interests" />
            <input type="submit" value="Add Person" />
          </form>
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
