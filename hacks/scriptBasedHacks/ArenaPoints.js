function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''));
    return JSON.parse(jsonPayload)
};

let userID = parseJwt(localStorage.JWT_TOKEN).content.userID
let arenaseason = await (await fetch(`https://api.prodigygame.com/leaderboard-api/user/${userID}/init?userID=${userID}`, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
        'Authorization': localStorage.JWT_TOKEN,
    },
})).json();
arenaseason = arenaseason.seasonID;

setInterval(_ => {
    fetch(("https://api.prodigygame.com/leaderboard-api/season/" + arenaseason + "/user/" + userID + "/pvp?userID=" + userID), {
        headers: {
            "authorization": localStorage.JWT_TOKEN,
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-fetch-mode": "cors"
        },
        referrer: "https://play.prodigygame.com/",
        referrerPolicy: "no-referrer-when-downgrade",
        body: ("seasonID=" + arenaseason + "&action=win"),
        method: "POST",
        mode: "cors"
    }).then(v => v.text()).then(v => console.log(v))
}, 60500);
