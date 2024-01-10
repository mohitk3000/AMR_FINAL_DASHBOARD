import React, { useState } from 'react';
import { Row, Col, Container, Button } from 'react-bootstrap';
import config from "../scripts/config";

class RobotState extends React.Component {
  state = {
    ros:null,
    x:0,
    y:0,
    orientation:0,
    linear_velocity:0,
    angular_velocity:0,
  };
  constructor(){
    super();
    this.init_connection();
  }
  
  init_connection(){
    
this.state.ros = new window.ROSLIB.Ros();

    try {
      this.state.ros.connect('ws://'+config.ROSBRIDGE_SERVER_IP+':9090');

      this.state.ros.on('connection', () => {
        console.log('Connected to ROS Bridge.');
        // this.setState({ connection: true });
      });

      this.state.ros.on('close', () => {
        console.log('Connection to ROS Bridge closed.');
        // this.setState({ connection: false });
      });

      this.state.ros.on('error', (error) => {
        console.error('Error connecting to ROS Bridge:', error);
      });
    } catch (error) {
      console.error('Error connecting to ROS Bridge:', error);
    }
  }
  pose_subscriber = new window.ROSLIB.Topic({
    ros:this.state.ros,

  });

  
  render() {
    return (
      <div>
        <Row>
            <Col>
            <h4 className='mt-4'>Position
            </h4>
            <p className='mt-0'>x:{this.state.x}</p>
            <p className='mt-0'>y:{this.state.y}</p>
            <p className='mt-0'>Orientation:{this.state.orientation}</p>

            </Col>
        </Row>
        <Row>
            <Col>
            <h4 className='mt-4'>Velocities
            </h4>
            <p className='mt-0'>Linear Velocity:{this.state.linear_velocity}</p>
            <p className='mt-0'>Angular Velocity:{this.state.angular_velocity}</p>
           
            </Col>
        </Row>

      </div>
    );
  }
}

export default RobotState;
