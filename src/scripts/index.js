import "../pages/index.css";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "f68a5f4c-877a-4883-a993-ebbc32a66d1e",
    "Content-Type": "application/json"
  }
});

let currentUserData = null;
let selectedCard;
let selectedCardId;
const cardIdMap = new Map(); // Store card element -> card ID mapping

// Query all DOM elements BEFORE making API calls
const editProfileBtn = document.querySelector(".profile__edit-btn");
const addCardBtn = document.querySelector(".profile__new-post-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editFormEl = editProfileModal.querySelector(".modal__form");
const nameInputEl = editFormEl.querySelector("#profile-name-input");
const descriptionInputEl = editFormEl.querySelector(
  "#profile-description-input",
);

const addCardModal = document.querySelector("#new-post-modal");
const addCardCloseBtn = addCardModal.querySelector(".modal__close-btn");

const avatarModal = document.querySelector("#avatar-modal");
const avatarFormEl = avatarModal.querySelector(".modal__form");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarFormEl.querySelector("#profile-avatar-input");
const profileAvatarEl = document.querySelector(".profile__avatar");

const addCardFormEl = addCardModal.querySelector(".modal__form");
const captionInputEl = addCardFormEl.querySelector("#card-caption-input");
const linkInputEl = addCardFormEl.querySelector("#card-image-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewModalCaption = document.querySelector(".modal__caption");

const deleteCardModal = document.querySelector("#delete-modal");
const deleteForm = deleteCardModal.querySelector("#delete-form");
const deleteFormCancelBtn = deleteForm.querySelector("button[type='button']");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

// Fetch and render initial data
api.getAppInfo()
  .then(([userData, cards]) => {
    currentUserData = userData;
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    profileAvatarEl.src = userData.avatar;
    profileAvatarEl.alt = userData.name;

    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;
  cardIdMap.set(cardElement, data._id); // Store the card ID in a Map

const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardLikeBtnEl.addEventListener("click", () => {
  cardLikeBtnEl.classList.toggle("card__like-btn_active");
  });

const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtnEl.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = cardIdMap.get(cardElement);
    handleDeleteCard();
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
  document.addEventListener("keydown", handleEscape);
  modal.addEventListener("mousedown", handleOverlayClick);
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function handleOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt.currentTarget);
  }
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  api.editAvatarInfo({
    avatar: avatarInput.value,
  })
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      profileAvatarEl.alt = data.name;
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.error(`Error updating avatar: ${err}`);
    });
}

function handleDeleteCard() {
  openModal(deleteCardModal);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
  modal.removeEventListener("mousedown", handleOverlayClick);
}

function resetValidation(formEl) {
  const inputList = Array.from(
    formEl.querySelectorAll(settings.inputSelector)
  );
  const submitButton = formEl.querySelector(
    settings.submitButtonSelector
  );

  inputList.forEach((inputEl) => {
    hideInputError(formEl, inputEl);
  });

  toggleButtonState(inputList, submitButton);
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
  editFormEl.reset();
  resetValidation(editFormEl);
  closeModal(editProfileModal);
});

previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

addCardCloseBtn.addEventListener("click", function () {
  addCardFormEl.reset();
  resetValidation(addCardFormEl);
  closeModal(addCardModal);
});

editFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();
  api.editUserInfo({
    name: nameInputEl.value,
    about: descriptionInputEl.value,
  })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      currentUserData = data;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error(`Error updating profile: ${err}`);
    });
});

avatarModalBtn.addEventListener("click", function () {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", function () {
  avatarFormEl.reset();
  resetValidation(avatarFormEl);
  closeModal(avatarModal);
});

avatarFormEl.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  if (selectedCard) {
    api.deleteCard(selectedCardId)
      .then(() => {
        cardIdMap.delete(selectedCard);
        selectedCard.remove();
        selectedCard = null;
        selectedCardId = null;
      })
      .catch((err) => {
        console.error(`Error deleting card: ${err}`);
      });
  }
  closeModal(deleteCardModal);
});

deleteFormCancelBtn.addEventListener("click", function () {
  selectedCard = null;
  selectedCardId = null;
  closeModal(deleteCardModal);
});

addCardFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();
  api.addCard({
    name: captionInputEl.value,
    link: linkInputEl.value,
  })
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      addCardFormEl.reset();
      resetValidation(addCardFormEl);
      closeModal(addCardModal);
    })
    .catch((err) => {
      console.error(`Error adding card: ${err}`);
    });
});
enableValidation(settings);