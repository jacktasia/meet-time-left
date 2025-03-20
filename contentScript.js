function injectElement() {
    const el = document.querySelector('#time-left');
    if (el !== null) {
      return; // already exists
    }

    const div = document.createElement('div');
    div.textContent = 'Checking time left...';
    div.id = "time-left";
    div.style.position = 'fixed';
    div.style.top = '18px';
    div.style.right = '75px';
    div.style.background = 'grey';
    div.style.padding = '10px';
    div.style.zIndex = '9999';
    div.style.borderRadius = '10px';
    document.body.appendChild(div);
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
    newText = `${Math.floor(Math.abs(timeDifference))} min after`;
  }

  const el = document.querySelector('#time-left');

  el.innerText = newText;

  if (timeDifference < 5) {
    el.style.background = 'red';
    el.style.fontWeight = 'bold';
    el.style.color = 'white';
  } else if (timeDifference < 10) {
    el.style.background = 'yellow';
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
  injectElement();

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
    const schText = sch.parentNode.childNodes[1].innerText;
    console.log(schText)
    mainDiv.parentNode.querySelector('button').click(); // we got the info close it

    setTimeRemaining(schText);
    setInterval(() => {
      setTimeRemaining(schText);
    }, 60000);

  }, 500);
}

mainTimeLeft();
