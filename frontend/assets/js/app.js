const toggleButton = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')

function toggleSidebar() {
  sidebar.classList.toggle('close')
  toggleButton.classList.toggle('rotate')

  if (sidebar.classList.contains('close')) {
    closeAllSubMenus()
  }
}

function toggleSubMenu(button) {
  const subMenu = button.nextElementSibling

  subMenu.classList.toggle('show')
  button.classList.toggle('rotate')

  if (sidebar.classList.contains('close')) {
    sidebar.classList.remove('close')
    toggleButton.classList.toggle('rotate')
  }
}

function closeAllSubMenus() {
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show')
    ul.previousElementSibling.classList.remove('rotate')
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const activeItem = sidebar.querySelector('.sub-menu .active')

  if (activeItem) {
    const subMenu = activeItem.closest('.sub-menu')
    const button = subMenu.previousElementSibling

    subMenu.classList.add('show')
    button.classList.add('rotate')
  }
})

document.addEventListener('click', (e) => {
  // close all dropdowns
  document.querySelectorAll('.mp-media-actions').forEach(el => {
    el.classList.remove('active')
  })

  // open current
  const btn = e.target.closest('.mp-media-more')
  if (btn) {
    e.stopPropagation()
    btn.parentElement.classList.add('active')
  }
})

// prevent close when clicking inside dropdown
document.querySelectorAll('.mp-media-dropdown').forEach(menu => {
  menu.addEventListener('click', e => e.stopPropagation())
})
