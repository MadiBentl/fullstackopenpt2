describe('Note app', function() {
  beforeEach(function() {
    cy.visit('http://localhost:3000')
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)

  })
  it('front page can be opened', function(){
    cy.contains('Notes')
  })
  it('login form can be opened', function(){
    cy.contains('login').click()
    cy.get('#username').type('mluukai')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()
    cy.contains('mluukai has logged in')
  })
  it('login fails with wrong password', function(){
    cy.contains('login').click()
    cy.get('#username').type('mluukai')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()
    cy.contains('wrong credentials')

  })
  describe('when logged in', function(){
    beforeEach(function(){
      cy.login({ username: 'mluukai', password: 'salainen'})
    })
    it('a new note can be created', function(){
      cy.contains('Add New Note').click()
      cy.get('#note-input').type('a new note created by cypress')
      cy.contains('save').click()
      cy.contains('a new note created by cypress')
    })
    describe('and a note exists', function(){
      beforeEach(function(){
        cy.contains('Add New Note').click()
        cy.get('#note-input').type('another note cypress')
        cy.contains('save').click()
      })
      it('it can be made important', function(){
        cy.contains('another note cypress')
          .contains('make important')
          .click()

        cy.contains('another note cypress')
          .contains('make not important')
          .click()
      })
    })
  })
})
