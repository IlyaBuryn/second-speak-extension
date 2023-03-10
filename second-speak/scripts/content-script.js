
(() => {

    if (window.hasRun) {
      return;
    }

    window.hasRun = true;

    function dimScreen() {
      document.body.style.opacity = '0.5';
    }

    function lightScreen() {
      document.body.style.opacity = '1';
    }
    
    function saveSelector(event) {
      event.target.classList.remove('ext_second-speak_highlight');
      const selector = getSelector(event.target);
      localStorage.setItem('firstSubtitleElement', selector);
      lightScreen();
    }
    
    function getSelector(element) {
      if (!element) {
        return null;
      }
    
      const selector = element.tagName.toLowerCase();
      if (element.id) {
        return `#${element.id}`;
      }
      if (element.className) {
        const classes = element.className.split(/\s+/).join('.');
        return `${selector}.${classes}`;
      }
      return selector;
    }

    function tryGetElement() {
      dimTimer = setTimeout(function() {
        dimScreen();

        const mouseoverHandler = function(event) {
          const target = event.target;
          target.classList.add('ext_second-speak_highlight');
        };
    
        const mouseoutHandler = function(event) {
          const target = event.target;
          target.classList.remove('ext_second-speak_highlight');
        };

        document.addEventListener('mouseover', mouseoverHandler);
        document.addEventListener('mouseout', mouseoutHandler);

        document.addEventListener('click', function(event) {
          saveSelector(event);

          document.removeEventListener('click', arguments.callee);
          document.removeEventListener('mouseover', mouseoverHandler);
          document.removeEventListener('mouseout', mouseoutHandler);

          getTextFromSubtitles();

          clearTimeout(dimTimer);
          dimTimer = null;
        }, { capture: false, once: true });
      }, 100);
    }


    function getTextFromSubtitles() {
      const selector = localStorage.getItem('firstSubtitleElement');
      const elements = document.querySelectorAll(selector);
      const lastElement = elements[elements.length - 1];
      if (lastElement) {
        const textContent = lastElement.textContent;
        translate(textContent, 'ru', 'en');
      }
      else {
        console.log("Element is null!0!")
      }
    }

    function translate(sourceText, sourceLang, targetLang) {
   
      var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);
      
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data[0]) {
            console.log(data[0][0][0]);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }    

    browser.runtime.onMessage.addListener((message) => {
      if (message.command === "getSubs") {
        tryGetElement();
      }
    });


  })();
  