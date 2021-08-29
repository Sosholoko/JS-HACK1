import React, {useState} from 'react';
import firebase from 'firebase';
import {Button} from "@material-ui/core";
import {db, storage} from './Firebase';
import './ImageUpload.css';

function ImageUpload({username, darkMode, setDarkMode}) {
    const [caption, setCaption] = useState('');
    //const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

    const handleChange =(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const handleUpload =()=>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress logic
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error)=>{
                //error function
                console.log(error);
                alert(error.message);
            },
            ()=>{
                //complete function
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    //post img to db
                    db.collection('posts').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    });

                    setProgress(0);
                    setCaption('');
                    setImage(null);
                })
            }
        )
    }

// FINAL RESULT OF THE COMPONENT

    return (
        <>
        <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
        <div className="imageupload" data-theme={darkMode ? "dark" : "light"}>
            <progress className='imageupload__progress' value={progress} max="100"></progress>
            <input className='imageupload__input' type='text' placeholder='What happened there ?' 
            onChange={event => setCaption(event.target.value)} value={caption}> 
            </input>
            
            <input className="upload__btn" type='file' onChange={handleChange}></input>
            <Button className='imageupload__button' name='imageupload__button' onClick={handleUpload} disabled={!image}>
                <span class='upload__button'>Upload</span>
            </Button>
        </div>
        </>
    )
}

export default ImageUpload
