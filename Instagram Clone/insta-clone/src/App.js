//import logo from './logo.svg';
import './App.css';
import Post from './Post';
import React, {useState, useEffect} from 'react';
import {db, auth, storage} from './Firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';

// import 'firebase/firestore';


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
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //user logged in
        console.log(authUser);
        setUser(authUser);
      }
      else{
        //user has logged out
        setUser(null);
      }
    })
    return () =>{
      //perform cleanup action
      unsubscribe();
    }
  }, [user, username]);


//use code when specific condition are listed
//empty brackets means the code will only run once when page loaded
  useEffect(()=>{
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot =>{
      //snapshot is for evrytime is db is changing, so execute code
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

    const signUp = (event) =>{
      event.preventDefault();

      auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser)=>{
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error)=>alert(error.message));

      setOpen(false);
    }

    const signIn = (event) =>{
      event.preventDefault();

      auth
      .signInWithEmailAndPassword(email, password)
      .catch((error)=> alert(error.message))

      setOpenSignIn(false);
    }

  return (
    <div className="App">

      
      

      <Modal
        open={open}
        onClose={()=> setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        <form className='app__signup'>
          <center>
          <img className="app__headerImage" 
            src="famygram.png"alt="" 
            height='70px'width='180px' alt=""
            />
          </center>
            <Input 
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e)=> setUsername(e.target.value)}
            />
            <Input 
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            />
            <Input 
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            />
            
            <Button onClick={signUp}>Sign Up</Button>
              
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=> setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        <form className='app__signup'>
          <center>
          <img className="app__headerImage" 
            src="famygram.png"alt="" 
            height='70px'width='180px' alt=""
            />
          </center>
            <Input 
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            />
            <Input 
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            />
            
            <Button onClick={signIn}>Sign In</Button>
              
          </form>
        </div>
      </Modal>


      <div className='app__header'>
        <img className="app__headerImage" src="famygram2.png"alt="" height='60px'width='200px'/>
        
        {user ? (
          <div className="logged">
            <span id='userN'>{user.displayName}</span><Button  onClick={() => auth.signOut()}><span className='btn__logout'>Log Out</span></Button>
          </div>
      ): (
        <div className='app__loginContainer'>
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
      )}
      </div>
      
      

      {/* header*/}
      <br></br><br></br><br></br><br></br><br></br>
      {user ? (
      <div className='app__story'>
        <p><img src='jimh.jpg' height='60px' width='60px'></img><br/>jimHalp</p><p id='prostory'><img src='sasha.jpg' height='60px' width='60px'></img><br/>{user.displayName}</p><p><img src='john.jpg' height='60px' width='60px'></img><br/>JohnDD</p><p><img src='mark.jpg' height='60px' width='60px'></img><br/>Mark1878</p><p><img src='sarah.jpg' height='60px' width='60px'></img><br/>Sarah77</p><p><img src='omer.jpg' height='60px' width='60px'></img><br/>omerAda</p>
      </div>
      ) :(
        <div>
{/* <p><img src='adar.jpg' height='60px' width='60px'></img><br/>adarH</p> */}
        </div>
      )}
      {user ? (
        <div className="app__welcome">
          <h2><span>Welcome back</span> {user.displayName}</h2>
        </div>
      ) : (
        <div>

        </div>
      )}<br></br><br></br>

      <div className='app__posts'>
        {
        posts.map(({id, post}) =>(
          <Post key={id} postId={id} user={user} username ={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }
      </div>

      
      
      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ): (
        <h3>Sorry you need to log in to upload...</h3>
      )}
      {/* Posts*/}
      
      {/* Posts*/}
    </div>
  );
}

export default App;
