//import logo from './logo.svg';
import './App.css';
import Post from './Post';
import React, {useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import {db, auth} from './Firebase';
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
    borderRadius: '15px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 'none',
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);

  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [signout, setSignOut] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const [button, setButton] = useState(false);
  const [darkMode, setDarkMode] = useState(false);


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

    function goTop(){
      window.scrollTo({top: 0, behavior: 'smooth'});
    }


    const toggleDarkMode = () => setDarkMode(darkMode ? false : true);





  return (
    <div className="App" data-theme={darkMode ? "dark" : "light"}>
      <Modal
        open={open}
        onClose={()=> setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        <form className='app__signup'>
          <center>
          <img className="app__headerImage" 
            src="famigram5.png"alt="" 
            height='70px'width='180px'
            />
          </center>
            <Input 
            placeholder="Username"
            type="text"
            value={username}
            disableUnderline = "true"
            onChange={(e)=> setUsername(e.target.value)}
            />
            <Input 
            placeholder="Email"
            type="text"
            value={email}
            disableUnderline = "true"
            onChange={(e)=> setEmail(e.target.value)}
            />
            <Input 
            placeholder="Password"
            type="password"
            disableUnderline = "true"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            />
            
            <Button className='signup__btn' onClick={signUp}><span id='su__btn'>Sign Up</span></Button>
              
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        <form className='app__signup'>
          <center>
          <img className="app__headerImage" 
            src="famigram5.png"alt="" 
            height='70px'width='180px'
            />
          </center>
            <Input 
            placeholder="Email"
            type="text"
            value={email}
            disableUnderline = "true"
            onChange={(e)=> setEmail(e.target.value)}
            />
            <Input 
            placeholder="Password"
            type="password"
            disableUnderline = "true"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            />
            
            <Button className='signin__btn' onClick={signIn}><span id="si__btn">Sign In</span></Button>
              
          </form>
        </div>
      </Modal>

      <Modal
        open={signout}
        onClose={()=> setSignOut(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        <form className='app__signup'>
          <center>
          {/* <img className="app__headerImage" 
            src="famigram5.png"alt="" 
            height='70px'width='180px'
            /> */}
          </center>
            
            <div className='so__btn'>
              <p><i class="fas fa-exclamation-triangle"></i> Are you sure you want to log out ? </p><br></br><br></br>
            <button onClick={() => auth.signOut()}>Yes</button><button onClick={() => setSignOut(false)} id='so__btn_no'>No</button>
            </div>
          </form>
        </div>
      </Modal>

      {/* App header */}
      

      <div className='app__header'>
        {/* <img className="app__headerImage" src="famigram5.png"alt="" height='60px'width='200px'/> */}
        
        {user ? (
          <div className="logged">
            <button id='userN' onClick={() => {setButton(true); goTop();}}><i class="fas fa-user"></i> {user.displayName}</button> <img className="app__headerImage" src="famigram5.png"alt="" height='40px'width='150px'/><Button  onClick={() => setSignOut(true)}><span className='btn__logout'>Log Out</span></Button>
          </div>
      ): (
        <div className='app__loginContainer'>
          <img className="app__headerImage2" src="famigram5.png"alt="" height='60px'width='170px'/>
          {/* <Button className='app__btn-login' onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button> */}
        </div>
      )}
      </div>
      {/* <br></br><br></br><br></br><br></br><br></br> */}
      {button ?(
        <>
        <div className='button_txt'>
          <div className='first__p'>
          {/* <img src='sasha.jpg' height="90px" width='90px' alt=''></img> */}
          <Avatar className='app__avatar' alt={user.displayName} src='#'/>
          <p>{user.displayName} <i class="fas fa-certificate"></i></p>
          <button onClick={()=> setButton(false)}>Back ←</button>
        </div>
        <p id='first_mail'>{user.email}</p><button id='app__btn__drk' onClick={toggleDarkMode}>Dark Mode <span id='moon'>☾</span></button><br/>
        <div className='counter_n'>
          <p>{(posts.length)}</p><p>0</p><p id='fling-count'>0</p>
        </div>
        <div className='counter_p'>
          <p>posts</p><p>followers</p><p>following</p>
        </div>
        <div className='img__tiles'>
          <img src='js.png' height='120px' width='120px' alt=''></img>
          <img src='react.png' height='120px'width='120px'alt=''></img>
          <img src='insta2.png' height='120px'width='120px'alt=''></img>
          <img src='john.jpg' height='120px'width='120px'alt=''></img>
          <img src='jimh.jpg' height='120px'width='120px'alt=''></img>
          <img src='mark.jpg' height='120px'width='120px'alt=''></img>
          <i class="fas fa-camera"></i>
        </div>
        
        
        </div>
        </>
      ):(
        <div></div>
      )}

      {/*Story*/}
      
      {user ? (
        <>
      <div className='app__story'>
      <div className="app__storyindi">
        <p id='prostory'>
        <img src='sasha.jpg' height='60px' width='60px' alt=''></img><br/>{user.displayName}<i class="fas fa-plus-circle"></i></p><p>
        <img src='jimh.jpg' height='50px' width='50px' alt=''></img><br/>jimHalp</p><p>
        <img src='john.jpg' height='50px' width='50px' alt=''></img><br/>JohnDD</p><p>
        <img src='mark.jpg' height='50px' width='50px' alt=''></img><br/>Mark1878</p><p>
        <img src='sarah.jpg' height='50px' width='50px' alt=''></img><br/>Sarah77</p><p>
        <img src='omer.jpg' height='50px' width='50px' alt=''></img><br/>omerAda</p>
        </div>
      </div>
      </>
      ) :(
        <div>

        </div>
      )}
      
      

        {/* Welcome section */}

      {user ? (
        <div className="app__welcome">
          <h2><span>Welcome back</span> {user.displayName} 😉</h2>
        </div>
      ) : (
        <div>

        </div>
      )}<br></br><br></br>

        {/* Post section/Login Signup page */}
          {/* Nested ternary operator to compare */}
      {user? (
          <div className='app__posts'>
            {
              posts.map(({id, post}) =>(
                <Post key={id} postId={id} user={user} username ={post.username} caption={post.caption} imageUrl={post.imageUrl} darkMode={darkMode} setDarkMode={setDarkMode}/>
              ))
            }
      </div>
      ):(
        <div className='app__welpage'>
        <center><br></br><br></br><br></br><br></br><br></br><br></br>
          <h1>Welcome to </h1><br/><img src='famigramw.png' height='60px' width='150px' alt=''></img><br/><br/><h3>social network</h3><br></br><br></br><br></br><br></br>
          <h3><br/><button className='signin__btn' onClick={() => setOpenSignIn(true)}>Connect →</button><br/><br/>OR<br/><br/><button onClick={() => setOpen(true)}>Create Account →</button></h3>
        </center>
        </div>
      )}
      
      

      
      
      {user?.displayName ?(
        <ImageUpload username={user.displayName} darkMode={darkMode} setDarkMode={setDarkMode}/>
      ): (
        // <h3>Sorry you need to log in to upload...</h3>
        <>
        </>
      )}
    </div>
  );
}

export default App;
