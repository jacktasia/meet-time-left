function injectTimeLeftElement() {
    const el = document.querySelector('#time-left');
    if (el !== null) {
      hideNotifyButton();
      return; // already exists
    }

    const div = document.createElement('div');
    div.textContent = 'Checking time left...';
    div.id = "time-left";
    div.style.position = 'relative';
    div.style.top = '8px';
    div.style.right = '160px';
    div.style.background = "linear-gradient(135deg, rgb(50, 50, 50), rgb(90, 90, 90))";
    div.style.color = 'white';
    div.style.padding = '10px';
    div.style.zIndex = '999999';
    div.style.borderRadius = '10px';
    div.style.textShadow = '1px 1px 5px rgba(0, 0, 0, 0.5)';

    if (document.querySelector('[aria-label="Gemini isn\'t taking notes"]') !== null) {
      document.querySelector('[aria-label="Gemini isn\'t taking notes"]').parentNode.parentNode.parentNode.parentNode.appendChild(div);
    } else {
      // can't find the gemini thing to make it relative to
      div.style.position = 'fixed';
      document.body.appendChild(div);
    }
}

function showNotifyButton() {
   const el = document.querySelector('#time-left-notify-btn');
   el.style.display = 'block';
}

function hideNotifyButton() {
   const el = document.querySelector('#time-left-notify-btn');
   el.style.display = 'none';
}

function injectNotifyButton() {
    const el = document.querySelector('#time-left-notify-btn');
    if (el !== null) {
      return; // already exists
    }

    const btn = document.createElement('button');
    btn.textContent = 'Notify Chat of Time';
    btn.id = "time-left-notify-btn";
    btn.style.position = 'fixed';
    btn.style.bottom = '18px';
    btn.style.right = '200px';
    btn.style.background = "linear-gradient(135deg, rgb(50, 50, 50), rgb(90, 90, 90))";
    btn.style.padding = '10px';
    btn.style.zIndex = '999999';
    btn.style.borderRadius = '10px';
    btn.style.textShadow = '1px 1px 5px rgba(0, 0, 0, 0.5)';
    btn.style.display = 'none';
    btn.style.color = 'white';
    btn.style.fontWeight = 'bold';

    btn.addEventListener('click', handleNotifyChat);


    document.body.appendChild(btn);
}

function handleNotifyChat() {
  hideNotifyButton();

  const chatDiv = findUniqueElementByText('div', 'Chat with everyone');
  if (chatDiv === undefined) {
    // check again in a second...
    console.log("debug: can't find chat div! [a]");
    setTimeout(handleNotifyChat, 1000);
    return;
  }

  // is chat already open???

  const isChatOpen = chatDiv.parentNode && chatDiv.parentNode.querySelector('button') && chatDiv.parentNode.querySelector('button').getAttribute('aria-pressed') == 'true'


  if (!isChatOpen) {
    if (!!chatDiv.parentNode && chatDiv.parentNode.querySelector('button') !== null) {
       chatDiv.parentNode.querySelector('button').click();
    } else {
      console.log("debug: can't find chat div button checking again in a second[b]");
      setTimeout(handleNotifyChat, 1000);
      return;
    }
  }

  // wait for chat to open!

  setTimeout(() => {
    document.querySelector('textarea').value = 'FYI: We are ' + document.querySelector('#time-left').innerText + ' 🙂';
    const sendBtnDiv = findUniqueElementByText('div', 'Send message');
    const sendBtn =  sendBtnDiv.parentNode.querySelector('button');
    sendBtn.removeAttribute('disabled');
    sendBtn.click();
  }, 600);
}

function calculateTimeDifference(timeString) {
    // Extract the target time part after the dash
    const targetTimePart = timeString.split('-')[1].trim();

    // Parse the target time
    const today = new Date();
    const targetTime = new Date(today.toDateString() + ' ' + targetTimePart);
    const currentTime = new Date();
    // Calculate the time difference in minutes
    const timeDifference = (targetTime - currentTime) / (1000 * 60);
    return timeDifference;
}

function findUniqueElementByText(elType, textContent) {
  return Array.from(document.querySelectorAll(elType)).find(div => div.textContent === textContent);
}

function setTimeRemaining(rawMeetingTime) {
  const timeDifference = calculateTimeDifference(rawMeetingTime);
  console.log('timeDifference', timeDifference);
  var newText = `${Math.floor(timeDifference)} min left`;
  if (timeDifference < 0) {
    newText = `${Math.floor(Math.abs(timeDifference))} min over`;
  }

  const el = document.querySelector('#time-left');

  el.innerText = newText;

  if (timeDifference < 1) {
    //el.style.background = 'red';
    el.style.background = "linear-gradient(135deg, rgb(211, 47, 47), rgb(239, 83, 80))";
    el.style.fontWeight = 'bold';
    showNotifyButton();
  } else if (timeDifference < 5) {
    // el.style.background = 'orange';
    el.style.background = "linear-gradient(135deg, rgb(255, 87, 34), rgb(255, 119, 60))";
    el.style.fontWeight = 'bold';
    showNotifyButton();
  } else if (timeDifference < 10) {
    // el.style.background = 'yellow';
    el.style.background = "linear-gradient(135deg, rgb(255, 193, 7), rgb(255, 214, 10))";
    showNotifyButton();
  }
}

function mainTimeLeft() {
  const mainDiv = findUniqueElementByText('div', 'Meeting details');
  if (mainDiv === undefined) {
    // check again in a second...
    console.log("debug: can't find meeting details checking again in a second[a]");
    setTimeout(mainTimeLeft, 1000);
    return;
  }

  // we see meeting details - we're in the meeting, so inject our element to show time remaining
  injectTimeLeftElement();
  injectNotifyButton();

  // try to get the meeting info - need to click into Meeting Details...
  if (!!mainDiv.parentNode && mainDiv.parentNode.querySelector('button') !== null) {
     mainDiv.parentNode.querySelector('button').click();
  } else {
    console.log("debug: can't find meeting details BUTTON checking again in a second[b]");
    setTimeout(mainTimeLeft, 1000);
    return;
  }

  // we wait 500ms for the more info to open
  setTimeout(() => {
    const sch = findUniqueElementByText('i', 'schedule');

    if (sch === undefined || sch.parentNode === null) {
      mainDiv.parentNode.querySelector('button').click(); // still need to close info panel
      console.log("debug: can't find schedule info checking again in a second[c]");
      setTimeout(mainTimeLeft, 1000);
      return;
    }

    const schText = sch.parentNode.childNodes[1].innerText;
    console.log(schText)
    mainDiv.parentNode.querySelector('button').click(); // close info panel

    setTimeRemaining(schText);
    setInterval(() => {
      setTimeRemaining(schText);
    }, 60000);

  }, 600);
}

mainTimeLeft();
