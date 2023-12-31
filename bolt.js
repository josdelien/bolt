(function() {
  'use strict';

  const invokeTauriCommand = async function(cmd) {
    if (window.__TAURI__) {
      const { invoke } = window.__TAURI__.tauri;
      return await invoke(cmd);
    }
    return null;
  };

  const handleBoltAction = async function(event) {
    const targetElement = event.target;
    const boltCmd = targetElement.getAttribute("bolt-cmd");
    const boltSwap = targetElement.getAttribute("bolt-swap");
    const boltTarget = targetElement.getAttribute("bolt-target");
    let target = boltTarget ? document.querySelector(boltTarget) : targetElement;

    // If bolt-cmd is present, execute the Tauri command
    if (boltCmd) {
      try {
        const response = await invokeTauriCommand(boltCmd);
        switch (boltSwap) {
          case 'innerHTML':
            target.innerHTML = response;
            break;
          case 'afterend':
            target.insertAdjacentHTML("afterend", response);
            break;
          case 'outerHTML':
            target.outerHTML = response;
            break;
        }
      } catch (error) {
        console.error("Error invoking Tauri command:", error);
      }
    }

    // Handle DOM-only actions regardless of bolt-cmd presence
    switch (boltSwap) {
      case 'remove':
        target.remove();
        break;
      case 'remove all':
        const elementsToRemove = document.querySelectorAll(boltTarget);
        elementsToRemove.forEach(el => el.remove());
        break;
    }
  };

  // Init
  document.addEventListener("DOMContentLoaded", function() {
    document.body.addEventListener("click", handleBoltAction);
  });

})();
