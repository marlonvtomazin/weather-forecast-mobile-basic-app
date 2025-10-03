import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios'

const API_URL = 'https://api.openweathermap.org/data/2.5/weather'
const API_KEY = '3871f2710964673b949f53f493ea2604'


export default function App() {
  const [weather, setWeather] = useState();


  //Ativado ao ligar o app
  useEffect(() => {
    getLocation()

  }, [])

  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const response = await axios.get(API_URL, {
      params: {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        appid: API_KEY,
        units: 'metric',
        lang: 'pt_br'
      }
    });
    setWeather(response.data)
  }


  return (
    <View style={styles.container}>
      <Text>{weather.name}</Text>
      <Text>{Math.round(weather.main.temp)} °C</Text>
      <Text>{weather.weather[0].description}</Text>

      <View>
        <View>
          <Text>Sensação térmica</Text>
          <Text>{Math.round(weather.main.feels_like)} °C</Text>
        </View>
      </View>

      <View>
        <View>
          <Text>Umidade</Text>
          <Text>{weather.main.humidity}%</Text>
        </View>
      </View>

      <View>
        <View>
          <Text>Vento</Text>
          <Text>{weather.wind.speed} m/s</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
