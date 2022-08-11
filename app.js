const BOOKMARKS = "bookmarks";

document.getElementById("form").addEventListener("submit", saveBookmark);
const siteName = document.getElementById("site_name");
const siteUrl = document.getElementById("site_url");
const resourceType = document.getElementById("resource_type");
const filterStrip = document.getElementById("filter__strip");

const types = [
  { selectName: "Sport", value: "sport" },
  { selectName: "Entertainment", value: "entertainment" },
  { selectName: "Psychology", value: "psychology" },
  { selectName: "News", value: "news" },
  { selectName: "IT", value: "it" },
];

function getType(type) {
  return type;
}

function filterByType(type) {
  getType(type);
  getBookmarks(type);
}

for (let i = 0; i < types.length; i++) {
  resourceType.innerHTML += `<option value=${types[i].value}>${types[i].selectName}</option>`;
  filterStrip.innerHTML += `
  <button onclick="filterByType('${types[i].value}')" data-type href="#">${types[i].selectName}</button>`;
}

const uid = () =>
  String(Date.now().toString(32) + Math.random().toString(16)).replace(
    /\./g,
    ""
  );

let editedId = "";
let mode = "";

function resetFields() {
  siteName.value = "";
  siteUrl.value = "";
  resourceType.value = "";
}

function saveBookmark(e) {
  e.preventDefault();
  if (!siteName.value || !siteUrl.value || !resourceType.value) {
    alert("fields are not filled");
    return;
  }

  let bookmark = {
    id: uid(),
    name: siteName.value,
    url: siteUrl.value,
    type: resourceType.value,
  };

  if (localStorage.getItem(BOOKMARKS) === null) {
    let bookmarks = [];
    bookmarks.push(bookmark);
    localStorage.setItem(BOOKMARKS, JSON.stringify(bookmarks));
    getBookmarks();
    resetFields();
  } else {
    let bookmarksFromStorage = JSON.parse(localStorage.getItem(BOOKMARKS));
    let filteredBookmarks = bookmarksFromStorage.filter(
      (bookmark) => bookmark.id !== editedId
    );
    bookmarksFromStorage.push(bookmark);
    if (mode === "update") {
      localStorage.setItem(
        BOOKMARKS,
        JSON.stringify([...filteredBookmarks, bookmark])
      );
    } else {
      localStorage.setItem(BOOKMARKS, JSON.stringify(bookmarksFromStorage));
    }
  }
  getBookmarks();
  resetFields();
  mode = "";
}

function deleteBookmark(id) {
  let bookmarksFromStorage = JSON.parse(localStorage.getItem(BOOKMARKS));
  for (let i = 0; i < bookmarksFromStorage.length; i++) {
    if (bookmarksFromStorage[i].id === id) {
      bookmarksFromStorage.splice(i, 1);
    }
  }
  localStorage.setItem(BOOKMARKS, JSON.stringify(bookmarksFromStorage));
  getBookmarks();
}

function updateBookmark(id) {
  mode = "update";
  let bookmarksFromStorage = JSON.parse(localStorage.getItem(BOOKMARKS));
  for (let i = 0; i < bookmarksFromStorage.length; i++) {
    if (bookmarksFromStorage[i].id === id) {
      siteName.value = bookmarksFromStorage[i].name;
      siteUrl.value = bookmarksFromStorage[i].url;
      resourceType.value = bookmarksFromStorage[i].type;
      editedId = bookmarksFromStorage[i].id;
    }
  }
}

function getBookmarks(type = "all") {
  let bookmarksFromStorage = JSON.parse(localStorage.getItem(BOOKMARKS));
  let bookmarks =
    type === "all"
      ? bookmarksFromStorage
      : bookmarksFromStorage.filter((bookmark) => bookmark.type === type);
  let bookmarkOutput = document.querySelector(".output");
  console.log(bookmarks);
  bookmarkOutput.innerHTML = "";
  for (let i = 0; i < bookmarks.length; i++) {
    let { name, url, type, id } = bookmarks[i];
    bookmarkOutput.innerHTML += `<div class="output__item">
       <p>${name}</p>
       <p>${type}</p>
       <a class=visit href=${url} target=_blank>Visit</a>
       <button onclick=deleteBookmark('${id}') class=delete_btn>delete</button>
       <button onclick=updateBookmark('${id}') class=update_btn>update</button>
     </div>
     `;
  }
}
