chrome.storage.sync.get('limit').then(({limit}) => {
  if (!limit) {
    return chrome.storage.sync.set({limit: 15})
  }
})

let alertOnActive = false;
async function actOnCreated(tab) {
  let result = await chrome.tabs.query({currentWindow:true});
  let {limit} = await chrome.storage.sync.get('limit');  

  if (result.length > parseInt(limit)) {
    alertOnActive = true;
    chrome.tabs.remove(tab.id)
    console.log('current',await chrome.tabs.getCurrent());
  }
}

async function actOnRemoved(e) {
  if (!alertOnActive) {
    return ;
  }

  let tabs = await chrome.tabs.query({active:true, currentWindow: true});
  if (tabs.length < 1) {
    return;
  }

  alertOnActive = false;
  chrome.scripting.executeScript({
    target:{tabId: tabs[0].id},
    func: function() {
      alert('Tabs limit exceeded!')
    }
  },() => {})
}

chrome.tabs.onCreated.addListener((e) => {
  actOnCreated(e);
})

chrome.tabs.onRemoved.addListener((e) => {
  actOnRemoved(e);
});
