
let currentTheme = getTheme();

// initial -->
document.addEventListener('DOMContentLoaded',()=>{
    changeTheme();
});


// TODO
function changeTheme() {
  // Set theme to web page
  changepageTheme(currentTheme, currentTheme);

  const changeThemeButton = document.querySelector('#theme_change_button');
  

  // Change theme button color (adjust as needed)
  changeThemeButton.style.backgroundColor = currentTheme === "dark" ? "lightgray" : "darkgray";

  // Add event listener to change theme button
  changeThemeButton.addEventListener('click', (event) => {
    const oldTheme = currentTheme; 
    console.log('change theme button Clicked');

    // Toggle current theme
    currentTheme = currentTheme === "dark" ? "light" : "dark";

    // Apply new theme and update theme button color
    changepageTheme(currentTheme, oldTheme);
    changeThemeButton.style.backgroundColor = currentTheme === "dark" ? "lightgray" : "darkgray";
  });
}

// Set theme from local Storage
function setTheme(theme) {
  localStorage.setItem("theme", theme);
}

// Get theme from local Storage
function getTheme() {
  let theme = localStorage.getItem("theme");
  return theme ? theme : "light";
}

// Change page theme
function changepageTheme(theme, oldTheme) {
  // Update local storage
  setTheme(currentTheme);

  // Remove current theme
  document.querySelector("html").classList.remove(oldTheme);

  // Set the current theme
  document.querySelector("html").classList.add(theme);

  // Add a check to ensure the classes exist before adding/removing them
  if (document.querySelector("html").classList.contains(oldTheme)) {
    document.querySelector("html").classList.remove(oldTheme);
  }
  if (!document.querySelector("html").classList.contains(theme)) {
    document.querySelector("html").classList.add(theme);
  }
  // Change theme button text
  document.querySelector("#theme_change_button")
    .querySelector("span").textContent = theme === "light" ? " Dark" : " Light";
}