module.exports = (content, list, className = '') => {
  const li = document.createElement('li');
  li.innerText = content;
  if (className !== '') li.className = className;
  list.appendChild(li);
};