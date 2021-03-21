var Sentiment = require('sentiment');
//count all distinct data entries from an array
function countNumberofDistinctElements(arr) {
    let elements = {};
    for (let i = 0; i < arr.length; i++) {
        elements[arr[i]] = 1 + (elements[arr[i]] || 0);
    }
    return elements;
}

function getSortedKeys(obj) {
    let key1=[];
    let value1=[];
    for (const [key, value] of Object.entries(obj)) {
        key1.push(key);
        value1.push(value);
    }

    arrayOfObj = key1.map(function(d, i) {
        return {
            label: d,
            data: value1[i] || 0
        };
    });
    sortedArrayOfObj = arrayOfObj.sort(function(a, b) {
        return b.data - a.data;
    });
    return sortedArrayOfObj;
}

//TODO
function removeStopWords(arr) {

}

//extract weekday name from twitter api data
exports.getWeekDay = function (fetchedData) {
    let data = [];
    for (let i = 0; i < fetchedData.length; i++) {
        let entry = fetchedData[i].created_at;
        let changedName = entry.substring(0, 3);
        data.push(changedName);
    }
    return sanitizedData = countNumberofDistinctElements(data);
};

//extract used device from twitter api data
exports.parseUsedDevice = function (fetchedData) {
        let data = [];
        for (let i = 0; i < fetchedData.length; i++) {
            let entry = fetchedData[i].source;
            const regexOpeningTag = /<a[^>]+href="(.*?)"[^>]*>/;
            const regexClosingTag = /<\/a>/;
            let replaceOpeningTag = entry.replace(regexOpeningTag, "");
            let replaceClosingTag = replaceOpeningTag.replace(regexClosingTag, "");
            data.push(replaceClosingTag);
        }
        return sanitizedData = countNumberofDistinctElements(data);
};

exports.extractInteractions = function (fetchedData) {
    let data = [];
    for(let i = 0;i<fetchedData.length;i++) {
        //wenn man diesen schritt nicht macht kann man nicht auf die entities zugreifen weil [object Object]
        let x = JSON.stringify(fetchedData[i].entities);
        let y = JSON.parse(x);
        if(y.user_mentions.length===0) {
        }
        else {
            for(let j = 0;j<y.user_mentions.length;j++) {
                data.push(y.user_mentions[j].name);
            }
        }
    }
    data = countNumberofDistinctElements(data);
    return sanitizedData = getSortedKeys(data);
};
exports.sanitizeFullText = function(fetchedData) {
    let data ="";
    for(let i = 0;i<fetchedData.length;i++) {
        let entry = fetchedData[i].full_text;
        let regexTwitterHandle = /@(\w){1,15}/;
        let regexURL = /^(http|https):\/\/([a-zA-Z.\/0-9]*)/;
        let removeTwitterHandle = entry.replace(regexTwitterHandle,"");
        let removeURLs = removeTwitterHandle.replace(regexURL, "");
        data+=removeURLs + " ";
    }
    return data;
};

exports.sentiment = function(tweets,lang) {
    var sentiment = new Sentiment();
    var result;
    if(lang==='de') {
        var gerSentimentLexiconJSON = require('../public/sentiment_analysis_lexicon/lexicon_ger');
        var deLanguage = {
            labels: gerSentimentLexiconJSON
        };
        sentiment.registerLanguage('de', deLanguage);
        result = sentiment.analyze(tweets,{language:'de'});
    }
    else {
        result = sentiment.analyze(tweets);
    }
    return result;
};

exports.extractId = function(tweets) {
    let allIds = "";
    for(let i = 0;i<tweets.length;i++) {
        allIds+=tweets[i].id_str;
        if(i !== tweets.length-1) {
            allIds+=',';
        }
    }
    return allIds;
};


exports.getLanguage = function (tweets) {
    let ger = 0;
    let eng = 0;
    let other = 0;
    for(let i = 0;i < tweets.length;i++) {
        if(tweets[i].lang ==='de') {
            ger +=1;
        }
        else if(tweets[i].lang ==='en') {
            eng +=1;
        }
        else {
            other +=1;
        }
    }
    if(ger >eng >other) {
        return 'de';
    }
    else if(eng>ger>other) {
        return 'en';
    }
    else {
        return 'other';
    }
};
