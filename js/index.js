let users = []

const getAllUsers = () => {
  fetch('http://localhost:3000/users')
  .then(res => res.json())
  .then(data => users = [...data])
}

const getCurrentUser = () => {
  let randomId = Math.floor(Math.random() * 10) + 1
  return users[randomId]
}

const getAllBooks = () => {
  fetch('http://localhost:3000/books')
  .then(res => res.json())
  .then(data => data.forEach(book => renderABook(book)))
}

const renderABook = book => {
  const showPanel = document.querySelector('div#show-panel')
  const li = document.createElement('li')
  li.innerText = book.title
  document.querySelector('ul#list').appendChild(li)

  li.addEventListener('click', () => {
    showPanel.innerHTML = ''
    const div = document.createElement('div')
    const ul = document.createElement('ul')
    
    const currentUser = getCurrentUser()
    currentUser.id = +currentUser.id
    
    let likedUsersIds = book.users.map(user => user.id)
    let isUserLikedBook = likedUsersIds.includes(currentUser.id)
    
    div.id = book.id
    const subtitle = book.subtitle ? `<h4>${book.subtitle}</h4>` : ''
    div.innerHTML = `
      <img src=${book.img_url}/>
      <h4>${book.title}</h4>
      ${subtitle}
      <h4>${book.author}</h4>
      <p>${book.description}</p>
    `
    book.users.forEach(user => renderUser(user, ul))
    div.appendChild(ul)
    const btn = document.createElement('button')
    btn.textContent = isUserLikedBook ? 'UNLIKE' : 'LIKE'
    btn.addEventListener('click', () => {
      if(isUserLikedBook) {
        btn.textContent = 'LIKE'
        const index = likedUsersIds.indexOf(currentUser.id)
        book.users.splice(index, 1)
        console.log('book.users:', book.users)
        fetch(`http://localhost:3000/books/${book.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(book)
        })
        .then(res => res.json())
        .then(userData => {
          ul.innerHTML = ''
          userData.users.forEach(user => renderUser(user, ul))
        })
      } else {
        btn.textContent = 'UNLIKE'
        book.users = [...book.users, currentUser]
        console.log(book.users)
        fetch(`http://localhost:3000/books/${book.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(book)
        }).then(res => res.json())
        .then(userData => {
          console.log('Data with added like:', userData)
          const li = document.createElement('li')
          li.id = currentUser.id
          li.textContent = currentUser.username
          ul.appendChild(li)
        })
      }
    })
    div.appendChild(btn)
    showPanel.appendChild(div)
  })
}

const renderUser = (comment, el) => {
  const li = document.createElement('li')
  li.textContent = comment.username
  li.id = comment.id
  el.appendChild(li)
}

document.addEventListener("DOMContentLoaded", function() {
  getAllUsers()
  getAllBooks()
});