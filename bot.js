
var TelegramBot = require('node-telegram-bot-api');
var token = '220134211:AAElm1rxgjigKiGfqixAwHy0_Wv1pdvg7DI';
var Q = require('Q');
var request = Q.denodeify(require("request"));

var bot = new TelegramBot(token, {polling: true});
bot.getMe().then(function (me) {
  console.log('Hi my name is Haziq!', me.username);
});

bot.onText(/\/start/, function (msg, match) {
  var fromId = msg.from.id; // get the id, of who is sending the message
  var message = "Welcome to your WeatherBot\n"
  message += "Get weather update by sending /weather [your_city] command."
  bot.sendMessage(fromId, message);
});

// match /weather [whatever]
bot.onText(/\/weather (.+)/, function (msg, match) {
  var fromId = msg.from.id; // get the id, of who is sending the message
  var postcode = match[1];
  getWeatherData(postcode)
  .then(function(data){
    var message = "Weather today in "+postcode+"\n";
    message += data.wx_desc+"\n"
    message += "temp: "+data.temp_c+"C or "+data.temp_f+"F"
    bot.sendMessage(fromId, message);
  });

});

function getWeatherData(postcode){
  var app_id = "412014fd"
  var app_key = "80cbe96a65ab6e82d40089e4273944b5"
  var url = " http://api.weatherunlocked.com/api/forecast/us."+postcode
  url += "?app_id="+app_id+"&app_key="+app_key

  var options ={
      url: url,
      method: "GET",
      json:true,
    }
    var response = request(options);
    return response.then(function (r){
        return r[0].body
    })
}