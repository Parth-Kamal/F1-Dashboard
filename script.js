// // Initialize Chart.js chart instances
// let lapTimeChart, positionChart;

// // Function to fetch all races for the season
// async function fetchRaces() {
//     try {
//         const response = await fetch("https://ergast.com/api/f1/current.json");
//         const data = await response.json();
//         populateRaceDropdown(data);
//     } catch (error) {
//         console.error("Error fetching races:", error);
//     }
// }

// // Populate race selection dropdown
// function populateRaceDropdown(data) {
//     const raceDropdown = document.getElementById("race-dropdown");
//     const races = data.MRData.RaceTable.Races;

//     races.forEach(race => {
//         const option = document.createElement("option");
//         option.value = race.round;
//         option.textContent = `${race.raceName} - ${race.Circuit.circuitName}`;
//         raceDropdown.appendChild(option);
//     });
// }

// // Fetch race data for the selected race
// async function fetchRaceData(round = "last") {
//     try {
//         const response = await fetch(`https://ergast.com/api/f1/current/${round}/results.json`);
//         const data = await response.json();
//         updateRaceInfo(data);
//         updateLeaderboard(data);
//         updateCharts(data);
//         updatePitStops(data);
//         setupDriverComparison(data);
//         fetchWeather(data);
//         fetchCircuitRecords(data);
//     } catch (error) {
//         console.error("Error fetching race data:", error);
//     }
// }

// // Update race information in the header
// function updateRaceInfo(data) {
//     const raceInfoElement = document.getElementById("race-info");
//     const race = data.MRData.RaceTable.Races[0];

//     raceInfoElement.innerHTML = `
//         <h2>${race.raceName} - Round ${race.round}</h2>
//         <p>Circuit: ${race.Circuit.circuitName}</p>
//         <p>Location: ${race.Circuit.Location.locality}, ${race.Circuit.Location.country}</p>
//     `;
// }

// // Update the live leaderboard
// function updateLeaderboard(data) {
//     const leaderboardList = document.getElementById("leaderboard-list");
//     leaderboardList.innerHTML = ""; // Clear existing leaderboard

//     const raceResults = data.MRData.RaceTable.Races[0].Results;
//     raceResults.forEach((result, index) => {
//         const listItem = document.createElement("li");
//         listItem.textContent = `${index + 1}. ${result.Driver.familyName} - Lap Time: ${result.Time?.time || 'N/A'}`;
//         leaderboardList.appendChild(listItem);
//     });
// }

// // Update lap time and position charts
// function updateCharts(data) {
//     const raceResults = data.MRData.RaceTable.Races[0].Results;

//     const drivers = raceResults.map(result => result.Driver.familyName);
//     const lapTimes = raceResults.map(result => parseInt(result.Time?.time.split(":")[1]) || 0);
//     const positions = raceResults.map(result => parseInt(result.position));

