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
    if (boltCmd) {
      try {
        const response = await invokeTauriCommand(boltCmd);
        const boltSwap = targetElement.getAttribute("bolt-swap");
        const boltTarget = targetElement.getAttribute("bolt-target");
        let target = boltTarget ? document.querySelector(boltTarget) : targetElement;

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
          default:
            console.warn(`Unknown bolt-swap value: ${boltSwap}`);
        }
      } catch (error) {
        console.error("Error invoking Tauri command:", error);
      }
    }
  };

  // Init
  document.addEventListener("DOMContentLoaded", function() {
    document.body.addEventListener("click", handleBoltAction);
  });

})();
