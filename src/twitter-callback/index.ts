const params = new URLSearchParams(location.search);
sessionStorage.setItem('twitter-callback', location.search);
location.replace(location.origin);
