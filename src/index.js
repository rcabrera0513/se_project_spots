import "./index.css";
import { enableValidation, settings, hideInputError, toggleButtonState } from "./utils/validation.js";
import Api from "./utils/Api.js"; 
import avatarImg from "./images/avatar.jpg";

// const initialCards = [
//   {
//     name: "Golden Gate Bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor case",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest...",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "f68a5f4c-877a-4883-a993-ebbc32a66d1e",
    "Content-Type": "application/json"
  }
});

let currentUserId = null;

Promise.all([api.getInitialCards(), api.getUserInfo()])
  .then(([cards, userData]) => {
    // set profile info from API
    if (userData) {
      currentUserId = userData._id || userData.id || null;
      profileNameEl.textContent = userData.name;
      profileDescriptionEl.textContent = userData.about;
      // If the API returns a generic placeholder, prefer the local avatar image
      const apiAvatar = userData.avatar;
      const hasMeaningfulApiAvatar = apiAvatar && !apiAvatar.includes('avatar_placeholder');
      profileAvatarEl.src = hasMeaningfulApiAvatar ? apiAvatar : avatarImg;
      profileAvatarEl.alt = userData.name || profileAvatarEl.alt;
    }

    const cardsToRender = initialCards;
        cards.forEach((card) => {
      cardsList.append(getCardElement(card));
    });
  })

  .catch((err) => {
    console.error(err);
    initialCards.forEach(card => {
      cardsList.append(getCardElement(card));
    });
  });


const editProfileBtn = document.querySelector(".profile__edit-btn");
const addCardBtn = document.querySelector(".profile__new-post-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");
// default avatar from local asset
profileAvatarEl.src = avatarImg;

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

const deleteConfirmModal = document.querySelector("#delete-confirm-modal");
const deleteConfirmBtn = deleteConfirmModal.querySelector(".modal__submit-btn_type_delete");
const deleteConfirmCloseBtn = deleteConfirmModal.querySelector(".modal__close-btn");
const deleteConfirmCancelBtn = deleteConfirmModal.querySelector(".modal__cancel-btn");
let cardToDelete = null;
let cardToDeleteId = null;

const addCardFormEl = addCardModal.querySelector(".modal__form");
const captionInputEl = addCardFormEl.querySelector("#card-caption-input");
const linkInputEl = addCardFormEl.querySelector("#card-image-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewModalCaption = document.querySelector(".modal__caption");

deleteConfirmBtn.addEventListener("click", () => {
  if (!cardToDelete) {
    closeModal(deleteConfirmModal);
    return;
  }
  const originalText = deleteConfirmBtn.textContent;
  deleteConfirmBtn.textContent = "Deleting...";
  deleteConfirmBtn.disabled = true;

  if (!cardToDeleteId) {
    cardToDelete.remove();
    closeModal(deleteConfirmModal);
    cardToDelete = null;
    deleteConfirmBtn.textContent = originalText;
    deleteConfirmBtn.disabled = false;
    return;
  }

  api.deleteCard(cardToDeleteId)
    .then(() => {
      cardToDelete.remove();
      closeModal(deleteConfirmModal);
    })
    .catch((err) => {
      console.error(`Error deleting card: ${err}`);
      deleteConfirmBtn.textContent = originalText;
      deleteConfirmBtn.disabled = false;
    })
    .finally(() => {
      cardToDelete = null;
      cardToDeleteId = null;
    });
});

deleteConfirmCancelBtn.addEventListener("click", () => {
  closeModal(deleteConfirmModal);
});

deleteConfirmCloseBtn.addEventListener("click", function () {
  closeModal(deleteConfirmModal);
});

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link || "src/images/State=Default.svg";
  cardImageEl.alt = data.name || "Card image";
  cardTitleEl.textContent = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");

  // show delete button only for cards owned by current user (when known)
  if (data.owner) {
    const ownerId = data.owner._id || data.owner;
    if (currentUserId && ownerId !== currentUserId) {
      cardDeleteBtnEl.style.display = "none";
    }
  }

  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-btn_active");
  }

  cardLikeBtnEl.addEventListener("click", () => {
    const wasLiked = cardLikeBtnEl.classList.contains("card__like-btn_active");

    if (!data._id) {
      return;
    }

    const action = wasLiked ? api.unlikeCard(data._id) : api.likeCard(data._id);
    action.then(() => {
      cardLikeBtnEl.classList.toggle("card__like-btn_active");
    }).catch((err) => {
      console.error(`Error toggling like: ${err}`);
    });
  });

  cardDeleteBtnEl.addEventListener("click", () => {
    cardToDelete = cardElement;
    cardToDeleteId = data._id || null;
    openModal(deleteConfirmModal);
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
  const submitButton = avatarFormEl.querySelector(".modal__submit-btn");
  const originalText = submitButton.textContent;
  submitButton.textContent = "Saving…";

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
  })
  .finally(() => {
    submitButton.textContent = originalText;
  });
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
  modal.removeEventListener("mousedown", handleOverlayClick);

  if (modal === deleteConfirmModal) {
    cardToDelete = null;
    cardToDeleteId = null;
  }
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
  resetValidation(editFormEl);
  openModal(editProfileModal);
});

addCardBtn.addEventListener("click", function () {
  addCardFormEl.reset();
  resetValidation(addCardFormEl);
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
  const submitButton = editFormEl.querySelector(".modal__submit-btn");
  const originalText = submitButton.textContent;
  submitButton.textContent = "Saving…";

  api.editUserInfo({
    name: nameInputEl.value,
    about: descriptionInputEl.value
  })
  .then((data) => {
    profileNameEl.textContent = data.name;
    profileDescriptionEl.textContent = data.about;
    closeModal(editProfileModal);
  })
  .catch((err) => {
    console.error(`Error updating profile: ${err}`);
  })
  .finally(() => {
    submitButton.textContent = originalText;
  });
  });

addCardFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const submitButton = addCardFormEl.querySelector(".modal__submit-btn");
  const originalText = submitButton.textContent;
  submitButton.textContent = "Saving…";

  const inputValues = {
    name: captionInputEl.value,
    link: linkInputEl.value,
  };
  api.addCard(inputValues)
    .then((data) => {
      addCardFormEl.reset();
      resetValidation(addCardFormEl);
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      closeModal(addCardModal);
    })
    .catch((err) => {
      console.error(`Error adding card: ${err}`);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
});

avatarModalBtn.addEventListener("click", function () {
  avatarFormEl.reset();
  resetValidation(avatarFormEl);
  openModal(avatarModal);
});

avatarFormEl.addEventListener("submit", handleAvatarSubmit);

avatarModalCloseBtn.addEventListener("click", function () {
  closeModal(avatarModal);
});

enableValidation(settings);