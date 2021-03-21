"use strict";

function getUserInfo(name) {
    let url5 = '/api/' + name;
    axios.get(url5).then(res => {
        document.getElementById("profile-picture").setAttribute('src',res.data.profile_image_url);
        document.getElementById('follower').innerHTML = res.data.followers_count;
        document.getElementById('following').innerHTML =   res.data.friends_count;
        document.getElementById('favorites').innerHTML =  res.data.favourites_count;
        document.getElementById('statuses').innerHTML = res.data.statuses_count;
    }).catch(err => {
        document.getElementById('error').innerHTML = 'Username does not exist';
    })
}

function getTweetsPerWeekday(name) {
    let url1 = '/api/weekday/' + name;
    axios.get(url1).then(res =>{
        let data = res.data;
        const labelsForTweetsPerDay = [];
        const valuesForTweetsPerDay = [];
        //draw graph
        const tweetsPerDayData = {
            labels: labelsForTweetsPerDay,
            datasets: [{
                label: 'Number of Tweets per weekday',
                data: valuesForTweetsPerDay,
                backgroundColor:
                    'rgba(54, 162, 235, 0.2)'
                ,
                borderColor:
                    'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
        const tweetsPerDay = document.getElementById('myChart');
        const tweetsPerDayGraph = new Chart(tweetsPerDay, {
            type: 'line',
            data: tweetsPerDayData,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: true,
                    text: 'Number of Tweets per weekday'
                },
                legend: {
                    display: false
                },
                responsive: true
            }
        });
        for (const [key, value] of Object.entries(data)) {
            labelsForTweetsPerDay.push(key);
            valuesForTweetsPerDay.push(value);
            tweetsPerDayGraph.update();
        }


    }).catch(err =>{
        if (Object.keys(err.response.data).length === 0) {
            document.getElementById('error').innerHTML = 'This user\'s tweets are protected.';
        } else {
            document.getElementById("profile-picture").remove();
            document.getElementById('error').innerHTML = 'Username does not exist';
        }
    })
}

function getAllInteractions(name) {
    let url3 = '/api/interactions/' + name;
    axios.get(url3).then(res => {
        let labelsForUserInteraction = [];
        let valuesForUserInteraction = [];
        const userInteractionData = {
            labels: labelsForUserInteraction,
            datasets: [{
                label: 'Number of interactions',
                data: valuesForUserInteraction,
                backgroundColor:
                    'rgba(54, 162, 235, 0.2)'
                ,
                borderColor:
                    'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
        const userInteraction = document.getElementById('myChart3');
        const userInteractionGraph = new Chart(userInteraction, {
            type: 'bar',
            data: userInteractionData,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: true,
                    text: 'Most Interactions'
                },
                legend: {
                    display: false
                },
                responsive: true
            }
        });
        let data = res.data;
        if (data.length > 10) {
            for (let i = 0; i < 10; i++) {
                labelsForUserInteraction.push(data[i].label);
                valuesForUserInteraction.push(data[i].data);
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                labelsForUserInteraction.push(data[i].label);
                valuesForUserInteraction.push(data[i].data);
            }
        }
        userInteractionGraph.update();

    }).catch(err => {
        if (Object.keys(err.response.data).length === 0) {
            document.getElementById('error').innerHTML = 'This user\'s tweets are protected.';
        } else {
            document.getElementById('error').innerHTML = 'Username does not exist';
        }
    })
}

function getUsedDevices(name) {
    let url2 = '/api/devices/' + name;
    axios.get(url2).then(res => {
        const labelsForDevicesUsed = [];
        const valuesForDevicesUsed = [];
        const devicesUsedData = {
            labels: labelsForDevicesUsed,
            datasets: [{
                label: 'Devices used for tweeting',
                data: valuesForDevicesUsed,
                backgroundColor: ['rgba(85, 172, 238, 0.2)',
                    'rgba(102, 117, 127,0.2)',
                    'rgba(41, 47, 51,0.5)',
                    'rgba(20,23,26,0.8)',
                    'rgba(17, 97, 145,0.5)'
                ]
                ,
                borderColor: ['rgba(85, 172, 238, 1)', 'rgba(102, 117, 127,1)', 'rgba(41, 47, 5 ,1)', 'rgba(20,23,26,1)', 'rgba(17, 97, 145,1)'
                ],
                borderWidth: 1
            }]
        };
        const devicesUsed = document.getElementById('myChart2');
        const devicesUsedGraph = new Chart(devicesUsed, {
            type: 'pie',
            data: devicesUsedData,
            options: {
                title: {
                    display: true,
                    text: 'Devices used for tweeting'
                },
                legend: {
                    display: true
                },
                responsive: true
            }
        });
        let data = res.data;
        for (const [key, value] of Object.entries(data)) {
            labelsForDevicesUsed.push(key);
            valuesForDevicesUsed.push(value);
            devicesUsedGraph.update();
        }

    }).catch(err => {
        if (Object.keys(err.response.data).length === 0) {
            document.getElementById('error').innerHTML = 'This user\'s tweets are protected.';
        } else {
            document.getElementById('error').innerHTML = 'Username does not exist';
        }
    })
}

function sentimentAnalysis(name) {
    let url4 = '/api/tweets/' + name;
    axios.get(url4).then(res => {
        let valuesForWords = [];
        const sentimentAnalysisData = {
            labels:['Positive Words','Negative Words'],
            datasets: [{
                label: 'Number of used words',
                data: valuesForWords,
                backgroundColor:
                    [
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 99, 132, 0.2)'
                    ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        };
        const sentimentAnalysis = document.getElementById('myChart4');
        const sentimentAnalysisGraph = new Chart(sentimentAnalysis, {
            type: 'bar',
            data: sentimentAnalysisData,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: true,
                    text: 'Number of positive or negative words'
                },
                legend: {
                    display: false
                },
                responsive: true
            }
        });
        let data = res.data;
        if(!(Object.keys(res.data).length === 0)) {
            valuesForWords.push(data.positive.length);
            valuesForWords.push(data.negative.length);
            document.getElementById('score').innerHTML = "Overall score: " + data.score;
            document.getElementById('comparative').innerHTML = "Comparative Score: " + data.comparative;
        }

        sentimentAnalysisGraph.update();

    }).catch(err => {
        /*if (Object.keys(err.response.data).length === 0) {
            document.getElementById('error').innerHTML = 'This user\'s tweets are protected.' ;
        } else {
            document.getElementById('error').innerHTML = 'Username does not exist';
        }*/
        console.log(err);
    })
}