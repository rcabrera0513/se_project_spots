const initialCards = [
  {
  name: "Val Thorens", 
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg", 
}, 
  {
  name: "Restaurant terrace", 
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg", 
}, 
  {
  name: "An outdoor case", 
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg", 
}, 
  {
  name: "A very long bridge, over the forest...", 
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg", 
}, 
  {
  name: "Tunnel with morning light", 
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg", 
}, 
  {
  name: "Mountain house", 
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg", 
}, 
]; 

const editProfileBtn = document.querySelector(".profile__edit-btn");
const addCardBtn = document.querySelector(".profile__add-btn"); 
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editFormEl = editProfileModal.querySelector(".modal__form"); 
const nameInputEl = editFormEl.querySelector("#profile-name-input"); 
const descriptionInputEl = editFormEl.querySelector("#profile-description-input");

const addCardModal = document.querySelector("#new-post-modal");
const addCardCloseBtn = addCardModal.querySelector(".modal__close-btn");
const addCardFormEl = addCardModal.querySelector(".modal__form");
const captionInputEl = addCardFormEl.querySelector("#card-caption-input");
const linkInputEl = addCardFormEl.querySelector("#card-link-input");


const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card"); 
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title"); 
  const cardImageEl = cardElement.querySelector(".card__image");
  
  cardImageEl.src = data.link; 
  cardImageEl.alt = data.name; 
  cardTitleEl.textContent = data.name; 
  
  return cardElement; 
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

editProfileBtn.addEventListener("click", function () {
  nameInputEl.value = profileNameEl.textContent;
  descriptionInputEl.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

addCardBtn.addEventListener("click", function () {
  openModal(addCardModal);
}); 

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

addCardCloseBtn.addEventListener("click", function () {
  closeModal(addCardModal);
}); 

editFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();
  profileNameEl.textContent = nameInputEl.value; 
  profileDescriptionEl.textContent = descriptionInputEl.value; 
  closeModal(editProfileModal);
});

addCardFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();
  console.log(captionInputEl.value); 
  console.log(linkInputEl.value); 
  const cardElement = getCardElement();
  addCardModal.classList.remove("modal__is-opened");
}); 

initialCards.forEach(function (item) {
  const cardElement = getCardElement(item); 
  cardsList.append(cardElement); 
});