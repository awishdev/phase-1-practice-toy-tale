let addToy = false;

const toysHolder = {}

document.querySelector(".add-toy-form").addEventListener("submit", handleSubmit);

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  getToys();

});

function handleSubmit(e){
  e.preventDefault();
  let toyObj = {
    name:e.target.name.value,
    image:e.target.image.value,
    likes: 0
  
  }
  fetch("http://localhost:3000/toys",{
    method: "POST",
    headers:
    {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body:JSON.stringify(toyObj)
  })
  .then(response => response.json())
  .then(toyData => renderToy(toyData));

}


function getToys(){
  fetch(`http://localhost:3000/toys`)
  .then(response => response.json())
  .then(data => data.forEach(toy => {
    renderToy(toy)}))
}

function renderToy(toy){
  let card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p id="${toy.id}-likes">${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>  
  `;
  toysHolder[`${toy.id}`] = {
    name: `${toy.name}`,
    image: `${toy.image}`,
    likes: toy.likes,
  };
  
  
  document.getElementById("toy-collection").appendChild(card);
  document.getElementById(`${toy.id}`).addEventListener("click", () =>  handleLike(toy.id));

}

function handleLike(id){
  toysHolder[`${id}`].likes = parseInt(toysHolder[`${id}`].likes) + 1;

  fetch(`http://localhost:3000/toys/${id}`,{
    method: "PATCH",
    headers:
    {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "likes": toysHolder[`${id}`].likes
    })
  })
  .then(response => response.json())
  .then((data) => {
    document.getElementById(`${data.id}-likes`).textContent = `${data.likes} Likes`;
  });

}