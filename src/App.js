import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Noteform from './components/Noteform'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import noteService from './services/note'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }
  const loginForm = () => {
    const hideWhenVisible = {display: loginVisible ? 'none' : ''}
    const showWhenVisible = {display: loginVisible ? '' : 'none'}
    return(
      <div>
        <div style={hideWhenVisible}>
          <button onClick = {() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            handleLogin= {handleUserLogin}
            setErrorMessage = {setErrorMessage}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }
  const handleUserLogin =  async () => {
    try{
      noteService.setToken(user.token)
      setUser(user)
    }
    catch(exception){
      setErrorMessage('wrong credentials')
      setTimeout(()=> {
        setErrorMessage(null)
      }, 5000)
  }
}
  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }
  const noteFormRef = React.createRef()

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)


  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in </p>
        </div>}
        <Togglable buttonLabel={'Add New Note'} ref={noteFormRef}>
          <Noteform createNote={addNote}/>
        </Togglable>
        <div>
          <button onClick={() => setShowAll(!showAll)}>
            show {showAll ? 'important' : 'all' }
          </button>
        </div>
      <ul>
        {notesToShow.map((note, i) =>
          <Note
            key={i}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>

    </div>
  )
}

export default App
