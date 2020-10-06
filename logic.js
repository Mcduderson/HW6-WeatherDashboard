$(document).ready(function(){

    var history = JSON.parse(localStorage.getItem("city")) || []
        
    if(history.length>0){
        gatherWeatherInfo(history[0]);
        renderButtons();
    }

    var cityName;

    $('#searchButton').on("click", function(){

        cityName = $('#searchInput').val();
    
        if(cityName===""){
            return;
        }else{
            history.unshift(cityName);
        }

        gatherWeatherInfo(cityName);
    })

    $(document).on('click','.arrayBtn',function(){
        cityName = $(this).attr("id")
        gatherWeatherInfo(cityName);
    });

    function gatherWeatherInfo(cityName){
        
        localStorage.setItem("city", JSON.stringify(history));
        
                
        var APIKey = "f60f4f73d7cfb1db655952c19ccc876d";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIKey;
                
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response)
                    
            var iconcode = response.weather[0].icon;
            var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
        
            $("#city").text(response.name)
            $("#wind").text("Wind Speed: " + response.wind.speed + "m/s")
            $("#humidity").text("Humidity: " + response.main.humidity + "%")
            $("#temp").text("Temperature: " + response.main.temp + "F")
            $('#wicon').attr('src', iconurl);
        
            var lat = JSON.stringify(response.coord.lat)
            var lon = JSON.stringify(response.coord.lon)    
            var uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

            $.ajax({
                url: uvIndexURL,
                method: "GET"
            }).then(function (a) {
                    
                $("#uv").empty();
                var uvValue = a.value
                var b = $("<p>")
                b.addClass("inline p-1 rounded-lg")
                b.text(uvValue)
                if(uvValue<3){

                    b.addClass("favorable")

                }else if (uvValue>8){

                    b.addClass("severe")

                }else {

                    b.addClass("moderate")

                }

                $("#uv").append(b);
            })

            var fivDayURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=current,minutely,hourly,alerts&appid=" + APIKey;

            $.ajax({
                url: fivDayURL,
                method: "GET"
            }).then(function (data) {
                console.log("hi")
                console.log(data)

                $("#fiveDay").empty();

                for(i=1; i<=5; i++){


                    var cards = $(`
                        <div class="card text-white d-inline float-left m-3" style="max-width: 200px;">
                            <div class="card-body bg-primary rounded-lg" style="max-width: 200px;">
                                <h5 class="card-title" id="fDayDate${[i]}"></h5>
                                <img id="wiconFDay${[i]}" src="" alt="Weather icon"></img>
                                <p class="card-text" id="fDayTemp${[i]}"></p>
                                <p class="card-text" id="fDayHum${[i]}"></p>
                            </div>
                        </div>
                    `)
                    
                    $("#fiveDay").append(cards);

                    for(v=1; v<=5; v++){

                        var iconcodeB = data.daily[v].weather[0].icon;
                        var iconurlB = "https://openweathermap.org/img/w/" + iconcodeB + ".png";
                        $("#wiconFDay" + v).attr("src", iconurlB);
                        $("#fDayDate" + v).text(moment().add(v, 'd').format("MMM Do YY"));
                        $("#fDayTemp" + v).text("Temp: " + data.daily[v].temp.day + " F");
                        $("#fDayHum" + v).text("Humidity: " + data.daily[v].humidity);
                    }

                }
            })
        })


        renderButtons();
    }        



            


    function renderButtons(){
        $('#arraySection').empty();
        for(c=0;c<history.length;c++){
            var arraybutton = $('<button class="d-block arrayBtn">')
            arraybutton.attr("id", history[c])
            arraybutton.text(history[c])
            $('#arraySection').append(arraybutton)
        }
                
            
    }
})
