// shared/dom.js — helpers para manipulação de DOM

export function query(selector, parent = document) {
  return parent.querySelector(selector);
}

export function queryAll(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

export function toggleClass(element, className) {
  if (element) {
    element.classList.toggle(className);
  }
}

export function addClass(element, className) {
  if (element) {
    element.classList.add(className);
  }
}

export function removeClass(element, className) {
  if (element) {
    element.classList.remove(className);
  }
}
