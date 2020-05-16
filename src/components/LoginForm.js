import React, { useState } from 'react'
import PropTypes from 'prop-types'
import loginService from '../services/login.js'
import noteService from '../services/note.js'

const LoginForm = ({ handleUserLogin, setErrorMessage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleLogin =  async (event) => {
    event.preventDefault()
    try{
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      handleUserLogin(user)
      setUsername('')
      setPassword('')
    }
    catch(exception){
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      console.log('logging in with ', username, password)
    }
  }
  return(
    <form onSubmit ={handleLogin}>
      <div>
      username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
      password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )
}

LoginForm.propTypes = {
  handleUserLogin : PropTypes.func.isRequired
}

export default LoginForm
