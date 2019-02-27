import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Camera, {IMAGE_TYPES} from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { AST_PropAccess } from 'terser';

const subscriptionKey = process.env.REACT_APP_FACE_API_SUBSCRIPTION_KEY;

const Image = (props) => {
	return (
  <div>
  <img style={{width:500}} src={props.imageUrl}/>
  </div>
  )
} 

const Info = (props) => {
	 var emotions = [];
	 if ((props.faceAttributes.emotion !== undefined || props.faceAttributes.length != 0 )&& props.errorMessage == "") { 
		emotions = props.faceAttributes.emotion;
	 }
	 else {
		 return (
			<div style={{color:"red"}}><h3>{props.errorMessage}</h3></div>
		 );
	 }
	return (
  	<div>
      <div> <h3><b>Guessed age is:</b> {props.faceAttributes.age}</h3> </div>
	  <div>
		  {
			  Object.keys(emotions).map((emotion, key) => 
			  <span key={key}><b>{emotion}:</b> {emotions[emotion]} </span>
		  )}
			</div>	
    </div>
  )
}

class FaceRecognitionForm extends React.Component {
	state = { imageUrl: ''}
  	handleSubmit = (event) => {
		
  	event.preventDefault();

	fetch('https://northeurope.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceID=false&&returnFaceAttributes=age,emotion', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Ocp-Apim-Subscription-Key' : subscriptionKey,
		},
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
			value = {this.state.imageUrl}
			onChange = {(event) => this.setState({ imageUrl: event.target.value })}
        	placeholder="Enter image url" />
        <button className="btn-info" type="submit">Do some magic </button>
      </form>
      </div>
    )
  }
}


class FaceRecognition extends Component {
	state = {
		faceAttributes: [],
		imageUrl: '',
		errorMessage: "",
	};

	addFaceInfo = (faceInfo, imageUrl) => {
		this.setState(prevState => ({
			faceAttributes: faceInfo.faceAttributes,
			imageUrl: imageUrl,
		}));
	}

	addErrorMessage = (errorMessage) => {
		this.setState({errorMessage: errorMessage,})
	}

	createBlob (dataUri, blobType) {
		var binary = atob(dataUri.split(',')[1]), array = [];
		for(var i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i));
		return new Blob([new Uint8Array(array)], {type: blobType});
	}

	onTakePhoto (dataUri) {
		var blob = this.createBlob(dataUri);

		fetch('https://northeurope.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceID=false&&returnFaceAttributes=age,gender,emotion', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					// 'Content-Type': 'application/json',
					'Content-Type' : 'application/octet-stream',
					'Ocp-Apim-Subscription-Key' : subscriptionKey,
				},
				body: blob,
			}).then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error(response.statusText);
				}
		  }).then(data => {
			  if(data.length != 0){
				this.addFaceInfo(data[0], dataUri);
				this.addErrorMessage("");
			  }
			  else {
				  this.addErrorMessage("No face detected");
			  }
		  })
	}

	render() {
		return (
		<div className="FaceRecognition">
			<FaceRecognitionForm onSubmit={this.addFaceInfo} imageUrl={this.state.imageUrl}/>
			<Image imageUrl={this.state.imageUrl} />
			<Info faceAttributes={this.state.faceAttributes} errorMessage={this.state.errorMessage}/>
			<Camera onTakePhoto = {(dataUri) => {this.onTakePhoto(dataUri) } } 
					idealResolution = {{width: 640, height: 480}}
					imageType = {IMAGE_TYPES.JPG}
					/>
		</div>

		);
	}
}

class App extends React.Component {
	render () {
		return (
			<div className="App">
				<FaceRecognition />
			</div>
		)
	}
}

export default App;
