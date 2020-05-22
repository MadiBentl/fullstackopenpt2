Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password })
    .then(res => {
      localStorage.setItem('loggedNoteappUser', JSON.stringify(res.body))
      cy.visit('http://localhost:3000')
    })
})
