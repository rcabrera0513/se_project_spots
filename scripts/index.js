const initialCards = [
  {
  name: "Golden Gate Bridge", 
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
},
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
const addCardBtn = document.querySelector(".profile__new-post-btn"); 
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
const linkInputEl = addCardFormEl.querySelector(".modal__submit-btn");

const previewModal = document.querySelector("#preview-modal"); 
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image"); 
const previewModalCaption = document.querySelector(".modal__caption");

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

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn"); 
  cardLikeBtnEl.addEventListener("click", () => {
    cardLikeBtnEl.classList.toggle("card__like-btn_active");
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn"); 
  cardDeleteBtnEl.addEventListener("click", () => {
    cardElement.remove(); 
  }); 

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link; 
    previewImageEl.alt = data.name; 
    previewModalCaption.textContent = data.name; 
    openModal(previewModal);
  });
  
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

previewModalCloseBtn.addEventListener("click", function () {
  previewModal.classList.remove("modal_is-opened");
})

addCardCloseBtn.addEventListener("click", function () {
  addCardModal.classList.remove("modal_is-opened");
}); 

editFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();
  profileNameEl.textContent = nameInputEl.value; 
  profileDescriptionEl.textContent = descriptionInputEl.value; 
  closeModal(editProfileModal);
});

addCardFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();
  
  const inputValues = {
    name: captionInputEl.value, 
    link: linkInputEl.value,
  }; 

  const cardElement = getCardElement(inputValues);
    cardsList.prepend(cardElement);

   addCardModal.classList.remove("modal_is-opened");
}); 

initialCards.forEach(function (item) {
  const cardElement = getCardElement(item); 
  cardsList.append(cardElement); 
});