//     // Lap Time Chart
//     if (!lapTimeChart) {
//         const ctx1 = document.getElementById("lapTimeCanvas").getContext("2d");
//         lapTimeChart = new Chart(ctx1, {
//             type: "line",
//             data: {
//                 labels: drivers,
//                 datasets: [{
//                     label: "Lap Times (seconds)",
//                     data: lapTimes,
//                     backgroundColor: "rgba(75, 192, 192, 0.4)",
//                     borderColor: "rgba(75, 192, 192, 1)",
//                     pointBackgroundColor: "#fff",
//                     borderWidth: 2
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 plugins: {
//                     tooltip: {
//                         callbacks: {
//                             label: (context) => `${context.label}: ${context.raw} sec`
//                         }
//                     }
//                 }
//             }
//         });
//     } else {
//         lapTimeChart.data.datasets[0].data = lapTimes;
//         lapTimeChart.update();
//     }

//     // Position Chart
//     if (!positionChart) {
//         const ctx2 = document.getElementById("positionCanvas").getContext("2d");
//         positionChart = new Chart(ctx2, {
//             type: "bar",
//             data: {
//                 labels: drivers,
//                 datasets: [{
//                     label: "Positions",
//                     data: positions,
//                     backgroundColor: "rgba(153, 102, 255, 0.4)",
//                     borderColor: "rgba(153, 102, 255, 1)",
//                     borderWidth: 2
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 plugins: {
//                     tooltip: {
//                         callbacks: {
//                             label: (context) => `Position: ${context.raw}`
//                         }
//                     }
//                 }
//             }
//         });
//     } else {
//         positionChart.data.datasets[0].data = positions;
//         positionChart.update();
//     }
// }

// // Update pit stop details
// function updatePitStops(data) {
//     const pitStopDetails = document.getElementById("pit-stop-details");
//     pitStopDetails.innerHTML = ""; // Clear existing data

//     const raceResults = data.MRData.RaceTable.Races[0].Results;
//     raceResults.forEach(result => {
//         const driverName = result.Driver.familyName;
//         const pitStops = result.pitStops || [];

//         const driverInfo = document.createElement("div");
//         driverInfo.className = "driver-pit-stop";
//         driverInfo.innerHTML = `<h4>${driverName}</h4>`;
        
//         pitStops.forEach(pit => {
//             driverInfo.innerHTML += `<p>Lap ${pit.lap} - Duration: ${pit.duration}</p>`;
//         });

//         pitStopDetails.appendChild(driverInfo);
//     });
// }

// // Fetch and display weather information
// // Fetch and display weather information
// async function fetchWeather(data) {
//     const raceLocation = data.MRData.RaceTable.Races[0].Circuit.Location;
//     const apiKey = "2063517ae0e584063cf32f3089cca182"; // Replace this with your actual weather API key
//     const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${raceLocation.locality}&appid=${apiKey}&units=metric`;

//     try {
//         const response = await fetch(weatherUrl);
        
//         // Check if the response is successful
//         if (!response.ok) {
//             throw new Error(`Weather API request failed with status: ${response.status}`);
//         }

//         const weatherData = await response.json();
        
//         // Log the data for debugging
//         console.log("Weather Data:", weatherData);

//         // Check if weather data is returned properly
//         if (weatherData && weatherData.main) {
//             const weatherDetails = document.getElementById("weather-details");
//             weatherDetails.innerHTML = `
//                 <p>Temperature: ${weatherData.main.temp}°C</p>
//                 <p>Humidity: ${weatherData.main.humidity}%</p>
//                 <p>Conditions: ${weatherData.weather[0].description}</p>
//             `;
//         } else {
//             console.error("Weather data is incomplete:", weatherData);
//             const weatherDetails = document.getElementById("weather-details");
//             weatherDetails.innerHTML = "<p>Error: Unable to fetch valid weather data.</p>";
//         }

//     } catch (error) {
//         console.error("Error fetching weather data:", error);
//         const weatherDetails = document.getElementById("weather-details");
//         weatherDetails.innerHTML = "<p>Error: Unable to fetch weather data. Please check the API key and city.</p>";
//     }
// }


// // Setup driver comparison dropdowns
// function setupDriverComparison(data) {
//     const raceResults = data.MRData.RaceTable.Races[0].Results;
//     const drivers = raceResults.map(result => ({
//         id: result.Driver.driverId,
//         name: result.Driver.familyName
//     }));

//     const driver1Dropdown = document.getElementById("driver1-dropdown");
//     const driver2Dropdown = document.getElementById("driver2-dropdown");

//     // Clear existing options
//     driver1Dropdown.innerHTML = '<option value="">Select Driver</option>';
//     driver2Dropdown.innerHTML = '<option value="">Select Driver</option>';

//     drivers.forEach(driver => {
//         const option1 = document.createElement("option");
//         option1.value = driver.id;
//         option1.textContent = driver.name;
//         driver1Dropdown.appendChild(option1);

//         const option2 = document.createElement("option");
//         option2.value = driver.id;
//         option2.textContent = driver.name;
//         driver2Dropdown.appendChild(option2);
//     });
// }

// // Fetch circuit records for historical reference
// function fetchCircuitRecords(data) {
//     const circuitRecords = document.getElementById("circuit-records");
//     circuitRecords.innerHTML = "<p>Loading circuit records...</p>";

//     const race = data.MRData.RaceTable.Races[0];
//     const circuitId = race.Circuit.circuitId;
//     const url = `https://ergast.com/api/f1/circuits/${circuitId}/fastest/1/results.json`;

//     fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             circuitRecords.innerHTML = ""; // Clear placeholder

//             const fastestLap = data.MRData.RaceTable.Races[0]?.Results[0];
//             if (fastestLap) {
//                 circuitRecords.innerHTML = `
//                     <p>Driver: ${fastestLap.Driver.familyName}</p>
//                     <p>Team: ${fastestLap.Constructor.name}</p>
//                     <p>Fastest Lap: ${fastestLap.Time.time}</p>
//                 `;
//             } else {
//                 circuitRecords.innerHTML = "<p>No records available for this circuit.</p>";
//             }
//         })
//         .catch(error => {
//             console.error("Error fetching circuit records:", error);
//             circuitRecords.innerHTML = "<p>Could not load circuit records.</p>";
//         });
// }

// // Fetch all races and initialize dashboard
// fetchRaces();
// fetchRaceData(); // Load latest race by default

// // Set up event listeners for race selection and driver comparison
// document.getElementById("race-dropdown").addEventListener("change", (event) => {
//     const selectedRace = event.target.value;
//     fetchRaceData(selectedRace);
// });


// Initialize Chart.js chart instances
let lapTimeChart, positionChart;
let currentRaceData = null; // Store the current race data for comparison

// Function to fetch all races for the season
async function fetchRaces() {
    try {
        const response = await fetch("https://ergast.com/api/f1/current.json");
        const data = await response.json();
        populateRaceDropdown(data);
    } catch (error) {
        console.error("Error fetching races:", error);
    }
}

// Populate race selection dropdown
function populateRaceDropdown(data) {
    const raceDropdown = document.getElementById("race-dropdown");
    const races = data.MRData.RaceTable.Races;

    races.forEach(race => {
        const option = document.createElement("option");
        option.value = race.round;
        option.textContent = `${race.raceName} - ${race.Circuit.circuitName}`;
        raceDropdown.appendChild(option);
    });
}

// Fetch race data for the selected race
async function fetchRaceData(round = "last") {
    try {
        const response = await fetch(`https://ergast.com/api/f1/current/${round}/results.json`);
        currentRaceData = await response.json(); // Save the fetched race data
        updateRaceInfo(currentRaceData);
        updateLeaderboard(currentRaceData);
        updateCharts(currentRaceData);
        updatePitStops(currentRaceData);
        setupDriverComparison(currentRaceData);
        fetchWeather(currentRaceData);
        fetchCircuitRecords(currentRaceData);
    } catch (error) {
        console.error("Error fetching race data:", error);
    }
}

// Update race information in the header
function updateRaceInfo(data) {
    const raceInfoElement = document.getElementById("race-info");
    const race = data.MRData.RaceTable.Races[0];

    raceInfoElement.innerHTML = `
        <h2>${race.raceName} - Round ${race.round}</h2>
        <p>Circuit: ${race.Circuit.circuitName}</p>
        <p>Location: ${race.Circuit.Location.locality}, ${race.Circuit.Location.country}</p>
    `;
}

// Update the live leaderboard
function updateLeaderboard(data) {
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = ""; // Clear existing leaderboard

    const raceResults = data.MRData.RaceTable.Races[0].Results;
    raceResults.forEach((result, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${index + 1}. ${result.Driver.familyName} - Lap Time: ${result.Time?.time || 'N/A'}`;
        leaderboardList.appendChild(listItem);
    });
}

// Update lap time and position charts
function updateCharts(data) {
    const raceResults = data.MRData.RaceTable.Races[0].Results;

    const drivers = raceResults.map(result => result.Driver.familyName);
    const lapTimes = raceResults.map(result => parseInt(result.Time?.time.split(":")[1]) || 0);
    const positions = raceResults.map(result => parseInt(result.position));

    // Lap Time Chart
    if (!lapTimeChart) {
        const ctx1 = document.getElementById("lapTimeCanvas").getContext("2d");
        lapTimeChart = new Chart(ctx1, {
            type: "line",
            data: {
                labels: drivers,
                datasets: [{
                    label: "Lap Times (seconds)",
                    data: lapTimes,
                    backgroundColor: "rgba(75, 192, 192, 0.4)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    pointBackgroundColor: "#fff",
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.raw} sec`
                        }
                    }
                }
            }
        });
    } else {
        lapTimeChart.data.datasets[0].data = lapTimes;
        lapTimeChart.update();
    }

    // Position Chart
    if (!positionChart) {
        const ctx2 = document.getElementById("positionCanvas").getContext("2d");
        positionChart = new Chart(ctx2, {
            type: "bar",
            data: {
                labels: drivers,
                datasets: [{
                    label: "Positions",
                    data: positions,
                    backgroundColor: "rgba(153, 102, 255, 0.4)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => `Position: ${context.raw}`
                        }
                    }
                }
            }
        });
    } else {
        positionChart.data.datasets[0].data = positions;
        positionChart.update();
    }
}

