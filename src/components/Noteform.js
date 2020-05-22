import React, { useState } from 'react'

const Noteform = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }
  const addNote = (event) => {
    event.preventDefault()
    console.log(newNote)
    createNote({
      content: newNote,
      important: false
    })
    setNewNote('')
  }

  return(
    <div className='formDiv'>
      <h2> Create a new note </h2>
      <form onSubmit={addNote}>
        <input
          id='note-input'
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default Noteform
