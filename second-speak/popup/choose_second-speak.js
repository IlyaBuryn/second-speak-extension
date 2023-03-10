document.addEventListener("click", (e) => {
  
  function findSubs(tabs) {
    browser.tabs.sendMessage(tabs[0].id, {
      command: "getSubs"
    });
  }

  function reset(tabs) {
    browser.tabs.sendMessage(tabs[0].id, {
      command: "reset",
    });
  }

  function reportError(error) {
    console.error(`Could not beastify: ${error}`);
  }

  if (e.target.type === "reset") {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(reset)
      .catch(reportError);
  } else {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(findSubs)
      .catch(reportError);
  }
});


function reportExecuteScriptError(error) {
document.querySelector("#popup-content").classList.add("hidden");
document.querySelector("#error-content").classList.remove("hidden");
console.error(`Failed to execute beastify content script: ${error.message}`);
}

browser.tabs
.executeScript({ file: "/scripts/content-script.js" })
.then(listenForClicks)
.catch(reportExecuteScriptError);