// Update pit stop details
function updatePitStops(data) {
    const pitStopDetails = document.getElementById("pit-stop-details");
    pitStopDetails.innerHTML = ""; // Clear existing data

    const raceResults = data.MRData.RaceTable.Races[0].Results;
    raceResults.forEach(result => {
        const driverName = result.Driver.familyName;
        const pitStops = result.pitStops || [];

        const driverInfo = document.createElement("div");
        driverInfo.className = "driver-pit-stop";
        driverInfo.innerHTML = `<h4>${driverName}</h4>`;
        
        pitStops.forEach(pit => {
            driverInfo.innerHTML += `<p>Lap ${pit.lap} - Duration: ${pit.duration}</p>`;
        });

        pitStopDetails.appendChild(driverInfo);
    });
}

// Setup driver comparison dropdowns
function setupDriverComparison(data) {
    const raceResults = data.MRData.RaceTable.Races[0].Results;
    const drivers = raceResults.map(result => ({
        id: result.Driver.driverId,
        name: result.Driver.familyName
    }));

    const driver1Dropdown = document.getElementById("driver1-dropdown");
    const driver2Dropdown = document.getElementById("driver2-dropdown");

    // Clear existing options
    driver1Dropdown.innerHTML = '<option value="">Select Driver</option>';
    driver2Dropdown.innerHTML = '<option value="">Select Driver</option>';

    drivers.forEach(driver => {
        const option1 = document.createElement("option");
        option1.value = driver.id;
        option1.textContent = driver.name;
        driver1Dropdown.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = driver.id;
        option2.textContent = driver.name;
        driver2Dropdown.appendChild(option2);
    });
}

