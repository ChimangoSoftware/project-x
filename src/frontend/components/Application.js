import React from 'react';

export default class Application extends React.Component {
  render() {
    return (
      <div>
        <h1>Test!!!</h1>
        { this.props.example.text }
        { this.props.example.id }
      </div>
    );
  }
}