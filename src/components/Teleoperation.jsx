import React, { Component } from 'react';
import { Joystick } from 'react-joystick-component';
import config from "../scripts/config";

class Connection extends Component {
  constructor() {
    super();
    this.state = {
      ros: new window.ROSLIB.Ros(),
      connection: false,
    };

    this.handleMove = this.handleMove.bind(this);
    this.handleStop = this.handleStop.bind(this);
  }

  componentDidMount() {
    this.initConnection();
  }

  initConnection() {
    const { ros } = this.state;

    try {
      ros.connect('ws://'+config.ROSBRIDGE_SERVER_IP+':9090');

      ros.on('connection', () => {
        console.log('Connected to ROS Bridge.');
        // this.setState({ connection: true });
      });

      ros.on('close', () => {
        console.log('Connection to ROS Bridge closed.');
        // this.setState({ connection: false });
      });

      ros.on('error', (error) => {
        console.error('Error connecting to ROS Bridge:', error);
      });
    } catch (error) {
      console.error('Error connecting to ROS Bridge:', error);
    }
  }

  handleMove(event) {
    const { ros } = this.state;
  
    try {
      const cmdVel = new window.ROSLIB.Topic({
        ros: ros,
        name: '/cmd_vel',
        messageType: 'geometry_msgs/Twist',
      });
  
     
  
      // Adjust the linear and angular velocities based on joystick movement
      const twist = new window.ROSLIB.Message({
        linear: {
          x: event.y,
          y: 0.0,
          z: 0.0,
        },
        angular: {
          x: 0.0,
          y: 0.0,
          z: -event.x,
        },
      });
  
      cmdVel.publish(twist);
      console.log('Twist message published successfully.');
    } catch (error) {
      console.error('Error publishing Twist message:', error);
    }
  }
  

  handleStop(event) {
    // Your stop handling logic here...
    const { ros } = this.state;

    try {
      const cmdVel = new window.ROSLIB.Topic({
        ros: ros,
        name: '/cmd_vel',
        messageType: 'geometry_msgs/Twist',
      });

      const twist = new window.ROSLIB.Message({
        linear: {
          x: 0.0, // Scale the joystick value for linear velocity
          y: 0.0,
          z: 0.0,
        },
        angular: {
          x: 0.0,
          y: 0.0,
          z: 0.0, // Scale the joystick value for angular velocity
        },
      });

      cmdVel.publish(twist);
      console.log('Twist message published successfully.');
    } catch (error) {
      console.error('Error publishing Twist message:', error);
    }
  }
  

  render() {
    return (
      <div>
        <Joystick
          size={100}
          sticky={true}
          baseColor="#EEEEEE"
          stickColor="#BBBBBB"
          move={this.handleMove}
          stop={this.handleStop}
        ></Joystick>

        
      </div>
    );
  }
}

export default Connection;