// Handle driver comparison
document.getElementById("compare-button").addEventListener("click", () => {
    const driver1Id = document.getElementById("driver1-dropdown").value;
    const driver2Id = document.getElementById("driver2-dropdown").value;

    if (!driver1Id || !driver2Id) {
        alert("Please select two drivers for comparison.");
        return;
    }

    const raceResults = currentRaceData.MRData.RaceTable.Races[0].Results;
    const driver1 = raceResults.find(result => result.Driver.driverId === driver1Id);
    const driver2 = raceResults.find(result => result.Driver.driverId === driver2Id);

    if (!driver1 || !driver2) {
        alert("Driver data not found.");
        return;
    }

    const driver1Position = parseInt(driver1.position);
    const driver2Position = parseInt(driver2.position);
    const betterDriver = driver1Position < driver2Position
        ? driver1.Driver.familyName
        : driver2.Driver.familyName;

    const isPositionTie = driver1Position === driver2Position;

    // Construct comparison result
    const comparisonResult = `
        <h4>Comparison</h4>
        <p>${driver1.Driver.familyName} vs ${driver2.Driver.familyName}</p>
        <ul>
            <li>Position: ${driver1.position} vs ${driver2.position}</li>
            <li>Lap Time: ${driver1.Time?.time || 'N/A'} vs ${driver2.Time?.time || 'N/A'}</li>
            <li>Constructor: ${driver1.Constructor.name} vs ${driver2.Constructor.name}</li>
        </ul>
        <h4>Better Driver</h4>
        <p>${isPositionTie 
            ? "Both drivers are tied based on position." 
            : `${betterDriver} is in a higher position.`}</p>
    `;

    document.getElementById("comparison-result").innerHTML = comparisonResult;
});

// Fetch all races and initialize dashboard
fetchRaces();
fetchRaceData(); // Load the latest race by default

// Set up event listeners for race selection
document.getElementById("race-dropdown").addEventListener("change", (event) => {
    const selectedRace = event.target.value;
    fetchRaceData(selectedRace);
});
