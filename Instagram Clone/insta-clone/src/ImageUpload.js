import React, {useState} from 'react';
import firebase from 'firebase';
import {Button} from "@material-ui/core";
import {db, storage} from './Firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import './ImageUpload.css';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

    const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 280,
        backgroundColor: theme.palette.background.paper,
        borderRadius: '15px',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        outline: 'none',
    },
    }));




function ImageUpload({username, darkMode, setDarkMode, button, setButton}) {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [caption, setCaption] = useState('');
    //const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);
    const [uploadModal, setUploadModal] = useState(false);

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
                    setUploadModal(false);
                })
            }
        )
    }

    function goTop(){
        window.scrollTo({top: 0, behavior: 'smooth'});
        }


// FINAL RESULT OF THE COMPONENT

    return (
        <>
        <br></br>
        <div className="imageupload" data-theme={darkMode ? "dark" : "light"}>

            <Modal
            open={uploadModal}
            onClose={()=> setUploadModal(false)}
        >
            <div style={modalStyle} className={classes.paper}>
            <form className='image__upload'>
            <center>
                <h2>Upload your picture !</h2><br/><br/>
                <input className="uploade__btn" type='file' onChange={handleChange}></input><br/>
                <input className='imageuploade__input' type='text' placeholder='What happened there ?' 
                onChange={event => setCaption(event.target.value)} value={caption}> 
                </input><br/><br/>
                <progress className='imageupload__progress' value={progress} max="100"></progress><br/>
                <Button className='imageupload__button' name='imageupload__button' onClick={handleUpload} disabled={!image}>
                <span class='upload__button'>Upload <i class="fas fa-arrow-circle-up"></i></span>
                </Button>
                
            </center>
            </form>
            </div>
        </Modal>

            <div className='img__up__'>
            {/* <progress className='imageupload__progress' value={progress} max="100"></progress>
            <input className='imageupload__input' type='text' placeholder='What happened there ?' 
            onChange={event => setCaption(event.target.value)} value={caption}> 
            </input> */}
            <button id='lo__btn' onClick= {()=> {setButton(false); goTop();}}><i class="fas fa-home"></i></button>
            {/* <input className="upload__btn" type='file' onChange={handleChange}></input> */}
            <button id='plus__btn' onClick={()=> setUploadModal(true)}><span id='plus__sign'>+</span></button>
            {/* <Button className='imageupload__button' name='imageupload__button' onClick={handleUpload} disabled={!image}>
                <span class='upload__button'>Upload</span>
            </Button> */}
            <button id= 'id__btn' onClick = {() => {setButton(true); goTop();}}><i class="far fa-user-circle"></i></button>
            
            </div>
            
        </div>
        </>
    )
}

export default ImageUpload
