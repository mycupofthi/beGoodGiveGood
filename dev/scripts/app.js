import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      people = [],
      
    }
  }
    render() {
      return (
        <div>
          
          {/* create a form that will take the name, interests and birthday of the person */}
          <form action="">
            <label htmlFor="name">Name:</label>
            <input type="text" value="Enter name" onChange="" id="name" />
            <label htmlFor="birthday">Birthday:</label>
            <input type="text" value="Enter Birthday" id="birthday" />
            <label htmlFor="interests">Interests:</label>
            <input type="text" value="Enter interests" onChange="" id="interests" />
            <input type="submit" value="Add Person" />
          </form>
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
