const params = new URLSearchParams(location.search);
localStorage.setItem('twitter-callback', location.search);
location.replace(location.origin);
