let vidDuration;
let timeSaved;
let ad;

let jumpjack = true;

chrome.storage.sync.get(["dataCondition"]).then((result) => {
  jumpjack = result.dataCondition;
});

const adPlaying = new MutationObserver((mutationsList) => {
 for(let mutation of mutationsList) {
  if (mutation.type === 'childList' && jumpjack) {
    new Promise((resolve, reject) => {
      let vid = document.querySelector('video');
      if (isFinite(vid.duration)) {
        vid.currentTime = vid.duration;
        vidDuration = vid.duration;
        resolve();
      }
    }).then(() => {
      chrome.storage.sync.get(['storedTimeSaved']).then((result) => {
        timeSaved = result.storedTimeSaved ? parseInt(result.storedTimeSaved) + ~~vidDuration : ~~vidDuration;
        chrome.storage.sync.set({storedTimeSaved: timeSaved}).then(() => {
            console.log(`[jumpjack] ad jumped | total time saved: ${time(timeSaved)}`)
        }).catch((error) => {
            console.error(`[jumpjack] error: ${error}`);
        });
      }).catch((error) => {
        console.error(`[jumpjack] error: ${error}`);
      });
      if (document.querySelector('.ytp-ad-skip-button')) document.querySelector('.ytp-ad-skip-button').click();
      if (document.querySelector('.ytp-ad-skip-button-modern')) document.querySelector('.ytp-ad-skip-button-modern').click();
    });
  }
 }
});

function load() {
  ad = document.querySelector('.ytp-ad-module')
  if (!ad) {
    setTimeout(load, 100);
    return;
  }
  adPlaying.observe(ad, { childList: true, subtree: true });
  console.log('[jumpjack] loaded');
}

load()

function time(seconds) {
  return seconds >= 86400 ? `${parseFloat(seconds/86400).toFixed(1)}d` : seconds >= 3600 ? `${~~(seconds/3600)}h` :
  seconds >= 60 ? `${~~(seconds/60)}m` : `${~~(seconds)}s`;
}

chrome.storage.onChanged.addListener((changes) => {
  if (!changes.dataCondition) return;
  jumpjack = changes.dataCondition.newValue;
});
