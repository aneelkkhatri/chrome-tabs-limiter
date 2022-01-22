chrome.storage.sync.get("limit", (v) => {
  document.getElementById('input').value=v.limit;
});
document.getElementById('input').addEventListener('input', e => {
  chrome.storage.sync.set({limit: e.target.value})
})