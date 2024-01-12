const timeSaved = document.querySelector('.timeSaved');
const btn = document.querySelector('.btn');
let jumpjack = true;

chrome.storage.sync.get(['dataCondition']).then((result) => {
  jumpjack = result.dataCondition;
  flip()
});

chrome.storage.sync.get(['storedTimeSaved']).then((result) => {
    timeSaved.textContent = result.storedTimeSaved ? time(result.storedTimeSaved) : '';
})

const flip = () => {
    jumpjack ? btn.classList.remove('off') : btn.classList.add('off')
}

btn.addEventListener('click', function() {
    jumpjack = !jumpjack;
    chrome.storage.sync.set({ dataCondition: jumpjack }).then(() => {
        flip()
    });
})

function time(seconds) {
  return seconds >= 86400 ? `${parseFloat(seconds/86400).toFixed(1)}d` : seconds >= 3600 ? `${~~(seconds/3600)}h` :
  seconds >= 60 ? `${~~(seconds/60)}m` : `${~~(seconds)}s`
}

chrome.storage.onChanged.addListener((changes) => {
  if (changes.storedTimeSaved) {
   timeSaved.textContent = time(changes.storedTimeSaved.newValue);
 }
});