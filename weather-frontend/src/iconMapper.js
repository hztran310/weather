import sunnyCloud from '/image/weather-icon/clouds_sun_sunny_icon.png';
import hailSnow from '/image/weather-icon/clouds_hail_hailstone_snow_icon.png';
import cloudStorm from '/image/weather-icon/clouds_night_storm_icon.png';
import sunStorm from '/image/weather-icon/clouds_rain_storm_thunder_icon.png';
import cloudSnow from '/image/weather-icon/clouds_snow_winter_icon.png';
import sunnyRain from '/image/weather-icon/clouds_cloudy_rain_sunny_icon.png';
import cloudWindNight from '/image/weather-icon/cloudy_storm_wind_icon.png';
import tornado from '/image/weather-icon/hurricane_storm_tornado_icon.png';
import moonrise from '/image/weather-icon/moon_moonrise_night_icon.png';
import moonSnow from '/image/weather-icon/moon_night_snow_icon.png';
import sunny from '/image/weather-icon/sun_sunny_temperature_icon.png';

export const getWeatherIcon = (description = "", hour = 12) => {
    const desc = description.toLowerCase();
    const isNight = hour >= 18 || hour < 6;

    // Moon versions if it's night
    if (isNight) {
        if (desc.includes("snow")) return moonSnow;
        if (desc.includes("cloud") || desc.includes("mist") || desc.includes("fog")) return moonrise;
        if (desc.includes("storm")) return cloudStorm;
        return moonrise;
    }

    // Daytime icons
    if (desc.includes("sunny") && desc.includes("cloud")) return sunnyCloud;
    if ((desc.includes("hail") || desc.includes("sleet"))) return hailSnow;
    if ((desc.includes("storm") || desc.includes("thunder"))) return sunStorm;
    if (desc.includes("snow") || desc.includes("blizzard")) return cloudSnow;
    if ((desc.includes("rain") || desc.includes("drizzle")) && desc.includes("sunny")) return sunnyRain;
    if ((desc.includes("rain") || desc.includes("drizzle"))) return cloudRain;
    if (desc.includes("wind")) return cloudWindNight;
    if (desc.includes("tornado") || desc.includes("hurricane")) return tornado;
    if (desc.includes("clear") || desc.includes("sunny")) return sunny;

    return sunny; // default fallback
};

