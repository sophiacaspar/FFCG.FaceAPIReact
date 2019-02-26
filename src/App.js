import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Camera, {IMAGE_TYPES} from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

const subscriptionKey = process.env.REACT_APP_FACE_API_SUBSCRIPTION_KEY;
const Image = (props) => {
	return (
  <div>
  <img style={{width:300}} src={props.imageUrl}/>
  </div>
  )
} 

const Info = (props) => {
	return (
  	<div>
      <div> <h3><b>Guessed age is:</b> {props.faceAttributes.age}</h3> </div>	
    </div>
  )
}

class FaceRecognitionForm extends React.Component {
	
	state = { imageUrl: ''}
  	handleSubmit = (event) => {
		
  	event.preventDefault();

	fetch('https://northeurope.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceID=false&&returnFaceAttributes=age', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			//'Content-Type' : 'application/octet-stream',
			'Ocp-Apim-Subscription-Key' : subscriptionKey,
		},
		//body: this.props.imageUrl,
		body: JSON.stringify({
			url: this.state.imageUrl,
		})
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			throw new Error(response.statusText);
		}
  }).then(data => {
		this.props.onSubmit(data[0], this.state.imageUrl);
  })
}    
	render () {
  	return (
    	<div style={{textAlign:"center"}}>
		<form onSubmit={this.handleSubmit}>
		  <input type="text" 
		  	//value = {this.props.imageUrl}
			value = {this.state.imageUrl}
			onChange = {(event) => this.setState({ imageUrl: event.target.value })}
        	placeholder="Enter image url" />
        <button className="btn-info" type="submit">Do some magic </button>
      </form>
      </div>
    )
  }
}




class App extends Component {
	state = {
		faceAttributes: [],
		imageUrl: '',
	};

	addFaceInfo = (faceInfo, imageUrl) => {
		this.setState(prevState => ({
			faceAttributes: faceInfo.faceAttributes,
			imageUrl: imageUrl,

		}));
	}

	// onTakePhoto (dataUri) {
	// 	var blob = new Blob([dataUri], {type: 'application/octet-stream' })
	// 	this.setState( {imageUrl: blob})
	// 	// fetch('https://northeurope.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceID=false&&returnFaceAttributes=age', {
	// 	// 		method: 'POST',
	// 	// 		headers: {
	// 	// 			'Accept': 'application/json',
	// 	// 			// 'Content-Type': 'application/json',
	// 	// 			'Content-Type' : 'application/octet-stream',
	// 	// 			'Ocp-Apim-Subscription-Key' : "f57b209714764e939217cacf889e29df",
	// 	// 		},
	// 	// 		body: JSON.stringify({
	// 	// 			data: blob,
	// 	// 			//url: this.state.imageUrl,
	// 	// 		})
	// 	// 	}).then(response => {
	// 	// 		if (response.ok) {
	// 	// 			return response.json();
	// 	// 		} else {
	// 	// 			throw new Error(response.statusText);
	// 	// 		}
	// 	//   }).then(data => {
	// 	// 	  console.log(data);
	// 	// 		//this.props.onSubmit(data[0], this.state.imageUrl);
	// 	// 		//this.props.onSubmit(data[0])
	// 	// 		console.log(data);
	// 	//   })
	// }

	render() {
		return (
		<div className="App">
			<FaceRecognitionForm onSubmit={this.addFaceInfo} imageUrl={this.state.imageUrl}/>
			<Image imageUrl={this.state.imageUrl} />
			<Info faceAttributes={this.state.faceAttributes}/>
			<Camera onTakePhoto = {(dataUri) => {this.onTakePhoto(dataUri) } } 
				imageType = {IMAGE_TYPES.JPG}/>

		</div>

		);
	}
}

export default App;
